<template>
    <div style="padding:12px 24px">
        <n-h3>数据字段</n-h3>
        <div style="display:flex;flex-direction:column">
            <n-button v-for="column in datasetStore.columns" :key="column">{{ column }}</n-button>
        </div>
    </div>
</template>

<script setup>
import { DatasetStore } from '@/store/DatasetStore';
import { NButton, NH3 } from 'naive-ui';

const datasetStore = DatasetStore();
</script>