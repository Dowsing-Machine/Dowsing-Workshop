<template>
    <div style="padding:12px 24px">
        <n-h3 style="margin-bottom: 0px;">数据字段</n-h3>
        <div style="display:flex;flex-direction:column">
            <data-type-select-vue 
                v-for="col in columns"
                :key="col.name"
                :name="col.name"
                :type="col.type"
                @update="datasetStore.defineColType(col.name,$event)"
            ></data-type-select-vue>
        </div>
    </div>
</template>

<script setup>
import { DatasetStore } from '@/store/DatasetStore';
import { NButton, NH3 } from 'naive-ui';
import DataTypeSelectVue from './DataTypeSelect.vue';
import {computed} from "vue";
import _ from "lodash"

const datasetStore = DatasetStore();

const columns=computed(()=>{
    return _.sortBy(datasetStore.columns,"name");
}); 

</script>