<template>
    <div style="padding:12px 24px;">
        <div v-if="controlStore.currentViewId !== null">
            <n-h3>视图绘制控制</n-h3>视图类型
            <encoding-select-vue
                :options="ChartTypeOpt"
                @update="updateEncoding('chart_type', $event)"
                :value="currentView.chart_type"
            ></encoding-select-vue>
            <n-divider></n-divider>
          <n-space>
            x轴编码
            <n-button size="tiny" @click="xshow = !xshow">Filter</n-button>
            <n-button size="tiny" @click="xshow = !xshow">Aggregation</n-button>
          </n-space>
          <n-card v-if="xshow" embedded style="position: absolute; z-index: 1">
            <n-space vertical>
              <n-slider v-model:value="xvalue" range :step="1" />
              <n-input-number size="small" v-model:value="xvalue[0]" />
              <n-input-number size="small" v-model:value="xvalue[1]" />
            </n-space>
          </n-card>
          <n-card v-if="xshow" embedded style="position: absolute; z-index: 1">
<!--            <n-select v-model:value="aggValue" :options="aggOptions" />-->
            <encoding-select-vue
              field="x_agg"
              label="x_agg"
              :columns="aggregateFunctions"
              @update="updateEncoding('x_aggregate', $event)"
              :value="currentView.x_aggregate"
              style="margin-bottom: 1em;"
              ></encoding-select-vue>
          </n-card>
          <encoding-select-vue
              field="x"
              label="x"
              :columns="encodingColumns"
              @update="updateEncoding('x_encoding', $event)"
              :value="currentView.x_encoding"
              style="margin-bottom: 1em;"
          ></encoding-select-vue>
          <n-space>
            y轴编码
            <n-button size="tiny" @click="yshow = !yshow">Filter</n-button>
            <n-button size="tiny" @click="yshow = !yshow">Aggregation</n-button>
          </n-space>
          <!--n-card v-if="show" embedded style="position: absolute; z-index: 1">
            <n-space vertical>
              <n-slider v-model:value="yvalue" range :step="1" />
              <n-input-number size="small" v-model:value="yvalue[0]" />
              <n-input-number size="small" v-model:value="yvalue[1]" />
            </n-space>
          </n-card-->
          <n-card v-if="yshow" embedded style="position: absolute; z-index: 1">
<!--            <n-select v-model:value="currentView.y_aggregate" :options="aggOptions" />-->
            <encoding-select-vue
              field="y_agg"
              label="y_agg"
              :columns="aggregateFunctions"
              @update="updateEncoding('y_aggregate', $event)"
              :value="currentView.y_aggregate"
              style="margin-bottom: 1em;"
              ></encoding-select-vue>
          </n-card>
          <encoding-select-vue
              field="y"
              label="y"
              :columns="encodingColumns"
              @update="updateEncoding('y_encoding', $event)"
              :value="currentView.y_encoding"
              style="margin-bottom: 1em;"
          ></encoding-select-vue>
            <n-divider></n-divider>分类列
            <encoding-select-vue
                field="category"
                label="category"
                :columns="encodingColumns"
                @update="updateEncoding('category_encoding', $event)"
                :value="currentView.category_encoding"
            ></encoding-select-vue>

            <n-divider></n-divider>分组列
            <encoding-select-vue
                field="group"
                label="group"
                :columns="encodingColumns"
                @update="updateEncoding('group_by', $event)"
                :value="currentView.group_by"
            ></encoding-select-vue>
        </div>
        <n-empty size="huge" v-else description="请选中一个视图以编辑">
            
        </n-empty>
    </div>
</template>

<script setup>
import {ref} from "vue";

const columnEnabled = (columns, view) => {
    return columns.map(c => ({
        label: c.name,
        value: c.name,
        disabled: [view.x_encoding, view.y_encoding, view.category_encoding, view.group_by].includes(c.name),
    }));
}
const aggregateFunctions = ["count", "sum", "mean", "median", "min", "max"].map(f => ({
    label: f,
    value: f,
})).concat([{
    label: "无",
    value: null,
}]);

function updateEncoding(channel, value) {
    const id = mvStore.views.findIndex(d => d.id === controlStore.currentViewId);
    mvStore.views[id][channel] = value;
    // mvStore.views[controlStore.currentViewId][channel] = value;
    // mvStore.editView(mvStore.currentViewId,view);
}

import { NButton, NCard, NSpace, NInputNumber, NModal, NSelect, NH3, NDivider,NSlider,NEmpty } from 'naive-ui';
import EncodingSelectVue from './EncodingSelect.vue';
import { DatasetStore } from '../store/DatasetStore';
import { MVStore } from '../store/MVStore';
import _ from 'lodash';
import { computed } from 'vue-demi';
import { ControlStore } from '../store/ControlStore';
import Filter from '../components/Filter.vue'


const xshow = ref(false)
const yshow = ref(false)
const xvalue = ref([0, 100])
const yvlaue = ref([1, 100])

const datasetStore = DatasetStore();
const controlStore = ControlStore();
const mvStore = MVStore();

const currentView = computed(() => mvStore.views.find(d => d.id === controlStore.currentViewId))

const ChartTypeOpt = [
    { label: '折线图', value: 'line' },
    { label: '柱状图', value: 'bar' },
    { label: '饼图', value: 'pie' },
    { label: '散点图', value: 'point' },
]

const encodingColumns = computed(() => columnEnabled(datasetStore.columns, currentView.value));
</script>
