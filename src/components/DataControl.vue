<template>
    <div>
        <n-button v-for="column in datasetStore.columns" :key="column">{{column}}</n-button>
    </div>
</template>

<script setup>
import {DatasetStore} from '@/store/DatasetStore';
import { NButton } from 'naive-ui';

const datasetStore=DatasetStore();
</script>