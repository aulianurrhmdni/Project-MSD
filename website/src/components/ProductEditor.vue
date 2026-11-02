<script setup>
import { reactive, ref, onMounted } from 'vue'
import { KS, marketService, useMarket } from '../stores/market.js'
import { readPhoto, photo } from '../utils.js'
const props = defineProps({ product: Object, kiosk: String })
const emit = defineEmits(['close'])
const market = useMarket()
const dialog = ref(null)
const error = ref('')
const busy = ref(false)
const form = reactive(
  props.product
    ? { ...props.product, bahan: [...props.product.bahan] }
    : { nama: '', harga: 0, stok: 1, bahan: [], asal: '', pengrajin: '', ket: '', foto: '' },
)
onMounted(() => dialog.value.showModal())
async function upload(e) {
  if (!e.target.files?.[0]) return
  busy.value = true
  try {
    form.foto = await readPhoto(e.target.files[0])
    error.value = ''
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}
function save() {
  error.value = ''
  if (!form.nama.trim() || form.harga <= 0 || !form.bahan.length || !form.foto) {
    error.value = 'Lengkapi nama, harga, bahan, dan foto barang.'
    return
  }
  const randomId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
  marketService.simpanProduk({
    ...form,
    nama: form.nama.trim(),
    harga: Math.max(0, Math.round(Number(form.harga)) || 0),
    stok: Math.max(0, Math.min(999, Math.round(Number(form.stok)) || 0)),
    id: props.product?.id || 'barang-' + randomId,
    kios: props.kiosk,
  })
  market.notify('Barang disimpan. Katalog pembeli sudah diperbarui.')
  emit('close')
}
</script>
<template>
  <dialog
    ref="dialog"
    class="editor-dialog"
    aria-labelledby="editor-title"
    @close="emit('close')"
    @cancel.prevent="emit('close')"
  >
    <form @submit.prevent="save">
      <div class="section-heading">
        <h2 id="editor-title">{{ product ? 'Ubah barang' : 'Tambah barang' }}</h2>
        <button
          type="button"
          class="text-button"
          @click="emit('close')"
        >
          Tutup
        </button>
      </div>
      <div class="editor-grid">
        <div class="stack">
          <img
            v-if="form.foto"
            class="edit-preview"
            :src="photo(form.foto)"
            alt="Pratinjau foto barang"
          />
          <label class="field">
            Foto barang
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              @change="upload"
            />
          </label>
        </div>
        <div class="stack">
          <label class="field">
            Nama barang
            <input
              v-model="form.nama"
              maxlength="120"
              required
            />
          </label>
          <div class="two-fields">
            <label class="field">
              Harga (Rp)
              <input
                v-model.number="form.harga"
                type="number"
                min="1"
                max="1000000000"
                required
              />
            </label>
            <label class="field">
              Stok
              <input
                v-model.number="form.stok"
                type="number"
                min="0"
                max="999"
                required
              />
            </label>
          </div>
          <fieldset>
            <legend>Bahan</legend>
            <div class="checks">
              <label
                v-for="b in KS.bahan"
                :key="b.id"
                class="check"
              >
                <input
                  v-model="form.bahan"
                  type="checkbox"
                  :value="b.id"
                />
                {{ b.nama }}
              </label>
            </div>
          </fieldset>
          <label class="field">
            Asal produk
            <input
              v-model="form.asal"
              required
            />
          </label>
          <label class="field">
            Pembuat
            <input
              v-model="form.pengrajin"
              required
            />
          </label>
          <label class="field">
            Deskripsi
            <textarea
              v-model="form.ket"
              rows="3"
              required
            ></textarea>
          </label>
        </div>
      </div>
      <p
        v-if="error"
        class="notice error"
        role="alert"
      >
        {{ error }}
      </p>
      <div class="action-row">
        <button
          class="button"
          :disabled="busy"
        >
          {{ busy ? 'Memproses foto…' : 'Simpan barang' }}
        </button>
        <button
          type="button"
          class="button secondary"
          @click="emit('close')"
        >
          Batal
        </button>
      </div>
    </form>
  </dialog>
</template>
