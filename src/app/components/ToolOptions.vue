<template>
  <div class="flex flex-col gap-4">
      <button class="ott-button" @click="handleAdd">Add PassengerSpot</button>
  </div>
</template>


<script lang="ts" setup>
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { useEditorState } from '../store/editorstate';


function handleAdd() {
  useEditorState().selectedDeck.addSpot(new PassengerSpot())
}
</script>
