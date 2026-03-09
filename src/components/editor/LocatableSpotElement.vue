<template>
  <div 
    class="m-2 shadow rounded-md p-1 flex items-center gap-2 cursor-grab active:cursor-grabbing bg-white border border-ott-bg-dark/50 hover:border-ott-accent transition-colors" 
    draggable="true"
    @click.stop="selectElement"
    @dragstart="handleDragStart"
  >
    <Icon v-if="element instanceof PassengerSpot" icon="material-symbols:event-seat-outline-rounded" />
    <Icon v-if="element instanceof LuggageSpot" icon="material-symbols:luggage-outline-rounded" />
    <span class="text-xs font-semibold tabular-nums">{{ element.Label }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useEditorState } from '@/app/store/editorstate';
import { LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  element: PassengerSpot | LuggageSpot,
}>()

function selectElement() {
  useEditorState().selectElement(props.element.attr_id)
}

function handleDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('elementId', props.element.attr_id);
    event.dataTransfer.effectAllowed = 'move';
  }
}

</script>
