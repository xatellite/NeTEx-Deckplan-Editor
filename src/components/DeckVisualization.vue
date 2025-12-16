<template>
    <template>
        <!-- Invisible rect for area selection on stage background -->
        
        <v-rect 
          :config="{...deck.getShape(scale), y: 5, ...getStyle(deck)}" 
          @click="(e) => handleClick(e, deck)"
        />
        <v-rect
            :config="{
                x: 0,
                y: 0,
                width: deck.getShape(scale).width,
                height: deck.getShape(scale).height,
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
            x: seat.getShape(scale).x,
            y: seat.getShape(scale).y,
            draggable: true
          }"
          @dragend="(e) => handleDragEnd(e, seat)"
          @dragmove="(e) => handleDragMove(e, seat)"
          @click="(e) => handleClick(e, seat)"
        >
          <v-rect
            :config="{
              width: seat.getShape(scale).width,
              height: seat.getShape(scale).height,
              ...getStyle(seat),
              fill: seat.getShape(scale).fill,
              stroke: seat.getShape(scale).stroke,
              strokeWidth: seat.getShape(scale).strokeWidth,
              cornerRadius: seat.getShape(scale).cornerRadius
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
        <v-rect
          v-if="selectionRect"
          :config="{...selectionRect, listening: false}"
        />
        <v-line
          v-for="(line, index) in guideLines"
          :key="`guide-${index}`"
          :config="line"
        />
    </template>
</template>

<script setup lang="ts">
import type { Deck } from '../types/deck';
import { PassengerSpot } from '../types/passengerSpot';
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
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

const seats = computed(() => {
  return props.deck.deckspaces?.flatMap(ds => {
    if (ds instanceof PassengerSpace) {
      return ds.passengerSpots?.filter((s): s is PassengerSpot => s instanceof PassengerSpot) || []
    }
    return []
  }) || []
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStyle = (element: any) => {
  if (props.selectedElements.includes(element)) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleClick = (e: any, element: any) => {
    // Prevent click if we were dragging or selecting area
    if (isSelecting.value) return

    emit('select', { element, ctrlKey: e.evt.ctrlKey || e.evt.metaKey })
    e.cancelBubble = true; // Stop propagation
}

const handleMouseDown = (e: any) => {
    if (e.evt.ctrlKey || e.evt.metaKey || e.target === e.target.getStage()) {
        isSelecting.value = true
        const stage = e.target.getStage()
        const pointer = stage.getPointerPosition()
        // Adjust for stage transform if needed, but here we assume simple stage
        // We need local coordinates relative to the deck group/layer if possible, 
        // but pointer is global. 
        // For simplicity, let's assume pointer is correct for now or adjust later.
        // Actually, we are inside a v-stage -> v-layer -> DeckVisualization
        // The pointer position is relative to the stage.
        // We might need to transform it if the layer/group is transformed.
        
        // Let's use relative pointer if possible
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
            stroke: 'green',
            strokeWidth: 1,
        }
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

const handleMouseUp = (e: any) => {
    if (!isSelecting.value) return
    isSelecting.value = false
    
    // Calculate selected elements
    const box = selectionRect.value
    if (!box) return

    // Normalize box
    const x = box.width > 0 ? box.x : box.x + box.width
    const y = box.height > 0 ? box.y : box.y + box.height
    const width = Math.abs(box.width)
    const height = Math.abs(box.height)

    const selected = seats.value.filter(seat => {
        const shape = seat.getShape(props.scale)
        // Check intersection
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

const handleDragMove = (e: any, seat: PassengerSpot) => {
    guideLines.value = []
    
    // Snapping logic
    const stage = e.target.getStage()
    const layer = e.target.getLayer()
    
    // Get all other seats
    const otherSeats = seats.value.filter(s => s !== seat)
    
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDragEnd = (e: any, seat: PassengerSpot) => {
  guideLines.value = []
  const x = e.target.x()
  const y = e.target.y()
  console.log("dragend", x, y)
  
  // Calculate delta
  let deltaX = 0
  let deltaY = 0

  if (seat.Centroid) {
      const oldX = ((seat.Centroid.x * props.scale) - (seat.Width * props.scale / 2)) + 5
      const oldY = ((seat.Centroid.y * props.scale) - (seat.Length * props.scale / 2)) + 5
      deltaX = x - oldX
      deltaY = y - oldY
  }

  // Update dragged seat
  updateSeatPosition(seat, x, y)

  // Update other selected seats
  if (props.selectedElements.includes(seat)) {
    console.log("DEBUG")
      props.selectedElements.forEach(other => {
          if (other !== seat && other instanceof PassengerSpot) {
             const otherShape = other.getShape(props.scale)
             updateSeatPosition(other, otherShape.x + deltaX, otherShape.y + deltaY)
          }
      })
  }
}

const updateSeatPosition = (seat: PassengerSpot, x: number, y: number) => {
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
</script>
