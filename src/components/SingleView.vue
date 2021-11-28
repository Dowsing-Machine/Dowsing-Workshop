<template>
    <div>
        <div ref="chartDiv"></div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue-demi';
import embed from 'vega-embed';
import {ref} from 'vue-demi';
import { defineProps } from 'vue-demi';

const props = defineProps({
    view:Object,
})

const chartDiv=ref(null);

function refreshChart(){

    embed(chartDiv.value, props.view.compileToVegaLite(),{actions:false});
}

onMounted(()=>{
    refreshChart();
});

watch(props.view,()=>{
    refreshChart();
},{deep:true});

</script>