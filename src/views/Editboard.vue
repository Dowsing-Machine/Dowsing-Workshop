<template>
        <n-layout>
            <n-layout-header bordered class="main-header">
                <n-space justify="space-between">
                    <div style="font-size: 2em">Dowsing Workshop</div>
                    <div style="align-self: center;">
                        <!-- <n-switch size="large">
                            <template #checked>探索</template>
                            <template #unchecked>面板</template>
                        </n-switch>-->
                        <n-space>
                            <dataset-select-vue></dataset-select-vue>
                            <collection-button></collection-button>
                            <download-button></download-button>
                            <log-upload-vue v-if="isDev"></log-upload-vue>
                        </n-space>
                    </div>
                </n-space>
            </n-layout-header>
            <n-layout-content>
                <n-layout has-sider class="main-middle">
                    <n-layout-sider bordered width="350">
                        <!-- <single-chart-edit></single-chart-edit> -->
                        <query-control-vue></query-control-vue>
                    </n-layout-sider>
                    <n-layout-content @click="onClick">
                        <n-layout>
                            <n-layout-header bordered>
                                <multi-view-ctrl></multi-view-ctrl>
                            </n-layout-header>
                            <n-layout-content>
                                <explore-panel-vue></explore-panel-vue>
                                <!-- <multi-view></multi-view> -->
                            </n-layout-content>
                        </n-layout>
                    </n-layout-content>
                </n-layout>
            </n-layout-content>
            <n-layout-footer class="main-footer">
                <n-space justify="space-between">
                    <div>Dowsing</div>
                    <div>
                        Group {{controlStore.groupId}}|
                        ID {{controlStore.Id}}|
                        {{datasetStore.name}}
                    </div>
                    
                    <div>VCL318</div>
                </n-space>
            </n-layout-footer>
        </n-layout>
</template>

<script setup>
import { NLayout, NLayoutHeader, NLayoutFooter, NLayoutSider, NLayoutContent, NSpace, NSwitch } from 'naive-ui';

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

import { computed } from 'vue-demi';

const isDev=computed(()=>import.meta.env.DEV)

const mvStore = MVStore();
const controlStore = ControlStore();
const datasetStore = DatasetStore();

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

function onClick() {
    // mvStore.selectView();
    controlStore.currentViewId = null;
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
</style>
