<template>
  <div class="tree-item">
    <div
      class="flex items-center gap-2 p-1 px-2 rounded-md cursor-pointer hover:bg-ott-bg-secondary transition-colors"
      :class="{ 'bg-ott-accent text-ott-text-white hover:text-ott-text-primary font-semibold': selectedId === id }"
      @click.stop="$emit('select', id)"
      :draggable="true"
      @dragstart="onDragStart"
      @dragover.prevent
      @drop="onDrop"
    >
      <div v-if="hasChildren" class="w-4 flex justify-center" @click.stop="isExpanded = !isExpanded">
        <Icon :icon="isExpanded ? 'material-symbols:keyboard-arrow-down-rounded' : 'material-symbols:keyboard-arrow-right'" width="16" />
      </div>

      <Icon :icon="icon" width="18" />
      <span class="text-sm truncate">{{ label }}</span>
    </div>

    <div v-if="isExpanded && hasChildren" class="ml-4 border-l border-ott-bg-dark pl-2 mt-1 flex flex-col gap-1">
      <TreeItem
        v-for="child in children"
        :key="child.id"
        :label="child.label"
        :id="child.id"
        :icon="child.icon"
        :children="child.children"
        :selectedId="selectedId"
        @select="(id) => $emit('select', id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

interface TreeChild {
  label: string;
  id: string;
  icon: string;
  children?: TreeChild[];
}

const props = defineProps<{
  label: string;
  id: string;
  icon: string;
  children?: TreeChild[];
  selectedId?: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'move', { sourceId, targetId }: { sourceId: string; targetId: string }): void;
}>();

const isExpanded = ref(true);
const hasChildren = computed(() => props.children && props.children.length > 0);

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', props.id);
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDrop = (event: DragEvent) => {
  const sourceId = event.dataTransfer?.getData('text/plain');
  if (sourceId && sourceId !== props.id) {
    emit('move', { sourceId, targetId: props.id });
  }
};
</script>
