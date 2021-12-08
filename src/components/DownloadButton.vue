<template>
  <n-badge>
    <n-spin v-if="sending" size="small" />
    <n-button v-else text style="font-size: 28px;" @click="saveActionList(false,true)">
      <n-icon>
        <arrow-upload16-filled />
      </n-icon>
    </n-button>
  </n-badge>
</template>

<script setup>
import { ArrowUpload16Filled } from "@vicons/fluent"
import { NButton, NIcon, NBadge, NModal, NCard,NSpin } from "naive-ui";
import { CollectionStore } from "../store/CollectionStore";
import CollectionChartsVue from "./CollectionCharts.vue";
import { QueryStore } from "../store/QueryStore"
import { ControlStore } from "../store/ControlStore";

import { watch, ref, getCurrentInstance, onBeforeUnmount } from "vue";
import _ from "lodash"
import { saveAs } from 'file-saver';

import axios from "axios";

const collectionStore = CollectionStore();
const queryStore = QueryStore();
const controlStore = ControlStore();

const { proxy } = getCurrentInstance();

const actionList = []
const actionSepts = []

const uploadURL = "https://dowsing-1254359329.cos.ap-chengdu.myqcloud.com";

let outputFilename = 'user_actions.json';

const sending=ref(false);

function setSendingToFalse(){
  sending.value = false;
}

const setFalse=_.debounce(setSendingToFalse,1000);

async function sendLog(log, topic) {
  sending.value = true;
  if (import.meta.env.DEV) {
    console.log(log, topic);
    setTimeout(() => {
      sending.value = false;
    }, 1000);
    // sending.value = false;
    return;
  }
  const uuid = controlStore.uuid;
  const groupId = controlStore.groupId;
  const id = controlStore.Id;
  const time = Date.now();

  topic = topic || "user_action";

  // axios.post(`${uploadURL}/log/${groupId}.${id}.${uuid}/${topic}.json?append`, log);
  await axios.put(`${uploadURL}/log/${groupId}.${id}.${uuid}/${topic}.${time}.json`, log);
  // sending.value = false;
  setTimeout(() => {
    setFalse();
  }, 1000);
}

watch(collectionStore.notes, _.debounce(() => {
  const logObj = {
    time: new Date().toLocaleString(),
    type: 'note',
    content: _.cloneDeep(collectionStore.notes)
  };
  actionList.push(logObj);
  sendLog(logObj, "notes");
  // console.log(new Date().toLocaleTimeString(), collectionStore.notes)
}, 1000))

watch(collectionStore.layouts, _.debounce(() => {
  const logObj = {
    time: new Date().toLocaleString(),
    type: 'layout',
    content: _.cloneDeep(collectionStore.layouts)
  }
  actionList.push(logObj, "layouts");
  sendLog(logObj, "layouts");

  // console.log(new Date().toLocaleTimeString(), collectionStore.notes)
}, 1000), {
  deep: true
})

watch(collectionStore.collections, _.debounce(() => {
  const logObj = {
    time: new Date().toLocaleString(),
    type: 'collection',
    content: _.cloneDeep(collectionStore.collections)
  }
  actionList.push(logObj, "collections");
  sendLog(logObj, "collections");

}, 1000), {
  deep: true
})

// watch(queryStore, _.debounce(()=> {
//   actionList.push({
//     time: new Date().toLocaleString(),
//     type: 'query',
//     content: _.cloneDeep(queryStore.$state)
//   })
// }, 1000))

let queryTemp = {}

queryStore.$subscribe((mutation, state) => {
  if (!_.isEqual(state, queryTemp)) {
    const logObj = {
      time: new Date().toLocaleString(),
      type: 'query',
      content: _.cloneDeep(state)
    }
    actionList.push(logObj, "query");
    sendLog(logObj, "query");
  }
  queryTemp = _.cloneDeep(state)
})


function saveActionList(download = true,send=false) {

  let finalState = {}

  finalState['notes'] = _.cloneDeep(collectionStore.notes)
  finalState['collections'] = _.cloneDeep(collectionStore.collections)
  finalState['layout'] = _.cloneDeep(collectionStore.layouts)

  if (download) {
    saveAs(new Blob([JSON.stringify({ 'finalState': finalState, 'actionSteps': actionSepts, 'actionList': actionList })], { type: 'text/plain; charset=utf-8' }), outputFilename);
  }
  if(send){
    sendLog(finalState, outputFilename+"_finalState");
  }
  return finalState;
}

proxy.$EventBus.on("*", function (type, e) {
  // console.log(type,e);
  const logObj = {
    time: new Date().toLocaleString(),
    type: type,
    content: e
  }
  actionSepts.push(logObj);
  sendLog(logObj, "action");

  if (_.startsWith(type, "user:dataset:load")) {
    const filename = _(e.url).trimStart("dataset/").trimEnd(".json");
    // console.log("filename",filename)
    const logObj = saveActionList(false);
    sendLog(logObj, `${filename}_final_state`);
    // outputFilename = `${filename}_user_actions.json`;
    outputFilename=filename;
    actionSepts.length = 0;
    actionList.length = 0;
  }
})

</script>

<style scoped>
</style>
