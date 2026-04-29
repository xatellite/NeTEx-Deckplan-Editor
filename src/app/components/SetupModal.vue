<template>
    <div v-if="!useEditorState().deckplan" class="flex flex-col gap-4 items-center w-150 bg-ott-bg-primary p-8 rounded-md">
      <h2>Deckplan Setup</h2>
      <button class="ott-button w-100" @click="initEmpty">Start from Scratch</button>
      <!-- <button class="ott-button w-100" @click="">Load Example</button> -->
      <button class="ott-button ott-button--accent w-100" @click="loadFromDisk">Load Deckplan File</button>
    </div>
</template>

<script lang="ts" setup>
import { DeckPlan } from '@/models/netex/deckplan/deckPlan';
import { parseDeckplanOrNetex, extractEquipments } from '@/helpers/parser';
import { useEditorState } from '../store/editorstate';

function initEmpty() {
  const store = useEditorState();
  store.setDeckplan([DeckPlan.empty(), undefined]);
  store.setEquipments([]);
}

function loadFromDisk() {
  const store = useEditorState();
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xml'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const [deckplan, wrapper] = parseDeckplanOrNetex(text)
        store.setDeckplan([deckplan, wrapper])
        if (wrapper) {
          const equipmentsObj = (wrapper as any).PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.equipments
          store.setEquipments(extractEquipments(equipmentsObj))
        }
      } catch (err) {
        alert('Failed to parse NeTEx file: ' + err)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

</script>
