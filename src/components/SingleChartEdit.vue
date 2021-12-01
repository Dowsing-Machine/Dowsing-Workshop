<template>
    <div style="padding:12px 24px;">
        <div v-if="controlStore.currentViewId !== null">
            <n-h3>视图绘制控制</n-h3>视图类型
            <encoding-select-vue
                :options="ChartTypeOpt"
                @update="updateEncoding('chart_type', $event)"
                :value="currentView.chart_type"
            ></encoding-select-vue>
            <n-divider></n-divider>x轴编码
            <encoding-select-vue
                field="x"
                label="x"
                :columns="encodingColumns"
                @update="updateEncoding('x_encoding', $event)"
                :value="currentView.x_encoding"
                style="margin-bottom: 1em;"
            ></encoding-select-vue>x轴聚合函数
            <encoding-select-vue
                field="x_agg"
                label="x_agg"
                :columns="aggregateFunctions"
                @update="updateEncoding('x_aggregate', $event)"
                :value="currentView.x_aggregate"
                style="margin-bottom: 1em;"
            ></encoding-select-vue>y轴编码
            <encoding-select-vue
                field="y"
                label="y"
                :columns="encodingColumns"
                @update="updateEncoding('y_encoding', $event)"
                :value="currentView.y_encoding"
                style="margin-bottom: 1em;"
            ></encoding-select-vue>y轴聚合函数
            <encoding-select-vue
                field="y_agg"
                label="y_agg"
                :columns="aggregateFunctions"
                @update="updateEncoding('y_aggregate', $event)"
                :value="currentView.y_aggregate"
                style="margin-bottom: 1em;"
            ></encoding-select-vue>
            <n-divider></n-divider>分类列
            <encoding-select-vue
                field="category"
                label="category"
                :columns="encodingColumns"
                @update="updateEncoding('category_encoding', $event)"
                :value="currentView.category_encoding"
            ></encoding-select-vue>

            <n-divider></n-divider>分组列
            <encoding-select-vue
                field="group"
                label="group"
                :columns="encodingColumns"
                @update="updateEncoding('group_by', $event)"
                :value="currentView.group_by"
            ></encoding-select-vue>
        </div>
    </div>
</template>

<script setup>
const columnEnabled = (columns, view) => {
    return columns.map(c => ({
        label: c,
        value: c,
        disabled: [view.x_encoding, view.y_encoding, view.category_encoding, view.group_by].includes(c),
    }));
}
const aggregateFunctions = ["count", "sum", "mean", "median", "min", "max"].map(f => ({
    label: f,
    value: f,
})).concat([{
    label: "无",
    value: null,
}]);

function updateEncoding(channel, value) {
    const id = mvStore.views.findIndex(d => d.id === controlStore.currentViewId);
    mvStore.views[id][channel] = value;
    // mvStore.views[controlStore.currentViewId][channel] = value;
    // mvStore.editView(mvStore.currentViewId,view);
}

import { NH3, NDivider, NButton } from 'naive-ui';
import EncodingSelectVue from './EncodingSelect.vue';
import { DatasetStore } from '../store/DatasetStore';
import { MVStore } from '../store/MVStore';
import _ from 'lodash';
import { computed } from 'vue-demi';
import { ControlStore } from '../store/ControlStore';


const datasetStore = DatasetStore();
const controlStore = ControlStore();
const mvStore = MVStore();

const currentView = computed(() => mvStore.views.find(d => d.id === controlStore.currentViewId))

const ChartTypeOpt = [
    { label: '折线图', value: 'line' },
    { label: '柱状图', value: 'bar' },
    { label: '饼图', value: 'pie' },
    { label: '散点图', value: 'point' },
]

const encodingColumns = computed(() => columnEnabled(datasetStore.columns, currentView.value));
</script>
