<template>
    <n-card style="margin:1em" @click="onClick" :class="{
        selected: isSelected,
    }">
        <template #header>{{ '图表#' + view.id }}</template>
        <template #header-extra>
            <n-dropdown trigger="hover" :options="colorOptions" :render-icon="renderIcon"
            @select="onSelectColor"
            >
                <n-button text style="font-size: 24px;">
                    <n-icon :color="mark2color[view.task_mark]">
                        <tag24-filled />
                    </n-icon>
                </n-button>
            </n-dropdown>
        </template>
        <div ref="chartDiv" style="overflow:auto;width: 100%;"></div>
    </n-card>
</template>

<script setup>
import { onMounted, watch } from 'vue-demi';
import embed from 'vega-embed';
import { ref, h } from 'vue-demi';
import { defineProps, computed } from 'vue-demi';
import { NCard, NTag, NButton, NIcon, NDropdown } from 'naive-ui';
import { MVStore } from '@/store/MVStore';
import { Tag24Filled, Square20Filled } from "@vicons/fluent"
import { DatasetStore } from '../store/DatasetStore';
import { ControlStore } from '../store/ControlStore';

const datasetStore = DatasetStore();
const controlStore = ControlStore();

const props = defineProps({
    view: Object,
    viewId: Number,
})

const mark2color={
    0:"#4c78a8",
    1:"#f58518",
    2:"#e45756",
    3:"#72b7b2",
    4:"#54a24b",
    5:"#eeca3b",
}

const mvStore = MVStore();

const chartDiv = ref(null);

function refreshChart() {
    embed(chartDiv.value, vega_lite.value, { actions: false });
}

onMounted(() => {
    refreshChart();
});


const vega_lite= computed(() => {
    if(props.view==null||props.view.compileToVegaLite==null) return "";
    return props.view.compileToVegaLite(datasetStore.dataset);
});

watch(vega_lite, () => {
    refreshChart();
}, { deep: true });

function onClick(e) {
    controlStore.currentViewId=props.viewId;
    e.stopPropagation();
}

const isSelected = computed(() => {
    return controlStore.currentViewId == props.viewId;
});

function onSelectColor(key){
    mvStore.views[controlStore.currentViewId].task_mark=key;
}

function renderIcon(opt){
    if(opt.key==null) return null;
    return h(NIcon,{color:mark2color[opt.key]},{default:()=>h(Tag24Filled)})
}


const colorOptions = [
    {
        label: "不分组",
        key: null
    },
    {
        label: "Group 0",
        key: 0,
    },
    {
        label: "Group 1",
        key: 1,
    },
    {
        label: "Group 2",
        key: 2,
    },
    {
        label: "Group 3",
        key: 3,
    },
    {
        label: "Group 4",
        key: 4,
    },
    {
        label: "Group 5",
        key: 5,
    },
]

</script>

<style scoped>
.selected {
    box-shadow: 0px 0px 10px steelblue;
}
</style>