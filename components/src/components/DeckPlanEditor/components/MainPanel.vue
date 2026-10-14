<script setup lang="ts">
import xml from '../../../../../library/tests/fixtures/deckplan.xml?raw'
import { loadNeTEx } from 'netex-deckplan-library'
import DeckExactRenderer from './DeckExactRenderer.vue'

const [deckPlan] = loadNeTEx(xml)

const deck = deckPlan.decks[0]
const boundingBox = deck.polygon?.boundingBox
</script>

<template>
  <main class="min-h-0 rounded-xl border border-stone-300 bg-white p-4">
    <DeckExactRenderer v-if="deck && boundingBox" :deck="deck" :boundingBox="boundingBox" />

    <p v-else>No deck polygon</p>
  </main>

</template>

<style scoped>

</style>
