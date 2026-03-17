<template>
  <div class="shadow-sm border-2 rounded-lg bg-ott-bg-primary">
    <div
      v-if="deck.spotRows.length > 0 && deck.spotColumns.length > 0"
      class="grid w-max p-4"
      :style="{
        gridTemplateColumns: `minmax(64px, auto) repeat(${deck.spotColumns.length}, ${scale * 6}px)`,
        gridAutoRows: `${scale * 6}px`,
        gap: '2px'
      }"
    >
      <!-- Corner -->
      <button class="bg-ott-bg-secondary/20 rounded border border-ott-bg-dark flex items-center justify-center p-2" @click="handleEditClicked">
        <Icon icon="material-symbols:grid-view-outline-rounded" width="18" class="text-ott-text-secondary" />
      </button>

      <!-- Column Labels -->
      <div
        v-for="column in deck.spotColumns"
        :key="column.attr_id"
        class="flex items-center justify-center text-[11px] font-bold text-ott-text-secondary uppercase bg-ott-bg-secondary p-1 px-2 whitespace-nowrap"
      >
        {{ column.label || '-' }}
      </div>

      <!-- Rows -->
      <template v-for="row in deck.spotRows" :key="row.attr_id">
        <!-- Row Label -->
        <div class="flex items-center justify-center text-[11px] font-bold text-ott-text-secondary uppercase bg-ott-bg-secondary p-2">
          {{ row.label || '-' }}
        </div>

        <!-- Cells -->
    <div
      v-for="column in deck.spotColumns"
      :key="`${row.attr_id}-${column.attr_id}`"
      class="border border-ott-bg-dark bg-white flex items-center justify-center relative transition-all hover:bg-ott-bg-secondary/5 group"
      @dragover.prevent
      @drop="handleDrop($event, column.attr_id, row.attr_id)"
    >
      <template v-for="spot in [locatableSpots[column.attr_id]?.[row.attr_id]]" :key="`spot-${spot?.attr_id}`">
        <LocatableSpotElement
          v-if="spot"
          draggable="true"
          :element="spot"
          class="scale-90"
          @select="(id) => $emit('select', id)"
        />
      </template>
      <div v-if="!locatableSpots[column.attr_id]?.[row.attr_id]" class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-ott-accent/5"></div>
    </div>
  </template>
</div>

<div v-else class="p-12 text-center bg-white border-2 border-dashed border-ott-bg-dark rounded-2xl flex flex-col items-center gap-3">
  <Icon icon="material-symbols:format-list-bulleted-rounded" width="32" class="text-ott-bg-dark" />
  <div class="flex flex-col gap-1">
    <span class="text-ott-text-primary font-bold">Grid Not Configured</span>
    <span class="text-ott-text-secondary text-sm italic">Define spot rows and columns in the deck properties to see the layout grid</span>
  </div>
</div>
</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Deck } from '@/models/netex/deckplan/deck/deck';
import type { OtherDeckSpace } from '@/models/netex/deckplan/deck/deckspace/otherDeckSpace';
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace';
import { LuggageSpotRef, type LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import { PassengerSpotRef, type PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import LocatableSpotElement from './LocatableSpotElement.vue';
import { Icon } from '@iconify/vue';
import { SpotColumnRef } from '@/models/netex/deckplan/deck/spotColumn';
import { SpotRowRef } from '@/models/netex/deckplan/deck/spotRow';

const props = defineProps<{
deck: Deck,
scale: number,
elementToBuild?: any,
}>();

const emit = defineEmits(['editGrid', 'select', 'drop', 'updateElement'])

function handleEditClicked() {
emit('editGrid')
}

function handleDrop(event: DragEvent, columnId: string, rowId: string) {
const isNew = event.dataTransfer?.getData('isNewElement') === 'true';
const elementId = event.dataTransfer?.getData('elementId');

if (isNew && props.elementToBuild) {
const el = props.elementToBuild;
el.SpotColumnRef = new SpotColumnRef({ attr_ref: columnId, attr_version: '1.0' });
el.SpotRowRef = new SpotRowRef({ attr_ref: rowId, attr_version: '1.0' });
emit('drop', { element: el, deckId: props.deck.attr_id });
} else if (elementId) {
emit('updateElement', {
  id: elementId,
  updates: {
    SpotColumnRef: new SpotColumnRef({ attr_ref: columnId, attr_version: '1.0' }),
    SpotRowRef: new SpotRowRef({ attr_ref: rowId, attr_version: '1.0' })
  }
});
}
}

// Flatten locatable spots and pack them into a list
const locatableSpotList = computed(() => props.deck.deckspaces.flatMap((space: OtherDeckSpace | PassengerSpace) => {
  if (space instanceof PassengerSpace) {
    const spots = [...(space.luggageSpots || []), ...(space.passengerSpots || [])];
    return spots.filter((s): s is (LuggageSpot | PassengerSpot | LuggageSpotRef | PassengerSpotRef) => s !== undefined);
  }
  return [];
}));

const locatableSpots = computed(() => {
    const spots: {[index: string]: {[index: string]: LuggageSpot | PassengerSpot }} = {}
    locatableSpotList.value.forEach((spot) => {
      if (spot instanceof LuggageSpotRef || spot instanceof PassengerSpotRef) return;

      if (!(spot.SpotColumnRef && spot.SpotRowRef)) return;
      const columnRef = spot.SpotColumnRef.attr_ref
      if (!spots[columnRef]) {
        spots[columnRef] = {}
      }
      if (spots[columnRef][spot.SpotRowRef.attr_ref]) {
        return
        //throw Error("Collision in Locatable Spots!")
      }

      spots[columnRef][spot.SpotRowRef.attr_ref] = spot
    })
    return spots
})
</script>
