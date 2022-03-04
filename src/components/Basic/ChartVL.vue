<template>
    <div ref="chart"></div>
</template>

<script setup>
import embed from 'vega-embed';
import { ref, watch, onMounted, isReactive, isRef, computed } from 'vue';
const props = defineProps({
    spec: Object,
    renderOption: {
        type: Object,
        default: () => ({actions:false}),
    },
    data: Array,   //{"field":String,"value":Array}
    field:String,
});
let vl=null;
const chart=ref(null);
onMounted(async function(){
    vl=await embed(chart.value,props.spec,props.renderOption);
    vl.view.data(props.field,props.data).run();
})


watch(()=>props.data,()=>{
    vl.view.data(props.field,props.data).run();
})

</script>