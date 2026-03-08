<template>
    <div class="flex flex-col gap-4">
      <!-- Add DeckSpace -->
      <div class="flex flex-col gap-2">
        <button
          @click="selectTool('deckspace', 'seatingArea')"
          :class="['ott-tool-btn', activeTool === 'deckspace' ? 'active' : '']"
        >
          <Icon icon="material-symbols:meeting-room-outline-rounded" width="20" />
          <span>Add DeckSpace</span>
        </button>
        <div v-if="activeTool === 'deckspace'" class="ml-8 flex flex-wrap gap-2">
          <button
            v-for="type in deckSpaceTypes"
            :key="type"
            @click="selectTool('deckspace', type)"
            :class="['ott-sub-tool-btn', activeEquipment === type ? 'active' : '']"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Add Spot -->
      <div class="flex flex-col gap-2">
        <button
          @click="selectTool('spot', 'passengerSpot')"
          :class="['ott-tool-btn', activeTool === 'spot' ? 'active' : '']"
        >
          <Icon icon="material-symbols:event-seat-outline-rounded" width="20" />
          <span>Add Spot</span>
        </button>
        <div v-if="activeTool === 'spot'" class="ml-8 flex flex-wrap gap-2">
          <button
            v-for="type in spotTypes"
            :key="type"
            @click="selectTool('spot', type)"
            :class="['ott-sub-tool-btn', activeEquipment === type ? 'active' : '']"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Add Entrance -->
      <div class="flex flex-col gap-2">
        <button
          @click="selectTool('entrance', 'default')"
          :class="['ott-tool-btn', activeTool === 'entrance' ? 'active' : '']"
        >
          <Icon icon="material-symbols:door-open-outline-rounded" width="20" />
          <span>Add Entrance</span>
        </button>
      </div>
  </div>
</template>


<script lang="ts" setup>
import SetupModal from '../components/SetupModal.vue';
import PropertyEditor from '../components/PropertyEditor.vue';
import { useEditorState } from '../store/editorstate';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import ToolOptions from '../components/ToolOptions.vue';

const store = useEditorState();
const { deckplan, activeTool, activeEquipment, selectedElement, selectedElementId } = storeToRefs(store);

const deckSpaceTypes = ['seatingArea', 'passengerCabin', 'vehicleArea', 'luggageStore', 'corridor', 'restaurant', 'toilet', 'bathroom', 'other'];
const spotTypes = ['passengerSpot', 'luggageSpot'];

const selectTool = (tool: 'deckspace' | 'spot' | 'entrance', equipment: string) => {
  if (store.activeTool === tool && store.activeEquipment === equipment) {
    store.setActiveTool(undefined, undefined);
  } else {
    store.setActiveTool(tool, equipment);
  }
};
</script>
