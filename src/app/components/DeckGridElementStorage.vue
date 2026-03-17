<template>
  <div
    class="flex flex-col bg-ott-bg-primary max-w-120 max-h-34 overflow-auto border-ott-text-primary"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="flex-1 overflow-y-auto p-4 flex flex-wrap gap-2 content-start scrollbar-thin">
      <span>Unlocated elements:</span>
      <template v-for="spot in unallocatedSpots" :key="spot.attr_id">
        <LocatableSpotElement :element="spot" @select="(id) => $emit('select', id)" />
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

defineEmits(['select'])

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
  const isNew = event.dataTransfer?.getData('isNewElement') === 'true';
  const elementId = event.dataTransfer?.getData('elementId');

  if (isNew && store.elementToBuild) {
    const el = store.elementToBuild;
    el.SpotColumnRef = undefined;
    el.SpotRowRef = undefined;
    store.addElementToDeck(el, props.deck.attr_id);
  } else if (elementId) {
    store.updateElement(elementId, {
      SpotColumnRef: undefined,
      SpotRowRef: undefined
    });
  }
}
</script>
