<template>
  <div
    class="m-2 rounded-md flex flex-col items-center cursor-grab active:cursor-grabbing  hover:border-ott-accent transition-colors"
    draggable="true"
    @click.stop="selectElement"
    @dragstart="handleDragStart"
  >
    <div :class="`${isSelected ? 'border-ott-highlight ' : 'border-ott-text-primary '}  ${element.Orientation === 'leftwards' ? 'border-r-6 ' : ''}  ${element.Orientation === 'rightwards' ? 'border-l-6 ' : ''}  ${element.Orientation === 'forwards' ? 'border-t-6 ' : ''} ${element.Orientation === 'backwards' ? 'border-b-6 ' : ''}  rounded-lg flex justify-center items-center w-10 h-10 bg-white border  shadow p-1`">
      <Icon v-if="element instanceof PassengerSpot" icon="material-symbols:event-seat-outline-rounded" width="16"/>
      {{ element.Label }}
    </div>
    <Icon v-if="element instanceof LuggageSpot" icon="material-symbols:luggage-outline-rounded" width="20"/>
    <!-- <span class="text-xs font-semibold tabular-nums">{{ element.Label }}</span> -->
  </div>
</template>

<script lang="ts" setup>
import { LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  element: PassengerSpot | LuggageSpot,
  isNew?: boolean,
  isSelected?: boolean,
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

function selectElement() {
  if (props.isNew) return;
  emit('select', props.element.attr_id)
}

function handleDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    if (props.isNew) {
        event.dataTransfer.setData('isNewElement', 'true');
    }
    event.dataTransfer.setData('elementId', props.element.attr_id);
    event.dataTransfer.effectAllowed = props.isNew ? 'copy' : 'move';
  }
}

</script>
