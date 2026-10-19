<script setup lang="ts">
import { MainPanel, DeckExactRenderer } from 'netex-deckplans-components'
import type { DeckType, BoundingBoxType } from 'netex-deckplan-library'
import SetupModal from '@/components/business/SetupModal.vue'
import { shallowRef } from 'vue'

const selectedDeck = shallowRef<DeckType>()
const boundingBox = shallowRef<BoundingBoxType>()

const handleOpen = (deck: DeckType, box: BoundingBoxType) => {
  selectedDeck.value = deck
  boundingBox.value = box
}
</script>

<template>
  <div class="flex h-dvh w-full p-4">
    <MainPanel class="min-h-0 flex-1">
      <DeckExactRenderer
        v-if="selectedDeck && boundingBox"
        :deck="selectedDeck"
        :boundingBox="boundingBox"
      />
    </MainPanel>

    <SetupModal v-if="!selectedDeck" @open="handleOpen" />
  </div>
</template>
