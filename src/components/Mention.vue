<template>
  <div style="padding:12px 24px">
    <n-h3>请在此处添加Note</n-h3>
    <n-scrollbar style="max-height: 150px;">
      <n-space>
        <n-card v-for="mention, i in mentions" :key="i">
          {{mention.text}}
          <template #footer>
            <n-space>
              <n-tag size="small">
                {{'Note#' + i}}
              </n-tag>
              <n-tag size="small">
                {{mention.time.toLocaleTimeString()}}
              </n-tag>
            </n-space>
          </template>
        </n-card>
      </n-space>
    </n-scrollbar>
    <n-mention type="textarea" style="margin: 1em 0" :prefix="['@', '$']" @search="handleSearch" :options="options" v-model:value="mentionText" />
    <n-button type="primary" style="width:100%"  @click="mentionStore.addMention(new Mention({text: mentionText, time: new Date()})); clearText()">{{mentionStore.mode}}</n-button>
  </div>
</template>

<script setup>
import { MentionStore } from "../store/MentionStore";
import { MVStore } from "../store/MVStore";
import { NLayout, NLayoutSider, NButton, NH3, NMention, NSpace, NInput, NCard, NAlert, NTag, NCarousel, NConfigProvider, NScrollbar } from 'naive-ui';
import Mention from "../models/Mention";
import { defineComponent, ref } from 'vue'
import {computed} from "vue-demi";

const mentionStore = MentionStore()
const mentions = MentionStore().mentions
const mvStore = MVStore()

const mentionText = ref('@')
const options = ref([])

function clearText(){
  mentionText.value = '@'
}

function getViewOptions(views) {
  return views.map( c => ({
    label: '图表#' + views.indexOf(c),
    value: '图表#' + views.indexOf(c) //在这里改成c.id
  }));
}

function getMentionOptions(mentions) {
  return mentions.map( c => ({
    label: 'Note#' + mentions.indexOf(c),
    value: 'Note#' + mentions.indexOf(c)
  }));
}

// const options = computed(()=>getOptions(mvStore.views))

function handleSearch(_, prefix) {
  if (prefix === '@') {
    options.value = getViewOptions(mvStore.views)
  } else {
    options.value = getMentionOptions(mentions)
  }
}

</script>

<style scoped>

</style>
