<template>
  <div class="flex gap-4 h-full">
      <div class="flex-1">
        Space
      </div>
      <div class="h-full flex flex-col gap-2">
        <span class="p-1">Filters</span>
        <div class="flex gap-2 px-2">
          <button
            v-for="category in categories"
            :key="`category-${category.id}`"
            @click="() => toggleCategory(category)"
            :class="`${enabledCategories.has(category) ? 'bg-ott-accent! text-ott-bg-primary! border-transparent!' : ''} ott-button `"
          >
            <Icon :icon="category.icon" />
          </button>
        </div>

        <div class="border bg-ott-bg-primary h-full">
          Drag and Click
        </div>
      </div>
  </div>
</template>


<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { ref, type Ref } from 'vue';

const categories = new Set([{
  id: 'seat',
  icon: 'material-symbols:event-seat-outline-rounded'
},
{
  id: 'luggage-spot',
  icon: 'material-symbols:luggage-outline-rounded'
},
{
  id: 'door',
  icon: 'material-symbols:door-open-outline-rounded'
},
{
  id: 'space',
  icon: 'fluent:breakout-room-32-regular'
}])

const enabledCategories: Ref<Set<{id: string, icon: string}>> = ref(new Set(categories))

function toggleCategory(category: {id: string, icon: string}) {
  if (enabledCategories.value.has(category)) {
    enabledCategories.value.delete(category)
  } else {
    enabledCategories.value.add(category)
  }
}
</script>
