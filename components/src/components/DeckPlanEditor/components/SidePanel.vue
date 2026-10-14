<script setup lang="ts">
import type { DeckPlanType } from 'netex-deckplan-library'

defineProps<{
  deckplan?: DeckPlanType
}>()
</script>

<template>
  <aside class="flex min-h-0 flex-col rounded-xl border border-stone-300 bg-stone-50 p-2">
    <h2 class="px-1 py-3 text-xl font-medium">Elements</h2>
    <div class="flex-1 overflow-auto rounded-md border border-stone-300 bg-stone-100 p-3 text-sm">
      <div>Deckplan</div>
    </div>
  </aside>
</template>
