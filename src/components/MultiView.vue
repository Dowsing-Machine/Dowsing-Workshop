<template>
    <n-modal v-model:show="showFullscreen">
        <n-card style="width:90vw; height:90vh;overflow:auto">
            <chart :view="FSView" :renderOption="{ width: 'container',height:null}"></chart>
        </n-card>
    </n-modal>

    <n-grid x-gap="12" y-gap="8" cols="3 1000:4">
        <n-grid-item v-for="view,i in views" :key="view.id">
            <single-view :view="view" @fullscreen="onFullscreen(view)"></single-view>
        </n-grid-item>
    </n-grid>
</template>

<script setup>
import { MVStore } from '@/store/MVStore';
import SingleView from '@/components/SingleView.vue';
import Chart from '@/components/Chart.vue';
import hljs from 'highlight.js/lib/core'
import { computed, watch, ref, h } from 'vue-demi';
import { NGrid, NGridItem, useDialog, NModal, NCard } from "naive-ui"


const mvStore = new MVStore();

const views = computed(() => mvStore.views);

const showFullscreen = ref(false);
const FSView = ref(null);

function onFullscreen(view) {
    showFullscreen.value = true;
    FSView.value = view;
}

const dialog = useDialog();


</script>