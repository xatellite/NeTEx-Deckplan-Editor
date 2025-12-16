<template>
    <template>
        <v-rect 
          :config="{...deck.getShape(scale), y: 5, ...getStyle(deck)}" 
          @click="$emit('select', deck)"
        />
        <v-rect 
          v-for="(seat, index) in seats" 
          :key="`seats-${index}`"  
          :config="{...seat.getShape(scale), ...getStyle(seat)}"
          @dragend="(e) => handleDragEnd(e, seat)"
          @click="$emit('select', seat)"
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
  },
  scale: {
    type: Number,
    required: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedElement: {
    type: Object as PropType<any>,
    default: null,
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStyle = (element: any) => {
  if (props.selectedElement === element) {
    return {
      stroke: 'green',
      strokeWidth: 3,
      shadowColor: 'green',
      shadowBlur: 10,
      shadowOpacity: 0.5,
    }
  }
  return {}
}

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
    seat.Centroid.x = ((x - 5) / props.scale) + (seat.Width / 2)  // 5 = Frame offset
    seat.Centroid.y = ((y - 5) / props.scale) + (seat.Length / 2)
  } else {
    seat.Centroid = new Centroid(
      ((x- 5) / props.scale) + (seat.Width / 2) ,
      ((y- 5) / props.scale) + (seat.Length / 2)
    )
  }
  console.log(seat.Centroid)
}
</script>
