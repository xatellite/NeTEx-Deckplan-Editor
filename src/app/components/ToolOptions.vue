<template>
  <div class="flex h-full overflow-hidden">
    <!-- Configuration Panel -->
    <div class="flex-1 flex flex-col min-h-0 primary border-r border-ott-bg-dark">
      <div class="p-2 bg-ott-bg-primary m-4 border border-ott-bg-dark">
          <div class="p-4 border-b border-ott-bg-secondary flex justify-between items-center">
          <h2 class="font-bold text-ott-text-primary">Configure Element</h2>
          <button
            v-if="elementToBuild"
            @click="() => store.selectElementToBuild(undefined)"
            class="text-xs text-ott-text-secondary hover:text-ott-accent"
          >
            Clear
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="elementToBuild" class="flex flex-col gap-6">
            <div class="flex justify-center p-8 bg-ott-bg-secondary/20 rounded-lg border border-ott-bg-dark border-dashed">
              <LocatableSpotElement
                v-if="elementToBuild instanceof PassengerSpot || elementToBuild.constructor.name === 'LuggageSpot'"
                :element="elementToBuild"
                :isNew="true"
              />
              <div
                v-else
                class="p-4 bg-white border border-ott-bg-dark rounded shadow-sm flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing"
                draggable="true"
                @dragstart="handleDragStart"
              >
                  <Icon :icon="currentCategoryIcon" width="24" class="text-ott-accent" />
                  <span class="text-xs font-bold text-ott-text-primary uppercase tracking-wider">
                    {{ elementToBuild.constructor.name }}
                  </span>
              </div>
            </div>

            <PropertyEditor
              :element="elementToBuild"
              @update="(updates) => store.updateElementToBuild(updates)"
            />
          </div>
          <div v-else class="h-full flex flex-col items-center justify-center text-ott-text-secondary italic text-sm text-center p-8">
            <Icon icon="material-symbols:info-outline" width="32" class="mb-2 opacity-20" />
            <span>Select an element type from the right to start building</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Element Selection Panel -->
    <div class="w-64 flex flex-col gap-2 bg-ott-bg-primary">
      <span class="p-1 text-xs font-bold text-ott-text-secondary uppercase px-2">Element Types</span>
      <div class="flex gap-2 px-2">
        <button
          v-for="category in categories"
          :key="`category-${category.id}`"
          @click="() => toggleCategory(category)"
          :class="`${enabledCategories.has(category) ? 'bg-ott-accent! text-ott-bg-primary! border-transparent!' : ''} ott-button `"
          :title="category.id"
        >
          <Icon :icon="category.icon" />
        </button>
      </div>

      <div class="border-t border-ott-bg-dark bg-ott-bg-secondary mt-2 pt-2 flex-1 overflow-y-auto px-2 pb-4">
        <div class="flex flex-col gap-2">
          <div
            v-for="item in filteredElements"
            :key="item.id"
            @click="() => createNewElement(item)"
            :class="`p-3 rounded-lg border flex items-center gap-3 bg-ott-bg-primary transition-all cursor-pointer hover:border-ott-accent group border-ott-bg-dark}`"
          >
            <Icon :icon="item.icon" width="20" class="group-hover:text-ott-accent" />
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ item.label }}</span>
              <span class="text-[10px] text-ott-text-secondary uppercase">{{ item.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { ref, type Ref, computed } from 'vue';
import { useEditorState } from '../store/editorstate';
import PropertyEditor from './PropertyEditor.vue';
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import { PassengerEntrance } from '@/models/netex/deckplan/deck/deckspace/entrance/passengerEntrance';
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace';
import { storeToRefs } from 'pinia';
import LocatableSpotElement from '@/components/editor/LocatableSpotElement.vue';

const store = useEditorState();
const { elementToBuild } = storeToRefs(store);

const categories = [
  { id: 'space', icon: 'fluent:breakout-room-32-regular' },
  { id: 'door', icon: 'material-symbols:door-open-outline-rounded' },
  { id: 'spot', icon: 'material-symbols:pin-drop-outline' },
];

// element as a group of equipments and other things represented in a deckplan
type ElementOption = {
  id: string,
  category: 'spot' | 'space' | 'door',
  icon: string,
  label: string,
  model: typeof PassengerSpot | typeof LuggageSpot | typeof PassengerEntrance | typeof PassengerSpace
  type?: 'seatingArea' | 'toilet' | 'corridor'
}

const elements: ElementOption[] = [
  { id: 'seat', category: 'spot', label: 'Passenger Seat', icon: 'material-symbols:event-seat-outline-rounded', model: PassengerSpot },
  { id: 'luggage-spot', category: 'spot', label: 'Luggage Spot', icon: 'material-symbols:luggage-outline-rounded', model: LuggageSpot },
  { id: 'entrance', category: 'door', label: 'Entrance', icon: 'material-symbols:door-open-outline-rounded', model: PassengerEntrance },
  { id: 'seating-area', category: 'space', label: 'Seating Area', icon: 'fluent:breakout-room-32-regular', model: PassengerSpace, type: 'seatingArea' },
  { id: 'toilet', category: 'space', label: 'Toilet', icon: 'mdi:toilet', model: PassengerSpace, type: 'toilet' },
  { id: 'corridor', category: 'space', label: 'Corridor', icon: 'ri:walk-line', model: PassengerSpace, type: 'corridor' }
];

const enabledCategories: Ref<Set<{id: string, icon: string}>> = ref(new Set(categories));

function toggleCategory(category: {id: string, icon: string}) {
  if (enabledCategories.value.has(category)) {
    enabledCategories.value.delete(category);
  } else {
    enabledCategories.value.add(category);
  }
}

const filteredElements = computed(() => {
  const enabledIds = Array.from(enabledCategories.value).map(c => c.id);
  return elements.filter(el => enabledIds.includes(el.category));
});

const currentCategoryIcon = computed(() => {
  if (!elementToBuild.value) return 'material-symbols:add-box-outline-rounded';
  const found = elements.find(el => elementToBuild.value instanceof el.model || elementToBuild.value.constructor === el.model);
  return found?.icon || 'material-symbols:add-box-outline-rounded';
});

function createNewElement(item: any) {
  const id = `${item.id}_${Date.now()}`;
  let newEl;

  if (item.model === PassengerSpace) {
    newEl = new item.model({
      attr_id: id,
      attr_version: '1.0',
      Name: { text_value: item.label } as any,
      PassengerSpaceType: item.type,
      passengerSpots: { PassengerSpot: [], PassengerSpotRef: [] },
      luggageSpots: { LuggageSpot: [], LuggageSpotRef: [] },
      deckEntrances: { PassengerEntrance: [] },
      deckEntranceUsage: { DeckEntranceUsage: [] },
      deckEntranceCouples: { DeckEntranceCouple: [] },
      deckSpaceCapacities: { DeckSpaceCapacity: [] },
      actualVehicleEquipments: { ActualVehicleEquipment: [] },
      PublicUse: { text_value: true },
      TotalCapacity: { text_value: 0 },
      FareClass: { text_value: 'secondClass' },
      AirConditioned: { text_value: true }
    });
  } else if (item.model === PassengerSpot) {
      newEl = new item.model({
          attr_id: id,
          attr_version: '1.0',
          Label: 'Seat',
          Orientation: 'forwards',
          actualVehicleEquipments: [],
          SpotColumnRef: undefined,
          SpotRowRef: undefined,
          Width: 0.5,
          Length: 0.5
      })
  } else if (item.model === LuggageSpot) {
      newEl = new item.model({
          attr_id: id,
          attr_version: '1.0',
          Label: 'Luggage',
          Orientation: 'forwards',
          actualVehicleEquipments: [],
          SpotColumnRef: undefined,
          SpotRowRef: undefined
      })
  } else if (item.model === PassengerEntrance) {
      newEl = new item.model({
          attr_id: id,
          attr_version: '1.0',
          Name: { text_value: 'Entrance' } as any,
          Label: { text_value: 'E' } as any,
          Width: { text_value: 0.8 } as any,
          Height: { text_value: 2.0 } as any,
          actualVehicleEquipments: { ActualVehicleEquipment: [] },
          PublicUse: { text_value: true },
          VehicleSide: { text_value: 'leftSide' } as any,
          DeckEntranceType: { text_value: 'external' }
      })
  }

  store.selectElementToBuild(newEl);
}

function handleDragStart(event: DragEvent) {
  if (event.dataTransfer && elementToBuild.value) {
    event.dataTransfer.setData('isNewElement', 'true');
    event.dataTransfer.setData('elementId', elementToBuild.value.attr_id);
    event.dataTransfer.effectAllowed = 'copy';
  }
}
</script>
