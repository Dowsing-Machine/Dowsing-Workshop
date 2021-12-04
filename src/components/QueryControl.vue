<template>
    <div style="padding:12px 24px;">
        视图类型
        <n-select :options="typeOption" v-model:value="queryStore.chart_type" clearable></n-select>X轴编码
        <encoding-embed-ctrl
            v-model:encoding="queryStore.x_encoding"
            v-model:aggregate="queryStore.x_aggregate"
            :columns="datasetStore.columns"
        ></encoding-embed-ctrl>Y轴编码
        <encoding-embed-ctrl
            v-model:encoding="queryStore.y_encoding"
            v-model:aggregate="queryStore.y_aggregate"
            :columns="datasetStore.columns"
        ></encoding-embed-ctrl>颜色编码
        <encoding-embed-ctrl
            v-model:encoding="queryStore.category_encoding"
            v-model:aggregate="queryStore.x_aggregate"
            :columns="datasetStore.columns"
        ></encoding-embed-ctrl>
    </div>
</template>

<script setup>
import { NSelect } from 'naive-ui';
import { computed, watch } from 'vue-demi';

import { DatasetStore } from '../store/DatasetStore';
import { QueryStore } from '../store/QueryStore';
import { RecommendStore } from '../store/RecommendStore';

import { specific, runQuery, alternative_encodings } from '../query';

import * as cql from "compassql"
import EncodingEmbedCtrl from "./EncodingEmbedCtrl.vue";

const datasetStore = DatasetStore();
const queryStore = QueryStore();
const recommendStore = RecommendStore();

const columnOptions = computed(() => {
    return datasetStore.columns.map(c => ({
        label: c.name,
        value: c.name,
    }));
});

const typeOption = [
    {
        label: "自动",
        value: null
    },
    {
        label: "柱状图",
        value: "bar"
    },
    {
        label: "折线图",
        value: "line"
    },
    {
        label: "散点图",
        value: "point",
    },
    {
        label: "刻度图",
        value: "tick"
    }
]

watch(queryStore, (query) => {
    if (queryStore.hasSpecView) {
        recommendStore.changeSpecView(
            runQuery(
                specific,
                query,
                datasetStore.dataset,
            )
        );
    }
    else {
        recommendStore.changeSpecView(null);
    }


    // console.log(query, output.result)

    recommendStore.relatedViews = [
        {
            name: "alternative-encodings",
            views: runQuery(
                alternative_encodings,
                query,
                datasetStore.dataset,
            )
        }
    ]
})

</script>