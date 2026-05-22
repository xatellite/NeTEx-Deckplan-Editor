<template>
  <div class="w-max mx-auto shadow-sm border-2 rounded-lg bg-ott-bg-primary p-4">
    <div class="relative">
      <v-stage
        :config="{
          width: getStageSize(deck, scale).height,
          height: getStageSize(deck, scale).width,
        }"
      >
        <v-layer>
          <v-rect
            :config="{
              ...deck.getShape(scale),
              width: deck.getShape(scale).height,
              height: deck.getShape(scale).width,
              y: 5,
              ...getStyle(deck),
            }"
            @click="(e: MouseEvent) => handleClick(e, deck)"
          />
          <v-rect
            :config="{
              x: 0,
              y: 0,
              width: deck.getShape(scale).height,
              height: deck.getShape(scale).width,
              fill: 'transparent',
              listening: true,
            }"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @dragover.prevent
            @drop="handleDropInExact"
          />
          <!-- Seats -->
          <v-group
            v-for="(seat, index) in seats"
            :key="`seats-${index}`"
            :config="{
              x: deck.Width * scale - seat.getShape(scale).y - seat.getShape(scale).height + 10,
              y: seat.getShape(scale).x,
              draggable: true,
            }"
            @dragstart="(e: MouseEvent) => handleDragStart(e, seat)"
            @dragend="(e: MouseEvent) => handleDragEnd(e, seat)"
            @dragmove="(e: MouseEvent) => handleDragMove(e, seat)"
            @click="(e: MouseEvent) => handleClick(e, seat)"
          >
            <!-- Main seat -->
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

            <!-- Orientation indicator -->
            <v-rect
              v-if="seat.Orientation === 'forwards'"
              :config="{
                x: 0,
                y: 0,
                width: seat.getShape(scale).width,
                height: 4,
                fill: '#000000',
                cornerRadius: 4,
                listening: false
              }"
            />

            <v-rect
              v-if="seat.Orientation === 'backwards'"
              :config="{
                x: 0,
                y: seat.getShape(scale).height - 4,
                width: seat.getShape(scale).width,
                height: 4,
                fill: '#000000',
                cornerRadius: 4,
                listening: false
              }"
            />


            <v-rect
              v-if="seat.Orientation === 'rightwards'"
              :config="{
                x: 0,
                y: 0,
                width: 4,
                height: seat.getShape(scale).width,
                fill: '#000000',
                cornerRadius: 4,
                listening: false
              }"
            />

            <v-rect
              v-if="seat.Orientation === 'leftwards'"
              :config="{
                x: seat.getShape(scale).height - 4,
                y: 0,
                width: 4,
                height: seat.getShape(scale).width,
                fill: '#000000',
                cornerRadius: 4,
                listening: false
              }"
            />

            <!-- Label -->
            <v-text
              :config="{
                width: seat.getShape(scale).width,
                height: seat.getShape(scale).height,
                text: seat.Label,
                align: 'center',
                verticalAlign: 'middle',
                fontSize: Math.min(
                  Math.min(
                    seat.getShape(scale).width,
                    seat.getShape(scale).height
                  ) / 2,
                  16
                ),
                listening: false
              }"
            />
          </v-group>
          <!-- Entrances -->
          <v-group
            v-for="(entrance, index) in entrances"
            :key="`entrance-${index}`"
            :config="{
              x: deck.Width * scale - entrance.getShape(scale, deck.Length, deck.Width).y - entrance.getShape(scale, deck.Length, deck.Width).height + 10,
              y: entrance.getShape(scale, deck.Length, deck.Width).x,
              draggable: true,
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
          <v-rect v-if="selectionRect" :config="{ ...selectionRect, listening: false }" />
          <v-line v-for="(line, index) in guideLines" :key="`guide-${index}`" :config="line" />
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '@/models/netex/deckplan/deck/deck'
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot'
import { PassengerEntrance } from '@/models/netex/deckplan/deck/deckspace/entrance/passengerEntrance'
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace'
import { Centroid } from '@/models/netex/centroid'

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
  },
  elementToBuild: {
    type: Object as PropType<any>,
    default: null,
  },
})

const emit = defineEmits(['select', 'area-select', 'drop', 'updateElement'])

const selectionRect = ref<any>(null)
const isSelecting = ref(false)
const startPos = ref({ x: 0, y: 0 })
const guideLines = ref<any[]>([])
const dragStartPositions = ref<Map<PassengerSpot, { kX: number; kY: number }>>(new Map())

const seats = computed((): PassengerSpot[] => {
  return (
    props.deck.deckspaces
      ?.flatMap((ds) => {
        if (ds instanceof PassengerSpace) {
          return (
            ds.passengerSpots?.filter((s): s is PassengerSpot => s instanceof PassengerSpot) || []
          )
        }
        return []
      })
      .map((spot: PassengerSpot) => {
        const seat = spot

        // seat.availability =
        //   props.availability && spot.attr_id
        //     ? PassengerSpotAvailability[
        //         props.availability[spot.attr_id] ?? "Undefined"
        //       ]
        //     : PassengerSpotAvailability.Undefined

        return seat
      }) || []
  )
})

const entrances = computed(() => {
  return (
    props.deck.deckspaces?.flatMap((ds) => {
      if (ds instanceof PassengerSpace) {
        return ds.deckEntrances || []
      }
      return []
    }) || []
  )
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStyle = (element: any) => {
  if (props.selectedElements.includes(element)) {
    return {
      stroke: '#68a691',
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
    width: maxWidth * scale + 10,
    height: maxHeight * scale + 10,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleClick = (e: any, element: any) => {
  if (isSelecting.value) return

  emit('select', { element, ctrlKey: e.evt.ctrlKey || e.evt.metaKey })
  e.cancelBubble = true
}

const handleMouseDown = (e: any) => {
  if (e.evt.ctrlKey || e.evt.metaKey || e.target === e.target.getStage()) {
    isSelecting.value = true
    const stage = e.target.getStage()
    const pointer = stage.getPointerPosition()

    const transform = e.target.getAbsoluteTransform().copy()
    transform.invert()
    const pos = transform.point(pointer)

    startPos.value = { x: pos.x, y: pos.y }
    selectionRect.value = {
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      fill: 'rgba(255, 0, 110, 0.3)',
      stroke: '#242670',
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
  const transform = e.target.getAbsoluteTransform().copy()
  transform.invert()
  const pos = transform.point(pointer)

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

  const selected = [...seats.value, ...entrances.value].filter((el) => {
    let kX, kY, kW, kH
    if (el instanceof PassengerSpot) {
      const shape = el.getShape(props.scale)
      kX = props.deck.Width * props.scale - shape.y - shape.height + 10
      kY = shape.x
      kW = shape.height
      kH = shape.width
    } else if (el instanceof PassengerEntrance) {
      const shape = el.getShape(props.scale, props.deck.Length, props.deck.Width)
      kX = props.deck.Width * props.scale - shape.y - shape.height + 10
      kY = shape.x
      kW = shape.height
      kH = shape.width
    } else {
      return false
    }

    return kX < x + width && kX + kW > x && kY < y + height && kY + kH > y
  })

  if (selected.length > 0) {
    emit('area-select', selected)
  }

  selectionRect.value = null
}

const handleDragStart = (e: any, seat: PassengerSpot) => {
  dragStartPositions.value.clear()
  if (props.selectedElements.includes(seat)) {
    props.selectedElements.forEach((el) => {
      if (el instanceof PassengerSpot) {
        const shape = el.getShape(props.scale)
        const stageX = props.deck.Width * props.scale - shape.y - shape.height + 10
        dragStartPositions.value.set(el, { kX: stageX, kY: shape.x })
      }
    })
  }
}

const handleDragMove = (e: any, seat: PassengerSpot) => {
  guideLines.value = []

  const stage = e.target.getStage()

  // Get all other seats that are NOT selected (snap to static objects only)
  const otherSeats = seats.value.filter((s) => s !== seat && !props.selectedElements.includes(s))

  // Current position
  const x = e.target.x()
  const y = e.target.y()

  // Snap threshold
  const SNAP_THRESHOLD = 10

  let newX = x
  let newY = y

  // Simple snapping to other seats' X and Y
  otherSeats.forEach((other) => {
    const otherShape = other.getShape(props.scale)
    const otherStageX = props.deck.Width * props.scale - otherShape.y - otherShape.height + 10

    // Snap X
    if (Math.abs(x - otherStageX) < SNAP_THRESHOLD) {
      newX = otherStageX
      guideLines.value.push({
        points: [otherStageX, 0, otherStageX, stage.height()],
        stroke: 'red',
        strokeWidth: 1,
        dash: [4, 6],
      })
    }

    // Snap Y
    if (Math.abs(y - otherShape.x) < SNAP_THRESHOLD) {
      newY = otherShape.x
      guideLines.value.push({
        points: [0, otherShape.x, stage.width(), otherShape.x],
        stroke: 'red',
        strokeWidth: 1,
        dash: [4, 6],
      })
    }
  })

  e.target.x(newX)
  e.target.y(newY)

  // Move other selected seats
  const startPos = dragStartPositions.value.get(seat)
  if (startPos && props.selectedElements.includes(seat)) {
    const dx = newX - startPos.kX
    const dy = newY - startPos.kY

    props.selectedElements.forEach((other) => {
      if (other !== seat && other instanceof PassengerSpot) {
        const otherStart = dragStartPositions.value.get(other)
        if (otherStart) {
          updateSeatPosition(other, otherStart.kX + dx, otherStart.kY + dy)
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

const updateSeatPosition = (seat: PassengerSpot, kX: number, kY: number) => {
  const newCentroid = {
    x: (kY - 5) / props.scale + seat.Width / 2,
    y: props.deck.Width - ((kX - 5) / props.scale + seat.Length / 2),
  }

  emit('updateElement', {
    id: seat.attr_id,
    updates: {
      Centroid: new Centroid(newCentroid.x, newCentroid.y),
    },
  })
}

const handleDropInExact = (e: any) => {
  const isNew = e.evt.dataTransfer?.getData('isNewElement') === 'true'
  if (isNew && props.elementToBuild) {
    const stage = e.target.getStage()
    const pointer = stage.getPointerPosition()
    const transform = e.target.getAbsoluteTransform().copy()
    transform.invert()
    const pos = transform.point(pointer)

    const el = props.elementToBuild
    if (
      el instanceof PassengerSpot ||
      el.constructor.name === 'LuggageSpot' ||
      el instanceof PassengerEntrance
    ) {
      if (el instanceof PassengerSpot || el.constructor.name === 'LuggageSpot') {
        const stageX = pos.x
        const stageY = pos.y
        el.Centroid = new Centroid(
          (stageY - 5) / props.scale + el.Width / 2,
          props.deck.Width - ((stageX - 5) / props.scale + el.Length / 2),
        )
      } else if (el instanceof PassengerEntrance) {
        el.Centroid = new Centroid(
          pos.y / props.scale,
          props.deck.Width - (pos.x / props.scale),
        )
      }
      emit('drop', { element: el, deckId: props.deck.attr_id })
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleEntranceDragMove = (e: any, entrance: PassengerEntrance) => {
  // const stage = e.target.getStage()
  // const layer = e.target.getLayer()

  const x = e.target.x()
  const y = e.target.y()

  e.target.x(x)
  e.target.y(y)

  if (!entrance.Centroid) {
    entrance.Centroid = new Centroid(0, 0)
  }

  entrance.Centroid.x = y / props.scale
  entrance.Centroid.y = props.deck.Width - x / props.scale
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleEntranceDragEnd = (e: any, entrance: PassengerEntrance) => {
  const x = e.target.x()
  const y = e.target.y()

  const deckWidthPx = props.deck.Width * props.scale
  const deckLengthPx = props.deck.Length * props.scale

  const shape = entrance.getShape(props.scale, props.deck.Length, props.deck.Width)
  const entranceWidth = shape.height
  const entranceHeight = shape.width

  const deckLeft = 5
  const deckTop = 5
  const deckRight = deckLeft + deckWidthPx
  const deckBottom = deckTop + deckLengthPx

  // Determine side based on final position
  // We can use the same logic as dragMove or just check coordinates
  // Allow for small epsilon due to floating point
  const epsilon = 1

  if (Math.abs(y - deckTop) < epsilon) {
    entrance.VehicleSide = 'front'
    entrance.SequenceFromFront = 0
  } else if (Math.abs(y - (deckBottom - entranceHeight)) < epsilon) {
    entrance.VehicleSide = 'back'
    entrance.SequenceFromFront = props.deck.Length
  } else if (Math.abs(x - deckLeft) < epsilon) {
    entrance.VehicleSide = 'leftSide'
    entrance.SequenceFromFront = (y - deckTop + entranceHeight / 2) / props.scale
  } else if (Math.abs(x - (deckRight - entranceWidth)) < epsilon) {
    entrance.VehicleSide = 'rightSide'
    entrance.SequenceFromFront = (y - deckTop + entranceHeight / 2) / props.scale
  }
}
</script>
