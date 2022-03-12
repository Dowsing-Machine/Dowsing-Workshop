<template>
    <n-space vertical style="padding:12px 24px;" justify="space-between">
        <n-space vertical>
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
                @update:filter="updateFilter('x_filter', queryStore.x_encoding, $event)"
                @update:aggregate="updateAggregate('x_aggregate', $event)"
                :columns="datasetStore.columns"
            ></encoding-embed-ctrl>Y轴编码
            <encoding-embed-ctrl
                :encoding="queryStore.y_encoding"
                :aggregate="queryStore.y_aggregate"
                :filter="y_filter"
                @update:encoding="updateEncoding('y_encoding', $event)"
                @update:filter="updateFilter('y_filter', queryStore.y_encoding, $event)"
                @update:aggregate="updateAggregate('y_aggregate', $event)"
                :columns="datasetStore.columns"
            ></encoding-embed-ctrl>颜色编码
            <encoding-embed-ctrl
                :encoding="queryStore.category_encoding"
                :aggregate="queryStore.category_aggregate"
                :filter="category_filter"
                @update:encoding="updateEncoding('category_encoding', $event)"
                @update:filter="updateFilter('category_filter', queryStore.category_encoding, $event)"
                @update:aggregate="updateAggregate('category_aggregate', $event)"
                :columns="datasetStore.columns"
            ></encoding-embed-ctrl>
            <n-button type="error" size="small" style="width:100%" @click="resetQuery()">清空</n-button>
            <n-divider></n-divider>
        </n-space>
        <n-tabs>
            <template #suffix>
                <n-button text class="text-lg">
                    <n-icon>
                        <Settings16Filled />
                    </n-icon>
                </n-button>
            </template>
            <n-tab-pane name="任务">
                <task-predict-vue></task-predict-vue>
                <task-tag-vue></task-tag-vue>
            </n-tab-pane>
            <n-tab-pane name="列"></n-tab-pane>
        </n-tabs>
    </n-space>
</template>

<script setup>
import { NSelect, NSpace, NButton, NTabs, NTabPane, NDivider,NIcon } from 'naive-ui';
import { computed, watch, getCurrentInstance } from 'vue-demi';

import { DatasetStore } from '../store/DatasetStore';
import { QueryStore } from '../store/QueryStore';

import { COUNT } from '../query';

import EncodingEmbedCtrl from "./EncodingEmbedCtrl.vue";


import _ from "lodash";

import TaskPredictVue from './Task/TaskPredict.vue';
import TaskTagVue from "./Task/TaskTag.vue";
import { ControlStore } from '../store/ControlStore';
import { CollectionStore } from '../store/CollectionStore';

import {Settings16Filled} from "@vicons/fluent"

const datasetStore = DatasetStore();
const queryStore = QueryStore();
const controlStore = ControlStore();
const collectionStore = CollectionStore();

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
    const enc = encoding?.encoding ?? 'None';
    let t = _.find(datasetStore.columns, column => column.name === enc)?.type;
    if (enc == "COUNT") {
        t = "quantitative";
    }
    if (enc.toLowerCase() == "year") {
        t = "ordinal"
    }
    proxy.$EventBus.emit(`user:update:${channel}:${t}`, {
        channel,
        encoding: encoding?.encoding
    });
    queryStore.editEncoding(channel, encoding?.encoding);
    const i = controlStore.currentViewId;
    const chartIns = collectionStore.collections.find(c => c.id == i);

    if (chartIns == null) return;
    let chn = (channel.match(/(.*?)_encoding/) ?? [, "None"])[1];
    if (enc != "None") {
        chartIns.mergeSpec({
            encoding: {
                [chn]: {
                    field: enc,
                    type: t
                }
            }
        })
    }
    else {
        chartIns.mergeSpec({
            ...chartIns.spec,
            encoding: {
                ...chartIns.spec.encoding,
                [channel]: null
            }
        })
    }
}

function updateFilter(enc, column, filter) {
    proxy.$EventBus.emit(`user:update:filter:${enc}`, {
        column,
        filter
    });
    queryStore.setFilterByColumn(column, filter);
}

function updateChartType(chart_type) {
    proxy.$EventBus.emit(`user:update:chart_type:${chart_type ?? 'None'}`, {
        chart_type
    });
    queryStore.chart_type = (chart_type);
    const i = controlStore.currentViewId;
    const chartIns = collectionStore.collections.find(c => c.id == i);
    if (chartIns == null) return;
    chartIns.mergeSpec({
        mark: chart_type
    })

}

function updateAggregate(channel, aggregate) {
    proxy.$EventBus.emit(`user:update:aggregate:${channel}`, {
        channel,
        aggregate
    });
    let chn = (channel.match(/(.*?)_aggregate/) ?? [, "None"])[1];
    const i = controlStore.currentViewId;
    const chartIns = collectionStore.collections.find(c => c.id == i);

    queryStore[channel] = aggregate;
    if (chn != "None") {
        chartIns.mergeSpec({
            encoding: {
                [chn]: {
                    aggregate
                }
            }
        })
    }
}

function resetQuery() {
    proxy.$EventBus.emit(`user:reset:query`);
    queryStore.$reset();
}
</script>