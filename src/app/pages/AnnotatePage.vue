<template>
  <div class="h-full w-full bg-ott-bg-secondary overflow-y-auto scrollbar-thin">
    <div v-if="!deckplan" class="flex-1 flex items-center justify-center text-ott-text-secondary italic text-lg h-full">
      Load a deck plan to start annotating
    </div>

    <div v-else class="max-w-6xl mx-auto w-full p-8 flex flex-col text-ott-text-primary">
      <!-- Section Template Helper -->
      <section v-for="section in sections" :key="section.title" class="flex flex-col">
        <div
          class="flex items-center justify-between px-1 cursor-pointer group/section"
          @click="toggleSection(section.title)"
        >
          <div class="flex items-center gap-2">
            <Icon
              :icon="collapsedSections.has(section.title) ? 'material-symbols:keyboard-arrow-right' : 'material-symbols:keyboard-arrow-down-rounded'"
              width="20"
              class="text-ott-text-secondary group-hover/section:text-ott-accent transition-colors"
            />
            <h2 class="ott-section-header border-none">{{ section.title }}</h2>
          </div>
          <span class="text-[10px] font-bold bg-ott-bg-dark/20 px-2 py-0.5 rounded-full text-ott-text-secondary">{{ section.items.length }} Items</span>
        </div>

        <div
          v-if="!collapsedSections.has(section.title)"
          class="bg-white border border-ott-bg-dark  overflow-hidden divide-y divide-ott-bg-dark shadow-sm transition-all"
        >
          <div v-for="item in section.items" :key="item.attr_id" class="flex flex-col">
            <div
              class="flex items-center gap-4 p-3 px-5 cursor-pointer hover:bg-ott-bg-secondary/50 transition-colors group"
              :class="{ 'bg-ott-bg-secondary border-b border-ott-bg-dark': expandedId === item.attr_id }"
              @click="toggleExpand(item.attr_id)"
            >
              <!-- Icon Base -->
              <Icon :icon="getIcon(item)" width="20" class="shrink-0" />

              <!-- Label & Info -->
              <div class="flex flex-col flex-1 min-w-0">
                <span class="font-semibold text-sm">{{ getLabel(item) }}</span>
                <span v-if="getSublabel(item)" class="text-[10px] text-ott-text-secondary font-mono truncate uppercase tracking-tight">
                  {{ getSublabel(item) }}
                </span>
              </div>

              <!-- Property Indicators -->
              <div class="flex items-center gap-4 shrink-0">
                <template v-if="item instanceof PassengerSpot">
                  <div class="flex items-center gap-1.5 border-r border-ott-bg-dark pr-4 h-4 last:border-0 last:pr-0">
                    <Icon v-if="item.IsByWindow" icon="material-symbols:window-outline" width="14" class="text-ott-accent" title="By Window" />
                    <Icon v-else icon="material-symbols:window-outline" width="14" class="text-ott-bg-dark" />
                    <Icon v-if="item.HasPower" icon="material-symbols:power-outline-rounded" width="14" class="text-ott-accent" title="Has Power" />
                    <Icon v-else icon="material-symbols:power-outline-rounded" width="14" class="text-ott-bg-dark" />
                    <Icon v-if="item.TableType" icon="material-symbols:table-restaurant" width="14" class="text-ott-accent" title="Has Power" />
                    <Icon v-else icon="material-symbols:table-restaurant-outline" width="14" class="text-ott-bg-dark" />
                  </div>
                  <span v-if="item.Orientation" class="text-[10px] border border-ott-bg-dark px-1.5 rounded bg-white text-ott-text-secondary font-mono">
                    {{ item.Orientation }}
                  </span>
                </template>

                <template v-if="item instanceof PassengerEntrance">
                  <span v-if="item.VehicleSide" class="text-[10px] px-2 py-0.5 bg-ott-bg-dark/20 rounded font-bold text-ott-text-secondary uppercase">
                    {{ item.VehicleSide }}
                  </span>
                </template>
              </div>

              <!-- Chevron -->
              <Icon
                :icon="expandedId === item.attr_id ? 'material-symbols:keyboard-arrow-up-rounded' : 'material-symbols:keyboard-arrow-down-rounded'"
                width="22"
                class="text-ott-bg-dark group-hover:text-ott-text-secondary transition-colors"
              />
            </div>

            <!-- Expanded Content -->
            <div v-if="expandedId === item.attr_id" class="p-6 bg-white transition-all">
              <div class="max-w-3xl">
                <DeckPropertyEditor v-if="item instanceof Deck" :deck="item" @update="(updates) => store.updateElement(item.attr_id, updates)" />
                <PropertyEditor v-else :element="item" @update="(updates) => store.updateElement(item.attr_id, updates)" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="!collapsedSections.has(section.title) && section.items.length === 0" class="p-8 text-center bg-white border border-dashed border-ott-bg-dark rounded-xl text-ott-text-secondary italic text-sm">
          No items found in this category
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick, type ComputedRef, onMounted } from 'vue';
import { useEditorState } from '../store/editorstate';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import PropertyEditor from '../components/PropertyEditor.vue';
import DeckPropertyEditor from '../components/DeckPropertyEditor.vue';
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace';
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot';
import { PassengerEntrance } from '@/models/netex/deckplan/deck/deckspace/entrance/passengerEntrance';
import { Deck } from '@/models/netex/deckplan/deck/deck';

const store = useEditorState();
const { deckplan, selectedElementId } = storeToRefs(store);

const expandedId = ref<string | null>(null);
const collapsedSections = reactive(new Set<string>());

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const toggleSection = (title: string) => {
  if (collapsedSections.has(title)) {
    collapsedSections.delete(title);
  } else {
    collapsedSections.add(title);
  }
};

const getLabel = (obj: any) => {
  if (!obj) return '';
  const label = obj.Label || obj.Name;
  if (label) {
    return typeof label === 'string' ? label : (label.value || label.text_value || '');
  }
  return obj.attr_id || 'Unnamed';
};

const getSublabel = (obj: any) => {
  if (obj instanceof PassengerSpace) return obj.PassengerSpaceType;
  return obj.attr_id;
};

const getIcon = (obj: Deck | PassengerSpot | LuggageSpot | PassengerSpace | PassengerEntrance) => {
  if (obj instanceof PassengerSpot) return 'material-symbols:event-seat-outline-rounded';
  if (obj instanceof LuggageSpot) return 'material-symbols:luggage-outline-rounded';
  if (obj instanceof PassengerSpace) return 'fluent:breakout-room-32-regular';
  if (obj instanceof PassengerEntrance) return 'material-symbols:door-open-outline-rounded';
  if (obj instanceof Deck) return 'material-symbols:layers-outline-rounded';
};

const allDecks = computed(() => deckplan.value?.decks || []);

const allDeckSpaces = computed(() => {
  if (!deckplan.value) return [];
  return deckplan.value.decks.flatMap(d => d.deckspaces || []);
});

const allSpaces = computed(() => {
  return allDeckSpaces.value.filter(s => s instanceof PassengerSpace);
});

const allPassengerSpots = computed(() => {
  return allDeckSpaces.value.flatMap(s => {
    if (s instanceof PassengerSpace) {
      return s.passengerSpots?.filter((p): p is PassengerSpot => p instanceof PassengerSpot) || [];
    }
    return [];
  });
});

const allLuggageSpots = computed(() => {
  return allDeckSpaces.value.flatMap(s => {
    if (s instanceof PassengerSpace) {
      return s.luggageSpots?.filter((l): l is LuggageSpot => l instanceof LuggageSpot) || [];
    }
    return [];
  });
});

const allEntrances = computed(() => {
  return allDeckSpaces.value.flatMap(s => {
    if (s instanceof PassengerSpace) {
      return s.deckEntrances?.filter((e): e is PassengerEntrance => e instanceof PassengerEntrance) || [];
    }
    return [];
  });
});

const sections = computed(() => [
  { title: 'Seats', items: allPassengerSpots.value },
  { title: 'Luggage', items: allLuggageSpots.value },
  { title: 'Entrances', items: allEntrances.value },
  { title: 'Passenger Spaces', items: allSpaces.value },
  { title: 'Decks', items: allDecks.value }
]);

function openSelectedItem() {
  if (selectedElementId.value) {
    // Find which section this element belongs to and expand it
    const section = sections.value.find(s => s.items.some(item => item.attr_id === selectedElementId.value));
    if (section) {
      sections.value.forEach((section) => {
        collapsedSections.add(section.title)
      })
      collapsedSections.delete(section.title);
      expandedId.value = selectedElementId.value;
    }
  } else {
    expandedId.value = null;
  }
}

onMounted(() => {
  console.log("mount", selectedElementId.value)
  openSelectedItem()
})

watch(selectedElementId, () => {
  openSelectedItem()
}, {immediate: true});

</script>
