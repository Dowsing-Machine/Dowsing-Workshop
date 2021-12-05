<template>
  <n-badge>
    <n-button text style="font-size: 28px;" @click="saveActionList">
      <n-icon>
        <arrow-download16-filled />
      </n-icon>
    </n-button>
  </n-badge>

</template>

<script setup>
import { ArrowDownload16Filled } from "@vicons/fluent"
import { NButton, NIcon, NBadge, NModal, NCard } from "naive-ui";
import { CollectionStore } from "../store/CollectionStore";
import CollectionChartsVue from "./CollectionCharts.vue";
import { isProxy, toRaw, watch, effectScope, ref } from "vue";
import _ from "lodash"
import { saveAs } from 'file-saver';

const collectionStore = CollectionStore();
const scope = effectScope();

const actionList = []

const actionColumns = {
  time: "time",
  type: "type",
  content: "content"
}

watch(collectionStore.notes, _.debounce(()=> {
  actionList.push({
    time: new Date().toLocaleTimeString(),
    type: 'note',
    content: _.cloneDeep(collectionStore.notes)
  })
  // console.log(new Date().toLocaleTimeString(), collectionStore.notes)
}, 1000))

function saveActionList(){
  saveAs(new Blob([JSON.stringify(actionList)], { type: 'text/plain; charset=utf-8' }), 'actionList.json');
}

</script>

<style scoped>

</style>
