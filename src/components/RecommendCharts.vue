<template>
<n-card style="width: fit-content;margin:5px" hoverable>

    <chart-raw-vue :vegalite="vegalite" style="max-height: 500px;"></chart-raw-vue>

</n-card>
</template>
<script setup>
import { NCard } from 'naive-ui';
import ChartRawVue from './ChartRaw.vue';
import {defineProps} from 'vue-demi';

const props=defineProps({
    vegalite:Object,
})

</script>