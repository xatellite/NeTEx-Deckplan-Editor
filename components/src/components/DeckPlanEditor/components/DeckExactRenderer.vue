<script setup lang="ts">
import type { DeckType, BoundingBoxType } from 'netex-deckplan-library'
import { PassengerSpace, PassengerSpot } from 'netex-deckplan-library'
import { computed } from 'vue'

const props = defineProps<{
  deck: DeckType
  boundingBox: BoundingBoxType
}>()
// Transform into SVG format
const points = computed(() =>
  props.deck.polygon?.points.map((point) => {
    return `${point.x},${point.y}`
  }).join(' ') ?? ''
)

// Calculate the box containing the deck
const viewBox = computed(() => {
  const padding = 0.5
  const { length, width } = props.boundingBox

  // [minX, minY, horizontalSize, verticalSize]
  return [
    -length/2 - padding,
    -width/2 - padding,
    length + padding * 2,
    width + padding * 2,
  ].join(' ')
})

const centeredTransform = computed(() => {
  const { x, y } = props.boundingBox.center
  return `translate(${-x},${-y})`
})

const passengerSpaces = computed(() => {
  return props.deck.deckspaces.filter((space) => space instanceof PassengerSpace)
})

const getSeats = (space: PassengerSpace) => {
  return space.passengerSpots?.filter((spot): spot is PassengerSpot => spot instanceof PassengerSpot && spot.Centroid !== undefined)
}

const getBackRest = (seat: PassengerSpot) => {
  const halfWidth = seat.Width / 2
  const halfLength = seat.Length / 2

  const padding = Math.min(seat.Width, seat.Length) * 0.1

  switch (seat.Orientation) {
    case "backwards":
      return {
        x1: halfWidth - padding, y1: -halfLength + padding,
        x2: halfWidth - padding, y2: halfLength - padding,
      }

    case "forwards":
      return {
        x1: -halfWidth + padding, y1: -halfLength + padding,
        x2: -halfWidth + padding, y2: halfLength - padding,
      }

    case 'leftwards':
      return {
        x1: -halfWidth + padding, y1: halfLength - padding,
        x2: halfWidth - padding, y2: halfLength - padding,
      }

    case 'rightwards':
      return {
        x1: -halfWidth + padding, y1: -halfLength + padding,
        x2: halfWidth - padding, y2: -halfLength + padding,
      }

    default:
      return undefined
  }
}
</script>

<template>
  <svg v-if="points"
    :viewBox="viewBox"
    class="block h-full min-h-75 w-full"
    aria-label="Deck outline"
  >
    <g :transform="centeredTransform">
      <polygon :points="points" fill="white" stroke="black" stroke-width="2" vector-effect="non-scaling-stroke" />

      <g v-for="space in passengerSpaces"
         :key="space.attr_id"
      >
        <polygon v-if="space.Polygon?.points.length"
          :points = "space.Polygon?.points.map(point => `${point.x},${point.y}`).join(' ')"
          fill="#68a691" fill-opacity="0.15" stroke="#68a691" stroke-width="1" vector-effect="non-scaling-stroke"
        />
        <g v-for="seat in getSeats(space)"
           :key="seat.attr_id"
           :transform="`translate(${seat.Centroid!.x},${seat.Centroid!.y})`"
        >
          <rect
            :x = "-seat.Width / 2"
            :y = "-seat.Length / 2"
            :width = "seat.Width"
            :height = "seat.Length"
            fill="white"
            stroke="black"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
            :rx="Math.min(seat.Width, seat.Length) * 0.15"
          />

          <text
            :x="0"
            :y="0"
            :font-size="Math.min(seat.Width, seat.Length) * 0.28"
            text-anchor="middle"
            dominant-baseline="central"
            fill="#333"
            pointer-events="none"
          >{{ seat.Label }}</text>

          <line v-if="getBackRest(seat)"
            v-bind="getBackRest(seat)"
            stroke="black"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
          />
        </g>
      </g>
    </g>
  </svg>
  <p v-else>No deck polygon</p>
</template>
