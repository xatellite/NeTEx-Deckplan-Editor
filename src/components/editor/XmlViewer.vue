<template>
  <div class="h-full flex flex-col bg-ott-bg-secondary font-mono text-sm overflow-hidden relative">
    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-4 scrollbar-thin">
      <div
        v-for="(line, index) in lines"
        :key="index"
        :id="`line-${index}`"
        :class="[
          'whitespace-pre min-h-5 flex gap-4 px-2 rounded transition-colors',
          isHighlighted(index) ? 'bg-ott-accent-light text-ott-accent font-medium' : 'hover:bg-ott-bg-darkened'
        ]"
      >
        <span class="inline-block w-8 text-right select-none text-ott-text-secondary opacity-50">{{ index + 1 }}</span>
        <span>{{ line }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, ref, useTemplateRef } from 'vue';

const props = defineProps<{
  xml: string;
  selectedId?: string | null;
}>();

const scrollContainer = useTemplateRef("scrollContainer");
const lines = computed(() => props.xml.split('\n'));
const highlightedRange = ref<{start: number, end: number} | null>(null);

const isHighlighted = (index: number) => {
  if (!highlightedRange.value) return false;
  return index >= highlightedRange.value.start && index <= highlightedRange.value.end;
};

const updateHighlight = () => {
  if (!props.selectedId) {
    highlightedRange.value = null;
    return;
  }

  const startLineIndex = lines.value.findIndex(line => line.includes(`id="${props.selectedId}"`));
  if (startLineIndex === -1) {
    highlightedRange.value = null;
    return;
  }

  const startLine = lines.value[startLineIndex];
  if (!startLine) return;

  // Check for self-closing tag
  if (startLine.trim().endsWith('/>')) {
    highlightedRange.value = { start: startLineIndex, end: startLineIndex };
  } else {
    // Extract tag name
    const match = startLine.match(/<(\w+)/);
    if (match) {
      const tagName = match[1];
      let depth = 1;
      let endLineIndex = startLineIndex;

      for (let i = startLineIndex + 1; i < lines.value.length; i++) {
        const line = lines.value[i];
        if (!line) continue;

        // Check for self-closing first (doesn't change depth)
        if (line.match(new RegExp(`<${tagName}.*/>`))) {
            continue;
        }

        if (line.match(new RegExp(`<${tagName}`))) {
          depth++;
        } else if (line.match(new RegExp(`</${tagName}>`))) {
          depth--;
        }

        if (depth === 0) {
          endLineIndex = i;
          break;
        }
      }
      highlightedRange.value = { start: startLineIndex, end: endLineIndex };
    } else {
        highlightedRange.value = { start: startLineIndex, end: startLineIndex };
    }
  }

  // Scroll to start
  nextTick(() => {
    const element = scrollContainer.value?.querySelector(`#line-${startLineIndex}`);
    if (element && scrollContainer.value) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

watch(() => [props.selectedId, props.xml], () => {
    updateHighlight();
}, { immediate: true });

</script>
