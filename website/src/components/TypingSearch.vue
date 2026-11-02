<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  usePreferredReducedMotion,
  useDocumentVisibility,
  useElementVisibility,
} from '@vueuse/core'
import AppIcon from './AppIcon.vue'
const router = useRouter()
const query = ref('')
const input = ref(null)
const interacted = ref(false)
const reduced = usePreferredReducedMotion()
const visible = useDocumentVisibility()
const inView = useElementVisibility(input)
const prompts = [
  'Nyari oleh-oleh?',
  'Nyari tas manik?',
  'Nyari batik Dayak?',
  'Nyari anyaman rotan?',
  'Nyari batu akik?',
]
const placeholder = ref(prompts[0])
let timer
let index = 0
let letters = prompts[0].length
let deleting = true
function stop() {
  clearTimeout(timer)
}
function step() {
  letters += deleting ? -1 : 1
  placeholder.value = prompts[index].slice(0, letters)
  let delay = deleting ? 35 : 85
  if (!letters) {
    index = (index + 1) % prompts.length
    deleting = false
    delay = 220
  } else if (letters === prompts[index].length) {
    deleting = true
    delay = 1900
  }
  timer = setTimeout(step, delay)
}
watch(
  [reduced, visible, inView, interacted],
  () => {
    stop()
    if (interacted.value || reduced.value === 'reduce') placeholder.value = prompts[0]
    else if (visible.value === 'visible' && inView.value) timer = setTimeout(step, 1900)
  },
  { immediate: true },
)
onUnmounted(stop)
</script>
<template>
  <form
    class="hero-search"
    role="search"
    @submit.prevent="
      router.push({ path: '/katalog', query: query.trim() ? { q: query.trim() } : {} })
    "
  >
    <label
      class="sr-only"
      for="cari-hero"
    >
      Cari oleh-oleh
    </label>
    <AppIcon name="search" />
    <input
      id="cari-hero"
      ref="input"
      v-model="query"
      type="search"
      :placeholder="placeholder"
      @focus="interacted = true"
    />
    <button type="submit">Cari</button>
  </form>
</template>
