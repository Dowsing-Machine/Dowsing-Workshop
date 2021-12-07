<template>
    <n-space vertical style="padding:12px 24px;">
        视图类型
        <n-select
            :options="typeOption"
            :value="queryStore.chart_type"
            @update:value="updateChartType"
            clearable
        ></n-select>X轴编码
        <encoding-embed-ctrl
            :encoding="queryStore.x_encoding"
            :aggregate="queryStore.x_aggregate"
            :filter="x_filter"
            @update:encoding="updateEncoding('x_encoding', $event)"
            @update:filter="updateFilter(queryStore.x_encoding, $event)"
            @update:aggregate="updateAggregate('x_aggregate', $event)"
            :columns="datasetStore.columns"
        ></encoding-embed-ctrl>Y轴编码
        <encoding-embed-ctrl
            :encoding="queryStore.y_encoding"
            :aggregate="queryStore.y_aggregate"
            :filter="y_filter"
            @update:encoding="updateEncoding('y_encoding', $event)"
            @update:filter="updateFilter(queryStore.y_encoding, $event)"
            @update:aggregate="updateAggregate('y_aggregate', $event)"
            :columns="datasetStore.columns"
        ></encoding-embed-ctrl>颜色编码
        <encoding-embed-ctrl
            :encoding="queryStore.category_encoding"
            :aggregate="queryStore.category_aggregate"
            :filter="category_filter"
            @update:encoding="updateEncoding('category_encoding', $event)"
            @update:filter="updateFilter(queryStore.category_encoding, $event)"
            @update:aggregate="updateAggregate('category_aggregate', $event)"
            :columns="datasetStore.columns"
        ></encoding-embed-ctrl>
        <n-button type="error" style="width:100%" @click="resetQuery()">清空查询</n-button>
    </n-space>
</template>

<script setup>
import { NSelect, NSpace, NButton } from 'naive-ui';
import { computed, watch, getCurrentInstance } from 'vue-demi';

import { DatasetStore } from '../store/DatasetStore';
import { QueryStore } from '../store/QueryStore';
import { RecommendStore } from '../store/RecommendStore';

import { specific, runQuery, alternative_encodings, summaries, addQuantitativeField, addCategoricalField, univariteSummaries, COUNT } from '../query';

import EncodingEmbedCtrl from "./EncodingEmbedCtrl.vue";

import * as cql from "compassql"

import _ from "lodash";

const datasetStore = DatasetStore();
const queryStore = QueryStore();
const recommendStore = RecommendStore();

const { proxy } = getCurrentInstance();

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

function refreshRecommend(query) {
    let isSpecAggregate = false;
    if (queryStore.hasSpecView) {
        recommendStore.changeSpecView(
            runQuery(
                specific,
                query,
                datasetStore,
            )
        );
        const specQuery=specific(query, datasetStore);
        isSpecAggregate = cql.query.spec.isAggregate(specQuery);
    }
    else {
        recommendStore.changeSpecView(null);
        recommendStore.relatedViews = [
            {
                name: "单变量摘要 | Univariate Summaries",
                views: runQuery(
                    univariteSummaries,
                    query,
                    datasetStore,
                )
            }
        ]
        return;
    }

    const res = [];    
    if (!isSpecAggregate) {
        res.push({
            name: "总结 | Summaries",
            views: runQuery(
                summaries,
                query,
                datasetStore,
                (e)=>console.log("worker",e)
            )
        });
    }
    if (queryStore.hasOpenPosition || queryStore.hasStyleChannel) {
        res.push({
            name: "添加定量字段 | Add Quantitative Field",
            views: runQuery(
                addQuantitativeField,
                query,
                datasetStore,
            )
        });
        res.push({
            name: "添加分类字段 | Add Categorical Field",
            views: runQuery(
                addCategoricalField,
                query,
                datasetStore,
            )
        });
    }

    res.push({
        name: "可替换的视觉编码 | Alternative Encodings",
        views: runQuery(
            alternative_encodings,
            query,
            datasetStore,
        )
    });

    recommendStore.relatedViews = res;
}

refreshRecommend(queryStore);

const debouncedRefreshRecommend = _.debounce(refreshRecommend, 500, {
    // leading: true,
});

watch(queryStore, debouncedRefreshRecommend);
watch(datasetStore, (query)=>{
    debouncedRefreshRecommend(query);
    queryStore.$reset();
});

const x_filter = computed(() => {
    if (queryStore.x_encoding == COUNT) {
        return null;
    }
    return queryStore.getFilterByColumn(queryStore.x_encoding);
})

const y_filter = computed(() => {
    if (queryStore.x_encoding == COUNT) {
        return null;
    }
    return queryStore.getFilterByColumn(queryStore.y_encoding);
})

const category_filter = computed(() => {
    if (queryStore.x_encoding == COUNT) {
        return null;
    }
    return queryStore.getFilterByColumn(queryStore.category_encoding);
})

function updateEncoding(channel, encoding) {
    proxy.$EventBus.emit(`user:update:encoding:${encoding}`, {
        channel,
        encoding
    });
    queryStore.editEncoding(channel, encoding);
}

function updateFilter(column, filter) {
    proxy.$EventBus.emit(`user:update:filter:${column}`, {
        column,
        filter
    });
    queryStore.setFilterByColumn(column, filter);
}

function updateChartType(chart_type) {
    proxy.$EventBus.emit(`user:update:chart_type`, {
        chart_type
    });
    queryStore.chart_type = (chart_type);
}

function updateAggregate(channel, aggregate) {
    proxy.$EventBus.emit(`user:update:aggregate:${channel}`, {
        channel,
        aggregate
    });
    queryStore[channel] = aggregate;
}

function resetQuery() {
    proxy.$EventBus.emit(`user:reset:query`);
    queryStore.$reset();
}

// watch(queryStore,(state,prevState)=>{
//     if(state.x_encoding==prevState.x_encoding&&state.y_encoding==prevState.y_encoding&&state.category_encoding==prevState.category_encoding){
//         return;
//     }
//     if(state.x_encoding!==prevState.x_encoding){
//         queryStore.refreshFilter();
//     }
//     else if(state.y_encoding!==prevState.y_encoding){
//         queryStore.refreshFilter();
//     }
//     else if(state.category_encoding!==prevState.category_encoding){
//         queryStore.refreshFilter();
//     }
// })

</script>