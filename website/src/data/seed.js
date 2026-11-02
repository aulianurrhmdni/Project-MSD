// Data contoh untuk prototipe. Nama kios, harga, asal, dan jadwal belum diverifikasi ke pedagang.

export const KS = {}

KS.bahan = [
  {
    id: 'kayu',
    nama: 'Kayu',
    foto: 'assets/img/bahan-kayu.jpg',
    olahan: 'Kayu diolah menjadi ukiran, suvenir, dan gagang mandau.',
  },
  {
    id: 'rotan',
    nama: 'Rotan',
    foto: 'assets/img/bahan-rotan.jpg',
    olahan: 'Rotan dianyam menjadi tas, tikar, dan wadah tradisional.',
  },
  {
    id: 'batu',
    nama: 'Batu alam & permata',
    foto: 'assets/img/bahan-batu.jpg',
    olahan: 'Batu alam dan permata diasah menjadi cincin, kalung, liontin, dan batu akik.',
  },
  {
    id: 'sutra',
    nama: 'Serat ulat sutra',
    foto: 'assets/img/bahan-sutra.jpg',
    olahan: 'Serat sutra ditenun dan dibatik menjadi kain dan kriya pelengkap.',
  },
  {
    id: 'kapas',
    nama: 'Serat kapas',
    foto: 'assets/img/bahan-kapas.jpg',
    olahan: 'Kain katun menjadi dasar batik Dayak, sulaman, dan kerajinan manik.',
  },
]

KS.kios = [
  { id: 'A-03', nama: 'Kios Manik Enggang', jual: 'Tas dan aksesori manik', qris: true },
  { id: 'A-07', nama: 'Kios Sulam & Manik', jual: 'Dompet, kopiah, tas sulam', qris: false },
  { id: 'A-12', nama: 'Kios Batik Mahakam', jual: 'Kemeja dan kain batik Dayak', qris: true },
  { id: 'B-11', nama: 'Kios Anyaman Paser', jual: 'Anyaman rotan dan wadah', qris: false },
  { id: 'C-05', nama: 'Kios Ukir Ulin', jual: 'Ukiran kayu dan suvenir', qris: true },
  { id: 'D-08', nama: 'Kios Akik & Permata', jual: 'Batu akik, cincin, liontin', qris: false },
]

KS.produk = [
  {
    id: 'tas-manik-rotan',
    nama: 'Tas manik rotan motif Dayak',
    harga: 285000,
    foto: 'assets/img/tas-manik-rotan.jpg',
    bahan: ['rotan'],
    kios: 'A-03',
    asal: 'Kutai Barat, Kalimantan Timur',
    pengrajin: 'Pengrajin manik dan anyaman rumahan',
    ket: 'Badan tas dari anyaman rotan, bagian atas dirangkai manik kaca bermotif Dayak.',
  },
  {
    id: 'ukiran-kayu',
    nama: 'Panel ukiran kayu motif Dayak',
    harga: 450000,
    foto: 'assets/img/ukiran-kayu.jpg',
    bahan: ['kayu'],
    kios: 'C-05',
    asal: 'Kutai Kartanegara, Kalimantan Timur',
    pengrajin: 'Pengukir kayu, dikerjakan dengan tangan',
    ket: 'Panel dinding berukuran sekitar 40 × 40 cm dengan motif sulur khas Dayak.',
  },
  {
    id: 'kemeja-batik',
    nama: 'Kemeja batik motif Dayak',
    harga: 165000,
    foto: 'assets/img/kemeja-batik.jpg',
    bahan: ['kapas'],
    kios: 'A-12',
    asal: 'Samarinda, Kalimantan Timur',
    pengrajin: 'Perajin batik cap dan tulis',
    ket: 'Katun, lengan pendek, tersedia ukuran M sampai XXL.',
  },
  {
    id: 'cincin-akik',
    nama: 'Cincin batu akik',
    harga: 150000,
    foto: 'assets/img/cincin-akik.jpg',
    bahan: ['batu'],
    kios: 'D-08',
    asal: 'Batu dari Kalimantan, diikat di Balikpapan',
    pengrajin: 'Pengasah batu dan perajin ikat cincin',
    ket: 'Ikatan perak bakar, batu diasah halus. Ukuran jari bisa disesuaikan di kios.',
  },
  {
    id: 'tas-anyaman-rotan',
    nama: 'Tas anyaman rotan',
    harga: 220000,
    foto: 'assets/img/tas-anyaman-rotan.jpg',
    bahan: ['rotan'],
    kios: 'B-11',
    asal: 'Kabupaten Paser, Kalimantan Timur',
    pengrajin: 'Kelompok penganyam perempuan',
    ket: 'Anyaman rapat dengan motif zig-zag, kuat untuk belanja sehari-hari.',
  },
  {
    id: 'dompet-manik',
    nama: 'Dompet dan tempat HP manik',
    harga: 45000,
    foto: 'assets/img/dompet-manik.jpg',
    bahan: ['kapas'],
    kios: 'A-07',
    asal: 'Balikpapan, Kalimantan Timur',
    pengrajin: 'Perajin manik rumahan',
    ket: 'Kain katun berlapis manik, muat ponsel sampai 6,7 inci.',
  },
  {
    id: 'kain-batik',
    nama: 'Kain batik Dayak katun dan sutra',
    harga: 175000,
    foto: 'assets/img/kain-batik.jpg',
    bahan: ['kapas', 'sutra'],
    kios: 'A-12',
    asal: 'Samarinda, Kalimantan Timur',
    pengrajin: 'Perajin batik dan penenun',
    ket: 'Kain 2 × 1,15 m. Pilihan katun atau campuran sutra.',
  },
  {
    id: 'tas-tangan-manik',
    nama: 'Tas tangan manik',
    harga: 195000,
    foto: 'assets/img/tas-tangan-manik.jpg',
    bahan: ['kapas', 'rotan'],
    kios: 'A-03',
    asal: 'Kutai Barat, Kalimantan Timur',
    pengrajin: 'Perajin manik rumahan',
    ket: 'Tas jinjing kecil dengan pegangan rotan dan panel manik warna-warni.',
  },
  {
    id: 'batu-permata',
    nama: 'Batu permata lepasan',
    harga: 120000,
    foto: 'assets/img/bahan-batu.jpg',
    bahan: ['batu'],
    kios: 'D-08',
    asal: 'Kalimantan',
    pengrajin: 'Pengasah batu',
    ket: 'Harga per butir. Pilih warna langsung di kios atau lewat chat penjual.',
  },
  {
    id: 'kopiah-manik',
    nama: 'Kopiah dan kotak manik',
    harga: 85000,
    foto: 'assets/img/kopiah-manik.jpg',
    bahan: ['kapas'],
    kios: 'A-07',
    asal: 'Balikpapan, Kalimantan Timur',
    pengrajin: 'Perajin manik rumahan',
    ket: 'Kopiah berhias manik bermotif Dayak. Kotak manik dijual terpisah.',
  },
  {
    id: 'tas-purun',
    nama: 'Tas anyaman bertali hijau',
    harga: 175000,
    foto: 'assets/img/tas-purun.jpg',
    bahan: ['rotan'],
    kios: 'B-11',
    asal: 'Kabupaten Paser, Kalimantan Timur',
    pengrajin: 'Kelompok penganyam perempuan',
    ket: 'Tas belanja besar dengan tali kain hijau.',
  },
  {
    id: 'kotak-anyaman',
    nama: 'Kotak anyaman warna-warni',
    harga: 60000,
    foto: 'assets/img/kotak-anyaman.jpg',
    bahan: ['rotan'],
    kios: 'B-11',
    asal: 'Kabupaten Paser, Kalimantan Timur',
    pengrajin: 'Kelompok penganyam perempuan',
    ket: 'Satu set tiga kotak bertingkat untuk perhiasan atau oleh-oleh.',
  },
  {
    id: 'tas-sulam-manik',
    nama: 'Tas kain sulam manik',
    harga: 95000,
    foto: 'assets/img/tas-sulam-manik.jpg',
    bahan: ['kapas'],
    kios: 'A-07',
    asal: 'Balikpapan, Kalimantan Timur',
    pengrajin: 'Perajin sulam dan manik',
    ket: 'Tas kain putih dengan sulaman manik berbentuk bunga.',
  },
]

// Stok awal tiap barang. Penjual mengubahnya lewat panel kios (admin.html).
KS.stokAwal = {
  'tas-manik-rotan': 6,
  'ukiran-kayu': 3,
  'kemeja-batik': 12,
  'cincin-akik': 8,
  'tas-anyaman-rotan': 5,
  'dompet-manik': 20,
  'kain-batik': 10,
  'tas-tangan-manik': 2,
  'batu-permata': 15,
  'kopiah-manik': 7,
  'tas-purun': 4,
  'kotak-anyaman': 9,
  'tas-sulam-manik': 0,
}

// PIN demo untuk masuk ke panel penjual. Sama untuk semua kios contoh.
KS.PIN_DEMO = '1981'

// Pesanan contoh agar panel penjual bisa langsung didemokan.
KS.contohPesanan = (function () {
  var menit = function (m) {
    return new Date(Date.now() - m * 60000).toISOString()
  }
  var item = function (id, nama, harga, n) {
    return { id: id, nama: nama, harga: harga, n: n }
  }
  return [
    {
      id: 'KS-CONTOH-01',
      kios: 'A-03',
      metode: 'qris',
      items: [item('tas-manik-rotan', 'Tas manik rotan motif Dayak', 285000, 1)],
      total: 285000,
      pembeli: { nama: 'Rina Saputri', hp: '0812-0000-1111' },
      ref: 'RINA SAPUTRI',
      status: 'perlu_validasi',
      dibuat: menit(12),
      riwayat: [
        { status: 'menunggu_bayar', at: menit(12), oleh: 'pembeli' },
        { status: 'perlu_validasi', at: menit(9), oleh: 'pembeli' },
      ],
    },
    {
      id: 'KS-CONTOH-02',
      kios: 'A-03',
      metode: 'kios',
      items: [item('tas-tangan-manik', 'Tas tangan manik', 195000, 1)],
      total: 195000,
      pembeli: { nama: 'Dimas Pratama', hp: '0812-0000-2222' },
      status: 'perlu_konfirmasi',
      dibuat: menit(40),
      riwayat: [{ status: 'perlu_konfirmasi', at: menit(40), oleh: 'pembeli' }],
    },
    {
      id: 'KS-CONTOH-03',
      kios: 'A-03',
      metode: 'qris',
      items: [item('tas-manik-rotan', 'Tas manik rotan motif Dayak', 285000, 1)],
      total: 285000,
      pembeli: { nama: 'Sari Wulandari', hp: '0812-0000-3333' },
      status: 'selesai',
      lunas: true,
      dibuat: menit(50 * 60),
      riwayat: [
        { status: 'perlu_konfirmasi', at: menit(50 * 60), oleh: 'pembeli' },
        { status: 'diproses', at: menit(49 * 60), oleh: 'penjual' },
        { status: 'selesai', at: menit(46 * 60), oleh: 'penjual' },
      ],
    },
    {
      id: 'KS-CONTOH-04',
      kios: 'C-05',
      metode: 'qris',
      items: [item('ukiran-kayu', 'Panel ukiran kayu motif Dayak', 450000, 1)],
      total: 450000,
      pembeli: { nama: 'Bayu Prakoso', hp: '0812-0000-4444' },
      ref: 'BAYU P',
      status: 'perlu_validasi',
      dibuat: menit(5),
      riwayat: [
        { status: 'menunggu_bayar', at: menit(5), oleh: 'pembeli' },
        { status: 'perlu_validasi', at: menit(3), oleh: 'pembeli' },
      ],
    },
  ]
})()
