<template>
    <div v-if="vegalite!=null" ref="chartDiv" style="overflow:auto;"></div>
    <n-empty v-else description="添加一些视觉编码吧"></n-empty>
</template>
<script setup>
import { defineProps,onMounted,watch,ref,defineExpose } from 'vue-demi';
import { NEmpty } from 'naive-ui';
import embed from 'vega-embed';

import {DatasetStore} from '@/store/DatasetStore';
import { NScrollbar } from 'naive-ui';
import { QueryStore } from '../store/QueryStore';
import {defineEmits} from 'vue-demi';
import _ from "lodash";

const emit=defineEmits(["addview"]);
const datasetStore=DatasetStore();
const queryStore=QueryStore();

const props=defineProps({
    vegalite:Object,
    renderOption: Object,
});
const chartDiv = ref(null);

const view=ref(null)

async function refreshChart() {
    if(view.value){
        view.value.finalize();
    }
    
    let v={
        ..._.cloneDeep(props.vegalite),
        ...props.renderOption,
        data:{
            // name:"data"
            values:datasetStore.dataset
        },
        "params": [{ "name": "brush", "select": "interval" }]
        // transform:queryStore.filter.filter(f=>f!=null).map(f=>({
        //     filter:{
        //         field:f.column,
        //         [f.predicate]:f.filter
        //     }
        // })),
    }
    v.encoding.color={
        "condition": {
            "param": "brush",
            "aggregate": v.encoding?.color?.aggregate,
            "field":v.encoding?.color?.field,
            "type": v.encoding?.color?.type,
        },
        "value": "grey"
    };
    v.$schema="https://vega.github.io/schema/vega-lite/v5.json";
    let res=await embed(chartDiv.value,v , { actions: false });
    // res.view.insert("data", datasetStore.dataset).run();

    emit("addview",res.view);

}

onMounted(() => {
    refreshChart();
});

watch(props, () => {
    refreshChart();
}, { deep: true });

function resize(){
    if(view.value){
        console.log("resize");
        view.value.resize().run();
        // refreshChart();
        // window.dispatchEvent(new Event('resize'))
    }
}

defineExpose({
    resize,
    refreshChart
});

</script>

<style scoped>
::-webkit-scrollbar{ 
      /* width:0; */
      /* position:absolute; */
  }
</style>
