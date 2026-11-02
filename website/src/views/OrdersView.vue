<script setup>
import { useMarket } from '../stores/market.js'
import { useRoute } from 'vue-router'
import OrderCard from '../components/OrderCard.vue'
const market = useMarket()
const route = useRoute()
</script>
<template>
  <div class="frame page narrow">
    <header class="page-heading">
      <h1>Pesanan saya</h1>
      <p>Ikuti pesananmu sampai oleh-oleh siap dibawa pulang.</p>
    </header>
    <p
      v-if="route.query.baru && market.mine.length"
      class="notice"
    >
      Pesanan berhasil dibuat. Setiap kios memproses pesanannya sendiri.
    </p>
    <div
      v-if="market.mine.length"
      class="stack"
    >
      <OrderCard
        v-for="o in market.mine"
        :key="o.id"
        :order="o"
      />
    </div>
    <div
      v-else
      class="empty"
    >
      <h2>Belum ada pesanan</h2>
      <p>Temukan oleh-oleh pilihanmu dulu.</p>
      <RouterLink
        class="button"
        to="/katalog"
      >
        Mulai belanja
      </RouterLink>
    </div>
  </div>
</template>
