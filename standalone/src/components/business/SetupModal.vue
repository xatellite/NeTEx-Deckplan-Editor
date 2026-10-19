<script setup lang="ts">
import type { DeckType, BoundingBoxType, DeckPlanType } from 'netex-deckplan-library'
import { loadNeTEx, getDecksBoundingBox } from 'netex-deckplan-library'
import { ref, shallowRef } from 'vue'

const deckPlan = shallowRef<DeckPlanType>()
const selectedDeckId = ref('')
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const loadXMLFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  // In case values are dirty
  deckPlan.value = undefined
  selectedDeckId.value = ''
  error.value = ''

  try {
    const xml = await file.text()
    const [plan] = loadNeTEx(xml)

    if (plan.decks.length === 0) {
      error.value = 'No decks found'
      return
    }

    deckPlan.value = plan
    selectedDeckId.value = plan.decks[0]!.attr_id
  } catch {
    error.value = 'File was not loaded'
  }
}

const emit = defineEmits<{ open: [deck: DeckType, boundingBox: BoundingBoxType] }>()

const openEditor = () => {
  if (!deckPlan.value) {
    return
  }

  const deck = deckPlan.value.decks.find((deck) => deck.attr_id === selectedDeckId.value)
  const box = getDecksBoundingBox(deckPlan.value)

  if (deck && box) {
    emit('open', deck, box)
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
    <section class="w-full max-w-xl rounded-xl bg-white p-8">
      <h2 class="mb-6 text-xl font-medium text-indigo-950">Start creating Seatmaps now!</h2>

      <input ref="fileInput" type="file" accept=".xml" hidden @change="loadXMLFile" />

      <select
        v-if="deckPlan"
        v-model="selectedDeckId"
        class="mb-4 w-full rounded border border-stone-300 p-2"
      >
        <option v-for="deck in deckPlan.decks" :key="deck.attr_id" :value="deck.attr_id">
          {{ deck.Name }}
        </option>
      </select>

      <p v-if="error" class="mb-4 text-red-500">{{ error }}</p>

      <div class="flex justify-end">
        <button
          v-if="!deckPlan"
          type="button"
          @click="fileInput?.click()"
          class="rounded bg-indigo-950 px-5 py-2 text-white"
        >
          Load
        </button>
        <button
          v-else
          type="button"
          :disabled="!selectedDeckId"
          @click="openEditor"
          class="rounded bg-[#FF9F1A] px-5 py-2 text-white disabled:opacity-40"
        >
          Open Editor
        </button>
      </div>
    </section>
  </div>
</template>
