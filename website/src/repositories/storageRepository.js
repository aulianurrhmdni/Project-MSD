/** JSON storage adapter. A future HTTP repository can replace this boundary. */
export function createStorageRepository(storage) {
  return {
    read(key, fallback = null) {
      try {
        const value = storage.getItem(key)
        return value === null ? fallback : JSON.parse(value)
      } catch {
        return fallback
      }
    },
    write(key, value) {
      storage.setItem(key, JSON.stringify(value))
    },
    remove(key) {
      storage.removeItem(key)
    },
  }
}
