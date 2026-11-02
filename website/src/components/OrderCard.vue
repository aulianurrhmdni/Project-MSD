<script setup>
import { computed, ref } from 'vue'
import { useMarket, marketService } from '../stores/market.js'
import { rupiah, waktu, whatsapp, readPhoto, photo } from '../utils.js'
const props = defineProps({ order: Object, seller: Boolean })
const market = useMarket()
const reference = ref('')
const evidence = ref('')
const error = ref('')
const kiosk = computed(() => market.kiosks.find((k) => k.id === props.order.kios))
const status = computed(
  () => marketService.STATUS[props.order.status] || { label: props.order.status, tone: 'wait' },
)
const next = computed(() => {
  const o = props.order
  if (o.status === 'menunggu_bayar') return 'Kirim konfirmasi setelah pembayaran selesai.'
  if (o.status === 'perlu_validasi') return 'Pembayaran sedang diperiksa oleh penjual.'
  if (o.status === 'perlu_konfirmasi') return 'Menunggu penjual menyisihkan barang.'
  if (o.status === 'diproses') {
    const at = o.riwayat?.find((r) => r.status === 'diproses')?.at
    return o.metode === 'kios' && at
      ? `Ambil barang di kios ${o.kios} sebelum ${waktu(new Date(new Date(at).getTime() + 86400000))} WITA.`
      : `Pesanan siap diambil di kios ${o.kios}. Tunjukkan nomor pesananmu.`
  }
  return o.status === 'selesai'
    ? 'Terima kasih sudah berbelanja.'
    : 'Hubungi kios jika ada pembayaran yang perlu ditindaklanjuti.'
})
function transition(state, extra = {}) {
  if (state === 'dibatalkan' && !window.confirm('Batalkan pesanan ini?')) return
  if (state === 'ditolak' && !window.confirm('Tolak pesanan ini?')) return
  marketService.ubahStatus(props.order.id, state, props.seller ? 'penjual' : 'pembeli', extra)
  market.notify('Status pesanan diperbarui.')
}
async function upload(e) {
  if (!e.target.files?.[0]) return
  try {
    error.value = ''
    evidence.value = await readPhoto(e.target.files[0], 720)
  } catch (e) {
    error.value = e.message
  }
}
</script>
<template>
  <article class="order-card panel">
    <div class="order-heading">
      <div>
        <h2>{{ seller ? order.pembeli?.nama || 'Pembeli' : kiosk?.nama || order.kios }}</h2>
        <p class="meta">{{ order.id }} · {{ waktu(order.dibuat) }} WITA</p>
      </div>
      <span
        class="status"
        :class="status.tone"
      >
        {{ status.label }}
      </span>
    </div>
    <ul>
      <li
        v-for="it in order.items"
        :key="it.id"
      >
        {{ it.n }} × {{ it.nama }}
      </li>
    </ul>
    <div class="sum-row">
      <span>{{ marketService.METODE[order.metode] }}</span>
      <strong>{{ rupiah(order.total) }}</strong>
    </div>
    <p class="notice">{{ next }}</p>
    <template v-if="!seller && order.status === 'menunggu_bayar'">
      <div class="payment-content">
        <img
          v-if="kiosk?.qrisImg"
          class="qr-photo"
          :src="photo(kiosk.qrisImg)"
          :alt="`QRIS ${kiosk.nama}`"
        />
        <p
          v-else
          class="notice"
        >
          QRIS kios belum diunggah. Konfirmasi pembayaran tersedia untuk simulasi.
        </p>
        <div class="stack">
          <label class="field">
            Nama di aplikasi pembayar
            <input
              v-model="reference"
              autocomplete="name"
            />
          </label>
          <label class="field">
            Bukti pembayaran (opsional)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              @change="upload"
            />
          </label>
          <img
            v-if="evidence"
            class="proof-photo"
            :src="evidence"
            alt="Pratinjau bukti bayar"
          />
          <p
            v-if="error"
            role="alert"
          >
            {{ error }}
          </p>
          <button
            class="button"
            @click="transition('perlu_validasi', { ref: reference.trim(), bukti: evidence })"
          >
            Saya sudah bayar
          </button>
        </div>
      </div>
    </template>
    <div
      v-if="seller"
      class="stack"
    >
      <p>WhatsApp: {{ order.pembeli?.hp || '-' }}</p>
      <p v-if="order.ref">Nama pembayar: {{ order.ref }}</p>
      <a
        v-if="order.bukti"
        :href="order.bukti"
        target="_blank"
        rel="noopener"
      >
        <img
          class="proof-photo"
          :src="order.bukti"
          alt="Bukti pembayaran pembeli"
        />
      </a>
      <div class="action-row">
        <button
          v-if="order.status === 'perlu_validasi'"
          class="button"
          @click="transition('diproses', { lunas: true })"
        >
          Dana masuk, validasi
        </button>
        <button
          v-if="order.status === 'perlu_konfirmasi'"
          class="button"
          @click="transition('diproses')"
        >
          Sisihkan barang
        </button>
        <button
          v-if="order.status === 'diproses'"
          class="button"
          @click="transition('selesai', { lunas: true })"
        >
          Selesaikan pesanan
        </button>
        <button
          v-if="['perlu_validasi', 'perlu_konfirmasi'].includes(order.status)"
          class="button secondary"
          @click="transition('ditolak')"
        >
          Tolak pesanan
        </button>
        <button
          v-if="['menunggu_bayar', 'diproses'].includes(order.status)"
          class="text-button danger"
          @click="transition('dibatalkan')"
        >
          Batalkan pesanan
        </button>
      </div>
    </div>
    <div
      v-else
      class="action-row"
    >
      <button
        v-if="['menunggu_bayar', 'perlu_konfirmasi'].includes(order.status)"
        class="text-button danger"
        @click="transition('dibatalkan')"
      >
        Batalkan pesanan
      </button>
      <a
        :href="whatsapp(kiosk, `Halo, saya menanyakan pesanan ${order.id}.`)"
        target="_blank"
        rel="noopener"
      >
        Chat penjual
      </a>
    </div>
    <details class="timeline">
      <summary>Riwayat pesanan</summary>
      <ol>
        <li
          v-for="(r, i) in order.riwayat || []"
          :key="i"
        >
          {{ waktu(r.at) }} · {{ (marketService.STATUS[r.status] || {}).label || r.status }}
        </li>
      </ol>
    </details>
  </article>
</template>
