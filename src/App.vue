<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <div style="padding: 10px; border-bottom: 1px solid #ccc;">
      <button @click="load">Load</button>
      <button @click="save">Save</button>
      <input ref="inputRef" type="file" multiple @change="onChange" accept="text/xml"/>
    </div>
    <div style="flex: 1; overflow: hidden;">
      <WagonVisualization 
        v-if="deckPlans.length > 0" 
        :deckPlans="deckPlans" 
        :selectedElement="selectedElement"
        @select="(element) => selectedElement = element"
      />
    </div>
    <ObjectProperties :element="selectedElement" style="height: 300px; overflow-y: auto;" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import WagonVisualization from './components/WagonVisualization.vue';
import ObjectProperties from './components/ObjectProperties.vue';
import { DeckPlan } from './types/deckPlan';
import { extractElementList, serializeElements } from './types/general';

const file: Ref<File | null> = ref(null)
const deckPlans = ref<DeckPlan[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedElement = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const netex = ref<any>(null)

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
      deckPlans.value = extractElementList(delivery.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan, DeckPlan)
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
