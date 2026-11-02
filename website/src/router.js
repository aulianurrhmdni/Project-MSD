import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
    meta: { title: 'Beranda' },
  },
  {
    path: '/katalog',
    component: () => import('./views/CatalogView.vue'),
    meta: { title: 'Katalog' },
  },
  {
    path: '/produk/:id',
    component: () => import('./views/ProductView.vue'),
    meta: { title: 'Detail barang' },
  },
  {
    path: '/keranjang',
    component: () => import('./views/CartView.vue'),
    meta: { title: 'Keranjang' },
  },
  {
    path: '/pesanan',
    component: () => import('./views/OrdersView.vue'),
    meta: { title: 'Pesanan saya' },
  },
  { path: '/denah', component: () => import('./views/MapView.vue'), meta: { title: 'Denah kios' } },
  { path: '/agenda', alias: '/agenda.html', redirect: '/' },
  {
    path: '/tentang',
    component: () => import('./views/AboutView.vue'),
    meta: { title: 'Tentang pasar' },
  },
  {
    path: '/penjual',
    component: () => import('./views/SellerView.vue'),
    meta: { title: 'Panel penjual', seller: true },
  },
  ...['index', 'katalog', 'keranjang', 'pesanan', 'denah', 'tentang', 'admin'].map((name) => ({
    path: `/${name}.html`,
    redirect: (to) => ({
      path: name === 'index' ? '/' : name === 'admin' ? '/penjual' : `/${name}`,
      query: to.query,
    }),
  })),
  {
    path: '/produk.html',
    redirect: (to) =>
      to.query.id ? { path: `/produk/${encodeURIComponent(to.query.id)}` } : { path: '/katalog' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('./views/NotFoundView.vue'),
    meta: { title: 'Halaman tidak ditemukan' },
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, saved) {
    return saved || (to.path === from.path ? undefined : { top: 0 })
  },
})
router.afterEach((to) => {
  document.title = `${to.meta.title} · Pasar Inpress Kebun Sayur`
})
export default router
