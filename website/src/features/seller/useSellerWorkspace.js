import { ref, computed, reactive, watch } from 'vue'
import { useStorage, useNow } from '@vueuse/core'
import { useMarket, KS, marketService } from '../../stores/market.js'
import { readPhoto } from '../../utils.js'

// Coordinates seller UI state; persistence stays in the service layer.
export function useSellerWorkspace() {
  const market = useMarket()
  const session = useStorage('ks-admin-kios', '', sessionStorage)
  const lock = useStorage('ks-admin-lock', { gagal: 0, sampai: 0 })
  const now = useNow({ interval: 1000 })
  const chosen = ref(market.kiosks[0]?.id || '')
  watch(
    () => market.kiosks,
    (kiosks) => {
      if (!chosen.value && kiosks?.length) chosen.value = kiosks[0].id
    },
    { immediate: true },
  )
  const pin = ref('')
  const loginError = ref('')
  const section = ref('ringkasan')
  const menu = ref(false)
  const statusFilter = ref('tindakan')
  const term = ref('')
  const editor = ref(false)
  const editing = ref(null)
  const uploadBusy = ref(false)
  const kiosk = computed(() => market.kiosks.find((k) => k.id === session.value))
  const seconds = computed(() =>
    Math.max(0, Math.ceil((lock.value.sampai - now.value.getTime()) / 1000)),
  )
  const tabs = {
    ringkasan: 'Ringkasan',
    validasi: 'Validasi QRIS',
    pesanan: 'Pesanan',
    barang: 'Barang & stok',
    profil: 'Profil kios',
  }
  const ownOrders = computed(() => market.orders.filter((o) => o.kios === session.value))
  const products = computed(() => market.products.filter((p) => p.kios === session.value))
  const lowStock = computed(() => products.value.filter((p) => p.stok <= 2))
  const waiting = computed(() =>
    ownOrders.value.filter((o) => ['perlu_validasi', 'perlu_konfirmasi'].includes(o.status)),
  )
  const today = (d) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar' }).format(new Date(d))
  const income = computed(() =>
    ownOrders.value
      .filter(
        (o) =>
          o.lunas &&
          o.riwayat?.some(
            (r) => ['diproses', 'selesai'].includes(r.status) && today(r.at) === today(now.value),
          ),
      )
      .reduce((s, o) => s + o.total, 0),
  )
  const shownOrders = computed(() =>
    ownOrders.value.filter((o) =>
      section.value === 'validasi'
        ? o.status === 'perlu_validasi'
        : statusFilter.value === 'semua' ||
          (statusFilter.value === 'tindakan'
            ? ['perlu_validasi', 'perlu_konfirmasi'].includes(o.status)
            : o.status === statusFilter.value),
    ),
  )
  const shownProducts = computed(() =>
    products.value.filter((p) => p.nama.toLowerCase().includes(term.value.toLowerCase())),
  )
  const profile = reactive({ nama: '', jual: '', wa: '', qris: false, qrisNama: '', qrisImg: '' })
  watch(
    () => kiosk.value?.id,
    () => {
      if (kiosk.value) Object.assign(profile, kiosk.value)
    },
    { immediate: true },
  )
  function login() {
    if (seconds.value) return
    if (lock.value.sampai) lock.value = { gagal: 0, sampai: 0 }
    if (pin.value.trim() !== KS.PIN_DEMO) {
      const failed = lock.value.gagal + 1
      lock.value = { gagal: failed, sampai: failed >= 5 ? Date.now() + 30000 : 0 }
      loginError.value = `PIN salah. Sisa percobaan: ${Math.max(0, 5 - failed)}.`
      return
    }
    lock.value = { gagal: 0, sampai: 0 }
    session.value = chosen.value
    pin.value = ''
    loginError.value = ''
  }
  function changeSection(id) {
    section.value = id
    menu.value = false
  }
  function logout() {
    session.value = ''
    section.value = 'ringkasan'
    menu.value = false
  }
  function edit(p = null) {
    editing.value = p
    editor.value = true
  }
  function remove(p) {
    if (window.confirm(`Hapus ${p.nama} dari katalog?`)) {
      marketService.hapusProduk(p.id)
      market.notify('Barang dihapus.')
    }
  }
  function saveProfile() {
    marketService.ubahKios(session.value, {
      nama: String(profile.nama || '').trim(),
      jual: String(profile.jual || '').trim(),
      wa: String(profile.wa || '').trim(),
      qris: Boolean(profile.qris),
      qrisNama: String(profile.qrisNama || '').trim(),
      qrisImg: profile.qrisImg || '',
    })
    market.notify('Profil kios tersimpan.')
  }
  async function uploadQr(e) {
    if (!e.target.files?.[0]) return
    uploadBusy.value = true
    try {
      profile.qrisImg = await readPhoto(e.target.files[0], 900)
    } catch (e) {
      market.notify(e.message)
    } finally {
      uploadBusy.value = false
    }
  }
  function reset() {
    if (window.confirm('Kembalikan semua kios, barang, dan pesanan ke data contoh?')) {
      marketService.reset()
      market.cart = {}
      Object.assign(profile, marketService.getKios(session.value) || {})
      market.notify('Data contoh dipulihkan.')
    }
  }

  return {
    market,
    session,
    chosen,
    pin,
    loginError,
    section,
    menu,
    statusFilter,
    term,
    editor,
    editing,
    uploadBusy,
    kiosk,
    seconds,
    tabs,
    ownOrders,
    lowStock,
    waiting,
    income,
    shownOrders,
    shownProducts,
    profile,
    login,
    logout,
    changeSection,
    edit,
    remove,
    saveProfile,
    uploadQr,
    reset,
  }
}
