<template>
  <div class="h-full overflow-y-auto bg-gray-100 p-4 font-mono text-sm">
    <div v-for="(line, index) in lines" :key="index" :id="`line-${index}`" :class="{'bg-yellow-200': isHighlighted(index)}">
      <pre>{{ line }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, ref } from 'vue';

const props = defineProps({
  xml: {
    type: String,
    required: true,
  },
  selectedId: {
    type: String,
    default: null,
  },
});

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
      // Find closing tag with same indentation? Or just next closing tag?
      // Simple approach: find next </TagName>
      // Better approach: count nesting
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
        // Fallback to single line
        highlightedRange.value = { start: startLineIndex, end: startLineIndex };
    }
  }

  // Scroll to start
  nextTick(() => {
    const element = document.getElementById(`line-${startLineIndex}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

watch(() => [props.selectedId, props.xml], () => {
    updateHighlight();
}, { immediate: true });

</script>
