<template>
    <div ref="chartDiv" style="overflow:auto;"></div>
</template>
<script setup>
import { defineProps,onMounted,watch,ref } from 'vue-demi';
import embed from 'vega-embed';

import {DatasetStore} from '@/store/DatasetStore';

const datasetStore=DatasetStore();

const props=defineProps({
    vegalite:Object,
    renderOption: Object,
});
const chartDiv = ref(null);

async function refreshChart() {
    let res=await embed(chartDiv.value, {
        ...props.vegalite,
        ...props.renderOption,
        data:{
            name:"data"
        }
    }, { actions: false });
    res.view.insert("data", datasetStore.dataset).run();
}

onMounted(() => {
    refreshChart();
});

watch(props, () => {
    refreshChart();
}, { deep: true });


</script>
