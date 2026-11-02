import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { marketService } from '../services/browserMarket.js'
export { marketService }
export { KS } from '../data/seed.js'

export const useMarket = defineStore('market', () => {
  const revision = ref(0)
  marketService.on(() => revision.value++)
  const products = computed(() => {
    revision.value
    return marketService.produk().map((p) => ({ ...p }))
  })
  const kiosks = computed(() => {
    revision.value
    return marketService.kios().map((k) => ({ ...k }))
  })
  const orders = computed(() => {
    revision.value
    return marketService.orders().map((o) => ({ ...o }))
  })
  const mine = computed(() => {
    revision.value
    return marketService.pesananSaya().map((o) => ({ ...o }))
  })
  const cart = useStorage('ks-cart', {})
  const items = computed(() =>
    Object.entries(cart.value || {}).flatMap(([id, n]) => {
      const p = products.value.find((p) => p.id === id)
      return p && p.stok > 0 && Number.isSafeInteger(n) && n > 0
        ? [{ p, n: Math.min(n, p.stok) }]
        : []
    }),
  )
  const count = computed(() => items.value.reduce((sum, it) => sum + it.n, 0))
  const total = computed(() => items.value.reduce((sum, it) => sum + it.n * it.p.harga, 0))
  const message = ref('')
  let toastTimer
  function notify(text) {
    message.value = text
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      message.value = ''
    }, 3500)
  }
  function setQuantity(id, n) {
    const p = products.value.find((p) => p.id === id)
    if (!p || n <= 0) {
      const next = { ...cart.value }
      delete next[id]
      cart.value = next
      return
    }
    cart.value = { ...cart.value, [id]: Math.max(0, Math.min(p.stok, Math.floor(n))) }
  }
  function add(p, n = 1) {
    const current = items.value.find((it) => it.p.id === p.id)?.n || 0
    if (current >= p.stok) return notify('Semua stok barang ini sudah ada di keranjang.')
    setQuantity(p.id, current + n)
    notify(`${p.nama} masuk keranjang.`)
  }
  function checkout(choices, buyer) {
    const clean = Object.fromEntries(items.value.map((it) => [it.p.id, it.n]))
    const created = marketService.buatPesanan(clean, choices, buyer)
    if (created.length) cart.value = {}
    return created
  }
  return {
    products,
    kiosks,
    orders,
    mine,
    cart,
    items,
    count,
    total,
    message,
    notify,
    setQuantity,
    add,
    checkout,
  }
})
