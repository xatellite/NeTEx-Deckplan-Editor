<template>
  <div class="flex items-center justify-center flex-col  w-8">
    <input class="transform-[rotate(90deg)]" id="scale-slider" type="range" min="1" max="20" v-model.number="scale" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useEditorState } from '../store/editorstate';

const {scale}  = storeToRefs(useEditorState())
</script>
