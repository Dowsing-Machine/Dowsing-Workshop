<template>
    <chart-vl :spec="spec" :data="predicts" field="table"></chart-vl>
</template>

<script setup>
import ChartVl from "../Basic/ChartVL.vue";
import { DebugStore } from '@/store/DebugStore';
import { computed, reactive, ref, watchEffect,watch } from "vue";
const debugStore = DebugStore();
const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "debug",
    "data": { "name": "table" },
    "mark": {
        "type": "line",
        "point": true
    },
    "encoding": {
        "x": { "field": "i", "sort": "descending" },
        "y": { "field": "score", "type": "quantitative" },
        "color": {
            "field": "type", "type": "nominal", "legend": {
                "values": ['数据转换', '关联', '关联（趋势）', '对比', '确认值', '聚类/异常']
            }
        }
    }
}

const predicts=computed(()=>{
        return debugStore.predicts.map(i=>({
            ...i,
            score:i.score[0]
            })
        );
    }
);
</script>