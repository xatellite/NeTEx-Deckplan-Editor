<template>
  <div
    class="flex flex-col bg-ott-bg-primary border-2 max-w-80 max-h-20 overflow-auto border-ott-text-primary"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="flex-1 overflow-y-auto p-4 flex flex-wrap gap-2 content-start scrollbar-thin">
      <template v-for="spot in unallocatedSpots" :key="spot.attr_id">
        <LocatableSpotElement :element="spot" />
      </template>

      <div v-if="unallocatedSpots.length === 0" class="w-full h-full flex flex-col items-center justify-center text-ott-text-secondary/30 italic text-sm gap-2 py-8">
        <Icon icon="material-symbols:check-circle-outline-rounded" width="24" />
        <span class="text-[11px]">All elements are allocated</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Deck } from '@/models/netex/deckplan/deck/deck';
import type { OtherDeckSpace } from '@/models/netex/deckplan/deck/deckspace/otherDeckSpace';
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace';
import { LuggageSpot, LuggageSpotRef } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import { PassengerSpot, PassengerSpotRef } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { Icon } from '@iconify/vue';
import { useEditorState } from '@/app/store/editorstate';
import LocatableSpotElement from '@/components/editor/LocatableSpotElement.vue';

const props = defineProps<{
  deck: Deck
}>();

const store = useEditorState();

const unallocatedSpots = computed(() => {
  return props.deck.deckspaces.flatMap((space: OtherDeckSpace | PassengerSpace) => {
    if (space instanceof PassengerSpace) {
      const spots = [...(space.luggageSpots || []), ...(space.passengerSpots || [])];
      return spots.filter((s): s is (LuggageSpot | PassengerSpot) =>
        s !== undefined &&
        !(s instanceof LuggageSpotRef) &&
        !(s instanceof PassengerSpotRef) &&
        (!s.SpotColumnRef || !s.SpotRowRef)
      );
    }
    return [];
  });
});

function handleDrop(event: DragEvent) {
  const elementId = event.dataTransfer?.getData('elementId');
  if (elementId) {
    store.updateElement(elementId, {
      SpotColumnRef: undefined,
      SpotRowRef: undefined
    });
  }
}
</script>
