<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), {
  title: 'Deck plan',
})
</script>

<template>
  <h1>{{ title }}</h1>
</template>
