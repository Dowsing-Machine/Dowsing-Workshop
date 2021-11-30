<template>
  <div style="padding:12px 24px">
    <n-h3>请在此处添加Mention</n-h3>
    <n-carousel show-arrow>
      <n-card v-for="mention, i in mentions" :key="i">
        {{mention.text}}
        <template #footer>
          <n-space>
            <n-tag size="small">
              {{'Mention#' + i}}
            </n-tag>
            <n-tag size="small">
              {{mention.time.toLocaleTimeString()}}
            </n-tag>
          </n-space>
        </template>
      </n-card>
    </n-carousel>
    <n-mention type="textarea" style="margin: 1em 0"  :options="options" v-model:value="mentionText" />
    <n-button type="primary" style="width:100%"  @click="mentionStore.addMention(new Mention({text: mentionText, time: new Date()})); clearText()">{{mentionStore.mode}}</n-button>
  </div>
</template>

<script setup>
import { MentionStore } from "../store/MentionStore";
import { MVStore } from "../store/MVStore";
import { NLayout, NLayoutSider, NButton, NH3, NMention, NSpace, NInput, NCard, NAlert, NTag, NCarousel } from 'naive-ui';
import Mention from "../models/Mention";
import { defineComponent, ref } from 'vue'
import {computed} from "vue-demi";

const mentionStore = MentionStore()
const mentions = MentionStore().mentions
const mvStore = MVStore()

var mentionText = ref('@')

function clearText(){
  mentionText.value = '@'
}

const getOptions=(views)=>{
  return views.map( c => ({
    label: '图表#' + views.indexOf(c),
    value: '图表#' + views.indexOf(c)
  }));
}

const options = computed(()=>getOptions(mvStore.views))

</script>

<style scoped>

</style>
