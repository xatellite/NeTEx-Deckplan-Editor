<template>
  <div class="h-full flex flex-col bg-ott-bg-secondary relative text-ott-text-primary justify-center items-center">
    <SetupModal v-if="!deckplan" />
    <div v-else class="flex-1 flex flex-col h-full w-full overflow-hidden">
      <ToolOptions />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SetupModal from '../components/SetupModal.vue';
import ToolOptions from '../components/ToolOptions.vue';
import { useEditorState } from '../store/editorstate';
import { storeToRefs } from 'pinia';

const { deckplan} = storeToRefs(useEditorState());
</script>
