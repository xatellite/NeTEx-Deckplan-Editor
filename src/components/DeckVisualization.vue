<template>
    <template>
        <v-rect :config="{...deck.getShape(), y: 110}" />
        <v-rect 
          v-for="(seat, index) in seats" 
          :key="`seats-${index}`"  
          :config="seat.getShape(scale)"
          @dragend="(e) => handleDragEnd(e, seat)"
        />
    </template>
</template>

<script setup lang="ts">
import type { Deck } from '../types/deck';
import { PassengerSpot } from '../types/passengerSpot';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { PassengerSpace } from '../types/passengerSpace';
import { Centroid } from '../types/centroid';

const props = defineProps({
  deck: {
    type: Object as PropType<Deck>,
    required: true,
  }
})

const scale = 20

const seats = computed(() => {
  console.log(props.deck.deckspaces)
  return props.deck.deckspaces.flatMap(ds => {
    console.log(ds instanceof PassengerSpace)
    if (ds instanceof PassengerSpace) {
      console.log("PSS", ds.passengerSpots)
      return ds.passengerSpots?.filter((s): s is PassengerSpot => s instanceof PassengerSpot) || []
    }
    return []
  })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDragEnd = (e: any, seat: PassengerSpot) => {
  const x = e.target.x()
  const y = e.target.y()
  console.log("dragend", x, y)
  
  if (seat.Centroid) {
    seat.Centroid.x = (x / scale) + (seat.Width / 2)
    seat.Centroid.y = (y / scale) + (seat.Length / 2)
  } else {
    seat.Centroid = new Centroid(
      (x / scale) + (seat.Width / 2),
      (y / scale) + (seat.Length / 2)
    )
  }
}
</script>
