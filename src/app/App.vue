<template>
  <div class="h-full flex flex-col max-h-screen overflow-hidden">
    <header class="flex justify-between p-4 bg-ott-bg-primary font-bold">
      <h1>NeTEx common public transport deckplan editor</h1>
      <DownloadButton />
    </header>
    <div class="flex-1 flex border-t-ott-bg-dark border-t min-h-0">
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

      <div class="bg-ott-bg-dark w-0.5 cursor-col-resize" />
      <!-- Renderer -->
      <div class="min-w-96 flex flex-col min-h-0">
        <div class="bg-ott-bg-primary p-4 w-full flex justify-center border-b border-ott-bg-secondary h-21 flex-shrink-0 items-center">
          <div class="flex gap-4 p-1 px-2 border-ott-bg-dark bg-ott-bg-secondary border rounded-md w-fit font-medium">
            <button @click="() => selectedRenderer = 'grid'" :class="`${selectedRenderer === 'grid' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Grid</button>
            <button @click="() => selectedRenderer = 'exact'" :class="`${selectedRenderer === 'exact' ? 'bg-ott-bg-primary ':''} rounded-md p-2 px-6`">Exact</button>
          </div>
        </div>
        <div class="flex-1 flex flex-col min-h-0 overflow-hidden" v-if="selectedDeck">
          <div class="p-4 pb-0 shrink-0 flex justify-center">
            <DeckSelector />
          </div>
          <div class="flex-1 flex w-full max-w-full items-center min-h-0 relative overflow-hidden">
            <div class="h-full flex items-center justify-center shrink-0">
              <ZoomBar />
            </div>
            <div class="flex-1 h-full min-h-0 overflow-auto relative bg-ott-bg-secondary/10">
              <div class="flex flex-col min-h-full min-w-full items-center justify-start p-8">
                <DeckGridRenderer @editGrid="handleEditDeck" :deck="selectedDeck" :scale="scale" v-if="selectedRenderer === 'grid'" />
                <DeckExactRenderer class="w-full" :selectedElements="selectedElement ? [selectedElement] : []" :deck="selectedDeck" :scale="scale*5" v-if="selectedRenderer === 'exact'" />
              </div>
            </div>
          </div>
          <div class="shrink-0 border-t border-ott-bg-secondary py-2 flex justify-center " v-if="selectedRenderer === 'grid'">
             <DeckGridElementStorage :deck="selectedDeck" />
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
import DeckGridElementStorage from './components/DeckGridElementStorage.vue';

const selectedTab: Ref<'build' | 'annotate' | 'view'> = ref('build')
const selectedRenderer: Ref<'grid' | 'exact'> = ref('grid')
const hierarchyShown = ref(false)

// State of the deckplan lives in the store!
const store = useEditorState()
const {deckplan, selectedDeck, selectedElementId, selectedElement, scale} = storeToRefs(store)

const handleEditDeck = () => {
  if (selectedDeck.value) {
    store.selectElement(selectedDeck.value.attr_id);
    selectedTab.value = 'annotate';
  }
};
</script>

