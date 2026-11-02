<script setup>
import { computed } from 'vue'
import OrderCard from '../../components/OrderCard.vue'
import { photo, rupiah } from '../../utils.js'

const props = defineProps({ orders: Array, waiting: Array, lowStock: Array, income: Number })
defineEmits(['navigate', 'edit'])
const paymentQueue = computed(
  () => props.orders.filter((order) => order.status === 'perlu_validasi').length,
)
const confirmationQueue = computed(
  () => props.orders.filter((order) => order.status === 'perlu_konfirmasi').length,
)
</script>

<template>
  <div class="metrics">
    <button @click="$emit('navigate', 'validasi')">
      <span>Perlu validasi QRIS</span>
      <strong>{{ paymentQueue }}</strong>
    </button>
    <button @click="$emit('navigate', 'pesanan')">
      <span>Perlu konfirmasi</span>
      <strong>{{ confirmationQueue }}</strong>
    </button>
    <div>
      <span>Pemasukan hari ini</span>
      <strong>{{ rupiah(income) }}</strong>
    </div>
    <button @click="$emit('navigate', 'barang')">
      <span>Stok menipis</span>
      <strong>{{ lowStock.length }}</strong>
    </button>
  </div>
  <div class="seller-overview">
    <section>
      <div class="section-heading">
        <h2>Pesanan perlu tindakan</h2>
        <button
          class="text-button"
          @click="$emit('navigate', 'pesanan')"
        >
          Lihat semua
        </button>
      </div>
      <div class="stack">
        <OrderCard
          v-for="order in waiting.slice(0, 3)"
          :key="order.id"
          :order="order"
          seller
        />
        <p
          v-if="!waiting.length"
          class="panel"
        >
          Semua pesanan sudah ditangani.
        </p>
      </div>
    </section>
    <section>
      <h2>Periksa stok</h2>
      <ul class="stock-list">
        <li
          v-for="product in lowStock"
          :key="product.id"
        >
          <img
            :src="photo(product.foto)"
            :alt="product.nama"
            width="48"
            height="48"
          />
          <div>
            <strong>{{ product.nama }}</strong>
            <p>{{ product.stok }} tersisa</p>
          </div>
          <button
            class="text-button"
            @click="$emit('edit', product)"
          >
            Ubah
          </button>
        </li>
      </ul>
      <p
        v-if="!lowStock.length"
        class="panel"
      >
        Stok semua barang masih tersedia.
      </p>
    </section>
  </div>
</template>
