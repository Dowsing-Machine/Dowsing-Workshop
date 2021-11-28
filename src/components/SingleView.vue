<template>
    <n-card 
    style="margin:1em" 
    @click="onClick" 
    :class="{
        selected: isSelected,
    }"
    >
    <template #header>
        {{'图表#'+view.id}}
    </template>
        <div ref="chartDiv" style="overflow:auto;width: 100%;"></div>
    </n-card>
</template>

<script setup>
import { onMounted, watch } from 'vue-demi';
import embed from 'vega-embed';
import {ref} from 'vue-demi';
import { defineProps,computed } from 'vue-demi';
import {NCard,NTag} from 'naive-ui';
import {MVStore} from '@/store/MVStore';

const props = defineProps({
    view:Object,
})

const mvStore = MVStore();

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

function onClick(e){
    mvStore.selectView(props.view.id);
    e.stopPropagation();
}

const isSelected = computed(()=>{
    return mvStore.currentViewId == props.view.id;
});

</script>

<style scoped>
.selected{
    box-shadow: 0px 0px 10px steelblue;
}

</style>