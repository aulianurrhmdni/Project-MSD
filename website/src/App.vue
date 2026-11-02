<script setup>
import { useRoute } from 'vue-router'
import { useMarket } from './stores/market.js'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
const route = useRoute()
const market = useMarket()
</script>
<template>
  <SiteHeader v-if="!route.meta.seller" />
  <main
    id="isi"
    tabindex="-1"
  >
    <RouterView />
  </main>
  <SiteFooter v-if="!route.meta.seller" />
  <Transition name="toast">
    <div
      v-if="market.message"
      class="toast"
      role="status"
    >
      {{ market.message }}
    </div>
  </Transition>
</template>
