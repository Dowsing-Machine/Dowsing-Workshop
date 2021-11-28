<template>
    <n-grid x-gap="12" y-gap="8" cols="4">
        <n-grid-item v-for="view,i in views" :key="i" style="max-height: 300px;overflow: auto;">
            <single-view :view="view"></single-view>
        </n-grid-item>
    </n-grid>
</template>

<script setup>
import { MVStore } from '@/store/MVStore';
import SingleView from '@/components/SingleView.vue';
import hljs from 'highlight.js/lib/core'
import { NGrid, NGridItem } from "naive-ui"
const views = MVStore().views;

</script>