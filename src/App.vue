<template>
  <main>
    <div>
      <input ref="inputRef" type="file" multiple @change="onChange"  accept="text/xml"/>
      <button @click="load">Load</button>
      <button @click="save">Save</button> 
    </div>
    <WagonVisualization v-if="deckPlan" :deckPlan="deckPlan" />
  </main>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import {XMLBuilder, XMLParser} from 'fast-xml-parser';
import { DeckPlan } from './types/deckPlan';
import WagonVisualization from './components/WagonVisualization.vue';
import { extractElementList } from './types/general';

const file: Ref<File | null> = ref(null)

const deckPlan: Ref<DeckPlan | null> = ref(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const netex: Ref<null | any> = ref(null)

const onChange = (e: InputEvent) => {
  file.value = (e.target as HTMLInputElement).files != null ? (e.target as HTMLInputElement).files[0] ?? null : null
}
function load() {
  if (file.value) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "attr_",
      });
      const delivery = parser.parse(event.target?.result);
      netex.value = delivery
      deckPlan.value = extractElementList(delivery.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan, DeckPlan)[0] ?? null
    });
    reader.readAsText(file.value);
    
  }
}


function save() {
  if (file.value) {
    netex.value.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan = deckPlan.value?.toXML()
      const builder = new XMLBuilder({
        ignoreAttributes: false,
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
