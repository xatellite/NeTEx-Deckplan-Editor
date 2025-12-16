<template>
    <template>
        <v-rect :config="{...deck.getShape(), y: 110}" />
        <v-rect v-for="(seat, index) in seats" :key="`seats-${index}`"  :config="{...seat.getShape(), y: 110}" />
    </template>
</template>

<script setup lang="ts">
import type { Deck } from '@/types/deck';
import type { PropType } from 'vue';



defineProps({
  deck: {
    type: Object as PropType<Deck>,
    required: true,
  }
})
</script>
