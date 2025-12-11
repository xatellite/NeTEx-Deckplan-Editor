<template>
    <div>
         <v-stage
            ref="stage"
            :config="stageSize"
            @dragstart="handleDragstart"
            @dragend="handleDragend"
        >
            <v-layer ref="layer">
            <!-- <v-star
                v-for="item in list"
                :key="item.id"
                :config="{
                x: item.x,
                y: item.y,
                rotation: item.rotation,
                id: item.id,
                numPoints: 5,
                innerRadius: 30,
                outerRadius: 50,
                fill: '#89b717',
                opacity: 0.8,
                draggable: true,
                scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
                scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: dragItemId === item.id ? 15 : 5,
                shadowOffsetY: dragItemId === item.id ? 15 : 5,
                shadowOpacity: 0.6
                }"
            /> -->
            </v-layer>
        </v-stage>
        <button>Test</button>
    </div>
</template>

<script lang="ts" setup>
// Waiting for https://github.com/konvajs/vue-konva/pull/266
// import {
//   Stage,
//   Layer,
// } from 'vue-konva';
import convert from 'xml-js';
import { ref, onMounted, type Ref } from 'vue';


const deckPlan: Ref<object> = ref();

function loadDeckPlan(xml: string) {
  deckPlan.value = convert.xml2json(xml, {compact: true, spaces: 4});
}

defineExpose(
  loadDeckPlan
)
</script>