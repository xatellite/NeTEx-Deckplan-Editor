<template>
  <div class="deck-treeview h-full flex flex-col bg-ott-bg-primary w-64">
    <div class="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-ott-bg-dark">
      <div v-if="!deckPlan || deckPlan.decks.length === 0" class="text-ott-text-secondary text-sm p-4 text-center italic">
        No decks in plan
      </div>
      <div v-else>
        <TreeItem
          v-for="root in treeData"
          :key="root.id"
          :label="root.label"
          :id="root.id"
          :icon="root.icon"
          :children="root.children"
          :selectedId="selectedId"
          @select="(id) => $emit('select', id)"
          @move="(moveData) => $emit('move', moveData)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TreeItem from './TreeItem.vue';
import type { DeckPlan } from '@/models/netex/deckplan/deckPlan';
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace';

const props = defineProps<{
  deckPlan?: DeckPlan;
  selectedId?: string;
}>();

defineEmits<{
  (e: 'select', id: string): void;
  (e: 'move', data: { sourceId: string; targetId: string }): void;
}>();

const treeData = computed(() => {
  if (!props.deckPlan) return [];

  const getLabel = (obj: any) => {
    if (!obj) return '';

    // Priority: Label -> Name -> attr_id
    const label = obj.Label;
    if (label) {
      return typeof label === 'string' ? label : (label.value || label.text_value || '');
    }

    const name = obj.Name;
    if (name) {
      return typeof name === 'string' ? name : (name.value || name.text_value || '');
    }

    return obj.attr_id || 'Unnamed';
  };

  return props.deckPlan.decks.map((deck) => ({
    label: getLabel(deck),
    id: deck.attr_id,
    icon: 'material-symbols:layers-outline-rounded',
    children: deck.deckspaces.map((space) => {
      const children: any[] = [];

      if (space instanceof PassengerSpace) {
        if (space.passengerSpots) {
          space.passengerSpots.forEach((spot) => {
            if (typeof spot !== 'string' && 'attr_id' in spot) {
              children.push({
                label: getLabel(spot),
                id: (spot as any).attr_id,
                icon: 'material-symbols:event-seat-outline-rounded',
              });
            }
          });
        }
        if (space.luggageSpots) {
          space.luggageSpots.forEach((spot) => {
            if (typeof spot !== 'string' && 'attr_id' in spot) {
              children.push({
                label: getLabel(spot),
                id: (spot as any).attr_id,
                icon: 'material-symbols:luggage-outline-rounded',
              });
            }
          });
        }
        if (space.deckEntrances) {
          space.deckEntrances.forEach((entrance) => {
            children.push({
              label: getLabel(entrance),
              id: entrance.attr_id,
              icon: 'material-symbols:door-open-outline-rounded',
            });
          });
        }
      }

      return {
        label: getLabel(space),
        id: space.attr_id,
        icon: 'fluent:breakout-room-32-regular',
        children: children.length > 0 ? children : undefined,
      };
    }),
  }));
});
</script>
