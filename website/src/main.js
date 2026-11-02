import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.js'
import './style.css'
import { useMarket } from './stores/market.js'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router)
app.config.errorHandler = (error) => {
  console.error(error)
  const message =
    error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh. Kurangi ukuran foto lalu coba lagi.'
      : 'Perubahan belum berhasil. Silakan coba lagi.'
  useMarket(pinia).notify(message)
}
app.mount('#app')
