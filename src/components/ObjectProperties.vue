<template>
  <div class="bg-ott-bg-primary border-t border-t-ott-bg-dark p-4">
    <h3 class="">Properties</h3>
    <div v-if="element">
      <div v-for="(value, key) in element" :key="key" class="flex items-center mb-10">
        <label :for="key" class="min-w-[150px] font-bold ">{{ key }}</label>
        <input
          v-if="typeof value === 'string' || typeof value === 'number'"
          :id="key"
          v-model="element[key]"
          :type="typeof value === 'number' ? 'number' : 'text'"
        />
        <input
          v-else-if="typeof value === 'boolean'"
          :id="key"
          v-model="element[key]"
          type="checkbox"
        />
        <span v-else-if="value && typeof value === 'object' && value.value !== undefined">
             <input
                :id="key"
                v-model="value.value"
                type="text"
            />
        </span>
        <span v-else-if="value && Array.isArray(value)">
            {{ value.length }} elements
        </span>
        <span v-else>{{ value }}</span>
      </div>
    </div>
    <div v-else>
      <p>Select an element to view properties.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
   
  element: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
.object-properties {
  padding: 20px;
  border-top: 1px solid #ccc;
  background-color: #f9f9f9;
}

.property-row {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.property-row label {
  width: 150px;
  font-weight: bold;
}

.property-row input {
  flex: 1;
  padding: 5px;
}
</style>
