import test from 'node:test'
import assert from 'node:assert/strict'
import { createMarketService, DATABASE_KEY } from '../src/services/marketService.js'
import { createStorageRepository } from '../src/repositories/storageRepository.js'

function fixture(existing) {
  const memory = new Map()
  const storage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  }
  const seed = () => ({
    produk: [
      { id: 'tas', nama: 'Tas manik', harga: 100000, stok: 3, kios: 'A-03' },
      { id: 'rotan', nama: 'Anyaman rotan', harga: 50000, stok: 2, kios: 'B-11' },
    ],
    kios: [
      { id: 'A-03', qris: true },
      { id: 'B-11', qris: false },
    ],
    orders: [],
  })
  if (existing) storage.setItem(DATABASE_KEY, JSON.stringify(existing))
  let sequence = 0
  const repository = createStorageRepository(storage)
  const service = createMarketService(repository, seed, {
    makeId: () => `order-${++sequence}`,
    now: () => '2026-11-03T00:00:00Z',
  })
  return { service, storage, seed }
}
const buyer = { nama: 'Pembeli tes', hp: '081234567890' }

test('checkout groups by kiosk, caps quantity and falls back when QRIS unavailable', () => {
  const { service } = fixture()
  const orders = service.buatPesanan(
    { tas: 8, rotan: 1, missing: 1 },
    { 'A-03': { metode: 'qris' }, 'B-11': { metode: 'qris' } },
    buyer,
  )
  assert.equal(orders.length, 2)
  assert.equal(orders[0].total, 300000)
  assert.equal(orders[0].status, 'menunggu_bayar')
  assert.equal(orders[1].status, 'perlu_konfirmasi')
  assert.equal(service.getProduk('tas').stok, 0)
  assert.equal(service.pesananSaya().length, 2)
})
test('cancellation returns reserved stock exactly once', () => {
  const { service } = fixture()
  const [order] = service.buatPesanan({ tas: 2 }, {}, buyer)
  service.ubahStatus(order.id, 'dibatalkan', 'pembeli')
  service.ubahStatus(order.id, 'dibatalkan', 'pembeli')
  assert.equal(service.getProduk('tas').stok, 3)
  assert.equal(order.riwayat.length, 2)
})
test('buyer cannot validate own payment or reopen a finished order', () => {
  const { service } = fixture()
  const [order] = service.buatPesanan({ tas: 1 }, { 'A-03': { metode: 'qris' } }, buyer)
  service.ubahStatus(order.id, 'diproses', 'pembeli')
  assert.equal(order.status, 'menunggu_bayar')
  service.ubahStatus(order.id, 'perlu_validasi', 'pembeli')
  service.ubahStatus(order.id, 'diproses', 'penjual', { lunas: true, total: 1, kios: 'B-11' })
  assert.equal(order.total, 100000)
  assert.equal(order.kios, 'A-03')
  service.ubahStatus(order.id, 'selesai', 'penjual')
  service.ubahStatus(order.id, 'dibatalkan', 'penjual')
  assert.equal(order.status, 'selesai')
  assert.equal(service.getProduk('tas').stok, 2)
})
test('existing database remains intact across migration and reload', () => {
  const first = fixture()
  first.service.setStok('tas', 17)
  const existing = JSON.parse(first.storage.getItem(DATABASE_KEY))
  const second = fixture(existing)
  assert.equal(second.service.getProduk('tas').stok, 17)
  second.service.reload()
  assert.equal(second.service.getProduk('tas').stok, 17)
})
test('failed persistence rolls back stock and order changes', () => {
  const { service, storage } = fixture()
  storage.setItem = () => {
    throw new DOMException('Full', 'QuotaExceededError')
  }
  assert.throws(() => service.buatPesanan({ tas: 1 }, {}, buyer), { name: 'QuotaExceededError' })
  assert.equal(service.getProduk('tas').stok, 3)
  assert.equal(service.orders().length, 0)
})
test('invalid quantities are ignored, and kiosk stock edits are bounded', () => {
  const { service } = fixture()
  assert.deepEqual(service.buatPesanan({ tas: -2, rotan: 0.5 }, {}, buyer), [])
  service.setStok('tas', 10000)
  assert.equal(service.getProduk('tas').stok, 999)
  service.setStok('tas', -1)
  assert.equal(service.getProduk('tas').stok, 0)
})
test('default id generator produces uppercase KS ids and sorts robustly', () => {
  const memory = new Map()
  const storage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  }
  const seed = () => ({
    produk: [{ id: 'tas', nama: 'Tas manik', harga: 100000, stok: 3, kios: 'A-03' }],
    kios: [{ id: 'A-03', qris: false }],
    orders: [{ id: 'old-1', kios: 'A-03', dibuat: null }],
  })
  const repository = createStorageRepository(storage)
  const service = createMarketService(repository, seed)
  const [created] = service.buatPesanan({ tas: 1 }, {}, buyer)
  assert.match(created.id, /^KS-[A-Z0-9]{8}$/)
  const list = service.orders('A-03')
  assert.equal(list.length, 2)
  assert.equal(list[0].id, created.id)
})
