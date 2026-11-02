# Pasar Inpress Kebun Sayur — Balikpapan

Aplikasi web katalog cendera mata dan oleh-oleh khas Kalimantan dari kios-kios pedagang di **Pasar Inpress Kebun Sayur, Balikpapan**. Dibangun sebagai Single Page Application (SPA) modern yang ringan, cepat, dan aksesibel menggunakan **Vue 3, Vite, Pinia, Vue Router, dan VueUse**.

---

## Daftar Isi

1. [Fitur Utama](#fitur-utama)
2. [Menjalankan Proyek Secara Lokal](#menjalankan-proyek-secara-lokal)
3. [Struktur Folder](#struktur-folder)
4. [Routing & Halaman](#routing--halaman)
5. [Panduan Deploy ke Vercel](#panduan-deploy-ke-vercel)
6. [Penjelasan Database & Penyimpanan Data](#penjelasan-database--penyimpanan-data)
7. [Panel Penjual & PIN Demo](#panel-penjual--pin-demo)
8. [Aturan Transaksi & Status Pesanan](#aturan-transaksi--status-pesanan)
9. [Batas Prototipe & Rencana Backend](#batas-prototipe--rencana-backend)

---

## Fitur Utama

- **Katalog Berbasis Bahan & Kios:** Filter produk berdasarkan bahan khas Kalimantan (Kayu, Rotan, Batu Alam & Akik, Sutra, Serat Kapas) serta filter per blok kios (A-03, A-07, A-12, B-11, C-05, D-08).
- **Pencarian Cerdas:** Kolom pencarian hero interaktif dengan simulasi pengetikan otomatis dan responsif terhadap *prefers-reduced-motion*.
- **Keranjang Multi-Kios:** Pengelompokan pesanan otomatis per kios saat checkout. Pembeli dapat memilih metode pembayaran terpisah untuk tiap kios.
- **Simulasi Pembayaran QRIS & Bayar di Kios:** Mendukung unggah bukti transfer dan konfirmasi pembayaran manual.
- **Panel Pengelolaan Kios (Seller Dashboard):** Akses panel pedagang di `/penjual` untuk mengubah stok secara langsung, menambah/mengedit produk lengkap dengan foto lokal, memperbarui QRIS, serta memvalidasi pesanan pembeli.
- **Denah Interaktif Kios:** Denah 48 stan pasar blok A sampai D lengkap dengan penanda kios QRIS dan integrasi rute Google Maps.
- **Desain Khusus:** Menggunakan tipografi *Plus Jakarta Sans* dengan palet warna tradisional pasar (biru, merah marun, putih), transisi halus, dan tata letak responsif ponsel hingga desktop.

---

## Menjalankan Proyek Secara Lokal

### Prasyarat

- **Node.js:** Versi 22.12+ atau 24+ (disarankan LTS)
- **NPM:** Versi bawaan Node.js

### Langkah-langkah

Masuk ke folder `website`:

```sh
cd website
npm ci
npm run dev
```

Buka peramban di: **`http://127.0.0.1:5510`**

### Perintah Penting Lainnya

```sh
npm run build        # Membangun bundle produksi ke folder dist/
npm run preview      # Menguji bundle dist/ di server lokal (port 5511)
npm test             # Menjalankan unit test aturan pesanan & persistensi
npm run format       # Memformat kode sumber dengan Prettier
npm run format:check # Memeriksa kesesuaian format kode tanpa mengubah file
```

---

## Struktur Folder

```text
website/
├── index.html                  # Entry point HTML tunggal
├── vite.config.js              # Konfigurasi bundler Vite (@vitejs/plugin-vue)
├── vercel.json                 # Konfigurasi SPA rewrite dan hosting Vercel
├── package.json                # Dependensi dan script npm
├── public/
│   └── assets/img/             # Foto produk, bahan, dan suasana pasar lokal
├── src/
│   ├── main.js                 # Bootstrap Vue 3, Pinia, Vue Router, error handler
│   ├── App.vue                 # Komponen root layout & toast notifikasi
│   ├── router.js               # Konfigurasi rute, page title, dan redirect URL lama
│   ├── utils.js                # Helper format rupiah, zona waktu WITA, URL WhatsApp, kompresi foto
│   ├── style.css               # Entri gaya global
│   ├── styles/                 # Modul CSS modular (base, home, shop, market, seller, responsive, motion)
│   ├── views/                  # Halaman aplikasi (Home, Catalog, Product, Cart, Orders, Map, About, Seller, NotFound)
│   ├── components/             # Komponen UI bersama (Header, Footer, ProductCard, OrderCard, Editor, dll)
│   ├── features/seller/        # Logika dan sub-komponen workspace panel penjual
│   ├── stores/market.js        # Pinia store reaktif untuk keranjang, pesan toast, dan state pasar
│   ├── services/
│   │   ├── marketService.js    # Logika bisnis transaksi independen platform
│   │   └── browserMarket.js    # Adapter runtime browser dengan localStorage
│   ├── domain/orderRules.js    # Aturan murni status transaksi (state machine)
│   ├── repositories/           # Abstraction layer penyimpanan JSON
│   └── data/seed.js            # Data awal produk, kios, bahan, dan pesanan simulasi
└── tests/
    └── marketService.test.js   # Unit test transaksi, isolasi kuota, dan rollback stok
```

---

## Routing & Halaman

Semua rute menggunakan `createWebHistory()` tanpa hash (`#`), didukung oleh rewrite Vercel ke `index.html`.

| Path | Komponen | Fungsi |
| --- | --- | --- |
| `/` | `HomeView.vue` | Etalase utama, pencarian interaktif, tab bahan, sorotan kios |
| `/katalog` | `CatalogView.vue` | Filter bahan, pilihan kios, pencarian teks, pengurutan harga |
| `/produk/:id` | `ProductView.vue` | Detail produk, ketersediaan stok, jumlah belanja, kontak WhatsApp kios |
| `/keranjang` | `CartView.vue` | Rincian keranjang belanja dikelompokkan per kios, form pemesan, checkout |
| `/pesanan` | `OrdersView.vue` | Daftar pesanan aktif pembeli, instruksi pengambilan barang, upload bukti bayar |
| `/denah` | `MapView.vue` | Denah blok kios (A, B, C, D), status QRIS, sematan Google Maps |
| `/tentang` | `AboutView.vue` | Sejarah Pasar Kebun Sayur sejak 1981, proses kerajinan, galeri foto suasana |
| `/penjual` | `SellerView.vue` | Portal masuk pedagang, kelola stok barang, validasi pembayaran, edit profil |
| `/*` | `NotFoundView.vue` | Tampilan 404 ramah pengguna saat URL tidak terdaftar |

*Catatan:* URL lama berakhiran `.html` (seperti `/katalog.html`, `/denah.html`, `/admin.html`) otomatis dialihkan ke format rute baru.

---

## Panduan Deploy ke Vercel

### 1. Menghubungkan Repository ke Git

Pastikan perubahan sudah ter-commit dan di-push ke GitHub/GitLab:

```sh
# Dari root direktori Project-MSD:
git add .
git commit -m "feat: persiapkan build dan konfigurasi deploy vercel"
git push origin main
```

### 2. Impor Proyek di Dashboard Vercel

1. Buka [vercel.com](https://vercel.com/) dan klik **Add New... > Project**.
2. Pilih repository Git Anda (`Project-MSD`).
3. Pada halaman konfigurasi **Configure Project**:
   - **Project Name:** Sesuaikan nama proyek yang diinginkan.
   - **Root Directory:** Klik tombol **Edit** lalu pilih/ketik **`website`** *(Wajib diatur ke `website` karena kode aplikasi berada di sub-folder).*
   - **Framework Preset:** Pilih **Vite**.
   - **Build Command:** Biarkan default (`npm run build`).
   - **Output Directory:** Biarkan default (`dist`).
   - **Install Command:** Biarkan default (`npm ci` atau `npm install`).
4. Klik tombol **Deploy**.

### 3. Konfigurasi `vercel.json`

File `website/vercel.json` sudah dikonfigurasi untuk menangani *Single Page Application (SPA)*:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Aturan rewrite ini memastikan bahwa saat pengguna me-refresh halaman seperti `/katalog`, `/denah`, atau `/penjual`, server Vercel tidak memberikan error 404, melainkan mengembalikan `index.html` dan Vue Router akan menampilkan halaman yang sesuai.

---

## Penjelasan Database & Penyimpanan Data

### *Apakah database tersimpan otomatis apabila di-push ke Vercel?*

> [!IMPORTANT]
> **Jawaban:** **Tidak tersimpan otomatis secara global/terpusat antar pengguna.**

Berikut penjelasan teknis cara kerja penyimpanan saat ini:

1. **Penyimpanan Lokal di Browser (`localStorage`):**
   - Saat ini, aplikasi menggunakan penyimpanan lokal browser pengunjung melalui `localStorage` (kunci `ks-db-v4`, `ks-my-orders`, `ks-cart`).
   - Tidak ada server database cloud terpusat (seperti MySQL atau PostgreSQL).
2. **Karakteristik Saat Live di Vercel:**
   - Vercel bertindak sebagai penyedia **Static Hosting** yang melayani file HTML, CSS, JavaScript, dan gambar.
   - Setiap pengguna yang membuka situs web di perangkat masing-masing (laptop, HP) akan mendapatkan salinan data awal bawaan (`src/data/seed.js`).
   - Jika Pengguna A membuat pesanan atau mengubah stok di HP miliknya, data tersebut **hanya tersimpan di browser Pengguna A**. Pengguna B yang membuka situs dari perangkat berbeda tidak akan melihat transaksi atau perubahan stok tersebut.
   - Data yang pernah Anda ubah di `localhost` komputer Anda **tidak ikut terunggah** ke browser pengunjung lain di Vercel.
   - Jika pengguna membersihkan riwayat/cache peramban (*Clear site data*) atau membuka mode Penyamaran (*Incognito*), data akan ter-reset ke data awal.

### Rencana Peningkatan ke Database Terpusat

Arsitektur aplikasi sudah menggunakan pola *Repository Pattern* (`storageRepository.js` dan `marketService.js`). Untuk membuat data tersimpan permanen dan tersinkronisasi antar seluruh pengunjung di Vercel, langkah berikutnya adalah mengganti repository lokal dengan database cloud seperti:
- **Supabase** (PostgreSQL gratis, SDK JavaScript langsung terhubung ke Vue).
- **Firebase Firestore** (Database NoSQL real-time).
- **Vercel Postgres / Neon** (dikombinasikan dengan Vercel Serverless Functions).

---

## Panel Penjual & PIN Demo

- **URL Akses:** `/penjual`
- **PIN Demo:** **`1981`** *(Dapat digunakan untuk masuk ke seluruh kios contoh).*
- **Keamanan Brute-Force:** Jika PIN salah dimasukkan sebanyak 5 kali berturut-turut, panel akan terkunci secara otomatis selama **30 detik** sebelum dapat dicoba kembali.
- **Fitur Kios:**
  - Pemantauan antrean pesanan (`Perlu konfirmasi`, `Perlu validasi QRIS`).
  - Pengubahan stok secara cepat atau edit informasi barang beserta foto.
  - Pengaturan profil kios, nomor kontak WhatsApp, dan unggah gambar kode QRIS kios.
  - Tombol **Kembalikan data contoh** untuk mereset seluruh data simulasi kembali ke kondisi awal.

---

## Aturan Transaksi & Status Pesanan

Aplikasi menerapkan *finite-state machine* ketat pada pesanan untuk menjamin integritas data:

```
[Metode QRIS]:  menunggu_bayar  ──>  perlu_validasi  ──>  diproses  ──>  selesai
                                        │
                                        └──>  ditolak / dibatalkan (stok dikembalikan)

[Bayar di Kios]:  perlu_konfirmasi  ──>  diproses  ──>  selesai
                        │
                        └──>  ditolak / dibatalkan (stok dikembalikan)
```

- Stok produk dipotong seketika saat pesanan dibuat (*stock reservation*).
- Jika pesanan dibatalkan oleh pembeli atau ditolak oleh penjual, stok barang dikembalikan secara otomatis tepat satu kali.
- Pesanan dengan status akhir (`selesai`, `dibatalkan`, `ditolak`) terkunci dan tidak dapat diubah statusnya kembali.

---

## Batas Prototipe & Catatan Keamanan

1. Aplikasi ini merupakan **prototipe fungsional (MVP)** untuk mendemonstrasikan pengalaman belanja dan pengelolaan pedagang pasar tradisional secara digital.
2. Belum ada sistem gateway pembayaran otomatis (seperti Midtrans atau Xendit); verifikasi pembayaran QRIS dilakukan secara manual oleh penjual.
3. Dokumen dalam folder `docs/` merupakan dokumen perencanaan dan referensi proyek, tidak menjadi bagian dari runtime aplikasi web yang di-deploy.
