<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMarket } from '../stores/market.js'
import { photo, whatsapp } from '../utils.js'
const market = useMarket()
const route = useRoute()
const router = useRouter()
const qrisOnly = ref(false)
const selected = computed(() =>
  /^[A-D]-(0[1-9]|1[0-2])$/.test(String(route.query.kios)) ? String(route.query.kios) : 'A-03',
)
const kiosk = computed(() => market.kiosks.find((k) => k.id === selected.value))
const products = computed(() => market.products.filter((p) => p.kios === selected.value))
const qris = (id) =>
  market.kiosks.find((k) => k.id === id)?.qris ||
  ['A-01', 'B-02', 'B-07', 'C-09', 'D-01', 'D-04', 'D-11'].includes(id)
const code = (block, n) => `${block}-${String(n).padStart(2, '0')}`
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Pasar+Inpres+Kebun+Sayur+Balikpapan'
</script>
<template>
  <div class="frame page">
    <header class="page-heading">
      <h1>Temukan kiosmu</h1>
      <p>Pasar Inpress Kebun Sayur, Jalan Letjen Suprapto, Balikpapan.</p>
    </header>
    <section class="map-location">
      <div>
        <h2>Jalan ke pasar</h2>
        <p>
          Marga Sari, Balikpapan Barat.
          <br />
          Temukan rute dari lokasimu melalui Google Maps.
        </p>
        <a
          class="button"
          :href="mapUrl"
          target="_blank"
          rel="noopener"
        >
          Buka Google Maps
        </a>
      </div>
      <iframe
        title="Lokasi Pasar Inpres Kebun Sayur di Google Maps"
        src="https://www.google.com/maps?q=Pasar+Inpres+Kebun+Sayur+Balikpapan&output=embed"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
    <div class="section-heading">
      <h2>Denah kios</h2>
      <label class="check">
        <input
          v-model="qrisOnly"
          type="checkbox"
        />
        Tandai kios QRIS
      </label>
    </div>
    <div class="map-layout">
      <div class="market-map">
        <section
          v-for="block in ['A', 'B', 'C', 'D']"
          :key="block"
        >
          <h3>Blok {{ block }}</h3>
          <div class="stall-grid">
            <button
              v-for="n in 12"
              :key="n"
              :aria-label="`Kios ${code(block, n)}${qris(code(block, n)) ? ', menerima QRIS' : ''}`"
              :aria-pressed="selected === code(block, n)"
              :class="{ qris: qris(code(block, n)), dim: qrisOnly && !qris(code(block, n)) }"
              @click="router.replace({ query: { kios: code(block, n) } })"
            >
              {{ String(n).padStart(2, '0') }}
            </button>
          </div>
        </section>
        <p class="map-entrance">Pintu masuk · Jl. Letjen Suprapto</p>
        <p class="meta map-note">Denah contoh 48 kios. Warna biru muda menandai kios QRIS.</p>
      </div>
      <aside class="panel kiosk-info">
        <p>Kios {{ selected }}</p>
        <h2>{{ kiosk?.nama || `Kios ${selected}` }}</h2>
        <p>{{ kiosk?.jual || 'Kios ini belum memiliki katalog online.' }}</p>
        <span
          v-if="qris(selected)"
          class="status go"
        >
          Menerima QRIS
        </span>
        <div
          v-if="products.length"
          class="mini-products"
        >
          <RouterLink
            v-for="p in products.slice(0, 3)"
            :key="p.id"
            :to="`/produk/${p.id}`"
          >
            <img
              :src="photo(p.foto)"
              :alt="p.nama"
              width="100"
              height="100"
            />
          </RouterLink>
        </div>
        <RouterLink
          v-if="kiosk"
          class="button"
          :to="{ path: '/katalog', query: { kios: selected } }"
        >
          Lihat {{ products.length }} barang
        </RouterLink>
        <RouterLink
          v-else
          class="button"
          to="/katalog"
        >
          Jelajahi katalog pasar
        </RouterLink>
        <a
          v-if="kiosk && kiosk.wa"
          :href="whatsapp(kiosk)"
          target="_blank"
          rel="noopener"
        >
          Chat penjual
        </a>
      </aside>
    </div>
  </div>
</template>
