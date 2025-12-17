<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-b-ott-secondary flex gap-2 items-center bg-ott-bg-primary">
      <input ref="inputRef" class="ott-button" type="file" multiple @change="onChange" accept="text/xml"/>
      <button @click="load" class="ott-button">Load</button>
      <button @click="save" class="ott-button">Save</button>
    </div>
    <div style="flex: 1; overflow: hidden;">
      <WagonVisualization 
        v-if="deckPlans.length > 0" 
        :deckPlans="deckPlans" 
        :selectedElements="selectedElements"
        @select="handleSelect"
        @area-select="handleAreaSelect"
      />
    </div>
    <ObjectProperties :element="selectedElements.length === 1 ? selectedElements[0] : null" style="height: 300px; overflow-y: auto;" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import WagonVisualization from './components/WagonVisualization.vue';
import ObjectProperties from './components/ObjectProperties.vue';
import { DeckPlan } from './types/deckPlan';
import { extractElementList, serializeElements } from './types/general';
import "@/assets/lib.css";

const file: Ref<File | null> = ref(null)
const deckPlans = ref<DeckPlan[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedElements = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const netex = ref<any>(null)

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
</script>
