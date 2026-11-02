<script setup>
import { marketService, useMarket } from '../../stores/market.js'
import { photo, rupiah } from '../../utils.js'

defineProps({ products: { type: Array, required: true } })
defineEmits(['edit', 'remove'])
const term = defineModel('term', { type: String, default: '' })
const market = useMarket()

function updateStock(product, value) {
  marketService.setStok(product.id, Number(value))
  market.notify('Stok diperbarui.')
}
</script>

<template>
  <div class="catalog-toolbar">
    <label class="field">
      Cari barang kios
      <input
        v-model="term"
        type="search"
        placeholder="Nama barang"
      />
    </label>
    <p>{{ products.length }} barang</p>
  </div>
  <div class="seller-products">
    <article
      v-for="product in products"
      :key="product.id"
    >
      <img
        :src="photo(product.foto)"
        :alt="product.nama"
        width="64"
        height="64"
      />
      <div>
        <h2>{{ product.nama }}</h2>
        <p>{{ rupiah(product.harga) }}</p>
      </div>
      <label class="field stock-input">
        Stok
        <input
          :value="product.stok"
          type="number"
          min="0"
          max="999"
          :aria-label="`Stok ${product.nama}`"
          @change="updateStock(product, $event.target.value)"
        />
      </label>
      <div class="action-row">
        <button
          class="text-button"
          @click="$emit('edit', product)"
        >
          Ubah
        </button>
        <button
          class="text-button danger"
          @click="$emit('remove', product)"
        >
          Hapus
        </button>
      </div>
    </article>
    <div
      v-if="!products.length"
      class="empty"
    >
      Belum ada barang yang sesuai.
    </div>
  </div>
</template>
