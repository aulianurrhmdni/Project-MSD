<script setup>
defineProps({ busy: Boolean })
const profile = defineModel('profile', { type: Object, required: true })
defineEmits(['save', 'upload', 'reset'])
</script>

<template>
  <form
    class="profile-form stack"
    @submit.prevent="$emit('save')"
  >
    <label class="field">
      Nama kios
      <input
        v-model="profile.nama"
        required
        maxlength="100"
      />
    </label>
    <label class="field">
      Barang yang dijual
      <input
        v-model="profile.jual"
        required
      />
    </label>
    <label class="field">
      Nomor WhatsApp
      <input
        v-model="profile.wa"
        type="tel"
        required
        pattern="[+0-9\s\-]{9,18}"
      />
    </label>
    <label class="check">
      <input
        v-model="profile.qris"
        type="checkbox"
      />
      Menerima pembayaran QRIS
    </label>
    <template v-if="profile.qris">
      <label class="field">
        Nama penerima QRIS
        <input v-model="profile.qrisNama" />
      </label>
      <label class="field">
        Gambar QRIS kios
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          @change="$emit('upload', $event)"
        />
      </label>
      <img
        v-if="profile.qrisImg"
        class="qr-photo"
        :src="profile.qrisImg"
        alt="QRIS kios"
      />
      <button
        v-if="profile.qrisImg"
        type="button"
        class="text-button danger"
        @click="profile.qrisImg = ''"
      >
        Hapus gambar QRIS
      </button>
    </template>
    <button
      class="button"
      :disabled="busy"
    >
      Simpan profil
    </button>
    <div class="reset-data">
      <h2>Data prototipe</h2>
      <p>
        Mengembalikan data contoh akan mengganti barang, stok, dan pesanan seluruh kios pada
        perangkat ini.
      </p>
      <button
        type="button"
        class="text-button danger"
        @click="$emit('reset')"
      >
        Kembalikan data contoh
      </button>
    </div>
  </form>
</template>
