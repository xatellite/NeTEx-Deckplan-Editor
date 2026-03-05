<template>
  <div class="h-full flex flex-col h-max-screen overflow-hidden">
    <header class="flex justify-between p-4 bg-ott-bg-primary font-bold">
      <h1>NeTEx common public transport deckplan editor</h1>
      <DownloadButton />
    </header>
    <div class="flex-1 flex border-t-ott-bg-dark border-t h-full">
      <!-- Workbench -->
      <div class="w-full flex flex-col">
        <div class="bg-ott-bg-primary p-4 w-full flex justify-center">
          <div class="flex gap-4 p-1 px-2 border-ott-bg-dark bg-ott-bg-secondary border rounded-md w-fit font-medium">
            <button @click="() => selectedTab = 'build'" :class="`${selectedTab === 'build' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Build</button>
            <button @click="() => deckplan ? selectedTab = 'annotate' : {}" :class="`${!deckplan ? 'text-ott-text-secondary':''} ${selectedTab === 'annotate' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Annotate</button>
            <button @click="() => deckplan ? selectedTab = 'view' : {}" :class="`${!deckplan ? 'text-ott-text-secondary':''} ${selectedTab === 'view' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">View</button>
          </div>
        </div>
        <div class="flex-1">
          <BuildPage v-if="selectedTab == 'build'" />
          <AnnotatePage />
          <ViewPage />
        </div>
      </div>
      <!-- Treeview? -->
      <div class="bg-ott-bg-dark w-0.5 cursor-col-resize" />
      <!-- Renderer -->
      <div class="min-w-96 h-full">
        <div class="bg-ott-bg-primary p-4 w-full  flex justify-center">
          <div class="flex gap-4 p-1 px-2 border-ott-bg-dark bg-ott-bg-secondary border rounded-md w-fit font-medium">
            <button @click="() => selectedRenderer = 'grid'" :class="`${selectedRenderer === 'grid' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Grid</button>
            <button @click="() => selectedRenderer = 'exact'" :class="`${selectedRenderer === 'exact' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Exact</button>
          </div>
        </div>
        <div class="flex items-center h-full flex-col pt-4 " v-if="selectedDeck">
          <DeckSelector />
          <div class="flex w-full max-w-full items-center h-full relative">
            <ZoomBar />
            <div class="flex-1 h-full max-h-full overflow-y flex items-center justify-center">
              <DeckGridRenderer  :deck="selectedDeck" :scale="scale" v-if="selectedRenderer === 'grid'" />
              <DeckExactRenderer  class="flex-1" :selectedElementId="selectedElementId" :deck="selectedDeck" :scale="scale" v-if="selectedRenderer === 'exact'" />
            </div>
            <button class="ott-button"><Icon icon="material-symbols:edit-outline-rounded" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import '@/assets/lib.css'
import { ref, type Ref } from 'vue';
import DownloadButton from './components/DownloadButton.vue';
import BuildPage from './pages/BuildPage.vue';
import DeckGridRenderer from '@/components/editor/DeckGridRenderer.vue';
import DeckSelector from './components/DeckSelector.vue';
import DeckExactRenderer from '@/components/editor/DeckExactRenderer.vue';
import { useEditorState } from './store/editorstate';
import { storeToRefs } from 'pinia';
import ZoomBar from './components/ZoomBar.vue';
import { Icon } from '@iconify/vue';

const selectedTab: Ref<'build' | 'annotate' | 'view'> = ref('build')
const selectedRenderer: Ref<'grid' | 'exact'> = ref('grid')

// State of the deckplan lives in the store!
const {deckplan, selectedDeck, selectedElementId, scale} = storeToRefs(useEditorState())
</script>

