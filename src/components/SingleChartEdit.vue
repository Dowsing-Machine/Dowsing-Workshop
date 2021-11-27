<template>
    <div style="padding:12px 24px;">
        <n-h3>视图绘制控制</n-h3>
        视图类型
        <encoding-select-vue :options="ChartTypeOpt" @update:value="updateEncoding('chart_type',$event)"></encoding-select-vue>
        <n-divider></n-divider>
        x轴编码
        <encoding-select-vue field="x" label="x" :columns="encodingColumns" @update="updateEncoding('x_encoding',$event)" :value="view.x_encoding"></encoding-select-vue>
        y轴编码
        <encoding-select-vue field="y" label="y" :columns="encodingColumns" @update="updateEncoding('y_encoding',$event)" :value="view.y_encoding"></encoding-select-vue>
        <n-divider></n-divider>
        分类列
        <encoding-select-vue field="category" label="category" :columns="encodingColumns" @update="updateEncoding('category_encoding',$event)" :value="view.category_encoding"></encoding-select-vue>
        
        <n-divider></n-divider>
        分组列
        <encoding-select-vue field="group" label="group" :columns="encodingColumns" @update="updateEncoding('group_by',$event)" :value="view.group_by"></encoding-select-vue>
        <n-button type="primary" style="margin: 1em 0;width:100%">{{mvStore.mode}}</n-button>
    </div>
</template>

<script setup>
const columnEnabled=(columns,view)=>{
    return columns.map(c=>({
        label:c,
        value:c,
        disabled:[view.x_encoding,view.y_encoding,view.category_encoding,view.group_by].includes(c),
    }));
}

function updateEncoding(channel,value){
    view[channel]=value;
    mvStore.editView(viewId,view);
}

import { NH3, NDivider,NButton } from 'naive-ui';
import EncodingSelectVue from './EncodingSelect.vue';
import { DatasetStore } from '../store/DatasetStore';
import { MVStore } from '../store/MVStore';
import _ from 'lodash';
import { computed } from 'vue-demi';

const datasetStore = DatasetStore();
const mvStore = MVStore();
const viewId=mvStore.currentViewId;
const view=mvStore.currentView;

const ChartTypeOpt=[
    {label:'折线图',value:'line'},
    {label:'柱状图',value:'bar'},
    {label:'饼图',value:'pie'},
    {label:'散点图',value:'scatter'},
]

const encodingColumns=computed(()=>columnEnabled(datasetStore.columns,view));
</script>