<template>
  <div class="w-max mx-auto shadow-sm border-2 rounded-lg bg-ott-bg-primary p-4">
    <div class="relative">
      <v-stage
        :config="{
          width: getStageSize(deck, scale).height,
          height: getStageSize(deck, scale).width
        }"
      >
          <v-layer>
          <v-rect
            :config="{...deck.getShape(scale), width: deck.getShape(scale).height, height: deck.getShape(scale).width, y: 5, ...getStyle(deck)}"
            @click="(e: MouseEvent) => handleClick(e, deck)"
          />
          <v-rect
              :config="{
                  x: 0,
                  y: 0,
                  width: deck.getShape(scale).height,
                  height: deck.getShape(scale).width,
                  fill: 'transparent',
                  listening: true
              }"
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
          />
          <v-group
            v-for="(seat, index) in seats"
            :key="`seats-${index}`"
            :config="{
              x: seat.getShape(scale).y,
              y: seat.getShape(scale).x,
              draggable: true
            }"
            @dragstart="(e: MouseEvent) => handleDragStart(e, seat)"
            @dragend="(e: MouseEvent) => handleDragEnd(e, seat)"
            @dragmove="(e: MouseEvent) => handleDragMove(e, seat)"
            @click="(e: MouseEvent) => handleClick(e, seat)"
          >
            <v-rect
              :config="{
                width: seat.getShape(scale).width,
                height: seat.getShape(scale).height,
                fill: seat.getShape(scale).fill,
                stroke: seat.getShape(scale).stroke,
                strokeWidth: seat.getShape(scale).strokeWidth,
                cornerRadius: seat.getShape(scale).cornerRadius,
                ...getStyle(seat),
              }"
            />
            <v-text
              :config="{
                width: seat.getShape(scale).width,
                height: seat.getShape(scale).height,
                text: seat.Label,
                align: 'center',
                verticalAlign: 'middle',
                fontSize: Math.min(Math.min(seat.getShape(scale).width, seat.getShape(scale).height) / 2, 16),
                listening: false
              }"
            />
          </v-group>
          <v-group
            v-for="(entrance, index) in entrances"
            :key="`entrance-${index}`"
            :config="{
              x: entrance.getShape(scale, deck.Length, deck.Width).y,
              y: entrance.getShape(scale, deck.Length, deck.Width).x,
              draggable: true
            }"
            @dragmove="(e: MouseEvent) => handleEntranceDragMove(e, entrance)"
            @dragend="(e: MouseEvent) => handleEntranceDragEnd(e, entrance)"
            @click="(e: MouseEvent) => handleClick(e, entrance)"
          >
            <v-rect
              :config="{
                width: entrance.getShape(scale, deck.Length, deck.Width).height,
                height: entrance.getShape(scale, deck.Length, deck.Width).width,
                fill: entrance.getShape(scale, deck.Length, deck.Width).fill,
                stroke: entrance.getShape(scale, deck.Length, deck.Width).stroke,
                strokeWidth: entrance.getShape(scale, deck.Length, deck.Width).strokeWidth,
                ...getStyle(entrance),
              }"
            />
          </v-group>
          <v-rect
            v-if="selectionRect"
            :config="{...selectionRect, listening: false}"
          />
          <v-line
            v-for="(line, index) in guideLines"
            :key="`guide-${index}`"
            :config="line"
          />
      </v-layer>
    </v-stage>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '@/models/netex/deckplan/deck/deck';
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { PassengerEntrance } from '@/models/netex/deckplan/deck/deckspace/entrance/passengerEntrance';
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace';
import { Centroid } from '@/models/netex/centroid';

const props = defineProps({
  deck: {
    type: Object as PropType<Deck>,
    required: true,
  },
  scale: {
    type: Number,
    required: true,
  },
  selectedElements: {
    type: Array as PropType<any[]>,
    default: () => [],
  }
})

const emit = defineEmits(['select', 'area-select'])

const selectionRect = ref<any>(null)
const isSelecting = ref(false)
const startPos = ref({ x: 0, y: 0 })
const guideLines = ref<any[]>([])
const dragStartPositions = ref<Map<PassengerSpot, {x: number, y: number}>>(new Map())

const seats = computed((): PassengerSpot[] => {
  return props.deck.deckspaces?.flatMap(ds => {
    if (ds instanceof PassengerSpace) {
      return ds.passengerSpots?.filter((s): s is PassengerSpot => s instanceof PassengerSpot) || []
    }
    return []
  }).map((spot: PassengerSpot) => {
    const seat = spot

      // seat.availability =
      //   props.availability && spot.attr_id
      //     ? PassengerSpotAvailability[
      //         props.availability[spot.attr_id] ?? "Undefined"
      //       ]
      //     : PassengerSpotAvailability.Undefined

      return seat
  }) || []
})

const entrances = computed(() => {
  return props.deck.deckspaces?.flatMap(ds => {
    if (ds instanceof PassengerSpace) {
      return ds.deckEntrances || []
    }
    return []
  }) || []
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStyle = (element: any) => {
  if (props.selectedElements.includes(element)) {
    return {
      stroke: '#ffffff',
      strokeWidth: 3,
    }
  }
  return {}
}

const getStageSize = (deck: Deck, scale: number) => {
  let maxWidth = 0
  let maxHeight = 0

  const { width, height } = deck.getBoundingBox()
  maxWidth = Math.max(maxWidth, width)
  maxHeight = Math.max(maxHeight, height)

  return {
    width: (maxWidth * scale) + 10,
    height: (maxHeight * scale) + 10
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleClick = (e: any, element: any) => {
    if (isSelecting.value) return

    emit('select', { element, ctrlKey: e.evt.ctrlKey || e.evt.metaKey })
    e.cancelBubble = true;
}

const handleMouseDown = (e: any) => {
    if (e.evt.ctrlKey || e.evt.metaKey || e.target === e.target.getStage()) {
        isSelecting.value = true
        const stage = e.target.getStage()
        const pointer = stage.getPointerPosition()

        const transform = e.target.getAbsoluteTransform().copy();
        transform.invert();
        const pos = transform.point(pointer);

        startPos.value = { x: pos.x, y: pos.y }
        selectionRect.value = {
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: 'rgba(0, 255, 0, 0.3)',
            stroke: '#68a691',
            strokeWidth: 1,
        }
    } else {
      emit('area-select', [])
    }
}

const handleMouseMove = (e: any) => {
    if (!isSelecting.value) return

    const stage = e.target.getStage()
    const pointer = stage.getPointerPosition()
    const transform = e.target.getAbsoluteTransform().copy();
    transform.invert();
    const pos = transform.point(pointer);

    selectionRect.value.width = pos.x - startPos.value.x
    selectionRect.value.height = pos.y - startPos.value.y
}

const handleMouseUp = () => {
    if (!isSelecting.value) return
    isSelecting.value = false

    const box = selectionRect.value
    if (!box) return

    const x = box.width > 0 ? box.x : box.x + box.width
    const y = box.height > 0 ? box.y : box.y + box.height
    const width = Math.abs(box.width)
    const height = Math.abs(box.height)

    const selected = seats.value.filter(seat => {
        const shape = seat.getShape(props.scale)
        return (
            shape.x < x + width &&
            shape.x + shape.width > x &&
            shape.y < y + height &&
            shape.y + shape.height > y
        )
    })

    if (selected.length > 0) {
        emit('area-select', selected)
    }

    selectionRect.value = null
}

const handleDragStart = (e: any, seat: PassengerSpot) => {
    dragStartPositions.value.clear()
    if (props.selectedElements.includes(seat)) {
        props.selectedElements.forEach(el => {
            if (el instanceof PassengerSpot) {
                const shape = el.getShape(props.scale)
                dragStartPositions.value.set(el, { x: shape.x, y: shape.y })
            }
        })
    }
}

const handleDragMove = (e: any, seat: PassengerSpot) => {
    guideLines.value = []

    const stage = e.target.getStage()

    // Get all other seats that are NOT selected (snap to static objects only)
    const otherSeats = seats.value.filter(s => s !== seat && !props.selectedElements.includes(s))

    // Current position
    const x = e.target.x()
    const y = e.target.y()

    // Snap threshold
    const SNAP_THRESHOLD = 10

    let newX = x
    let newY = y

    // Simple snapping to other seats' X and Y
    otherSeats.forEach(other => {
        const otherShape = other.getShape(props.scale)

        // Snap X
        if (Math.abs(x - otherShape.x) < SNAP_THRESHOLD) {
            newX = otherShape.x
            guideLines.value.push({
                points: [otherShape.x, 0, otherShape.x, stage.height()],
                stroke: 'red',
                strokeWidth: 1,
                dash: [4, 6]
            })
        }

        // Snap Y
        if (Math.abs(y - otherShape.y) < SNAP_THRESHOLD) {
            newY = otherShape.y
            guideLines.value.push({
                points: [0, otherShape.y, stage.width(), otherShape.y],
                stroke: 'red',
                strokeWidth: 1,
                dash: [4, 6]
            })
        }
    })

    e.target.x(newX)
    e.target.y(newY)

    // Move other selected seats
    const startPos = dragStartPositions.value.get(seat)
    if (startPos && props.selectedElements.includes(seat)) {
        const dx = newX - startPos.x
        const dy = newY - startPos.y

        props.selectedElements.forEach(other => {
            if (other !== seat && other instanceof PassengerSpot) {
                const otherStart = dragStartPositions.value.get(other)
                if (otherStart) {
                    updateSeatPosition(other, otherStart.x + dx, otherStart.y + dy)
                }
            }
        })
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDragEnd = (e: any, seat: PassengerSpot) => {
  guideLines.value = []
  const x = e.target.x()
  const y = e.target.y()

  // Update dragged seat
  updateSeatPosition(seat, x, y)

  dragStartPositions.value.clear()
}

const updateSeatPosition = (seat: PassengerSpot, y: number, x: number) => {
  if (seat.Centroid) {
    seat.Centroid.x = ((x - 5) / props.scale) + (seat.Width / 2)
    seat.Centroid.y = ((y - 5) / props.scale) + (seat.Length / 2)
  } else {
    seat.Centroid = new Centroid(
      ((x - 5) / props.scale) + (seat.Width / 2),
      ((y - 5) / props.scale) + (seat.Length / 2)
    )
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleEntranceDragMove = (e: any, entrance: PassengerEntrance) => {
    // const stage = e.target.getStage()
    // const layer = e.target.getLayer()

    const x = e.target.x()
    const y = e.target.y()

    const deckWidthPx = props.deck.Width * props.scale
    const deckLengthPx = props.deck.Length * props.scale

    // Use getShape to get current dimensions (based on current VehicleSide)
    const shape = entrance.getShape(props.scale, props.deck.Length, props.deck.Width)
    const entranceWidth = shape.width
    const entranceHeight = shape.height

    const deckLeft = 5
    const deckTop = 5
    const deckRight = deckLeft + deckLengthPx
    const deckBottom = deckTop + deckWidthPx

    const centerX = x + entranceWidth / 2
    const centerY = y + entranceHeight / 2

    const distLeft = Math.abs(centerX - deckLeft)
    const distRight = Math.abs(centerX - deckRight)
    const distTop = Math.abs(centerY - deckTop)
    const distBottom = Math.abs(centerY - deckBottom)

    const minDist = Math.min(distLeft, distRight, distTop, distBottom)

    let newX = x
    let newY = y

    if (minDist === distTop) {
        // Snap to Top (Left Side)
        newY = deckTop
        newX = Math.max(deckLeft, Math.min(x, deckRight - entranceWidth))
    } else if (minDist === distBottom) {
        // Snap to Bottom (Right Side)
        newY = deckBottom - entranceHeight
        newX = Math.max(deckLeft, Math.min(x, deckRight - entranceWidth))
    } else if (minDist === distLeft) {
        // Snap to Left (Front)
        newX = deckLeft
        // Snap Y to center
        newY = (deckWidthPx / 2) + 5 - (entranceHeight / 2)
    } else if (minDist === distRight) {
        // Snap to Right (Back)
        newX = deckRight - entranceWidth
        // Snap Y to center
        newY = (deckWidthPx / 2) + 5 - (entranceHeight / 2)
    }

    e.target.x(newX)
    e.target.y(newY)

    if (!entrance.Centroid) {
      entrance.Centroid = new Centroid(0, 0)
    }

    entrance.Centroid.x = newY / props.scale
    entrance.Centroid.y = newX / props.scale
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleEntranceDragEnd = (e: any, entrance: PassengerEntrance) => {
    const x = e.target.x()
    const y = e.target.y()

    const deckWidthPx = props.deck.Width * props.scale
    const deckLengthPx = props.deck.Length * props.scale

    const shape = entrance.getShape(props.scale, props.deck.Length, props.deck.Width)
    const entranceWidth = shape.width
    const entranceHeight = shape.height

    const deckLeft = 5
    const deckTop = 5
    const deckRight = deckLeft + deckLengthPx
    const deckBottom = deckTop + deckWidthPx

    // Determine side based on final position
    // We can use the same logic as dragMove or just check coordinates
    // Allow for small epsilon due to floating point
    const epsilon = 1

    if (Math.abs(y - deckTop) < epsilon) {
        entrance.VehicleSide = 'leftSide'
        // Update SequenceFromFront
        entrance.SequenceFromFront = (x - deckLeft + (entranceWidth / 2)) / props.scale
    } else if (Math.abs(y - (deckBottom - entranceHeight)) < epsilon) {
        entrance.VehicleSide = 'rightSide'
        entrance.SequenceFromFront = (x - deckLeft + (entranceWidth / 2)) / props.scale
    } else if (Math.abs(x - deckLeft) < epsilon) {
        entrance.VehicleSide = 'front'
        entrance.SequenceFromFront = 0
    } else if (Math.abs(x - (deckRight - entranceWidth)) < epsilon) {
        entrance.VehicleSide = 'back'
        entrance.SequenceFromFront = props.deck.Length
    }
}
</script>
