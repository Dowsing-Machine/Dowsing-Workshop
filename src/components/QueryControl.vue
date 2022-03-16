<template>
    <n-space vertical style="padding:12px 24px;" justify="space-between" class>
        <div class="flex flex-col">
            <div class="flex items-center">
                <div class="panel-subtitle">DATA CONTROLLER</div>
                <n-button @click="resetQuery()" size="tiny" color="#c4c4c488" text-color="black">
                    <n-icon>
                        <ArrowReset20Filled />
                    </n-icon>
                </n-button>
            </div>
            <hr class="border-0 w-1/1 mt-2 mb-2" />
            <n-space vertical>
                <div class="flex flex-col">
                    <div class="font-semibold">Chart Type</div>
                    <n-select
                        class="mt-1"
                        :options="typeOption"
                        :value="queryStore.chart_type"
                        @update:value="updateChartType"
                        placeholder="Select..."
                        clearable
                    ></n-select>
                </div>
                <div class="flex flex-col">
                    <div class="font-semibold">X Encoding</div>
                    <encoding-embed-ctrl
                        class="mt-1"
                        :encoding="queryStore.x_encoding"
                        :aggregate="queryStore.x_aggregate"
                        :filter="x_filter"
                        @update:encoding="updateEncoding('x_encoding', $event)"
                        @update:filter="updateFilter('x_filter', queryStore.x_encoding, $event)"
                        @update:aggregate="updateAggregate('x_aggregate', $event)"
                        :columns="datasetStore.columns"
                    ></encoding-embed-ctrl>
                </div>
                <div class="flex flex-col">
                    <div class="font-semibold">Y Encoding</div>
                    <encoding-embed-ctrl
                        class="mt-1"
                        :encoding="queryStore.y_encoding"
                        :aggregate="queryStore.y_aggregate"
                        :filter="y_filter"
                        @update:encoding="updateEncoding('y_encoding', $event)"
                        @update:filter="updateFilter('y_filter', queryStore.y_encoding, $event)"
                        @update:aggregate="updateAggregate('y_aggregate', $event)"
                        :columns="datasetStore.columns"
                    ></encoding-embed-ctrl>
                </div>

                <div class="flex flex-col">
                    <div class="font-semibold">Color Encoding</div>
                    <encoding-embed-ctrl
                        class="mt-1"
                        :encoding="queryStore.category_encoding"
                        :aggregate="queryStore.category_aggregate"
                        :filter="category_filter"
                        @update:encoding="updateEncoding('category_encoding', $event)"
                        @update:filter="updateFilter('category_filter', queryStore.category_encoding, $event)"
                        @update:aggregate="updateAggregate('category_aggregate', $event)"
                        :columns="datasetStore.columns"
                    ></encoding-embed-ctrl>
                </div>

                <!-- <n-button type="error" size="small" style="width:100%" @click="resetQuery()">Clear</n-button> -->
            </n-space>
        </div>
        <!-- <n-divider></n-divider> -->
        <div class="flex flex-col">
            <div class="mt-5 flex items-center">
                <!-- <div class="panel-subtitle">PREFERENCE</div> -->
                <div class="panel-subtitle flex">
                    <div
                        :class="{ 'text-gray-400': !showTask }"
                        class="transition-colors duration-200"
                        @click="showTask = true"
                    >TASK</div>
                    <div
                        class="ml-2 transition-colors duration-200"
                        :class="{ 'text-gray-400': showTask }"
                        @click="showTask = false"
                    >COLUMNS</div>
                </div>

                <n-button size="tiny" color="#c4c4c488" text-color="black">
                    <n-icon>
                        <Settings20Filled />
                    </n-icon>
                </n-button>
            </div>
            <hr class="border-0 w-1/1 mt-2 mb-2" />
            <div v-if="showTask">
                <div class="font-semibold mb-1">Task Types</div>
                <task-legend-vue class="mb-1" />
                <task-predict-vue></task-predict-vue>
                <!-- <div class="flex mb-1">
                    <div class="font-semibold flex-1">Active Tasks</div>
                    <n-button size="tiny" color="#c4c4c488" text-color="black">
                        <n-icon>
                            <Add20Filled/>
                        </n-icon>
                    </n-button>
                </div>-->
                <task-tag-vue></task-tag-vue>
            </div>
            <div v-else>
                <p-o-i></p-o-i>
            </div>
            <!-- <n-tabs>
                <n-tab-pane name="Task">
                    <div class="mb-1 font-semibold">TYPE</div>
                    <task-legend-vue class="mb-1" />
                    <task-predict-vue></task-predict-vue>
                    <task-tag-vue></task-tag-vue>
                </n-tab-pane>
                <n-tab-pane name="Columns"></n-tab-pane>
            </n-tabs>-->
        </div>
    </n-space>
</template>

<script setup>
import { NSelect, NSpace, NButton, NTabs, NTabPane, NDivider, NIcon } from 'naive-ui';
import { computed, watch, getCurrentInstance } from 'vue-demi';

import { DatasetStore } from '../store/DatasetStore';
import { QueryStore } from '../store/QueryStore';

import { COUNT } from '../query';

import EncodingEmbedCtrl from "./EncodingEmbedCtrl.vue";
import { ref } from "vue";

import _ from "lodash";

import TaskPredictVue from './Task/TaskPredict.vue';
import TaskTagVue from "./Task/TaskTag.vue";
import POI from "./POI.vue";
import TaskLegendVue from './Task/TaskLegend.vue';
import { ControlStore } from '../store/ControlStore';
import { CollectionStore } from '../store/CollectionStore';
import { POIStore } from "../store/POIStore";

import { Settings20Filled, ArrowReset20Filled, Settings20Regular, Add20Filled } from "@vicons/fluent"

const datasetStore = DatasetStore();
const queryStore = QueryStore();
const controlStore = ControlStore();
const collectionStore = CollectionStore();
const poiStore = POIStore();

const { proxy } = getCurrentInstance();

const columnOptions = computed(() => {
    return datasetStore.columns.map(c => ({
        label: c.name,
        value: c.name,
    }));
});
const showTask = ref(true);

const typeOption = [
    // {
    //     label: "自动",
    //     value: null
    // },
    {
        label: "Bar",
        value: "bar"
    },
    {
        label: "Line",
        value: "line"
    },
    {
        label: "Scatter",
        value: "point",
    },
    // {
    //     label: "刻度图",
    //     value: "tick"
    // }
]

//大问题，重新选中图时候，queryStore不恢复
const x_filter = computed(() => {
    if (queryStore.x_encoding == COUNT) {
        return null;
    }
    console.log(queryStore.filter);
    console.log(queryStore.getFilterByColumn(queryStore.x_encoding))
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
    const old = queryStore[channel];
    console.log(queryStore.filter)
    queryStore.deleteFilterByColumn(old);
    console.log(queryStore.filter)
    queryStore.editEncoding(channel, encoding?.encoding);
    const i = controlStore.currentViewId;
    const chartIns = collectionStore.collections.find(c => c.id == i);
    
    const nowFilter=queryStore.filter.map(f=>{
        return {
            "filter":{
                field:f.column,
                [f.predicate]:f.filter,
            }
        }
    });
    
    const newspec=chartIns.spec;
    newspec.transform=nowFilter;

    chartIns.changeSpec(newspec);


    if (chartIns == null) return;
    let chn = (channel.match(/(.*?)_encoding/) ?? [, "None"])[1];
    if (chn == "category") {
        chn = "color";
    }
    if (enc != "None") {
        chartIns.mergeSpec({
            encoding: {
                [chn]: {
                    field: enc,
                    type: t
                }
            },
            "transform":nowFilter
        })
    }
    else {
        chartIns.mergeSpec({
            ...chartIns.spec,
            encoding: {
                ...chartIns.spec.encoding,
                [channel]: null
            },
            "transform":nowFilter
        })
    }
    
    poiStore.updateColumn(encoding.encoding);
    
}

function updateFilter(channel, column, filter) {
    
    proxy.$EventBus.emit(`user:update:filter:${channel}`, {
        column,
        filter
    });
    queryStore.setFilterByColumn(column, filter);
    const i = controlStore.currentViewId;
    const chartIns = collectionStore.collections.find(c => c.id == i);

    if (chartIns == null) return;

    let chn = (channel.match(/(.*?)_encoding/) ?? [, "None"])[1];
    if (chn == "category") {
        chn = "color";
    }

    const nowFilter=queryStore.filter.map(f=>{
        return {
            "filter":{
                field:f.column,
            [f.predicate]:f.filter,
            }
        }
    });
    const newspec=chartIns.spec;
    newspec.transform=nowFilter;
    ///////
    // chartIns.changeSpec(newspec);

    chartIns.mergeSpec({
        transform: nowFilter,
    })
    console.log(chartIns.spec.transform)

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
    console.log(aggregate)
    if (chn != "None" && aggregate != "bin") {
        chartIns.mergeSpec({
            encoding: {
                [chn]: {
                    aggregate,
                    "bin": false,
                }
            }
        })
    }
    if(chn != "None" && aggregate == "bin"){
        chartIns.mergeSpec({
            encoding: {
                [chn]: {
                    "bin": true,
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

<style scoped>
.panel-subtitle {
    @apply font-bold text-lg flex-1 text-$title-color;
}
</style>