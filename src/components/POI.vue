<template>
    <div ref="chart"></div>
</template>
<script setup>
import ChartVl from "./Basic/ChartVL.vue";
import { POIStore } from "../store/POIStore";
import { computed, reactive, ref, watchEffect,onMounted, watch } from "vue";

import _ from "lodash";
import {newChart} from "./Basic/utils";

const poiStore = POIStore();
let vl = null;
const chart = ref(null);
const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "debug",
    "data": { "name": "table" },
    "mark": {
        "type": "bar"
    },
    "encoding": {
        "x": { "field": "col" },
        "y": { "field": "cnt", "type": "quantitative" }
        
    }
}

onMounted(async function () {
    vl = await newChart(chart.value,spec,{});
    
    vl.view.data("table", poiStore.column).run();
})

watch(()=>poiStore.column, async function (){
    console.log(poiStore.column)
    vl = await newChart(chart.value,spec,{});
    vl.view.data("table", poiStore.column).run();
},{deep:true})

</script>