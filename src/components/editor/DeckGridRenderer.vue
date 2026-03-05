<template>
  <div :class="`flex flex-col w-[${scale*4}px] items-center m-4 p-2 border-2 rounded-md bg-ott-bg-primary`">
    <div v-if="deck.spotColumns && deck.spotColumns" class="flex flex-col w-full">
      <div
        v-for="(row, rowIndex) in deck.spotRows"
        :key="`${rowIndex}-row`"
          class="flex w-full"
      >
        <span>{{row.label }}</span>
        <div
          v-for="(column, colIndex) in deck.spotColumns"
          :key="`${colIndex}-column`"
          class="w-full"
        >
          <span v-if="rowIndex == 0">{{column.label }}</span>
          <div :class="`border border-ott-bg-dark m-[1px]  w-full`" :style="`height: ${scale*4}px`  ">

          <LocatableSpotElement draggable="true" v-if="locatableSpots[column.attr_id]?.[row.attr_id]" :element="locatableSpots[column.attr_id]?.[row.attr_id]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Deck } from '@/models/netex/deckplan/deck/deck';
import type { OtherDeckSpace } from '@/models/netex/deckplan/deck/deckspace/otherDeckSpace';
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace';
import { LuggageSpotRef, type LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import { PassengerSpotRef, type PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import LocatableSpotElement from './LocatableSpotElement.vue';
import type { DeckLevel } from '@/models/netex/deckplan/decklevels/deckLevel';

const props = defineProps<{
  deck: Deck,
  scale: number,
}>();

// Flatten locatable spots and pack them into a
const locatableSpotList: (LuggageSpot | PassengerSpot | LuggageSpotRef | PassengerSpotRef )[] = props.deck.deckspaces.flatMap((space: OtherDeckSpace | PassengerSpace) => {
  if (space instanceof PassengerSpace) {
    return [...space?.luggageSpots ?? [], ...space?.passengerSpots ?? []]
  }
  return []
})

const locatableSpots: {[index: string]: {[index: string]: LuggageSpot | PassengerSpot }} = {}
locatableSpotList.forEach((spot) => {
  if (spot instanceof LuggageSpotRef || spot instanceof PassengerSpotRef) return;

  if (!(spot.SpotColumnRef && spot.SpotRowRef)) return;
  const columnRef = spot.SpotColumnRef.attr_ref
  if (!locatableSpots[columnRef]) {
    locatableSpots[columnRef] = {}
  }
  if (locatableSpots[columnRef][spot.SpotRowRef.attr_ref]) {
    return
    //throw Error("Collision in Locatable Spots!")
  }

  locatableSpots[columnRef][spot.SpotRowRef.attr_ref] = spot
})
</script>
