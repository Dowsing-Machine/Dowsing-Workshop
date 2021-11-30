<template>
    <n-grid x-gap="12" y-gap="8" cols="3 1000:4">
        <n-grid-item v-for="view,i in views" :key="view.id">
            <single-view :view="view" :viewId="view.id"></single-view>
        </n-grid-item>
    </n-grid>
</template>

<script setup>
import { MVStore } from '@/store/MVStore';
import SingleView from '@/components/SingleView.vue';
import hljs from 'highlight.js/lib/core'
import { computed,watch } from 'vue-demi';
import { NGrid, NGridItem } from "naive-ui"

const mvStore = new MVStore();

const views = computed(()=>mvStore.views);

</script>