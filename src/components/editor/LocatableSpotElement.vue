<template>
  <div class="m-2 shadow rounded-md p-1 flex items-center gap-2" @click="selectElement">
    <Icon v-if="element instanceof PassengerSpot" icon="material-symbols:event-seat-outline-rounded" />
    <Icon v-if="element instanceof LuggageSpot" icon="material-symbols:luggage-outline-rounded" />
    {{ element.Label }}
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

</script>
