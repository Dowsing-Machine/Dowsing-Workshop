<template>
    <div ref="chartDiv" style="overflow:auto;"></div>
</template>
<script setup>
import { defineProps,onMounted,watch,ref } from 'vue-demi';
import embed from 'vega-embed';

const props=defineProps({
    vegalite:Object,
    renderOption: Object,
});
const chartDiv = ref(null);

function refreshChart() {
    embed(chartDiv.value, {
        ...props.vegalite,
        ...props.renderOption,
    }, { actions: false });
}

onMounted(() => {
    refreshChart();
});

watch(props, () => {
    refreshChart();
}, { deep: true });


</script>
