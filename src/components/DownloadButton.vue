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
import { QueryStore } from "../store/QueryStore"
import { watch, ref, getCurrentInstance } from "vue";
import _ from "lodash"
import { saveAs } from 'file-saver';

const collectionStore = CollectionStore();
const queryStore = QueryStore();

const {proxy}=getCurrentInstance();

const actionList = []
const actionSepts = []
let outputFilename='user_actions.json';

watch(collectionStore.notes, _.debounce(()=> {
  actionList.push({
    time: new Date().toLocaleString(),
    type: 'note',
    content: _.cloneDeep(collectionStore.notes)
  })
  // console.log(new Date().toLocaleTimeString(), collectionStore.notes)
}, 1000))

watch(collectionStore.layouts, _.debounce(()=> {
  actionList.push({
    time: new Date().toLocaleString(),
    type: 'layout',
    content: _.cloneDeep(collectionStore.layouts)
  })
  // console.log(new Date().toLocaleTimeString(), collectionStore.notes)
}, 1000))

watch(collectionStore.collections, _.debounce(()=> {
  actionList.push({
    time: new Date().toLocaleString(),
    type: 'collection',
    content: _.cloneDeep(collectionStore.collections)
  })
}, 1000))

// watch(queryStore, _.debounce(()=> {
//   actionList.push({
//     time: new Date().toLocaleString(),
//     type: 'query',
//     content: _.cloneDeep(queryStore.$state)
//   })
// }, 1000))

let queryTemp = {}

queryStore.$subscribe((mutation, state) => {
  if(! _.isEqual(state, queryTemp)){
    actionList.push({
      time: new Date().toLocaleString(),
      type: 'query',
      entrance: mutation.type,
      content: _.cloneDeep(state)
    })
  }
  queryTemp = _.cloneDeep(state)
})


function saveActionList(){

  let finalState = {}

  finalState['notes'] = _.cloneDeep(collectionStore.notes)
  finalState['collections'] = _.cloneDeep(collectionStore.collections)
  finalState['layout'] = _.cloneDeep(collectionStore.layouts)

  saveAs(new Blob([JSON.stringify({'finalState': finalState, 'actionSteps': actionSepts, 'actionList': actionList})], { type: 'text/plain; charset=utf-8' }), outputFilename);

}

proxy.$EventBus.on("*",function(type,e){
    // console.log(type,e);
  actionSepts.push({
    time: new Date().toLocaleString(),
    type: type,
    content: e
  })

  if(_.startsWith(type,"user:dataset:load")){
    actionSepts.length=0;
    actionList.length=0;
    const filename=_(e.url).trimStart("dataset/").trimEnd(".json");
    console.log("filename",filename)
    outputFilename=`${filename}_user_actions.json`;
  } 
})

</script>

<style scoped>

</style>
