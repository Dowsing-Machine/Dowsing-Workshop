<template>
    <transition name="scaleY" @after-enter="onEnter" @after-leave="onLeave">
        <div class="h-50" v-show="props.show">
            <n-space class="h-1/1 py-2 overflow-x-auto overflow-y-hidden" :wrap="false" :ref="el">
                <n-card class="h-1/1 w-50" v-for="vl in vegalites">
                    <transition name="fade">
                        <chart-raw-vue
                            v-if="chartsShow"
                            :vegalite="vl"
                            :renderOption="{
                                height: 'container',
                                width: 'container',
                                autosize: {
                                    type: 'fit',
                                    contains: 'padding'
                                },
                                resize: true,
                            }"
                            :ref="el => { if (el) charts[idx] = el }"
                            class="h-1/1 w-1/1"
                        ></chart-raw-vue>
                    </transition>
                </n-card>
            </n-space>
        </div>
    </transition>
</template>

<script setup>
import { NCard, NSpace } from 'naive-ui';
import ChartRawVue from '../ChartRaw.vue';
import { nextTick, ref, watch } from "vue";
import { useElementSize } from '@vueuse/core'

const charts = ref([]);
const chartsShow = ref(false);
const props = defineProps({
    vegalites: Array,
    show: Boolean
});
const el = ref(null);
const { height } = useElementSize(el);
watch(height, () => {
    console.log(height.value);
})
function onEnter() {
    chartsShow.value = true;
}
function onLeave() {
    chartsShow.value = false;
}
</script>

<style scoped>
.scaleY-enter-active,
.scaleY-leave-active {
    /* transition: opacity 0.5s ease; */
    @apply transition-all duration-500;
}

.scaleY-enter-from,
.scaleY-leave-to {
    /* opacity: 0; */
    @apply transform h-0;
    /* transform: scaleY(0); */
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>