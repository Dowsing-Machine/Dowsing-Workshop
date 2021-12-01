<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { NDialogProvider,NConfigProvider,NThemeEditor } from 'naive-ui'; 
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :dateLocale="dateZhCN">
  <n-dialog-provider>
    <div class="app">
      <router-view></router-view>
    </div>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style>
</style>
