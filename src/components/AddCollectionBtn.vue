<template>
    <n-button
        v-if="!inCollection"
        text
        class="header_button"
        @click="addCollection"
    >
        <n-icon>
            <star12-regular />
        </n-icon>
    </n-button>
    <n-button v-else text class="header_button" @click="removeCollection">
        <n-icon>
            <star12-filled />
        </n-icon>
    </n-button>
</template>

<script setup>
import {NButton, NIcon} from 'naive-ui';
import { Star12Filled,Star12Regular } from '@vicons/fluent';
import { defineProps,defineEmits } from 'vue-demi';

const props=defineProps({
    inCollection:Boolean,
});

const emits=defineEmits([
    "addCollection",
    "removeCollection"
]);

function addCollection(){
    emits("addCollection");
}

function removeCollection(){
    emits("removeCollection");
}
</script>