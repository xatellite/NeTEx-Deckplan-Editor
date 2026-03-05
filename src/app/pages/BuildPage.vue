<template>
  <div class="h-full justify-center flex flex-col items-center">
    <SetupModal v-if="!deckplan" />
    <div v-else>

    </div>
  </div>
</template>

<script lang="ts" setup>
import SetupModal from '../components/SetupModal.vue';
import { useEditorState } from '../store/editorstate';

const deckplan = useEditorState().deckplan

</script>
