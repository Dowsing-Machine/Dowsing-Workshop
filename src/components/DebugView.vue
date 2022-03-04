<template>
    <div ref="chartDiv1" style="overflow:auto;height: 400px;width: 400px;"></div>
    <div ref="chartDiv2" style="overflow:auto;height: 400px;width: 400px;"></div>
    <div ref="chartDiv3" style="overflow:auto;height: 400px;width: 400px;"></div>
    <div ref="chartDiv4" style="overflow:auto;height: 400px;width: 400px;"></div>
    <div ref="chartDiv5" style="overflow:auto;height: 400px;width: 400px;"></div>
    <div ref="chartDiv6" style="overflow:auto;height: 400px;width: 400px;"></div>
    <!-- <chart-raw-vue :vegalite="vl" v-if="show"></chart-raw-vue> -->
</template>

<script setup>
import ChartRawVue from './ChartRaw.vue';
import { DebugStore } from '../store/DebugStore';
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import embed from 'vega-embed';
import { vegaLite, vega } from 'vega-embed';

const debugStore = DebugStore();
const chartDiv1 = ref(null);
const chartDiv2 = ref(null);
const chartDiv3 = ref(null);
const chartDiv4 = ref(null);
const chartDiv5 = ref(null);
const chartDiv6 = ref(null);

const chartDivs=[
    chartDiv1,
    chartDiv2,
    chartDiv3,
    chartDiv4,
    chartDiv5,
    chartDiv6,
];

const data = ref([]);
const show = ref(true);
const vl = computed(() => {
    console.log("debug", data.value);
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "debug",
        "data": { "name": "table" },
        "mark": {
            "type": "line",
            "point": true
        },
        "encoding": {
            "x": { "field": "i","sort": "descending" },
            "y": { "field": "score","type":"quantitative" },
            "color": { "field": "type", "type": "nominal","legend":{
                "values":['数据转换','关联','关联（趋势）','对比','确认值','聚类/异常']
            } }
        }
    }
})
async function refresh(d) {
    for (let item of d) {
        view.value.insert("table", item);
    }
    view.value.run();
}


// watch(data, async function () {
//     refresh(data.value)
// })
debugStore.$subscribe((mutation, state) => {
    // data.value = state.predicts;
    // for (let item of state.newItems) {
    //     for(let i=0;i<item.score.length;i++){
    //         views[i].insert("table", {
    //             "score": item.score[i],
    //             "type": item.type,
    //             "i": item.i,
    //         }).run();
    //     }
    //     // view.value.insert("table", item).run();
    // }
    // state.newItems = [];
    views[0].data("table",state.predicts.map(i=>({
        ...i,
        score:i.score[0]
    }))).run();

})

const view = ref(null);
const views=[];
onMounted(async function () {
    for (let i = 0; i < chartDivs.length; i++) {
        let res = await embed(chartDivs[i].value, vl.value);
        views.push(res.view);
    }


    // const res = await embed(chartDiv.value, vl.value);
    // view.value = res.view;
})

</script>