<template>
    <div v-show="ready" ref="chartDiv" style="overflow:auto;width: 100%;"></div>
    <n-empty v-show="!ready" description="添加一些编码以显示图表">
    <template #icon>
      <n-icon>
        <data-usage-edit20-filled/>
      </n-icon>
    </template>
    </n-empty>
</template>

<script setup>
import { onMounted, watch,defineProps,ref,computed } from 'vue-demi';
import embed from 'vega-embed';
import { DatasetStore } from '@/store/DatasetStore';
import { NEmpty,NIcon } from 'naive-ui';
import {DataUsageEdit20Filled} from "@vicons/fluent"

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

const ready=props.view.isReady();

const vega_lite = props.view.compileToVegaLite(dataset,columns,props.renderOption);

watch(vega_lite, () => {
    refreshChart();
}, { deep: true });

</script>