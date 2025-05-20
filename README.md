# Pharos Testnet Auto Tools

[Register](https://testnet.pharosnetwork.xyz/experience?inviteCode=Wo7IfbX9MZAYYA0m)

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Deskripsi

Pharos Testnet Auto Tools adalah aplikasi berbasis Node.js yang membantu pengguna dalam proses:

- **Generate wallet baru**
- **Login dan verifikasi akun ke API Pharos**
- **Mengirim transaksi antar wallet**
- **Otomatisasi semua langkah di atas**

Dengan CLI yang interaktif, tools ini cocok untuk pengguna yang ingin mengelola banyak wallet sekaligus secara efisien.

---

## Fitur Utama

| Fitur                        | Deskripsi                                                                 |
|-----------------------------|--------------------------------------------------------------------------|
| **1. Generate Wallet**       | Membuat banyak wallet Ethereum beserta mnemonic, private key, dan address. |
| **2. Login & Verifikasi**    | Login ke akun Pharos dan melihat jumlah poin (TaskPoints).               |
| **3. Kirim Transaksi**       | Mengirim transaksi ETH antar wallet dan otomatis verifikasi task.        |
| **4. Jalankan Semua Tools**  | Menjalankan fitur 1–3 secara berurutan secara otomatis.                 |

---

## Struktur File Output

| File                           | Deskripsi                                          |
|--------------------------------|---------------------------------------------------|
| `results/phrases_hasil.txt`    | Mnemonic (seed phrase) dari wallet yang digenerate |
| `results/pv_keys_hasil.txt`    | Private key dari wallet yang digenerate           |
| `results/adress_hasil.txt`     | Address wallet yang digenerate                    |
| `results/tx_log.txt`           | Log transaksi yang sudah dikirim                  |

---

## Instalasi (Linux / Windows / MacOS)

### 1. Clone Repository
```bash
git clone https://github.com/username/pharos-js.git
cd pharos-js
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Siapkan File
Buat file `.env` di folder utama dan isi dengan daftar private key, satu baris per wallet.

---

## Cara Menjalankan

```bash
node index.js
```

Anda akan disajikan menu seperti berikut:

```
1. Generate wallet baru
2. Login dan verifikasi akun
3. Kirim transaksi
4. Jalankan semua tools
5. Exit
```

Pilih fitur sesuai kebutuhan dengan memasukkan angka 1–5.

---

## Menjalankan di Termux (Android)

Jika Anda menggunakan **Termux**, ikuti panduan berikut:

### 1. Update & Install Node.js
```bash
pkg update && pkg upgrade -y
pkg install nodejs git -y
```

> Pastikan Node.js versi minimal 18+  
> Cek versi dengan: `node -v`

---

### 2. Clone Repositori
```bash
git clone https://github.com/axzss/pharos-js.git
cd pharos-js
```

---

### 3. Install Dependency
```bash
npm install
```

---

### 4. Siapkan `.env`
Buat file untuk daftar private key:
```bash
nano .env
```

Contoh isi:
```
PRIVATE_KEYS=0xabc123...,0xdef456...,0xghi789...
pisahkan banyak private key dengan koma, tanpa sepasi di antara nya
```

Tekan `CTRL + X`, lalu `Y`, dan Enter untuk menyimpan.

---

### 5. Jalankan Tools
```bash
node index.js
```

---

## Catatan Penting

- Pastikan wallet pengirim memiliki saldo cukup untuk gas fee. [faucet](https://testnet.pharosnetwork.xyz/)
- Gunakan secara bertanggung jawab.

---

## Lisensi

MIT License © 2025 GreyAch

---

## Kontak

Untuk pertanyaan dan kolaborasi:

**Telegram**: [@GreyAch](https://t.me/archhans) 
