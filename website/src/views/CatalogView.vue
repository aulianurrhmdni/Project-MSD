<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMarket, KS } from '../stores/market.js'
import ProductCard from '../components/ProductCard.vue'
const market = useMarket()
const route = useRoute()
const router = useRouter()
const sort = ref('pilihan')
const material = computed(() => String(route.query.bahan || 'semua'))
const kiosk = computed(() => String(route.query.kios || 'semua'))
const search = computed(() => String(route.query.q || '').trim())
const products = computed(() =>
  market.products
    .filter((p) => {
      const hay = [
        p.nama,
        p.ket,
        ...p.bahan.map((id) => KS.bahan.find((b) => b.id === id)?.nama),
        market.kiosks.find((k) => k.id === p.kios)?.nama,
      ]
        .join(' ')
        .toLowerCase()
      return (
        (material.value === 'semua' || p.bahan.includes(material.value)) &&
        (kiosk.value === 'semua' || p.kios === kiosk.value) &&
        hay.includes(search.value.toLowerCase())
      )
    })
    .sort(
      (a, b) =>
        Number(b.stok > 0) - Number(a.stok > 0) ||
        (sort.value === 'murah'
          ? a.harga - b.harga
          : sort.value === 'mahal'
            ? b.harga - a.harga
            : 0),
    ),
)
function filter(key, value) {
  const q = { ...route.query }
  if (value === 'semua') delete q[key]
  else q[key] = value
  router.replace({ query: q })
}
</script>
<template>
  <div class="frame page">
    <header class="page-heading">
      <h1>Katalog oleh-oleh</h1>
      <p>
        {{
          search
            ? `Hasil pencarian untuk “${search}”`
            : 'Pilih sesuatu yang mengingatkanmu pada Kalimantan.'
        }}
      </p>
    </header>
    <div class="catalog-layout">
      <aside class="filters">
        <div>
          <h2>Bahan</h2>
          <div class="filter-options">
            <button
              :aria-pressed="material === 'semua'"
              @click="filter('bahan', 'semua')"
            >
              Semua bahan
            </button>
            <button
              v-for="b in KS.bahan"
              :key="b.id"
              :aria-pressed="material === b.id"
              @click="filter('bahan', b.id)"
            >
              {{ b.nama }}
            </button>
          </div>
        </div>
        <label class="field">
          Kios
          <select
            :value="kiosk"
            @change="filter('kios', $event.target.value)"
          >
            <option value="semua">Semua kios</option>
            <option
              v-for="k in market.kiosks"
              :key="k.id"
              :value="k.id"
            >
              {{ k.nama }}
            </option>
          </select>
        </label>
        <RouterLink
          v-if="Object.keys(route.query).length"
          class="text-link"
          to="/katalog"
        >
          Hapus semua filter
        </RouterLink>
      </aside>
      <div>
        <div class="catalog-toolbar">
          <p role="status">{{ products.length }} barang</p>
          <label class="sort-label">
            Urutkan
            <select v-model="sort">
              <option value="pilihan">Pilihan kios</option>
              <option value="murah">Harga terendah</option>
              <option value="mahal">Harga tertinggi</option>
            </select>
          </label>
        </div>
        <div class="product-grid catalog-products">
          <ProductCard
            v-for="p in products"
            :key="p.id"
            :product="p"
          />
          <div
            v-if="!products.length"
            class="empty"
          >
            <h2>Belum ketemu?</h2>
            <p>Coba bahan atau kios lain.</p>
            <RouterLink
              class="button"
              to="/katalog"
            >
              Lihat semua barang
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
