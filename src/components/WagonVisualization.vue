<template>
    <div>
        <v-stage
          ref="stage"
          :config="stageSize"
        >
          <v-layer ref="layer">
            <DeckVisualization v-for="(deck, index) in deckPlan?.decks" :key="`deck-${index}`" :deck="deck" />
          </v-layer>
        </v-stage>
        {{ deckPlan?.decks.length }}
        <button>Test</button>
    </div>
</template>

<script lang="ts" setup>
import type { DeckPlan } from '@/types/deckPlan';
import type { PropType } from 'vue';
import DeckVisualization from './DeckVisualization.vue';

// Waiting for https://github.com/konvajs/vue-konva/pull/266
// import {
//   Stage,
//   Layer,
// } from 'vue-konva';

const stageSize = {
  width: window.innerWidth,
  height: 500
};

defineProps({
  deckPlan: {
    type: Object as PropType<DeckPlan>,
  }
})

</script>