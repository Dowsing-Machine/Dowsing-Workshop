<template>
    <n-card v-if="recommendStore.specifiedView !== null">
      <template #header>Specified View</template>
        <chart-raw-vue :vegalite="recommendStore.specifiedView"></chart-raw-vue>
    </n-card>
    <n-card v-for="group in groups" :key="group.name">
      <template #header>{{ group.name }}</template>
      <template #header-extra>
        <n-switch v-if="group.views.items.length > 3" v-model:value="gridCollapsed[group.name]">
          <template #checked>Hide Details</template>
          <template #unchecked>Load More...</template>
        </n-switch>
      </template>
        <!-- {{group.views}} -->
      <n-grid x-gap="12" y-gap="8" cols="3" :collapsed-rows="gridCollapsedRows" :collapsed="!gridCollapsed[group.name]">
        <n-grid-item v-for="(node,i) in group.views.items" :key="i">
          <chart-raw-vue v-for="(leaf,j) in node.items" :key="j" :vegalite="leaf.toSpec()" :renderOption="{ width: 'container'}"></chart-raw-vue>
        </n-grid-item>
      </n-grid>
    </n-card>
</template>

<script setup>
import { NCard, NInput, NDivider, NGrid, NGridItem, NSwitch, NSpace } from "naive-ui";
import Chart from "./Chart.vue"
import * as cql from "compassql";
import {computed, ref} from "vue-demi";

import RecommendResVue from "./RecommendRes.vue";
import ChartRawVue from "./ChartRaw.vue";

import { MVStore } from "../store/MVStore";
import { DatasetStore } from "../store/DatasetStore";
import { RecommendStore } from "../store/RecommendStore";

// import {Mark} from 'vega-lite/build/src/mark';
import * as MARK from 'vega-lite/build/src/mark';
import { COLOR, COLUMN, ROW, SIZE, X, Y } from 'vega-lite/build/src/channel';
import _ from "lodash";
const text = ref("");
const results = ref({});
const mvstore = MVStore();
const datasetStore = DatasetStore();
const recommendStore = RecommendStore();
const gridCollapsedRows = ref(1)
const gridCollapsed = ref({'summaries': false, 'addQuantitativeField': false, 'addCategoricalField': false, 'alternative-encodings': false})

function onClick() {
    var query = JSON.parse(text.value);
    _.assign(query.spec, {
        data: {
            values: datasetStore.dataset,
        }
    });
    var schema = cql.schema.build(datasetStore.dataset);
    var output = cql.recommend(query, schema,
        cql.config.extendConfig({
            enum: {
                mark: [MARK.POINT, MARK.BAR, MARK.LINE, MARK.TICK],
                channel: [X, Y, COLOR],

            },
            // maxCardinalityForFacet:1
        }));
    var result = output.result; // recommendation result
    results.value = result;
    console.log(result);
}

const currentView = computed(() => mvStore.views.find(d => d.id === controlStore.currentViewId))

const groups=computed(()=>{
  return recommendStore.relatedViews.filter((group) => {
    console.log(group)
    return group.views.items.length > 0
  });
});

// function test(group){
//   console.log(group)
// }

</script>
