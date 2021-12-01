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
});

const chartDiv = ref(null);

function refreshChart() {
    embed(chartDiv.value, vega_lite.value, { actions: false });
}

onMounted(() => {
    refreshChart();
});

const vega_lite = computed(() => {
    if (props.view == null || props.view.compileToVegaLite == null) return "";
    return props.view.compileToVegaLite(datasetStore.dataset);
});

watch(vega_lite, () => {
    refreshChart();
}, { deep: true });

</script>