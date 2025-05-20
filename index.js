require('dotenv').config();
const fs = require('fs');
const readline = require('readline-sync');
const axios = require('axios');
const { ethers } = require('ethers');
const bip39 = require('bip39');
const figlet = require('figlet');
const colors = require('colors');
const path = require('path');

const RPC_URL = "https://testnet.dplabs-internal.com";
const CHAIN_ID = 688688;
const API_URL = "https://api.pharosnetwork.xyz";
const DELAY_BETWEEN_TX = 15 * 1000;
const MINIMUM_BALANCE = 0.000001;
const OUTPUT_FOLDER = "results";

if (!fs.existsSync(OUTPUT_FOLDER)) fs.mkdirSync(OUTPUT_FOLDER);

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

function showBanner() {
  console.clear();
  console.log(colors.magenta(figlet.textSync('Pharos Testnet Auto')));
  console.log(colors.white.bold("Tools Automate Tx by GreyAch (Adit) | GAC Airdrop\n"));
  console.log(colors.red("1. Generate wallet baru"));
  console.log(colors.green("2. Login dan verifikasi akun"));
  console.log(colors.cyan("3. Kirim transaksi"));
  console.log(colors.yellow("4. Jalankan semua tools"));
  console.log(colors.white("5. Exit\n"));
}

function generateWallet() {
  const mnemonic = bip39.generateMnemonic();
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  return {
    address: wallet.address,
    private_key: wallet.privateKey,
    seed_phrase: mnemonic
  };
}

function saveGeneratedWallets(wallets) {
  fs.writeFileSync(path.join(OUTPUT_FOLDER, 'phrases_hasil.txt'), wallets.map(w => w.seed_phrase).join('\n'));
  fs.writeFileSync(path.join(OUTPUT_FOLDER, 'pv_keys_hasil.txt'), wallets.map(w => w.private_key).join('\n'));
  fs.writeFileSync(path.join(OUTPUT_FOLDER, 'adress_hasil.txt'), wallets.map(w => w.address).join('\n'));
}

async function signMessage(privateKey, message = "pharos") {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  return signature;
}

async function loginWithPrivateKey(privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await signMessage(privateKey);
  const url = `${API_URL}/user/login?address=${wallet.address}&signature=${signature}`;
  const headers = {
    Origin: "https://testnet.pharosnetwork.xyz",
    Referer: "https://testnet.pharosnetwork.xyz"
  };
  try {
    const res = await axios.post(url, {}, { headers });
    return res.data?.data?.jwt;
  } catch {
    return null;
  }
}

async function sendTransaction(privateKey, to, valueEth = MINIMUM_BALANCE) {
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther(valueEth.toString()),
    gasLimit: 21000,
    gasPrice: ethers.utils.parseUnits('1.2', 'gwei')
  });
  await tx.wait();
  return { hash: tx.hash, sender: wallet.address };
}

async function verifyTransaction(address, txHash, token) {
  const url = `${API_URL}/task/verify?address=${address}&task_id=103&tx_hash=${txHash}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Origin: 'https://testnet.pharosnetwork.xyz',
    Referer: 'https://testnet.pharosnetwork.xyz'
  };
  const res = await axios.post(url, {}, { headers });
  return res.data;
}

async function getProfileInfo(address, token) {
  const url = `${API_URL}/user/profile?address=${address}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Origin: 'https://testnet.pharosnetwork.xyz',
    Referer: 'https://testnet.pharosnetwork.xyz'
  };
  const res = await axios.get(url, { headers });
  return res.data;
}

async function fitur_1_generate_wallet() {
  const jumlah = parseInt(readline.question("Jumlah wallet yang ingin dibuat: "));
  const wallets = Array.from({ length: jumlah }, generateWallet);
  saveGeneratedWallets(wallets);
  console.log("✅ Wallet berhasil digenerate dan disimpan.");
  readline.question("Tekan Enter untuk kembali ke menu...");
}

async function fitur_2_login_verifikasi() {
  const privateKeys = process.env.PRIVATE_KEYS?.split(',').map(k => k.trim()) || [];
  if (privateKeys.length === 0) {
    console.log("❌ Tidak ada private key ditemukan di .env");
    return readline.question("Tekan Enter untuk kembali ke menu...");
  }

  const input = readline.question(`Akun yang ingin diproses (jumlah atau 'all' untuk semua ${privateKeys.length} akun): `).toLowerCase();
  const keysToUse = input === 'all' ? privateKeys : privateKeys.slice(0, parseInt(input));

  for (let i = 0; i < keysToUse.length; i++) {
    const pk = keysToUse[i];
    const wallet = new ethers.Wallet(pk);
    console.log(`\n▶️ Wallet #${i + 1}: ${wallet.address}`);
    const token = await loginWithPrivateKey(pk);
    if (!token) {
      console.log("❌ Login gagal.");
      continue;
    }
    const profil = await getProfileInfo(wallet.address, token);
    const poin = profil?.data?.user_info?.TaskPoints ?? 0;
    console.log(`✅ Login berhasil - Poin: ${poin}`);
  }
  readline.question("Tekan Enter untuk kembali ke menu...");
}

async function fitur_3_kirim_transaksi() {
  const privateKeys = process.env.PRIVATE_KEYS?.split(',').map(k => k.trim()) || [];
  if (privateKeys.length === 0) {
    console.log("❌ Tidak ada private key ditemukan di .env");
    return readline.question("Tekan Enter untuk kembali ke menu...");
  }

  const jumlahTx = parseInt(readline.question("Jumlah transaksi per wallet: "));
  const value = parseFloat(readline.question("Jumlah ETH yang dikirim per transaksi: "));
  const destinations = fs.readFileSync(path.join(OUTPUT_FOLDER, 'adress_hasil.txt'), 'utf-8').trim().split('\n');

  for (let i = 0; i < privateKeys.length; i++) {
    const pk = privateKeys[i];
    const wallet = new ethers.Wallet(pk);
    console.log(`\n▶️ Wallet #${i + 1}: ${wallet.address}`);
    const token = await loginWithPrivateKey(pk);
    if (!token) {
      console.log("❌ Login gagal.");
      continue;
    }

    for (let j = 0; j < jumlahTx; j++) {
      const to = destinations[Math.floor(Math.random() * destinations.length)];
      try {
        console.log(`Transaksi #${j + 1} ke ${to}`);
        const { hash, sender } = await sendTransaction(pk, to, value);
        console.log(`✅ Transaksi berhasil: ${hash}`);
        console.log(`🔗 Explorer: https://testnet.pharosscan.xyz/tx/${hash}`);
        fs.appendFileSync(path.join(OUTPUT_FOLDER, 'tx_log.txt'), `${sender} -> ${to}: ${hash}\n`);
        const verif = await verifyTransaction(sender, hash, token);
        if (verif.code === 0) console.log("🔒 Verifikasi sukses!");
        const profil = await getProfileInfo(sender, token);
        const poin = profil?.data?.user_info?.TaskPoints ?? 0;
        console.log(`🎯 Total Poin: ${poin}`);
      } catch (err) {
        console.log(`❗ Kesalahan: ${err.message}`);
      }
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_TX));
    }
  }
  readline.question("Tekan Enter untuk kembali ke menu...");
}

async function main() {
  while (true) {
    showBanner();
    const choice = readline.question("Pilih fitur (1-5): ");
    if (choice === "1") await fitur_1_generate_wallet();
    else if (choice === "2") await fitur_2_login_verifikasi();
    else if (choice === "3") await fitur_3_kirim_transaksi();
    else if (choice === "4") {
      await fitur_1_generate_wallet();
      await fitur_2_login_verifikasi();
      await fitur_3_kirim_transaksi();
    } else if (choice === "5") {
      console.log("Keluar dari program.");
      process.exit(0);
    } else {
      console.log("Pilihan tidak valid.");
    }
  }
}

main();
