<template>
  <div class="h-full flex flex-col max-h-screen overflow-hidden">
    <header class="flex justify-between p-4 bg-ott-bg-primary font-bold">
      <h1>NeTEx common public transport deckplan editor</h1>
      <DownloadButton />
    </header>
    <div class="flex-1 flex border-t-ott-bg-dark border-t overflow-hidden min-h-0">
      <!-- Workbench -->
      <div class="flex-1 flex flex-col min-w-0">
        <div class="bg-ott-bg-primary p-4 w-full flex justify-center">
          <div class="flex gap-4 p-1 px-2 border-ott-bg-dark bg-ott-bg-secondary border rounded-md w-fit font-medium">
            <button @click="() => selectedTab = 'build'" :class="`${selectedTab === 'build' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Build</button>
            <button @click="() => deckplan ? selectedTab = 'annotate' : {}" :class="`${!deckplan ? 'text-ott-text-secondary':''} ${selectedTab === 'annotate' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Annotate</button>
            <button @click="() => deckplan ? selectedTab = 'view' : {}" :class="`${!deckplan ? 'text-ott-text-secondary':''} ${selectedTab === 'view' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">View</button>
          </div>
        </div>
        <div class="flex-1 overflow-hidden h-full relative">
          <BuildPage v-if="selectedTab == 'build'" />
          <AnnotatePage v-if="selectedTab == 'annotate'" />
          <ViewPage v-if="selectedTab == 'view'" />
        </div>
      </div>
      <!-- Treeview -->
      <div>
        <div class="bg-ott-bg-primary h-21 p-4 w-full flex justify-center border-b border-ott-bg-secondary items-center">
          <div class="p-1 px-2 border-ott-bg-dark bg-ott-bg-secondary border rounded-md w-fit font-medium">
            <button @click="hierarchyShown = !hierarchyShown" :disabled="!deckplan" :class="`${hierarchyShown ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6 disabled:text-ott-bg-dark`"> <Icon icon="material-symbols:account-tree-outline-rounded" width="20" /></button>
          </div>
        </div>
        <DeckTreeview
          v-if="deckplan && hierarchyShown"
          :deckPlan="deckplan"
          :selectedId="selectedElementId"
          @select="(id) => {
            const deck = deckplan?.decks.find(d => d.attr_id === id);
            if (deck && deck.DeckLevelRef?.attr_ref) {
              store.selectDeckLevel(deck.DeckLevelRef.attr_ref);
            }
            store.selectElement(id);
          }"
        />
      </div>

      <div class="bg-ott-bg-dark w-0.5 cursor-col-resize" />
      <!-- Renderer -->
      <div class="min-w-96 flex flex-col">
        <div class="bg-ott-bg-primary p-4 w-full  flex justify-center">
          <div class="flex gap-4 p-1 px-2 border-ott-bg-dark bg-ott-bg-secondary border rounded-md w-fit font-medium">
            <button @click="() => selectedRenderer = 'grid'" :class="`${selectedRenderer === 'grid' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Grid</button>
            <button @click="() => selectedRenderer = 'exact'" :class="`${selectedRenderer === 'exact' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Exact</button>
          </div>
        </div>
        <div class="flex-1 flex items-center flex-col pt-4 min-h-0" v-if="selectedDeck">
          <DeckSelector />
          <div class="flex w-full max-w-full items-center h-full relative">
            <ZoomBar />
            <div class="overflow-hidden h-full max-h-full w-full">
              <div class="flex-1 overflow-y flex items-center justify-center">
                <DeckGridRenderer  :deck="selectedDeck" :scale="scale" v-if="selectedRenderer === 'grid'" />
                <DeckExactRenderer  class="flex-1" :selectedElementId="selectedElementId" :deck="selectedDeck" :scale="scale*5" v-if="selectedRenderer === 'exact'" />
              </div>
            </div>
            <button class="ott-button" @click="handleEditDeck">
              <Icon icon="material-symbols:edit-outline-rounded" />
            </button>
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
import AnnotatePage from './pages/AnnotatePage.vue';
import ViewPage from './pages/ViewPage.vue';
import DeckGridRenderer from '@/components/editor/DeckGridRenderer.vue';
import DeckSelector from './components/DeckSelector.vue';
import DeckExactRenderer from '@/components/editor/DeckExactRenderer.vue';
import { useEditorState } from './store/editorstate';
import { storeToRefs } from 'pinia';
import ZoomBar from './components/ZoomBar.vue';
import { Icon } from '@iconify/vue';
import DeckTreeview from '@/components/editor/DeckTreeview.vue';

const selectedTab: Ref<'build' | 'annotate' | 'view'> = ref('build')
const selectedRenderer: Ref<'grid' | 'exact'> = ref('grid')
const hierarchyShown = ref(false)

// State of the deckplan lives in the store!
const store = useEditorState()
const {deckplan, selectedDeck, selectedElementId, scale} = storeToRefs(store)

const handleEditDeck = () => {
  if (selectedDeck.value) {
    store.selectElement(selectedDeck.value.attr_id);
    selectedTab.value = 'annotate';
  }
};
</script>

