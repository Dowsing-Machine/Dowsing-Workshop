<template>
    <n-button text style="font-size: 28px;" @click="showDatasetDialog=true">
        <n-icon>
            <database24-filled></database24-filled>
        </n-icon>
    </n-button>
    <n-modal
        :show="showDatasetDialog||!datasetReady"
        :mask-closable="false"
    >
        <n-card style="max-width: 40vw;">
            <n-h3>演示数据集</n-h3>
            <n-space>
                <n-button 
                    @click="loadDataset('/datasets/weather.json')"
                >
                    Weather
                </n-button>
            </n-space>
            <n-divider></n-divider>
            <n-h3>讨论数据集</n-h3>
            <n-space>
                <n-button 
                    @click="loadDataset('/datasets/penguins.json')"
                >
                    Penguins
                </n-button>
                <n-button
                    @click="loadDataset('/datasets/gapminder-lite.json')"
                >
                    Gapminder
                </n-button>
            </n-space>
            <n-divider></n-divider>
            <n-h3>操作数据集</n-h3>
            <n-space>
                <n-button
                    @click="loadDataset('/datasets/cars.json')"
                >
                    Cars
                </n-button>
                <n-button
                    @click="loadDataset('/datasets/birdstrikes-lite.json')"
                >
                    Birdstrikes
                </n-button>
            </n-space>
        </n-card>
    </n-modal>
</template>

<script setup>
import {NButton,NIcon,NModal,NCard,NSpace,NH3,NDivider} from "naive-ui";
import {Database24Filled} from "@vicons/fluent"
import {ref,getCurrentInstance,computed} from "vue";

import { DatasetStore } from "../store/DatasetStore";

const datasetStore = DatasetStore();

const datasetReady = computed(()=>{
    return datasetStore.dataset.length>0;
})

const showDatasetDialog=ref(false);
const {proxy}=getCurrentInstance();

async function loadDataset(url){
    proxy.$EventBus.emit(`user:dataset:load:${url}`);
    await datasetStore.loadDataset(url);
    showDatasetDialog.value=false;
}
</script>