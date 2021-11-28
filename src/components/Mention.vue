<template>
  <div style="padding:12px 24px">
    <n-h3>请在此处添加Mention</n-h3>
    <n-card v-for="mention, i in mentions" :key="i">
      {{mention.text}}
    </n-card>
    <n-mention :options="options" v-model:value="mentionValue.text" />
    <n-button type="primary" style="margin: 1em 0;width:100%"  @click="mentionStore.addMention(new Mention(mentionValue))">{{mentionStore.mode}}</n-button>
  </div>
</template>

<script setup>
import { MentionStore } from "../store/MentionStore";
import { NButton, NH3, NMention, NSpace, NInput, NCard } from 'naive-ui';
import Mention from "../models/Mention";

const mentionStore = MentionStore()
const mentions = MentionStore().mentions;

var mentionValue = {
  text: '@'
}

const options = [
  {
    label: '07akioni',
    value: '07akioni'
  },
  {
    label: 'star-kirby',
    value: 'star-kirby'
  },
  {
    label: '广东路',
    value: '广东路'
  },
  {
    label: '颐和园路5号',
    value: '颐和园路5号'
  }
]
</script>

<style scoped>

</style>
