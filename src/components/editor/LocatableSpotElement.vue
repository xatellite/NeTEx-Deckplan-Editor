<template>
  <div class="bg-ott-bg-secondary">
    {{ element.Label }}
  </div>
</template>

<script lang="ts" setup>
import type { LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import type { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';


defineProps<{
  element: PassengerSpot | LuggageSpot,
}>()

</script>
