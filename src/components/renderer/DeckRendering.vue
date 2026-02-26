<template>
  <svg
    :width="vertical ? stageSize.height : stageSize.width"
    :height="vertical ? stageSize.width : stageSize.height"
    class="vehicle-frame"
    style="user-select:none;"
  >
    <g :class="`${vertical ? 'vehicle-frame--vertical' : ''}`"
    :transform="`rotate(
      ${vertical ? 90 : 0},
      ${stageSize.height / 2},
      ${stageSize.height / 2}
    )`"
    >
      <!-- Deck -->
      <rect
        v-bind="{ ...deck.getShape(scale), y: 5 }"
        @click.stop="handleClick($event, deck)"
        class="vehicle-deck"
      />

      <!-- Seats -->
      <g
        v-for="(seat, index) in seats"
        :key="`seat-${index}`"
        :transform="`translate(${seatPositions.get(seat)?.x ?? seat.getShape(scale).x},
                              ${seatPositions.get(seat)?.y ?? seat.getShape(scale).y})`"
        @click.stop="handleClick($event, seat)"
        :class="`seat ${seat.getClasses()}`"
      >
        <g class="seat__container" :transform="`rotate(  ${seat.Orientation === 'forwards' ? 180 : 0},  ${seat.getShape(scale).width / 2}, ${seat.getShape(scale).height / 2})`">
          <!-- Base rectangle -->
          <rect
            :width="seat.getShape(scale).width"
            :height="seat.getShape(scale).height"
            :class="`seat__base`"
          />
          <!-- Backrest side (inner inset strip) -->
          <rect
            :x="seat.getShape(scale).width * 0.9"
            y="0"
            :width="seat.getShape(scale).width * 0.20"
            :height="seat.getShape(scale).height"
            rx="6"
            ry="6"
            class="seat__backrest"
            pointer-events="none"
            :class="`seat__backrest`"
          />
        </g>

        <g class="seat__text-container"
        :transform="`rotate(
          ${vertical ? -90 : 0},
          ${seat.getShape(scale).width / 2},
          ${seat.getShape(scale).height / 2}
        )`">
          <text
            :x="seat.getShape(scale).width / 2"
            :y="seat.getShape(scale).height / 2"
            text-anchor="middle"
            dominant-baseline="middle"
            class="seat__text"
            :font-size="Math.max(
              Math.min(seat.getShape(scale).width, seat.getShape(scale).height)/3,
              10
            )"
            pointer-events="none"
          >
            {{ seat.Label }}
          </text>
        </g>
      </g>

      <!-- Entrances -->
      <g
        v-for="(entrance, index) in entrances"
        :key="`entrance-${index}`"
        :transform="`translate(${entrancePositions.get(entrance)?.x ?? entrance.getShape(scale, deck.Length, deck.Width).x},
                              ${entrancePositions.get(entrance)?.y ?? entrance.getShape(scale, deck.Length, deck.Width).y})`"
        @click.stop="handleClick($event, entrance)"
      >
        <rect
          :width="entrance.getShape(scale, deck.Length, deck.Width).width"
          :height="entrance.getShape(scale, deck.Length, deck.Width).height"
          class="door"
        />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { Deck } from '@/types/netex/deck'
import { PassengerSpot } from '@/types/netex/passengerSpot'
import { PassengerSpace } from '@/types/netex/passengerSpace'
import type { PropType } from 'vue'
import { PassengerSpotAvailability, type Availability  } from '@/types/view/seats'

const props = defineProps({
  deck: { type: Object as PropType<Deck>, required: true },
  scale: { type: Number, required: true },
  availability: {
    type: Object as PropType<Availability> ,
  },
  vertical: { type: Boolean, default: false }
})

const seatPositions = reactive(new Map())
const entrancePositions = reactive(new Map())

const emit = defineEmits(['select'])

const seats = computed((): PassengerSpot[] => {
  return props.deck.deckspaces?.flatMap(ds => {
    if (ds instanceof PassengerSpace) {
      return ds.passengerSpots?.filter((s): s is PassengerSpot => s instanceof PassengerSpot) || []
    }
    return []
  }).map((seat: PassengerSpot) => {
      seat.availability =
        props.availability && seat.attr_id
          ? PassengerSpotAvailability[
              props.availability[seat.attr_id] ?? "Undefined"
            ]
          : PassengerSpotAvailability.Undefined

      return seat
  }) || []
})


const entrances = computed(() =>
  props.deck.deckspaces?.flatMap(ds =>
    ds instanceof PassengerSpace ? ds.deckEntrances ?? [] : []
  ) ?? []
)

const stageSize = computed(() => {
  const { width, height } = props.deck.getBoundingBox()
  return {
    width: width * props.scale + 10 ,
    height: height * props.scale + 10
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleClick(e: MouseEvent, element: any){
  emit('select', { element, ctrlKey: e.ctrlKey || e.metaKey })
}
</script>

<style>
.vehicle-frame {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.vehicle-deck {
  fill: #ffffff;
  stroke: #68A691;
  rx: 5px;
  stroke-width: 2px;
}

.seat .seat__base{
  fill: #4caf50;
}
.seat-occupied .seat__base{
  fill: #f44336;
}
.seat-selected .seat__base{
  fill: #ff9800;
}
.seat-filtered .seat__base{
  fill: #ff9800;
}
.seat-undefined .seat__base{
  fill: #9e9e9e;
}

.seat .seat__base {
  fill: #D9D9D9;
  stroke: #7C7C7C;
  stroke-width: 1px;
  cursor: pointer;
  rx: 5px;
}

.seat .seat__backrest{
  fill: #7C7C7C;
}

.seat__text {
  stroke: #7C7C7C;
  pointer-events: none;
}

.door {
  fill: #DEDEDE;
  stroke: #DEDEDE;
  stroke-width: 1px;
  cursor: pointer;
}
</style>
