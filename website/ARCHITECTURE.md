# Panduan arsitektur

## Batas tanggung jawab

Proyek ini adalah aplikasi frontend Vue. Tidak ada kode backend yang disisipkan ke template.

```text
views / components
      ↓ event atau composable
stores / features
      ↓ operasi aplikasi
services/marketService.js
      ├── domain/orderRules.js       aturan yang bebas dari framework
      └── repositories/             baca/tulis penyimpanan
```

- **View** mengatur susunan halaman. Hindari akses `localStorage`, perhitungan status transaksi, atau string HTML di template.
- **Komponen** memiliki kontrak props/emits atau `defineModel`. Contoh: `SellerInventory` menerima produk dan mengirim event edit/hapus, `ProductEditor` menangani formulir barang, `OrderCard` menampilkan satu pesanan.
- **Composable** mengoordinasikan state fitur. `useSellerWorkspace` menangani sesi demo, pilihan bagian panel, antrean terfilter, dan draft profil.
- **Pinia** menyediakan snapshot reaktif produk/kios/pesanan, keranjang, total, dan notifikasi. Perubahan service menaikkan revisi agar computed state diperbarui.
- **Service** menjalankan operasi aplikasi: buat pesanan, simpan produk, ubah stok, ubah status, dan reset. Service menerima repository melalui parameter; tidak membutuhkan Vue, DOM, atau global `localStorage` untuk dites.
- **Domain** menjawab apakah transisi sah, kapan stok dikembalikan, dan bagaimana keranjang dikelompokkan per kios.
- **Repository** adalah adapter JSON penyimpanan. `browserMarket.js` menyambungkan adapter dengan data contoh serta event storage lintas tab.

## Contoh alur checkout

1. `CartView.vue` memvalidasi nama dan nomor WhatsApp, lalu memanggil `market.checkout()`.
2. Store membersihkan item yang sudah dihapus/habis, dan membatasi jumlah pada stok saat ini.
3. `marketService.buatPesanan()` mengelompokkan item menurut kios, menentukan metode bayar yang tersedia, dan mengurangi stok.
4. Repository menyimpan database dan daftar pesanan milik pembeli menggunakan kunci lama.
5. Service mengirim notifikasi perubahan, store memperbarui computed state, keranjang dikosongkan, lalu router membuka `/pesanan`.
6. Jika penyimpanan gagal, perubahan database dalam memori dikembalikan dan halaman checkout menampilkan error, bukan pesan berhasil.

Pembatasan peran pada domain adalah aturan prototipe, bukan otorisasi aman. Pengguna masih dapat mengubah data browser sendiri. Backend produksi harus mengulangi validasi stok, harga, identitas kios, peran, dan pembayaran di server.

## Menambah halaman

1. Buat `src/views/NamaView.vue` dengan `<script setup>`.
2. Tambahkan route dan judul di `src/router.js` menggunakan lazy import.
3. Gunakan `RouterLink` untuk navigasi internal dan URL absolut `/assets/img/...` untuk foto publik.
4. Letakkan CSS di berkas area terkait dalam `src/styles/`; gunakan token dari `base.css`.
5. Jalankan formatter dan build; periksa URL langsung, refresh, keyboard, dan tampilan ponsel.

## Menghubungkan backend nanti

Tambahkan client HTTP di `services/` dan ganti operasi repository lokal dengan request API. Karena HTTP bersifat asynchronous, store perlu state loading/error dan pembaruan snapshot setelah request. View tetap menggunakan kontrak aksi store/composable. Jangan menganggap penggantian repository lokal menjadi HTTP cukup dengan mengubah satu URL.

Server perlu menyediakan transaksi stok atomik, otorisasi per kios, sesi autentikasi, kepemilikan pesanan, penyimpanan foto, dan verifikasi pembayaran. Rahasia API tidak boleh masuk `VITE_*`, karena variabel itu dibundel ke browser.

## Konvensi kerja

- Satu tanggung jawab per file; pecah fitur besar menjadi komponen, bukan satu template panjang.
- Gunakan nama fungsi yang menyatakan tindakan dan computed untuk nilai turunan.
- Jangan gunakan `innerHTML` atau `v-html` untuk data pedagang/pembeli.
- Komentar menjelaskan alasan atau batas, bukan mengulang sintaks.
- `npm run format:check`, `npm test`, dan `npm run build` adalah pemeriksaan sebelum menyerahkan perubahan.
- Tes domain memakai repository memori, bukan penyimpanan pengguna.
- Perubahan desain tetap mempertahankan Plus Jakarta Sans, biru-merah-putih, tanpa gambar logo navbar, dan pencarian publik hanya di beranda.

## Berkas hasil migrasi

Source aktif hanya memiliki satu HTML entry: `index.html`. Salinan sebelum migrasi berada di `docs/vue-migration-backup` pada workspace, di luar folder deployment dan diabaikan Git. Build Vite menghasilkan `dist/`; jangan mengedit file minified di sana karena akan ditimpa build berikutnya.
