<template>
  <div class="flex gap-2">
    <div class="flex gap-2 border rounded-full p-1 px-2 border-ott-bg-dark">
      <button @click="() => selectDeckLevel(level.attr_id)" v-for="level in deckplan?.deckLevels" :class="`${selectedDeckLevelId == level.attr_id ? 'bg-ott-bg-primary':''} p-1 px-4 rounded-full`" :key="`level-${level.attr_id}`">{{level.Label}}</button>
      <button @click="addDeckLevel" class="p-2 px-4 rounded-full"><Icon icon="material-symbols:add-2" /></button>
    </div>
    <button @click="removeDeckLevel" v-if="isDeletable"><Icon icon="material-symbols:delete-outline-rounded" /></button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { useEditorState } from '../store/editorstate';
import { storeToRefs } from 'pinia';

const {deckplan, selectedDeckLevelId} = storeToRefs(useEditorState())

const isDeletable = computed(() => deckplan.value?.deckLevels.findIndex((level)=> level.attr_id === selectedDeckLevelId.value) !== 0)

function addDeckLevel() {
  useEditorState().addDeckLevel()
}

function selectDeckLevel(levelId: string) {
  console.log('select', levelId)
  useEditorState().selectDeckLevel(levelId)
}

function removeDeckLevel() {
  if (selectedDeckLevelId) {
    useEditorState().removeDeckLevel()
  }
}

</script>
