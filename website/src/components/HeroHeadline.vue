<script setup>
import { computed, ref, watch } from 'vue'
import {
  useDocumentVisibility,
  useElementVisibility,
  useIntervalFn,
  usePreferredReducedMotion,
} from '@vueuse/core'

const heading = ref(null)
const phrases = [
  { title: 'Oleh-oleh', detail: 'Kalimantan' },
  { title: 'Buah tangan', detail: 'khas Dayak' },
  { title: 'Cinderamata', detail: 'buatan tangan' },
]
const activeIndex = ref(0)
const reducedMotion = usePreferredReducedMotion()
const documentVisibility = useDocumentVisibility()
const inView = useElementVisibility(heading)
const canAnimate = computed(
  () => reducedMotion.value !== 'reduce' && documentVisibility.value === 'visible' && inView.value,
)
const { pause, resume } = useIntervalFn(
  () => {
    activeIndex.value = (activeIndex.value + 1) % phrases.length
  },
  3200,
  { immediate: false },
)

watch(
  canAnimate,
  (enabled) => {
    if (enabled) resume()
    else pause()
    if (reducedMotion.value === 'reduce') activeIndex.value = 0
  },
  { immediate: true },
)
</script>

<template>
  <h1 ref="heading">
    <span class="sr-only">Oleh-oleh Kalimantan</span>
    <span aria-hidden="true">
      <span
        v-for="line in ['title', 'detail']"
        :key="line"
        class="headline-rotation"
      >
        <span
          v-for="(phrase, index) in phrases"
          :key="phrase.title"
          class="headline-phrase"
          :class="{
            'is-active': index === activeIndex,
            'is-long': phrase[line] === 'buatan tangan',
            'is-wide-title': line === 'title' && index > 0,
          }"
        >
          {{ phrase[line] }}
        </span>
      </span>
    </span>
  </h1>
</template>

<style scoped>
h1 {
  width: 100%;
}

/* All phrases share one row so changing the copy never moves the search form. */
.headline-rotation {
  display: grid;
  height: 1.18em;
  overflow: hidden;
}

.headline-phrase {
  grid-area: 1 / 1;
  align-self: center;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(65%);
  transition:
    opacity 450ms ease,
    transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
}

.headline-phrase.is-active {
  opacity: 1;
  transform: translateY(0);
}

.headline-phrase.is-long {
  font-size: 0.76em;
}

.headline-phrase.is-wide-title {
  font-size: 0.86em;
}
</style>
