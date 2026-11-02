import {
  ORDER_STATUS,
  PAYMENT_METHODS,
  ACTIVE_STATUSES,
  canTransition,
  shouldReturnStock,
  groupCartByKiosk,
} from '../domain/orderRules.js'

// Keep these keys compatible with the original website so migration never resets user data.
export const DATABASE_KEY = 'ks-db-v4'
export const MY_ORDERS_KEY = 'ks-my-orders'

export function createMarketService(repository, seed, options = {}) {
  const listeners = new Set()
  const now = options.now || (() => new Date().toISOString())
  const makeId =
    options.makeId ||
    (() => {
      const raw =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
      return `KS-${raw.replace(/-/g, '').slice(0, 8).toUpperCase()}`
    })
  let database

  function reload() {
    const saved = repository.read(DATABASE_KEY)
    database =
      saved && ['produk', 'kios', 'orders'].every((key) => Array.isArray(saved[key]))
        ? saved
        : seed()
    notify()
  }

  function notify() {
    for (const listener of listeners) listener()
  }

  // Persist first; rollback on quota failure so the UI never reports a successful unsaved edit.
  function mutate(action) {
    const previous = structuredClone(database)
    try {
      const result = action()
      repository.write(DATABASE_KEY, database)
      notify()
      return result
    } catch (error) {
      database = previous
      notify()
      throw error
    }
  }

  const getProduk = (id) => database.produk.find((item) => item.id === id)
  const getKios = (id) => database.kios.find((item) => item.id === id)
  const getOrder = (id) => database.orders.find((item) => item.id === id)
  const myIds = () => {
    const ids = repository.read(MY_ORDERS_KEY, [])
    return Array.isArray(ids) ? ids : []
  }

  reload()

  return {
    STATUS: ORDER_STATUS,
    METODE: PAYMENT_METHODS,
    AKTIF: ACTIVE_STATUSES,
    reload,
    on(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    produk: () => database.produk,
    kios: () => database.kios,
    getProduk,
    getKios,
    getOrder,

    simpanProduk(product) {
      const record = JSON.parse(JSON.stringify(product))
      return mutate(() => {
        const current = getProduk(record.id)
        if (current) Object.assign(current, record)
        else database.produk.unshift(record)
      })
    },
    hapusProduk(id) {
      return mutate(() => {
        database.produk = database.produk.filter((product) => product.id !== id)
      })
    },
    setStok(id, value) {
      return mutate(() => {
        const product = getProduk(id)
        if (product) product.stok = Math.max(0, Math.min(999, Math.round(value) || 0))
      })
    },
    ubahKios(id, patch) {
      return mutate(() => {
        const kiosk = getKios(id)
        if (kiosk) Object.assign(kiosk, patch)
      })
    },
    orders(kioskId) {
      return database.orders
        .filter((order) => !kioskId || order.kios === kioskId)
        .sort((a, b) => String(b.dibuat || '').localeCompare(String(a.dibuat || '')))
    },
    pesananSaya() {
      const ids = myIds()
      return this.orders().filter((order) => ids.includes(order.id))
    },
    buatPesanan(cart, choices, buyer) {
      const previousIds = myIds()
      try {
        return mutate(() => {
          const groups = groupCartByKiosk(cart, database.produk)
          const created = Object.entries(groups).map(([kioskId, items]) => {
            const method =
              choices[kioskId]?.metode === 'qris' && getKios(kioskId)?.qris ? 'qris' : 'kios'
            const status = method === 'qris' ? 'menunggu_bayar' : 'perlu_konfirmasi'
            const timestamp = now()
            for (const item of items) {
              const product = getProduk(item.id)
              if (product) product.stok -= item.n
            }
            return {
              id: makeId(),
              kios: kioskId,
              metode: method,
              items,
              total: items.reduce((sum, item) => sum + item.harga * item.n, 0),
              pembeli: { ...buyer },
              status,
              dibuat: timestamp,
              riwayat: [{ status, at: timestamp, oleh: 'pembeli' }],
            }
          })
          database.orders.unshift(...created)
          repository.write(MY_ORDERS_KEY, [...created.map((order) => order.id), ...previousIds])
          return created
        })
      } catch (error) {
        try {
          repository.write(MY_ORDERS_KEY, previousIds)
        } catch {
          /* Original error is more useful. */
        }
        throw error
      }
    },
    ubahStatus(id, next, actor, details = {}) {
      const order = getOrder(id)
      if (!order || !canTransition(order.status, next, actor)) return order
      return mutate(() => {
        if (shouldReturnStock(order.status, next)) {
          for (const item of order.items) {
            const product = getProduk(item.id)
            if (product) product.stok += item.n
          }
        }
        // Only payment metadata may change here, never totals, ownership or item quantities.
        for (const key of ['ref', 'bukti', 'lunas']) if (key in details) order[key] = details[key]
        order.status = next
        order.riwayat = Array.isArray(order.riwayat) ? order.riwayat : []
        order.riwayat.push({ status: next, at: now(), oleh: actor })
        return order
      })
    },
    reset() {
      return mutate(() => {
        database = seed()
        repository.remove(MY_ORDERS_KEY)
      })
    },
  }
}
