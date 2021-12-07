<template>
    <div ref="chartDiv" style="overflow:auto;"></div>
</template>
<script setup>
import { defineProps,onMounted,watch,ref,defineExpose } from 'vue-demi';
import embed from 'vega-embed';

import {DatasetStore} from '@/store/DatasetStore';
import { NScrollbar } from 'naive-ui';
import { QueryStore } from '../store/QueryStore';

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
    let res=await embed(chartDiv.value, {
        ...props.vegalite,
        ...props.renderOption,
        data:{
            // name:"data"
            values:datasetStore.dataset
        },
        transform:queryStore.filter.filter(f=>f!=null).map(f=>({
            filter:{
                field:f.column,
                [f.predicate]:f.filter
            }
        })),
    }, { actions: false });
    // res.view.insert("data", datasetStore.dataset).run();
    view.value=res.view;
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
