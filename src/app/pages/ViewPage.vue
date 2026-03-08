<template>
  <div class="flex-1 flex flex-col bg-ott-bg-secondary relative text-ott-text-primary min-h-0 overflow-hidden  h-full">
    <SetupModal v-if="!deckplan" />
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-hidden">
        <XmlViewer :xml="xmlContent" :selectedId="selectedElementId" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { XMLBuilder } from 'fast-xml-parser';
import SetupModal from '../components/SetupModal.vue';
import XmlViewer from '../../components/editor/XmlViewer.vue';
import { useEditorState } from '../store/editorstate';

const store = useEditorState();
const { deckplan, selectedElementId } = storeToRefs(store);

const builder = new XMLBuilder({
  ignoreAttributes: false,
  textNodeName: 'text_value',
  attributeNamePrefix: 'attr_',
  format: true,
  indentBy: '  ',
});

const xmlContent = computed(() => {
  if (!deckplan.value) return '';
  return builder.build({
    DeckPlan: deckplan.value.toXML()
  });
});
</script>
