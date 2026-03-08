<template>
  <button @click="downloadNeTEx" :disabled="!deckplan" class="ott-button">
    Download Deckplan file
    <Icon icon="material-symbols:download" />
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { XMLBuilder } from 'fast-xml-parser';
import { useEditorState } from '../store/editorstate';
import { storeToRefs } from 'pinia';

const { deckplan} = storeToRefs(useEditorState());

function downloadNeTEx() {{
    if (!deckplan) return

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      textNodeName: 'text_value',
      attributeNamePrefix: 'attr_',
    })

    const text = builder.build(deckplan)
    const blob = new Blob([text], { type: 'text/xml' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'Demo.xml'
    link.click()
}
}
</script>
