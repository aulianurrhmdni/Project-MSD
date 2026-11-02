# Pasar Inpress Kebun Sayur — Balikpapan

Katalog digital dan platform belanja oleh-oleh khas Kalimantan dari kios-kios pedagang di **Pasar Inpress Kebun Sayur, Balikpapan**.

Aplikasi web modern berbasis **Vue 3, Vite, Pinia, Vue Router, dan VueUse**, dirancang dengan mengutamakan performa, aksesibilitas, serta estetika visual khas pasar kerajinan Kalimantan Timur.

---

## Ringkasan Proyek

- **Aplikasi Web Aktif:** Berada di dalam folder [`website/`](./website/).
- **Dokumentasi Perencanaan:** Berada di dalam folder `docs/` *(hanya sebagai referensi perencanaan arsitektur & desain; diabaikan dari build & Git)*.
- **PIN Demo Panel Penjual:** **`1981`** (diakses melalui `/penjual`).

---

## Panduan Cepat Menjalankan di Lokal

Untuk menjalankan aplikasi web di komputer lokal:

```sh
# 1. Masuk ke direktori aplikasi
cd website

# 2. Pasang dependensi
npm ci

# 3. Jalankan server pengembangan
npm run dev
```

Aplikasi dapat dibuka melalui browser pada alamat: **`http://127.0.0.1:5510`**

### Perintah Utama di Folder `website/`:

| Perintah | Deskripsi |
| --- | --- |
| `npm run dev` | Menjalankan local dev server dengan Vite (port 5510) |
| `npm run build` | Melakukan kompilasi bundle produksi ke folder `website/dist/` |
| `npm run preview` | Menjalankan preview lokal dari hasil build `dist/` |
| `npm test` | Menjalankan unit test aturan transaksi dan penyimpanan data |
| `npm run format` | Merapikan format kode dengan Prettier |
| `npm run format:check` | Memeriksa format kode tanpa mengubah isi file |

---

## Panduan Push ke Git & Deploy ke Vercel

### Langkah 1: Push ke Repository Git (GitHub / GitLab)

Jalankan perintah berikut dari root direktori proyek (`Project-MSD`):

```sh
# Periksa status file yang akan di-commit
git status

# Tambahkan file ke staging (hanya website, README.md, dan .gitignore yang terdaftar)
git add .

# Buat commit
git commit -m "feat: persiapan rilis dan konfigurasi deploy vercel"

# Hubungkan ke repository remote (jika belum pernah dihubungkan)
# Ganti URL berikut dengan URL repository Anda:
git remote add origin https://github.com/USERNAME/Project-MSD.git

# Pastikan branch utama bernama main
git branch -M main

# Push ke remote repository
git push -u origin main
```

> [!NOTE]
> Jika Anda mengalami kendala indeks Git di terminal lokal Anda (misal `fatal: index file corrupt`), Anda dapat menjalankan:
> ```sh
> del .git\index
> git reset
> ```

---

### Langkah 2: Deploy ke Vercel

1. Masuk ke akun Anda di [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik tombol **Add New...** dan pilih **Project**.
3. Pilih repository Git Anda (`Project-MSD`).
4. Pada form **Configure Project**:
   - **Root Directory:** Klik tombol **Edit** di samping Root Directory, lalu pilih folder **`website`**. *(PENTING: Jangan biarkan default `./` karena aplikasi berada di folder `website`)*.
   - **Framework Preset:** Terdeteksi otomatis sebagai **Vite**.
   - **Build Command:** Biarkan default (`npm run build`).
   - **Output Directory:** Biarkan default (`dist`).
   - **Install Command:** Biarkan default (`npm ci` atau `npm install`).
5. Klik **Deploy**.
6. Selesai! Vercel akan memproses build dan memberikan tautan domain publik (`https://...vercel.app`).

File `website/vercel.json` sudah berisi aturan rewrite Single Page Application (SPA), sehingga refresh halaman atau membuka URL langsung (seperti `/katalog`, `/denah`, `/tentang`, `/penjual`) tidak akan menghasilkan error 404.

---

## Tanya Jawab: Penyimpanan Database di Vercel

> **Pertanyaan:** *Apakah database itu bisa tersimpan otomatis apabila aku push di Vercel?*

### Jawaban:
**Tidak tersimpan otomatis secara terpusat antar pengguna.**

### Penjelasan:
1. **Penyimpanan Saat Ini (`localStorage`):**
   - Aplikasi saat ini menyimpan data produk, stok, keranjang, dan pesanan di dalam **`localStorage` browser masing-masing pengunjung** (diatur oleh `marketService` dan `storageRepository`).
   - Tidak ada server database fisik/cloud yang berjalan di belakang layar.
2. **Kondisi Saat di Vercel:**
   - Vercel bertindak sebagai **Web Hosting Statis** untuk file HTML, CSS, JavaScript, dan gambar.
   - Pengunjung baru yang membuka web di Vercel akan selalu mendapatkan data awal bawaan (`src/data/seed.js`).
   - Setiap perubahan yang dibuat oleh Pengunjung A (misal: memesan barang atau menambah stok) hanya tersimpan di browser Pengunjung A dan **tidak terlihat** oleh Pengunjung B di perangkat lain.
   - Data yang pernah Anda buat di komputer lokal (`localhost`) tidak otomatis pindah ke pengunjung Vercel.
3. **Jika Ingin Database Online Terpusat (Multi-User):**
   - Di masa depan, Anda dapat mengintegrasikan database cloud sungguhan seperti **Supabase** (PostgreSQL) atau **Firebase Firestore**.
   - Kode aplikasi sudah menggunakan *Repository Pattern*, sehingga perpindahan dari `localStorage` ke API database cloud dapat dilakukan dengan mudah tanpa perlu mengubah tampilan atau komponen Vue.

---

## Dokumentasi Lengkap

Untuk dokumentasi arsitektur modul, struktur data, dan panduan kode secara terperinci, silakan merujuk ke:
- [Dokumentasi Lengkap Website](./website/README.md)
- [Arsitektur Aplikasi](./website/ARCHITECTURE.md)
