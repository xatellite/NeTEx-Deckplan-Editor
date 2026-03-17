<template>
  <div class="tree-item">
    <div
      class="flex items-center gap-2 p-1 px-2 rounded-md cursor-pointer hover:bg-ott-bg-secondary transition-colors relative"
      :class="{ 
        'bg-ott-accent text-ott-text-white hover:text-ott-text-primary font-semibold': selectedId === id,
        'bg-ott-accent/20 border-ott-accent ring-2 ring-ott-accent ring-inset': isDragOver && dropPosition === 'inside'
      }"
      @click.stop="$emit('select', id)"
      :draggable="true"
      @dragstart="onDragStart"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @drop="onDrop"
    >
      <div v-if="hasChildren" class="w-4 flex justify-center" @click.stop="isExpanded = !isExpanded">
        <Icon :icon="isExpanded ? 'material-symbols:keyboard-arrow-down-rounded' : 'material-symbols:keyboard-arrow-right'" width="16" />
      </div>

      <Icon :icon="icon" width="18" />
      <span class="text-sm truncate">{{ label }}</span>
      
      <!-- Placeholder indicators -->
      <div v-if="isDragOver && dropPosition === 'before'" class="absolute -top-0.5 left-0 right-0 h-1 bg-ott-accent z-20 pointer-events-none rounded-full shadow-[0_0_8px_rgba(var(--ott-accent-rgb),0.5)]"></div>
      <div v-if="isDragOver && dropPosition === 'after'" class="absolute -bottom-0.5 left-0 right-0 h-1 bg-ott-accent z-20 pointer-events-none rounded-full shadow-[0_0_8px_rgba(var(--ott-accent-rgb),0.5)]"></div>
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
        @dropNew="(data) => $emit('dropNew', data)"
        @move="(data) => $emit('move', data)"
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
  (e: 'move', data: { sourceId: string; targetId: string; position?: 'before' | 'inside' | 'after' }): void;
  (e: 'dropNew', data: { targetId: string; position?: 'before' | 'inside' | 'after' }): void;
}>();

const isExpanded = ref(true);
const isDragOver = ref(false);
const dropPosition = ref<'before' | 'inside' | 'after'>('inside');
const hasChildren = computed(() => props.children && props.children.length > 0);

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', props.id);
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDragEnter = () => {
  isDragOver.value = true;
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onDragOver = (event: DragEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeY = event.clientY - rect.top;
    const threshold = rect.height / 3;

    if (relativeY < threshold) {
        dropPosition.value = 'before';
    } else if (relativeY > rect.height - threshold) {
        dropPosition.value = 'after';
    } else {
        dropPosition.value = 'inside';
    }
};

const onDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const isNew = event.dataTransfer?.getData('isNewElement') === 'true';
  
  if (isNew) {
    emit('dropNew', { targetId: props.id, position: dropPosition.value });
    return;
  }

  const sourceId = event.dataTransfer?.getData('text/plain');
  if (sourceId && sourceId !== props.id) {
    emit('move', { sourceId, targetId: props.id, position: dropPosition.value });
  }
};
</script>
