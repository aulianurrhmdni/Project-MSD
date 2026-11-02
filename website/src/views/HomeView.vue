<script setup>
import { ref, computed } from 'vue'
import { useMarket, KS } from '../stores/market.js'
import ProductCard from '../components/ProductCard.vue'
import TypingSearch from '../components/TypingSearch.vue'
import AppIcon from '../components/AppIcon.vue'
import HeroHeadline from '../components/HeroHeadline.vue'
const market = useMarket()
const selected = ref('semua')
const chosen = computed(() =>
  market.products
    .filter((p) => p.stok > 0 && (selected.value === 'semua' || p.bahan.includes(selected.value)))
    .slice(0, 4),
)
</script>
<template>
  <section class="market-hero">
    <div class="hero-copy">
      <RouterLink
        class="hero-location"
        to="/denah"
      >
        <AppIcon name="pin" />
        Pasar Inpress Kebun Sayur, Balikpapan
      </RouterLink>
      <HeroHeadline />
      <p>Berbagai cinderamatamu ada di Pasar Inpress Kebun Sayur Balikpapan</p>
      <TypingSearch />
    </div>
    <figure class="hero-visual">
      <img
        src="/assets/img/pasar-depan.jpg"
        alt="Bagian depan Pasar Inpress Kebun Sayur dengan papan nama biru dan merah"
        width="800"
        height="534"
        fetchpriority="high"
      />
      <figcaption>Temukan yang khas. Bawa pulang ceritanya.</figcaption>
    </figure>
  </section>
  <section
    class="frame home-section collection"
    aria-labelledby="koleksi-title"
  >
    <div class="section-heading">
      <h2 id="koleksi-title">Pilih yang kamu suka</h2>
      <RouterLink
        :to="{ path: '/katalog', query: selected === 'semua' ? {} : { bahan: selected } }"
      >
        Lihat katalog
        <AppIcon name="arrow" />
      </RouterLink>
    </div>
    <div
      class="material-tabs"
      aria-label="Pilihan bahan"
    >
      <button
        :aria-pressed="selected === 'semua'"
        @click="selected = 'semua'"
      >
        Semua oleh-oleh
      </button>
      <button
        v-for="b in KS.bahan"
        :key="b.id"
        :aria-pressed="selected === b.id"
        @click="selected = b.id"
      >
        {{ b.nama }}
      </button>
    </div>
    <div
      class="product-grid"
      aria-live="polite"
    >
      <ProductCard
        v-for="p in chosen"
        :key="p.id"
        :product="p"
      />
      <p
        v-if="!chosen.length"
        class="empty"
      >
        Belum ada stok untuk bahan ini.
      </p>
    </div>
  </section>
  <section class="kiosk-section home-section">
    <div class="frame kiosk-layout">
      <div>
        <h2>
          Dari kiosnya
          <br />
          langsung
        </h2>
        <p>Kenali penjualnya, pilih barangnya, lalu ambil pesananmu saat mampir ke pasar.</p>
        <RouterLink
          class="text-link"
          to="/denah"
        >
          Temukan kios di denah
          <AppIcon name="arrow" />
        </RouterLink>
      </div>
      <div class="kiosk-list">
        <RouterLink
          v-for="k in market.kiosks"
          :key="k.id"
          :to="{ path: '/katalog', query: { kios: k.id } }"
        >
          <span class="kiosk-code">{{ k.id }}</span>
          <span>
            <strong>{{ k.nama }}</strong>
            <small>{{ k.jual }}</small>
          </span>
          <AppIcon name="arrow" />
        </RouterLink>
      </div>
    </div>
  </section>
  <section class="frame home-section visit-layout">
    <img
      src="/assets/img/suasana-lorong.jpg"
      alt="Lorong Pasar Inpres Kebun Sayur dengan kios cendera mata dan pengunjung"
      width="1280"
      height="720"
      loading="lazy"
    />
    <div>
      <h2>Mampir ke pasarnya</h2>
      <p>
        Di balik setiap etalase ada pilihan yang berbeda. Susuri lorongnya, lihat kerajinan dari
        dekat, dan temukan oleh-oleh untuk orang rumah.
      </p>
      <RouterLink
        class="button"
        to="/tentang"
      >
        Kenali pasarnya
      </RouterLink>
      <a
        class="photo-credit"
        href="https://ibukotakini.com/read/pasar-inpres-kebun-sayur-direvitalisasi-2026-pemkot-siapkan-tps-pedagang"
        target="_blank"
        rel="noopener"
      >
        Foto lorong: ibukotakini.com
      </a>
    </div>
  </section>
</template>
