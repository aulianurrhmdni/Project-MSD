<script setup>
import { useMarket } from '../stores/market.js'
import { rupiah, photo } from '../utils.js'
const props = defineProps({ product: { type: Object, required: true } })
const market = useMarket()
</script>
<template>
  <article class="product-card">
    <RouterLink
      :to="`/produk/${product.id}`"
      class="product-photo"
    >
      <img
        :src="photo(product.foto)"
        :alt="product.nama"
        width="400"
        height="450"
        loading="lazy"
      />
      <span
        v-if="product.stok <= 2"
        class="stock-tag"
      >
        {{ product.stok ? 'Sisa ' + product.stok : 'Stok habis' }}
      </span>
    </RouterLink>
    <p class="product-kiosk">Kios {{ product.kios }}</p>
    <h3>
      <RouterLink :to="`/produk/${product.id}`">{{ product.nama }}</RouterLink>
    </h3>
    <div class="product-bottom">
      <strong>{{ rupiah(product.harga) }}</strong>
      <button
        :disabled="!product.stok"
        class="add-button"
        :aria-label="`Tambah ${product.nama} ke keranjang`"
        @click="market.add(props.product)"
      >
        +
      </button>
    </div>
  </article>
</template>
