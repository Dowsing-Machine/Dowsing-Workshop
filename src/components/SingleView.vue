<template>
    <n-card
        style="margin:1em"
        @click="onClick"
        :class="{
            selected: isSelected,
        }"
    >
        <template #header>{{ '图表#' + view.id }}</template>
        <template #header-extra>
            <n-dropdown
                trigger="hover"
                :options="colorOptions"
                :render-icon="renderIcon"
                @select="onSelectColor"
            >
                <n-button text class="header_button">
                    <n-icon :color="mark2color[view.task_mark]">
                        <tag24-filled />
                    </n-icon>
                </n-button>
            </n-dropdown>
            <n-button text class="header_button" @click="onFullScreen">
                <n-icon>
                    <zoom-in24-regular />
                </n-icon>
            </n-button>
        </template>
        <chart :view="view"></chart>
    </n-card>
</template>

<script setup>
import { onMounted, watch } from 'vue-demi';
import embed from 'vega-embed';
import { ref, h } from 'vue-demi';
import { defineProps, defineEmits, computed } from 'vue-demi';
import { NCard, NTag, NButton, NIcon, NDropdown } from 'naive-ui';
import { MVStore } from '@/store/MVStore';
import { Tag24Filled, Square20Filled, FullScreenMaximize24Filled,ZoomIn24Regular } from "@vicons/fluent"
import { DatasetStore } from '../store/DatasetStore';
import { ControlStore } from '../store/ControlStore';

import Chart from "./Chart.vue"

const datasetStore = DatasetStore();
const controlStore = ControlStore();

const props = defineProps({
    view: Object,
})

const emit = defineEmits([
    "fullscreen"
])

const mark2color = {
    0: "#4c78a8",
    1: "#f58518",
    2: "#e45756",
    3: "#72b7b2",
    4: "#54a24b",
    5: "#eeca3b",
}

const mvStore = MVStore();

function onClick(e) {
    controlStore.currentViewId = props.view.id;
    e.stopPropagation();
}

const isSelected = computed(() => {
    return controlStore.currentViewId == props.view.id;
});

function onSelectColor(key) {
    props.view.task_mark = key;
}

function renderIcon(opt) {
    if (opt.key == null) return null;
    return h(NIcon, { color: mark2color[opt.key] }, { default: () => h(Tag24Filled) })
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

function onFullScreen(e) {
    emit("fullscreen");
    e.stopPropagation();
}

</script>

<style scoped>
.selected {
    box-shadow: 0px 0px 10px steelblue;
}

.header_button {
    margin: 0 5px;
    font-size: 24px;
}
</style>