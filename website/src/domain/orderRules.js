/** Business rules shared by buyer and seller screens. No browser or Vue dependencies. */
export const ORDER_STATUS = {
  menunggu_bayar: { label: 'Menunggu pembayaran', tone: 'wait' },
  perlu_validasi: { label: 'Menunggu validasi penjual', tone: 'wait' },
  perlu_konfirmasi: { label: 'Menunggu konfirmasi kios', tone: 'wait' },
  diproses: { label: 'Diproses', tone: 'go' },
  selesai: { label: 'Selesai', tone: 'done' },
  ditolak: { label: 'Ditolak penjual', tone: 'stop' },
  dibatalkan: { label: 'Dibatalkan', tone: 'stop' },
}

export const PAYMENT_METHODS = { qris: 'Nontunai (QRIS)', kios: 'Datang ke kios' }
export const ACTIVE_STATUSES = ['menunggu_bayar', 'perlu_validasi', 'perlu_konfirmasi', 'diproses']

const transitions = {
  menunggu_bayar: { pembeli: ['perlu_validasi', 'dibatalkan'], penjual: ['ditolak', 'dibatalkan'] },
  perlu_validasi: { penjual: ['diproses', 'ditolak'] },
  perlu_konfirmasi: { pembeli: ['dibatalkan'], penjual: ['diproses', 'ditolak'] },
  diproses: { penjual: ['selesai', 'dibatalkan', 'ditolak'] },
}

export function canTransition(current, next, actor) {
  return transitions[current]?.[actor]?.includes(next) ?? false
}

export function shouldReturnStock(current, next) {
  return ACTIVE_STATUSES.includes(current) && ['ditolak', 'dibatalkan'].includes(next)
}

export function groupCartByKiosk(cart, products) {
  const groups = {}
  for (const [id, quantity] of Object.entries(cart)) {
    const product = products.find((item) => item.id === id)
    if (!product || product.stok <= 0 || !Number.isSafeInteger(quantity) || quantity <= 0) continue
    const item = {
      id,
      nama: product.nama,
      harga: product.harga,
      n: Math.min(quantity, product.stok),
    }
    ;(groups[product.kios] ??= []).push(item)
  }
  return groups
}
