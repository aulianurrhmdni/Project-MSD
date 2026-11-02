<script setup>
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useMarket } from '../stores/market.js'
import { rupiah, photo } from '../utils.js'
const market = useMarket()
const router = useRouter()
const choices = reactive({})
const buyer = reactive({ nama: '', hp: '' })
const error = ref('')
const submitting = ref(false)
const groups = computed(() =>
  market.kiosks
    .map((k) => ({ ...k, items: market.items.filter((it) => it.p.kios === k.id) }))
    .filter((k) => k.items.length),
)
const subtotal = (items) => items.reduce((sum, it) => sum + it.p.harga * it.n, 0)
watchEffect(() => {
  groups.value.forEach((k) => {
    if (!choices[k.id] || (!k.qris && choices[k.id].metode === 'qris'))
      choices[k.id] = { metode: k.qris ? 'qris' : 'kios' }
  })
})
function checkout() {
  if (submitting.value) return
  error.value = ''
  const cleanHp = buyer.hp.trim().replace(/[\s\-().]/g, '')
  if (!buyer.nama.trim() || !/^(?:\+?62|0)\d{8,13}$/.test(cleanHp)) {
    error.value = 'Isi nama dan nomor WhatsApp Indonesia yang valid.'
    return
  }
  submitting.value = true
  try {
    const orders = market.checkout(choices, { nama: buyer.nama.trim(), hp: cleanHp })
    if (orders.length)
      router.push({ path: '/pesanan', query: { baru: orders.map((o) => o.id).join(',') } })
    else error.value = 'Stok berubah. Silakan periksa keranjangmu.'
  } catch {
    error.value = 'Pesanan belum tersimpan. Periksa ruang penyimpanan perangkat lalu coba lagi.'
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <div class="frame page">
    <header class="page-heading">
      <h1>Keranjangmu</h1>
      <p>Pilih cara bayar, lalu ambil oleh-oleh langsung di kios.</p>
    </header>
    <form
      v-if="market.items.length"
      class="checkout-layout"
      @submit.prevent="checkout"
    >
      <div class="stack">
        <section
          v-for="k in groups"
          :key="k.id"
          class="panel"
        >
          <h2>{{ k.nama }}</h2>
          <p class="meta">Kios {{ k.id }}</p>
          <ul class="cart-items">
            <li
              v-for="it in k.items"
              :key="it.p.id"
            >
              <img
                :src="photo(it.p.foto)"
                :alt="it.p.nama"
                width="88"
                height="88"
              />
              <div>
                <RouterLink :to="`/produk/${it.p.id}`">
                  <strong>{{ it.p.nama }}</strong>
                </RouterLink>
                <p>{{ rupiah(it.p.harga) }}</p>
                <div class="action-row">
                  <div class="quantity">
                    <button
                      type="button"
                      :aria-label="`Kurangi ${it.p.nama}`"
                      @click="market.setQuantity(it.p.id, it.n - 1)"
                    >
                      −
                    </button>
                    <output>{{ it.n }}</output>
                    <button
                      type="button"
                      :disabled="it.n >= it.p.stok"
                      :aria-label="`Tambah ${it.p.nama}`"
                      @click="market.setQuantity(it.p.id, it.n + 1)"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    class="text-button danger"
                    @click="market.setQuantity(it.p.id, 0)"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          </ul>
          <fieldset v-if="choices[k.id]">
            <legend>Cara bayar di {{ k.nama }}</legend>
            <label class="payment-option">
              <input
                v-model="choices[k.id].metode"
                type="radio"
                :name="k.id"
                value="qris"
                :disabled="!k.qris"
              />
              <span>
                QRIS
                <small>
                  {{
                    k.qris ? 'Bayar sebelum datang, ambil di kios.' : 'Belum tersedia di kios ini.'
                  }}
                </small>
              </span>
            </label>
            <label class="payment-option">
              <input
                v-model="choices[k.id].metode"
                type="radio"
                :name="k.id"
                value="kios"
              />
              <span>
                Bayar di kios
                <small>Barang disisihkan setelah dikonfirmasi penjual.</small>
              </span>
            </label>
          </fieldset>
        </section>
      </div>
      <aside class="panel order-summary">
        <h2>Ringkasan belanja</h2>
        <div
          v-for="k in groups"
          :key="k.id"
          class="sum-row"
        >
          <span>{{ k.nama }}</span>
          <b>{{ rupiah(subtotal(k.items)) }}</b>
        </div>
        <div class="sum-row total">
          <b>Total</b>
          <b>{{ rupiah(market.total) }}</b>
        </div>
        <label class="field">
          Nama pemesan
          <input
            v-model="buyer.nama"
            required
            autocomplete="name"
            maxlength="100"
          />
        </label>
        <label class="field">
          Nomor WhatsApp
          <input
            v-model="buyer.hp"
            required
            type="tel"
            autocomplete="tel"
            placeholder="08xxxxxxxxxx"
          />
        </label>
        <p
          v-if="error"
          role="alert"
          class="notice error"
        >
          {{ error }}
        </p>
        <button
          class="button"
          :disabled="submitting"
          type="submit"
        >
          {{ submitting ? 'Membuat pesanan…' : 'Buat pesanan' }}
        </button>
      </aside>
    </form>
    <div
      v-else
      class="empty"
    >
      <h2>Masih ada ruang untuk oleh-oleh</h2>
      <p>Belum ada barang di keranjangmu.</p>
      <RouterLink
        class="button"
        to="/katalog"
      >
        Jelajahi katalog
      </RouterLink>
    </div>
  </div>
</template>
