<template>
    <n-layout
        class="h-screen max-h-screen"
        :content-style="{ display: 'flex', flexDirection: 'column' }"
    >
        <n-layout-header
            bordered
            class="p-2 px-5 items-center bg-gradient-to-r to-yellow-200 from-yellow-400"
        >
            <n-space justify="space-between">
                <div style="font-size: 1.5em" class="text-light-50 text-shadow-lg">Dowsing</div>
                <div style="align-self: center;" class="h-1/1">
                    <!-- <n-switch size="large">
                            <template #checked>探索</template>
                            <template #unchecked>面板</template>
                    </n-switch>-->
                    <n-space>
                        <dataset-select-vue></dataset-select-vue>
                        <!-- <collection-button></collection-button> -->
                        <download-button></download-button>
                        <!-- <log-upload-vue v-if="isDev"></log-upload-vue> -->
                    </n-space>
                </div>
            </n-space>
        </n-layout-header>
        <n-layout-content class="flex-1 overflow-hidden">
            <n-layout has-sider class="h-1/1">
                <n-layout-sider bordered width="300" :class="{ 'shadow-left': recommendClosed }">
                    <!-- <single-chart-edit></single-chart-edit> -->
                    <query-control-vue></query-control-vue>
                </n-layout-sider>
                <n-layout-content  class="h-1/1">
                    <n-layout has-sider class="h-1/1">
                        <!-- <n-layout-header bordered>
                            <multi-view-ctrl></multi-view-ctrl>
                        </n-layout-header>-->
                        <n-layout-sider
                            @click="onClick"
                            bordered
                            width="300"
                            collapse-mode="transform"
                            :collapsed-width="0"
                            show-trigger="bar"
                            content-style="height:100%"
                            :native-scrollbar="false"
                            :default-collapsed="true"
                            v-model:collapsed="recommendClosed"
                            class="shadow-left"
                        >
                            <recommend-grid-vue ></recommend-grid-vue>
                        </n-layout-sider>
                        <n-layout-content
                            :content-style="{ display: 'flex', flexDirection: 'column' }"
                        >
                            <n-layout-header 
                                class="shadow"
                                bordered
                                @click="onClick"
                            >
                                <multi-view-ctrl></multi-view-ctrl>
                            </n-layout-header>
                            <!-- <explore-panel-vue class="flex-1 h-1/1 overflow-auto"></explore-panel-vue> -->

                            <!-- <multi-view></multi-view> -->
                            <collection-charts-vue class="h-1/1 flex-1 overflow-auto" @click="onClick">
                            </collection-charts-vue>
                            <div class="p-1 border-t shadow-up">
                                <n-button
                                    secondary
                                    size="tiny"
                                    class="w-1/1"
                                    @click.stop="showPast = !showPast"
                                    :disabled="controlStore.currentViewId == null"
                                >{{ !pastPanelOpen ? '展开历史记录 ▲' : '收起历史记录 ▼' }}</n-button>
                                <history-view-vue
                                    :vegalites="chartHistories"
                                    :show="pastPanelOpen"
                                    :selectId="controlStore.currentViewId"
                                    
                                />
                                <!-- <transition name="fade">
                                    <div class="h-50" v-show="pastPanelOpen">
                                        <history-view-vue
                                            :vegalites="chartHistories"
                                            :show="pastPanelOpen"
                                        />
                                    </div>
                                </transition>-->
                                <!-- <n-collapse-transition class="h-50" :show="pastPanelOpen" appear></n-collapse-transition> -->
                            </div>
                        </n-layout-content>
                    </n-layout>
                </n-layout-content>
            </n-layout>
        </n-layout-content>
        <!-- <n-layout-footer class="p-1">
            <n-space justify="space-between">
                <div>Dowsing</div>
                <div>
                    Group {{ controlStore.groupId }}|
                    ID {{ controlStore.Id }}|
                    {{ datasetStore.name }}
                </div>

                <div>VCL318</div>
                <div>{{fps}}</div>
            </n-space>
        </n-layout-footer>-->
    </n-layout>
</template>

<script setup>
import { NLayout, NLayoutHeader, NLayoutFooter, NLayoutSider, NLayoutContent, NSpace, NSwitch, NCollapseTransition, NButton } from 'naive-ui';
import DebugViewVue from '../components/DebugView.vue';
import DataControl from "@/components/DataControl.vue";
import SingleChartEdit from "@/components/SingleChartEdit.vue";
import QueryControlVue from '../components/QueryControl.vue';
import MultiView from '../components/MultiView.vue';
import MultiViewCtrl from '../components/MultiViewCtrl.vue';
import DatasetSelectVue from '../components/DatasetSelect.vue';
// import Mention from '../components/Mention.vue'

import { MVStore } from '../store/MVStore';

import { ControlStore } from '../store/ControlStore';
import ExplorePanelVue from '@/components/ExplorePanel.vue';

import CollectionButton from '@/components/CollectionButton.vue';
import DownloadButton from "@/components/DownloadButton.vue";
import { DatasetStore } from '../store/DatasetStore';

import logUploadVue from '../components/logUpload.vue';

import { computed, ref } from 'vue-demi';
import RecommendGridVue from '../components/Recommendation/RecommendGrid.vue';
import CollectionChartsVue from '../components/CollectionCharts.vue';

import { QueryStore, spec2query } from '../store/QueryStore';

import HistoryViewVue from '../components/History/HistoryView.vue';
import { CollectionStore, CollectionItem } from '../store/CollectionStore';

import { useFps, useMemory } from "@vueuse/core";
const { menory } = useMemory();
const fps = useFps();

const showPast = ref(true);
const pastPanelOpen = computed(() => {
    console.log(controlStore.currentViewId)
    return (showPast.value == true) && (controlStore.currentViewId != null);
})
const isDev = computed(() => import.meta.env.DEV)

const mvStore = MVStore();
const controlStore = ControlStore();
const collectionStore = CollectionStore();
const datasetStore = DatasetStore();
const queryStore = QueryStore();
const currentChart = computed(() => {
    return collectionStore.collections.find(c => c.id == controlStore.currentViewId);
});
const chartHistories = computed(() => {
    const res = [...(currentChart.value?.history ?? []), currentChart.value?.spec].filter(c => CollectionItem.isValid(c));
    // console.log(currentChart.value?.history,currentChart.value?.spec,res);
    return res;
});
const style = {
    header: {
        height: "64px",
        padding_y: "12px",
        padding_x: "24px",
    },
    footer: {
        height: "28px",
        padding_x: "24px",
        padding_y: "2px"
    },
};

const recommendClosed = ref(true);

function onClick() {
    // mvStore.selectView();
    controlStore.currentViewId = null;
    queryStore.$patch(spec2query({}));
}
</script>

<style scoped>
.main-header {
    height: v-bind("style.header.height");
    padding: v-bind("style.header.padding_y") v-bind("style.header.padding_x");
}

.main-footer {
    height: v-bind("style.footer.height");
    padding: v-bind("style.footer.padding_y") v-bind("style.footer.padding_x");
}

.main-middle {
    height: calc(
        100vh - v-bind("style.header.height") - v-bind("style.footer.height")
    );
}

.shadow-left {
    @apply shadow;
    --tw-shadow: 10px 0 15px -3px rgb(0 0 0/0.1), 4px 0 6px -4px rgb(0 0 0/0.1);
}

.shadow-up {
    @apply shadow;
    --tw-shadow: 0 10px 15px -3px rgb(0 0 0/0.1), 0 -4px 6px -4px rgb(0 0 0/0.1);
}

</style>
