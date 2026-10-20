<script setup lang="ts">
import type { DeckType, BoundingBoxType } from 'netex-deckplan-library'
import { PassengerSpace } from 'netex-deckplan-library'
import { computed } from 'vue'
import { getBackRest, getSeats } from './seatHelpers'
import { useContainerSize } from './useContainerSize'

const props = withDefaults(defineProps<{
  deck: DeckType
  boundingBox: BoundingBoxType
  scaleTo?: 'both' | 'width' | 'height'
}>(), {
  scaleTo: 'both',
})

const {
  container,
  containerWidth,
  containerHeight,
} = useContainerSize()

// Calculate drawing width and height
const padding = 0.5

const drawingWidth = computed(() => {
  return props.boundingBox.length + padding * 2
})

const drawingLength = computed(() => {
  return props.boundingBox.width + padding * 2
})

// Calculate the scale
const scale = computed(() => {
  if (drawingWidth.value <= 0 || drawingLength.value <= 0) {
    return 0
  }

  const scaleX = containerWidth.value / drawingWidth.value
  const scaleY = containerHeight.value / drawingLength.value

  if (props.scaleTo === 'width') return scaleX
  if (props.scaleTo === 'height') return scaleY

  // Chooses smaller scale to fit the drawing in the panel
  return Math.min(scaleX, scaleY)
})

// Transform into SVG format
const points = computed(() =>
  props.deck.polygon?.points.map((point) => {
    return `${point.x},${point.y}`
  }).join(' ') ?? ''
)

// Calculate the box containing the deck
const viewBox = computed(() => {
  // [minX, minY, horizontalSize, verticalSize]
  return [
    -drawingWidth.value/2,
    -drawingLength.value/2,
    drawingWidth.value,
    drawingLength.value,
  ].join(' ')
})

const centeredTransform = computed(() => {
  const { x, y } = props.boundingBox.center
  return `translate(${-x},${-y})`
})

const passengerSpaces = computed(() => {
  return props.deck.deckspaces.filter((space) => space instanceof PassengerSpace)
})
</script>

<template>
  <div ref="container" class="h-full min-h-0 w-full min-w-0 overflow-auto">
    <div
      v-if="points"
      class="grid min-h-full w-max min-w-full place-items-center"
    >
      <svg v-if="points"
           :viewBox="viewBox"
           :width="drawingWidth * scale"
           :height="drawingLength * scale"
           class="block max-w-none"
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
    </div>
    <p v-else>No deck polygon</p>
  </div>
</template>
