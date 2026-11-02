<script setup>
const sources = {
  corridor:
    'https://ibukotakini.com/read/pasar-inpres-kebun-sayur-direvitalisasi-2026-pemkot-siapkan-tps-pedagang',
  seller:
    'https://pusaranmedia.com/read/15296/penjualan-batu-akik-pasar-inpres-kebun-sayur-tak-lagi-mengkilap',
}
const steps = [
  ['bahan-rotan.jpg', 'Bahan alam', 'Rotan, kayu, batu, dan serat menjadi awal setiap kerajinan.'],
  [
    'sdm-pengrajin.jpg',
    'Dibuat tangan',
    'Dianyam, diukir, dan dirangkai oleh pengrajin Kalimantan.',
  ],
  [
    'pasar-interior.jpg',
    'Sampai di kios',
    'Beragam karya bertemu di etalase Pasar Inpress Kebun Sayur.',
  ],
]
</script>
<template>
  <div class="frame page">
    <section class="about-intro">
      <div>
        <h1>Cerita Kebun Sayur</h1>
        <p class="lead">Namanya Kebun Sayur. Isinya cerita dan cendera mata Kalimantan.</p>
        <p>
          Sejak 1981, Pasar Inpress Kebun Sayur menjadi tempat mencari tas manik, anyaman rotan,
          ukiran kayu, batu akik, dan batik Dayak di Balikpapan.
        </p>
        <RouterLink
          class="button"
          to="/denah"
        >
          Rencanakan kunjungan
        </RouterLink>
      </div>
      <img
        src="/assets/img/pasar-depan.jpg"
        alt="Bangunan Pasar Inpress Kebun Sayur di Balikpapan"
        width="800"
        height="534"
      />
    </section>
    <section class="home-section">
      <div class="section-heading"><h2>Dari bahan ke buah tangan</h2></div>
      <div class="process-grid">
        <figure
          v-for="[file, title, copy] in steps"
          :key="file"
        >
          <img
            :src="'/assets/img/' + file"
            :alt="title"
            width="500"
            height="400"
            loading="lazy"
          />
          <figcaption>
            <h3>{{ title }}</h3>
            <p>{{ copy }}</p>
          </figcaption>
        </figure>
      </div>
    </section>
    <section class="home-section">
      <div class="section-heading">
        <h2>Suasana pasar</h2>
        <p>Lorong, etalase, dan orang di baliknya.</p>
      </div>
      <div class="gallery">
        <figure>
          <img
            src="/assets/img/suasana-lorong.jpg"
            alt="Pengunjung menyusuri kios di lorong Pasar Inpres Kebun Sayur"
            width="1280"
            height="720"
            loading="lazy"
          />
          <figcaption>
            <strong>Menyusuri lorong oleh-oleh</strong>
            <a
              :href="sources.corridor"
              target="_blank"
              rel="noopener"
            >
              Foto: ibukotakini.com
            </a>
          </figcaption>
        </figure>
        <figure>
          <img
            src="/assets/img/suasana-pedagang.jpg"
            alt="Pedagang menata cincin batu akik di etalase pasar"
            width="928"
            height="696"
            loading="lazy"
          />
          <figcaption>
            <strong>Cerita dari balik etalase</strong>
            <a
              :href="sources.seller"
              target="_blank"
              rel="noopener"
            >
              Foto: Achmad Fadillah / Pusaran Media
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  </div>
</template>
