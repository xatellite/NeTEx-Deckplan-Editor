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
                  <DeckVisualization
                    :deck="deck"
                    :scale="scale"
                    :selectedElements="selectedElements"
                    @select="(payload) => $emit('select', payload)"
                    @area-select="(elements) => $emit('area-select', elements)"
                  />
                  <DeckRendering
                    :deck="deck"
                    :scale="scale"
                    :selectedElements="selectedElements"
                    @select="(payload) => $emit('select', payload)"
                    @area-select="(elements) => $emit('area-select', elements)"
                  />
            </div>
          </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { DeckPlan } from '@/types/netex/deckPlan';
import type { PropType } from 'vue';
import DeckVisualization from './DeckVisualization.vue';
import { ref } from 'vue';
import DeckRendering from '../renderer/DeckRendering.vue';

const scale = ref(20)

defineProps({
  deckPlans: {
    type: Array as PropType<DeckPlan[]>,
    required: false,
  },

  selectedElements: {
    type: Array as PropType<any[]>,
    default: () => [],
  }
})

</script>
