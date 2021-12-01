<template>
    <div ref="chartDiv" style="overflow:auto;width: 100%;"></div>
</template>

<script setup>
import { onMounted, watch,defineProps,ref,computed } from 'vue-demi';
import embed from 'vega-embed';
import { DatasetStore } from '@/store/DatasetStore';

const datasetStore = DatasetStore();

const props = defineProps({
    view: Object,
    renderOption: Object,
});

const chartDiv = ref(null);

function refreshChart() {
    embed(chartDiv.value, vega_lite.value, { actions: false });
}

onMounted(() => {
    refreshChart();
});

const dataset=computed(()=>{
    return datasetStore.dataset;
});

const columns=computed(()=>{
    return datasetStore.columns;
});

const vega_lite = props.view.compileToVegaLite(dataset,columns,props.renderOption);

watch(vega_lite, () => {
    refreshChart();
}, { deep: true });

</script>