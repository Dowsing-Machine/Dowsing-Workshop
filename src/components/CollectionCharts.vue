<template>
    <grid-layout
        :layout="SpecWithChart"
        :col-num="12"
        :row-height="150"
        :is-draggable="true"
        @layout-ready="onReady"
        @update:layout="onLayoutChange"
    >
        <grid-item
            v-for="(layout,idx) in SpecWithChart"
            :key="layout.i"
            :x="layout.x"
            :y="layout.y"
            :w="layout.w"
            :h="layout.h"
            :i="layout.i"
            @resized="onResize(idx,$event)"
        >
            <n-card style="height: 100%;width: 100%;">
                <template #header>图表#{{ layout.i }}</template>
                <template #header-extra>
                    <n-space>
                        <n-popover trigger="click">
                            <template #trigger>
                                <n-button text class="header_button">
                                    <n-icon>
                                        <comment-note24-regular />
                                    </n-icon>
                                </n-button>
                            </template>
                            <n-input
                                type="textarea"
                                :value="layout.note"
                                @update:value="addNote(layout.spec, $event)"
                            ></n-input>
                        </n-popover>
                        <n-button text class="header_button" @click="removeCollection(layout.spec)">
                            <n-icon>
                                <star12-filled />
                            </n-icon>
                        </n-button>
                    </n-space>
                </template>
                <chart-raw
                    :vegalite="layout.spec"
                    :render-option="{
                        width: 'container', height: 'container',
                        autosize: {
                            type: 'fit',
                            contains: 'padding'
                        },
                        resize: true
                    }"
                    :ref="el => { if (el) charts[idx] = el }"
                    style="width:100%;height:100%"
                ></chart-raw>
            </n-card>
        </grid-item>
    </grid-layout>
</template>

<script setup>
import { NSpace, NCard, NScrollbar, NButton, NIcon, NPopover, NInput } from 'naive-ui';
import ChartRaw from './ChartRaw.vue';
import { CollectionStore } from '../store/CollectionStore';

import { computed, toRaw, ref,getCurrentInstance } from "vue-demi";
import { onBeforeUpdate } from "vue";
import _ from "lodash";

import { Star12Filled, CommentNote24Regular } from '@vicons/fluent';
import { rowProps } from 'naive-ui/lib/legacy-grid/src/Row';

const collectionStore = CollectionStore();
const { proxy } = getCurrentInstance();


const SpecWithChart = computed(() => {
    return collectionStore.collections.map(collection => {
        const strSpec = JSON.stringify(collection)
        const id = collectionStore.specIds[strSpec];
        return {
            spec: collection,
            note: collectionStore.notes[strSpec],
            ...collectionStore.layouts.find(i => i.i === id),
        }
    })
})

const charts = ref([]);

onBeforeUpdate(function () {
    charts.value = [];
})

function onResize(idx,event) {
    const {newH,newW,i} = event;
    const layout=collectionStore.layouts.find(i => i.i === i);
    rowProps.$EventBus.emit(`user:layout:resize:${idx}`,{
        block_val:event
    })
    if(layout){
        layout.h = newH;
        layout.w = newW;
    }
    // updateLayout();
    charts.value[idx].resize();
}

function onReady() {
    for (let chart of charts.value) {
        chart.refreshChart();
    }
}

function updateLayout(value) {
    proxy.$EventBus.emit("user:layout:update",{
        layout:value
    });
    collectionStore.layouts = value.map(i => ({
        i: i.i,
        x: i.x,
        y: i.y,
        w: i.w,
        h: i.h
    }));
}

const onLayoutChange = _.debounce(updateLayout, 500);

// const noteValue = computed(() => {
//   if(collectionStore.notes[JSON.stringify(props.vegalite)] != null){
//     return collectionStore.notes[JSON.stringify(props.vegalite)]
//   }
//   else{
//     return ''
//   }
// })

function addNote(spec, noteValue) {
    const strSpec = JSON.stringify(spec);
    collectionStore.addNote(strSpec, noteValue);
}

function removeCollection(spec) {
    collectionStore.remove(spec);
}
</script>