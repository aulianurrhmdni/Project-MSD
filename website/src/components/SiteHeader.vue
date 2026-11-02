<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMediaQuery, onKeyStroke } from '@vueuse/core'
import { useMarket } from '../stores/market.js'
import AppIcon from './AppIcon.vue'
const market = useMarket()
const route = useRoute()
const open = ref(false)
const desktop = useMediaQuery('(min-width: 1150px)')
const nav = [
  ['/', 'Beranda'],
  ['/katalog', 'Katalog'],
  ['/denah', 'Denah kios'],
  ['/tentang', 'Tentang pasar'],
]
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
watch(desktop, () => {
  open.value = false
})
onKeyStroke('Escape', () => {
  open.value = false
})
</script>
<template>
  <a
    class="skip"
    href="#isi"
  >
    Langsung ke isi
  </a>
  <header class="site-header">
    <div class="header-inner frame">
      <RouterLink
        class="brand"
        to="/"
      >
        <span>Pasar Inpress</span>
        <strong>Kebun Sayur</strong>
      </RouterLink>
      <nav
        class="desktop-nav"
        aria-label="Navigasi utama"
      >
        <RouterLink
          v-for="[to, label] in nav"
          :key="to"
          :to="to"
          :class="{ active: route.path === to }"
        >
          {{ label }}
        </RouterLink>
      </nav>
      <div class="header-actions">
        <RouterLink
          class="seller-link"
          to="/penjual"
        >
          Login sebagai penjual
        </RouterLink>
        <RouterLink
          class="orders-link"
          to="/pesanan"
          aria-label="Pesanan saya"
        >
          <AppIcon name="receipt" />
        </RouterLink>
        <RouterLink
          class="cart-link"
          to="/keranjang"
          :aria-label="`Keranjang, ${market.count} barang`"
        >
          <AppIcon name="bag" />
          <span>{{ market.count }}</span>
        </RouterLink>
        <button
          class="menu-toggle"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Tutup menu' : 'Buka menu'"
          @click="open = !open"
        >
          <AppIcon :name="open ? 'close' : 'menu'" />
        </button>
      </div>
    </div>
    <nav
      v-if="open"
      id="mobile-menu"
      class="mobile-menu frame"
      aria-label="Menu ponsel"
    >
      <RouterLink
        v-for="[to, label] in nav"
        :key="to"
        :to="to"
      >
        {{ label }}
      </RouterLink>
      <RouterLink to="/pesanan">Pesanan saya</RouterLink>
      <RouterLink
        to="/penjual"
        class="mobile-seller"
      >
        Login sebagai penjual
      </RouterLink>
    </nav>
  </header>
</template>
