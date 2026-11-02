import { KS } from '../data/seed.js'
import { createStorageRepository } from '../repositories/storageRepository.js'
import { createMarketService, DATABASE_KEY, MY_ORDERS_KEY } from './marketService.js'

function seedDatabase() {
  return {
    produk: KS.produk.map((product) => ({
      ...structuredClone(product),
      stok: KS.stokAwal[product.id] ?? 5,
    })),
    kios: KS.kios.map((kiosk) => ({
      ...kiosk,
      wa: `0812-0000-${kiosk.id.charCodeAt(0) - 64}${kiosk.id.slice(2).padStart(3, '0')}`,
      qrisNama: kiosk.qris ? kiosk.nama.toUpperCase() : '',
      qrisImg: '',
    })),
    orders: structuredClone(KS.contohPesanan),
  }
}

export const marketService = createMarketService(
  createStorageRepository(localStorage),
  seedDatabase,
)

window.addEventListener('storage', (event) => {
  if ([DATABASE_KEY, MY_ORDERS_KEY, null].includes(event.key)) marketService.reload()
})
