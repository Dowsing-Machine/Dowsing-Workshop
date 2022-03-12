<template>
    <n-space class="h-1/1 py-2" :wrap="false">
        <n-card class="h-1/1 w-50" v-for="vl in vegalites">
            <chart-raw-vue
                :vegalite="vl"
                :renderOption="{
                    height: 'container',
                    width: 'container',
                    autosize: {
                        type: 'fit',
                        contains: 'padding'
                    },
                    resize: true
                }"
                class="h-1/1 w-1/1"
            ></chart-raw-vue>
        </n-card>
    </n-space>
</template>

<script setup>
import { NCard, NSpace } from 'naive-ui';
import ChartRawVue from '../ChartRaw.vue';

const props = defineProps({
    vegalites: Array,
});


</script>