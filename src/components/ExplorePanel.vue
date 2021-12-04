<template>
    <n-card v-if="recommendStore.specifiedView !== null">
        <chart-raw-vue :vegalite="recommendStore.specifiedView"></chart-raw-vue>
    </n-card>
    <n-card v-for="group in recommendStore.relatedViews" :key="group.name">
        <template #header>{{ group.name }}</template>
        <!-- {{group.views}} -->
            <div v-for="(node,i) in group.views.items" :key="i">
                <chart-raw-vue v-for="(leaf,j) in node.items" :key="j" :vegalite="leaf.toSpec()"></chart-raw-vue>
            </div>
    </n-card>
</template>

<script setup>
import { NCard, NInput, NDivider } from "naive-ui";
import Chart from "./Chart.vue"
import * as cql from "compassql";
import { ref } from "vue-demi";

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

</script>