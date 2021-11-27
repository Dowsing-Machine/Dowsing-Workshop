<template>
    <n-select :placeholder="label" :options="columns" clearable @update:value="handleUpdateValue"></n-select>
</template>

<script setup>
import { computed, defineProps } from 'vue-demi';

import { NSelect } from 'naive-ui';
// import { MVStore } from '@/store/MVStore';
defineProps({
    label:String,
    field:String,
    columns:Array,
});

const emit=defineEmits({
    update:null,
});

function handleUpdateValue(value){
    emit('update',value);
}
</script>