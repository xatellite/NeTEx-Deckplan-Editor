<template>
  <div class="flex flex-col gap-2 p-4 bg-white flex-1">
    <h3 class="font-bold mb-2">Catalog</h3>
    <div class="flex flex-col gap-2">
      <button 
        class="ott-button w-fit text-left"
        @click="$emit('add-seat')"
      >
        + Add Seat
      </button>
      <button 
        class="ott-button w-fit text-left"
        @click="$emit('add-door')"
      >
        + Add Door
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['add-seat', 'add-door'])
</script>
