<template>
    <n-button text style="font-size: 28px;" @click="showDatasetDialog = true">
        <n-icon color="#b2caec">
            <database24-filled></database24-filled>
        </n-icon>
    </n-button>
    <n-modal
        :show="showDatasetDialog || !datasetReady"
        @update-show="showDatasetDialog = $event"
        :mask-closable="datasetReady"
    >
        <n-card class="max-w-1000px min-w-300px">
            <div class="text-lg font-bold mb-4">DATASETS</div>
            <!-- <n-space>
                <n-space vertical>
                    <n-h3>组号</n-h3>
                    <n-input v-model:value="controlStore.groupId"></n-input>
                </n-space>
                <n-space vertical>
                    <n-h3>编号</n-h3>
                    <n-input v-model:value="controlStore.Id"></n-input>
                </n-space>
            </n-space>-->
            <n-space>
                <n-button @click="loadDataset('/datasets/weather.json')">Weather</n-button>
                <n-button @click="loadDataset('/datasets/penguins.json')">Penguins</n-button>
                <n-button @click="loadDataset('/datasets/cars_copy.json')">Cars</n-button>
                <n-button @click="loadDataset('/datasets/birdstrikes-lite.json')">Birdstrikes</n-button>
                <n-button @click="loadDataset('/datasets/gapminder-lite.json')">Gapminder</n-button>
                <n-upload>
                    <n-button>Upload File</n-button>
                </n-upload>
            </n-space>
            <n-data-table
                :data="datasetStore.dataset"
                :columns="columns"
                class="mt-2 max-h-300px overflow-auto"
                virtual-scroll
                :max-height="200"
                size="small"
            >
                <template #empty>
                    <n-empty description="No Data"></n-empty>
                </template>
            </n-data-table>
            <!-- <n-h3>演示数据集</n-h3>
            <n-space>
                <n-button @click="loadDataset('/datasets/weather.json')">Weather</n-button>
            </n-space>
            <n-divider></n-divider>
            <n-h3>讨论数据集</n-h3>
            <n-space>
                <n-button @click="loadDataset('/datasets/penguins.json')">Penguins</n-button>
            </n-space>
            <n-divider></n-divider>
            <n-h3>操作数据集</n-h3>
            <n-space>
                <n-button @click="loadDataset('/datasets/cars_copy.json')">Cars</n-button>
                <n-button
                    style="display: none;"
                    @click="loadDataset('/datasets/birdstrikes-lite.json')"
                >Birdstrikes</n-button>
                <n-button @click="loadDataset('/datasets/gapminder-lite.json')">Gapminder</n-button>
            </n-space>-->
        </n-card>
    </n-modal>
</template>

<script setup>
import { NButton, NIcon, NModal, NCard, NSpace, NH3, NDivider, NInput, useMessage, NDataTable, NEmpty, NUpload } from "naive-ui";
import { Database24Filled } from "@vicons/fluent"
import { ref, getCurrentInstance, computed } from "vue";

import { DatasetStore } from "../store/DatasetStore";
import { ControlStore } from "../store/ControlStore";
import { CollectionStore } from "../store/CollectionStore";
import _ from "lodash";
// import {computed} from "vue";


const datasetStore = DatasetStore();
const controlStore = ControlStore();
const collectionStore = CollectionStore();

const datasetReady = computed(() => {
    return datasetStore.dataset.length > 0;
})

const showDatasetDialog = ref(false);
const { proxy } = getCurrentInstance();
const message = useMessage()

async function loadDataset(url) {
    proxy.$EventBus.emit(
        `user:dataset:load:${url}`,
        {
            url
        }
    );
    try {
        await datasetStore.loadDataset(url);
        showDatasetDialog.value = false;
        collectionStore.$reset();
        message.success(`成功加载数据集${datasetStore.name}`);
    } catch (error) {
        message.error("可能是网络开小差了~");
    }

}

const columns = computed(() => {
    return datasetStore.columns.map(i => ({
        // title:_.truncate(i.name,{
        //     length:5
        // }),
        title: i.name,
        key: i.name,
        sorter: 'default',
        ellipsis: {
            tooltip: true
        },
    }))
})

</script>