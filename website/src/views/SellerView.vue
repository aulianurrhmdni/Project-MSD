<script setup>
import { useSellerWorkspace } from '../features/seller/useSellerWorkspace.js'
import { marketService } from '../stores/market.js'
import OrderCard from '../components/OrderCard.vue'
import ProductEditor from '../components/ProductEditor.vue'
import AppIcon from '../components/AppIcon.vue'
import SellerOverview from '../features/seller/SellerOverview.vue'
import SellerInventory from '../features/seller/SellerInventory.vue'
import SellerProfile from '../features/seller/SellerProfile.vue'
const {
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
} = useSellerWorkspace()
</script>
<template>
  <div
    v-if="!kiosk"
    class="seller-login-page"
  >
    <div class="login-story">
      <RouterLink
        class="brand"
        to="/"
      >
        <span>Pasar Inpress</span>
        <strong>Kebun Sayur</strong>
      </RouterLink>
      <div>
        <h1>
          Kiosmu,
          <br />
          lebih dekat.
        </h1>
        <p>Kelola barang dan layani pesanan dari satu tempat.</p>
      </div>
      <img
        src="/assets/img/suasana-pedagang.jpg"
        alt="Pedagang di balik etalase Pasar Inpres Kebun Sayur"
        width="928"
        height="696"
      />
    </div>
    <form
      class="login-form"
      @submit.prevent="login"
    >
      <h2>Login sebagai penjual</h2>
      <p>Masuk ke kios yang kamu kelola.</p>
      <label class="field">
        Pilih kios
        <select
          v-model="chosen"
          required
        >
          <option
            v-for="k in market.kiosks"
            :key="k.id"
            :value="k.id"
          >
            {{ k.nama }} · {{ k.id }}
          </option>
        </select>
      </label>
      <label class="field">
        PIN kios
        <input
          v-model="pin"
          type="password"
          inputmode="numeric"
          required
          autocomplete="current-password"
        />
      </label>
      <p
        v-if="seconds || loginError"
        class="notice error"
        role="alert"
      >
        {{ seconds ? `Coba lagi dalam ${seconds} detik.` : loginError }}
      </p>
      <button
        class="button"
        :disabled="seconds > 0"
      >
        Masuk ke kios
      </button>
      <p class="meta">PIN prototipe: 1981</p>
      <RouterLink to="/">Kembali ke pasar</RouterLink>
    </form>
  </div>
  <div
    v-else
    class="seller-app"
    data-ui
  >
    <aside class="seller-sidebar">
      <div class="seller-mobile-head">
        <RouterLink
          class="brand"
          to="/"
        >
          <span>Pasar Inpress</span>
          <strong>Kebun Sayur</strong>
        </RouterLink>
        <button
          class="menu-toggle"
          :aria-expanded="menu"
          aria-controls="seller-navigation"
          aria-label="Menu penjual"
          @click="menu = !menu"
        >
          <AppIcon :name="menu ? 'close' : 'menu'" />
        </button>
      </div>
      <div class="workspace">
        <strong>{{ kiosk.nama }}</strong>
        <p>Kios {{ kiosk.id }} · Blok {{ kiosk.id[0] }}</p>
      </div>
      <nav
        id="seller-navigation"
        :class="{ open: menu }"
        aria-label="Panel penjual"
      >
        <button
          v-for="(label, id) in tabs"
          :key="id"
          :aria-current="section === id ? 'page' : undefined"
          @click="changeSection(id)"
        >
          {{ label }}
          <span v-if="id === 'validasi' && ownOrders.some((o) => o.status === 'perlu_validasi')">
            {{ ownOrders.filter((o) => o.status === 'perlu_validasi').length }}
          </span>
        </button>
        <button @click="logout">Keluar</button>
      </nav>
      <RouterLink
        class="seller-store-link"
        to="/"
      >
        Lihat website pembeli
      </RouterLink>
    </aside>
    <div class="seller-main">
      <header class="section-heading">
        <div>
          <h1>{{ tabs[section] }}</h1>
          <p>
            {{
              section === 'ringkasan'
                ? `${waiting.length} pesanan menunggu tindakan kios.`
                : kiosk.nama
            }}
          </p>
        </div>
        <button
          v-if="section === 'barang'"
          class="button"
          @click="edit()"
        >
          Tambah barang
        </button>
      </header>
      <SellerOverview
        v-if="section === 'ringkasan'"
        :orders="ownOrders"
        :waiting="waiting"
        :low-stock="lowStock"
        :income="income"
        @navigate="changeSection"
        @edit="edit"
      />
      <template v-else-if="section === 'pesanan' || section === 'validasi'">
        <p
          v-if="section === 'validasi'"
          class="notice"
        >
          Cocokkan bukti dengan mutasi bank atau dompet digital kios sebelum memvalidasi.
        </p>
        <label
          v-else
          class="field order-filter"
        >
          Status pesanan
          <select v-model="statusFilter">
            <option value="tindakan">Perlu tindakan</option>
            <option value="semua">Semua status</option>
            <option
              v-for="(s, id) in marketService.STATUS"
              :key="id"
              :value="id"
            >
              {{ s.label }}
            </option>
          </select>
        </label>
        <div class="stack">
          <OrderCard
            v-for="o in shownOrders"
            :key="o.id"
            :order="o"
            seller
          />
          <div
            v-if="!shownOrders.length"
            class="empty"
          >
            <h2>Tidak ada pesanan di sini</h2>
            <p>Pesanan yang sesuai akan muncul di bagian ini.</p>
          </div>
        </div>
      </template>
      <SellerInventory
        v-else-if="section === 'barang'"
        v-model:term="term"
        :products="shownProducts"
        @edit="edit"
        @remove="remove"
      />
      <SellerProfile
        v-else-if="section === 'profil'"
        v-model:profile="profile"
        :busy="uploadBusy"
        @save="saveProfile"
        @upload="uploadQr"
        @reset="reset"
      />
    </div>
    <ProductEditor
      v-if="editor"
      :product="editing"
      :kiosk="session"
      @close="editor = false"
    />
  </div>
</template>
