<template>
    <n-badge :value="collectionStore.collections.length" :max="15">
        <n-button text style="font-size: 28px;" @click="showCollection = !showCollection">
            <n-icon>
                <board28-filled />
            </n-icon>
        </n-button>
    </n-badge>
    <n-modal v-model:show="showCollection">
    <n-card style="max-width:90vw;max-height:90vh;overflow:auto">
        <collection-charts-vue></collection-charts-vue>

    </n-card>
        
    </n-modal>
</template>

<script setup>
import { Board28Filled } from "@vicons/fluent"
import { NButton, NIcon, NBadge, NModal,NCard } from "naive-ui";
import { CollectionStore } from "../store/CollectionStore";
import CollectionChartsVue from "./CollectionCharts.vue";
import { ref } from "vue";

const showCollection = ref(false)
const collectionStore = CollectionStore();

</script>