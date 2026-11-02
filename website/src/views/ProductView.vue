<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMarket, KS } from '../stores/market.js'
import { rupiah, photo, whatsapp } from '../utils.js'
import ProductCard from '../components/ProductCard.vue'
const market = useMarket()
const route = useRoute()
const quantity = ref(1)
const product = computed(() => market.products.find((p) => p.id === route.params.id))
const kiosk = computed(() => market.kiosks.find((k) => k.id === product.value?.kios))
const related = computed(() =>
  market.products
    .filter(
      (p) => p.id !== product.value?.id && p.bahan.some((b) => product.value?.bahan.includes(b)),
    )
    .slice(0, 4),
)
watch(
  () => [route.params.id, product.value?.stok],
  ([, stok]) => {
    if (!stok) quantity.value = 0
    else if (quantity.value < 1 || quantity.value > stok) quantity.value = 1
  },
  { immediate: true },
)
</script>
<template>
  <div
    class="frame page"
    v-if="product"
  >
    <RouterLink
      class="back-link"
      to="/katalog"
    >
      Kembali ke katalog
    </RouterLink>
    <div class="product-detail">
      <img
        class="detail-image"
        :src="photo(product.foto)"
        :alt="product.nama"
        width="600"
        height="650"
      />
      <div class="detail-copy">
        <p>Kios {{ product.kios }} · {{ kiosk?.nama }}</p>
        <h1>{{ product.nama }}</h1>
        <p class="price">{{ rupiah(product.harga) }}</p>
        <p>{{ product.ket }}</p>
        <dl class="specs">
          <div>
            <dt>Bahan</dt>
            <dd>
              {{ product.bahan.map((id) => KS.bahan.find((b) => b.id === id)?.nama).join(', ') }}
            </dd>
          </div>
          <div>
            <dt>Asal</dt>
            <dd>{{ product.asal }}</dd>
          </div>
          <div>
            <dt>Pembuat</dt>
            <dd>{{ product.pengrajin }}</dd>
          </div>
        </dl>
        <p>{{ product.stok ? `${product.stok} barang tersedia` : 'Stok habis' }}</p>
        <div class="action-row">
          <div class="quantity">
            <button
              :disabled="quantity <= 1 || !product.stok"
              aria-label="Kurangi jumlah"
              @click="quantity--"
            >
              −
            </button>
            <output>{{ product.stok ? quantity : 0 }}</output>
            <button
              :disabled="quantity >= product.stok"
              aria-label="Tambah jumlah"
              @click="quantity++"
            >
              +
            </button>
          </div>
          <button
            class="button"
            :disabled="!product.stok"
            @click="market.add(product, quantity)"
          >
            {{ product.stok ? 'Tambah ke keranjang' : 'Stok habis' }}
          </button>
        </div>
        <div class="seller-detail">
          <strong>{{ kiosk?.nama }}</strong>
          <p>{{ kiosk?.qris ? 'Menerima QRIS dan bayar di kios' : 'Bayar langsung di kios' }}</p>
          <div class="action-row">
            <RouterLink :to="{ path: '/denah', query: { kios: product.kios } }">
              Lihat lokasi kios
            </RouterLink>
            <a
              :href="whatsapp(kiosk, `Halo, saya tertarik dengan ${product.nama}.`)"
              target="_blank"
              rel="noopener"
            >
              Chat penjual
            </a>
          </div>
        </div>
      </div>
    </div>
    <section
      v-if="related.length"
      class="home-section"
    >
      <div class="section-heading"><h2>Pilihan lainnya</h2></div>
      <div class="product-grid">
        <ProductCard
          v-for="p in related"
          :key="p.id"
          :product="p"
        />
      </div>
    </section>
  </div>
  <div
    v-else
    class="frame page empty"
  >
    <h1>Barang tidak ditemukan</h1>
    <RouterLink
      class="button"
      to="/katalog"
    >
      Kembali ke katalog
    </RouterLink>
  </div>
</template>
