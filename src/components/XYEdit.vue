<template>
X轴编码
<encoding-select-vue v-model="mvStore.currentView.x_encoding" :columns="columnEnabled"></encoding-select-vue>
x轴聚合函数
<encoding-select-vue v-model="mvStore.currentView.x_aggregate" ></encoding-select-vue>
Y轴编码
<encoding-select-vue v-model="mvStore.currentView.y_encoding" :columns="columnEnabled"></encoding-select-vue>
Y轴聚合函数
<encoding-select-vue v-model="mvStore.currentView.y_aggregate" ></encoding-select-vue>
</template>

<script setup>
import EncodingSelectVue from './EncodingSelect.vue';
import {MVStore} from '@/store/MVStore';

const mvStore = MVStore();
const columnEnabled=(columns,view)=>{
    return columns.map(c=>({
        label:c,
        value:c,
        disabled:[view.x_encoding,view.y_encoding,view.category_encoding,view.group_by].includes(c),
    }));
}
</script>