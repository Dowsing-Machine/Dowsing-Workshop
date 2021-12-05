<template>
    <n-space>
        <n-card v-for="collection in collectionStore.collections">
            <chart-raw :vegalite="collection"></chart-raw>
        </n-card>
    </n-space>
</template>

<script setup>
import { NSpace,NCard } from 'naive-ui';
import ChartRaw from './ChartRaw.vue';
import { CollectionStore } from '../store/CollectionStore';
const collectionStore = CollectionStore();
</script>