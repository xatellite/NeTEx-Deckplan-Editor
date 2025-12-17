<template>
    <div class="flex flex-col h-full">
      <div class="flex p-4 w-full items-center justify-center gap-10">
        <label for="scale-slider">Scale: {{ scale }}</label>
        <input id="scale-slider" type="range" min="10" max="50" v-model.number="scale" />
      </div>
      <div style="display: flex; flex-direction: row; overflow-x: auto; gap: 20px; padding: 20px;">
          <div v-for="(deckPlan, index) in deckPlans" :key="`deckplan-${index}`">
            <h3>{{ deckPlan.attr_id }}</h3>
            <div v-for="(deck, dIndex) in deckPlan.decks" :key="`deck-${dIndex}`">
              <h4 @click="$emit('select', { element: deck, ctrlKey: false })" :class="`${selectedElements.includes(deck) ? 'text-ott-accent' : ''} cursor-pointer`">{{ deck.Name }}</h4>
              <v-stage
                :config="getStageSize(deck, scale)"
              >
                <v-layer>
                  <DeckVisualization 
                    :deck="deck" 
                    :scale="scale" 
                    :selectedElements="selectedElements"
                    @select="(payload) => $emit('select', payload)"
                    @area-select="(elements) => $emit('area-select', elements)"
                  />
                </v-layer>
              </v-stage>
            </div>
          </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import type { DeckPlan } from '@/types/deckPlan';
import type { PropType } from 'vue';
import DeckVisualization from './DeckVisualization.vue';
import { ref } from 'vue';
import type { Deck } from '@/types/deck';

// Waiting for https://github.com/konvajs/vue-konva/pull/266
// import {
//   Stage,
//   Layer,
// } from 'vue-konva';

const scale = ref(20)

defineProps({
  deckPlans: {
    type: Array as PropType<DeckPlan[]>,
    required: true,
  },
   
  selectedElements: {
    type: Array as PropType<any[]>,
    default: () => [],
  }
})

const getStageSize = (deck: Deck, scale: number) => {
  let maxWidth = 0
  let maxHeight = 0

  const { width, height } = deck.getBoundingBox()
  maxWidth = Math.max(maxWidth, width)
  maxHeight = Math.max(maxHeight, height)

  return {
    width: (maxWidth * scale) + 10,
    height: (maxHeight * scale) + 10
  }
}

</script>