<template>
  <main>
    <StandaloneHeader />
    <DeckPlanEditor />
    <SetupModal />
  </main>
</template>

<script setup lang="ts">
import {DeckPlanEditor} from 'netex-deckplans-components';
import SetupModal from './components/business/SetupModal.vue';
import StandaloneHeader from './components/business/StandaloneHeader.vue';
</script>
