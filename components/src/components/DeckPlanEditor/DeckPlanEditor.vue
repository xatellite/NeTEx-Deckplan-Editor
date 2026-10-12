<script setup lang="ts">
import SidePanel from './components/SidePanel.vue'
import MainPanel from './components/MainPanel.vue'
</script>

<template>
  <div class="grid h-full min-h-0 w-full grid-cols-[minmax(220px,24%)_minmax(0,1fr)] gap-2 p-4">
    <SidePanel />
    <MainPanel />
  </div>
</template>
