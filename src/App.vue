<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-b-ott-bg-dark flex gap-2 items-center bg-ott-bg-primary">
      <input ref="inputRef" class="ott-button" type="file" multiple @change="onChange" accept="text/xml"/>
      <button @click="load" class="ott-button">Load</button>
      <button @click="save" class="ott-button">Save</button>
      <button @click="toggleXml" class="ott-button" :class="{'bg-ott-accent text-white': showXml}">XML</button>
    </div>
    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 overflow-hidden">
        <WagonVisualization 
          v-if="deckPlans.length > 0" 
          :deckPlans="deckPlans" 
          :selectedElements="selectedElements"
          @select="handleSelect"
          @area-select="handleAreaSelect"
        />
      </div>
      <XmlViewer 
        v-if="showXml" 
        :xml="currentXml" 
        :selectedId="selectedElements[0]?.attr_id"
        class="w-1/3 border-l border-ott-bg-dark"
      />
    </div>
    <div class="flex flex-row h-[300px] border-t border-ott-bg-dark">
      <ObjectProperties 
        :element="selectedElements.length === 1 ? selectedElements[0] : null" 
        class="flex-1 overflow-y-auto" 
        @delete="handleDelete"
      />
      <ElementCatalog 
        class="w-[200px] border-l border-ott-bg-dark"
        @add-seat="handleAddSeat"
        @add-door="handleAddDoor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import WagonVisualization from './components/WagonVisualization.vue';
import ObjectProperties from './components/ObjectProperties.vue';
import ElementCatalog from './components/ElementCatalog.vue';
import XmlViewer from './components/XmlViewer.vue';
import { DeckPlan } from './types/deckPlan';
import { extractElementList, serializeElements } from './types/general';
import { PassengerSpot } from './types/passengerSpot';
import { PassengerEntrance } from './types/passengerEntrance';
import { Centroid } from './types/centroid';
import { PassengerSpace } from './types/passengerSpace';
import "@/assets/lib.css";

const file: Ref<File | null> = ref(null)
const deckPlans = ref<DeckPlan[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedElements = ref<any[]>([])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const netex = ref<any>(null)
const showXml = ref(false)
const currentXml = ref('')

const updateXml = () => {
  if (!showXml.value || !netex.value) return
  
  netex.value.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan = serializeElements(deckPlans.value)
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    textNodeName: 'text_value',
    attributeNamePrefix: "attr_",
    format: true
  });
  currentXml.value = builder.build(netex.value);
}

const toggleXml = () => {
  showXml.value = !showXml.value
  if (showXml.value) {
    updateXml()
  }
}

watch(deckPlans, () => {
    updateXml()
}, { deep: true })

const handleSelect = ({ element, ctrlKey }: { element: any, ctrlKey: boolean }) => {
  if (ctrlKey) {
    const index = selectedElements.value.indexOf(element)
    if (index > -1) {
      selectedElements.value.splice(index, 1)
    } else {
      if (selectedElements.value.length > 0) {
        const first = selectedElements.value[0]
        if (first.constructor !== element.constructor) {
          return
        }
      }
      selectedElements.value.push(element)
    }
  } else {
    selectedElements.value = [element]
  }
}

const handleAreaSelect = (elements: any[]) => {
  selectedElements.value = elements
}

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  file.value = target.files ? target.files[0] : null;
}

function load() {
  if (file.value) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      const parser = new XMLParser({
        ignoreAttributes: false,
        alwaysCreateTextNode: true,
        textNodeName: 'text_value',
        attributeNamePrefix: "attr_",
      });
      const delivery = parser.parse(event.target?.result);
      netex.value = delivery
      console.log(delivery)
      deckPlans.value = extractElementList(delivery.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan, DeckPlan)
      console.log(deckPlans.value)
    });
    reader.readAsText(file.value);
  }
}

function save() {
  if (file.value) {
    netex.value.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan = serializeElements(deckPlans.value)
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        textNodeName: 'text_value',
        attributeNamePrefix: "attr_",
      });

    const text = builder.build(netex.value);
    const blob = new Blob([text], { type: 'text/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Demo.xml';
    link.click();
  }
}

const getTargetDeck = () => {
  // If a deck is selected (or an element inside a deck), use that.
  // For now, just default to the first deck of the first deck plan.
  if (deckPlans.value.length > 0 && deckPlans.value[0]?.decks?.length > 0) {
    return deckPlans.value[0].decks![0]
  }
  return null
}

const handleAddSeat = () => {
  const deck = getTargetDeck()
  if (!deck) return

  // Find or create a PassengerSpace to add the seat to
  let passengerSpace = deck.deckspaces?.find(ds => ds instanceof PassengerSpace) as PassengerSpace
  if (!passengerSpace) {
      // If no passenger space exists, we might need to create one, but for now let's assume one exists or just log error
      console.warn("No PassengerSpace found to add seat to")
      return
  }

  const newSeat = new PassengerSpot({
      attr_id: `seat_${Date.now()}`,
      attr_version: '1',
      Label: { text_value: '' },
      Orientation: { text_value: 'forwards' },
      actualVehicleEquipments: [],
      SpotColumnRef: null,
      SpotRowRef: null,
      ByWindow: { text_value: false },
      ByAisle: { text_value: false },
      HasPower: { text_value: false },
      Centroid: { x: 1, y: 1 }, // Default position
      Width: { text_value: 0.5 },
      Length: { text_value: 0.5 }
  })
  
  if (!passengerSpace.passengerSpots) {
      passengerSpace.passengerSpots = []
  }
  passengerSpace.passengerSpots.push(newSeat)
}

const handleAddDoor = () => {
  const deck = getTargetDeck()
  if (!deck) return

  let passengerSpace = deck.deckspaces?.find(ds => ds instanceof PassengerSpace) as PassengerSpace
  if (!passengerSpace) {
      console.warn("No PassengerSpace found to add door to")
      return
  }

  const newDoor = new PassengerEntrance({
      attr_id: `door_${Date.now()}`,
      attr_version: '1',
      Name: { text_value: 'New Door' },
      Width: { text_value: 1.0 },
      VehicleSide: { text_value: 'leftSide' },
      SequenceFromFront: { text_value: 0 },
      DeckEntranceType: { text_value: 'external' },
      actualVehicleEquipments: { ActualVehicleEquipment: [] },
      Label: undefined,
      Height: undefined,
      PublicUse: undefined,
      HeightFromGround: undefined,
      IsEmergencyExit: undefined,
      HasDoor: undefined,
      IsAutomatic: undefined,
      Centroid: undefined
  })

  if (!passengerSpace.deckEntrances) {
      passengerSpace.deckEntrances = []
  }
  passengerSpace.deckEntrances.push(newDoor)
}

const handleDelete = (element: any) => {
    // Iterate through all deck plans, decks, and deckspaces to find and remove the element
    deckPlans.value.forEach(dp => {
        dp.decks.forEach(deck => {
            deck.deckspaces?.forEach(ds => {
                if (ds instanceof PassengerSpace) {
                    if (ds.passengerSpots) {
                        const index = ds.passengerSpots.indexOf(element)
                        if (index > -1) {
                            ds.passengerSpots.splice(index, 1)
                        }
                    }
                    if (ds.deckEntrances) {
                        const index = ds.deckEntrances.indexOf(element)
                        if (index > -1) {
                            ds.deckEntrances.splice(index, 1)
                        }
                    }
                }
            })
        })
    })
    selectedElements.value = []
}
</script>
