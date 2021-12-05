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
            @resized="onResize(idx)"
        >
        <n-card style="height: 100%;width: 100%;">
            <chart-raw
                :vegalite="layout.spec"
                :render-option="{
                    width: 'container', height: 'container',
                    autosize: {
                        type: 'fit',
                        contains: 'padding'
                    },
                    resize:true
                    // contains:'padding',
                    // config:{
                    //     padding:20
                    // }
                }"
                :ref="el => { if (el) charts[idx] = el }"
                style="width:100%;height:100%"
            ></chart-raw>
        </n-card>
        </grid-item>
    </grid-layout>
</template>

<script setup>
import { NSpace, NCard,NScrollbar } from 'naive-ui';
import ChartRaw from './ChartRaw.vue';
import { CollectionStore } from '../store/CollectionStore';

import { computed, toRaw, ref } from "vue-demi";
import { onBeforeUpdate } from "vue";
import _ from "lodash";

const collectionStore = CollectionStore();

const SpecWithChart = computed(() => {
    return collectionStore.collections.map(collection => {
        const id = collectionStore.specIds[JSON.stringify(collection)];
        return {
            spec: collection,
            ...collectionStore.layouts.find(i => i.i === id),
        }
    })
})

const charts = ref([]);

onBeforeUpdate(function () {
    charts.value = [];
})

function onResize(idx) {

    charts.value[idx].resize();
}

function onReady(){
    for(let chart of charts.value){
        chart.refreshChart();
    }
}

function updateLayout(value){
    collectionStore.layouts = value.map(i => ({
        i: i.i,
        x: i.x,
        y: i.y,
        w: i.w,
        h: i.h
    }));
}

const onLayoutChange=_.debounce(updateLayout,500);
</script>