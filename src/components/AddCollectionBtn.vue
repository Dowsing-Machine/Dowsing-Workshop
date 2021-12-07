<template>
    <n-button v-if="!inCollection" text class="header_button" @click="addCollection">
        <n-icon>
            <star12-regular />
        </n-icon>
    </n-button>
    <n-popconfirm @positive-click="removeCollection" v-else>
        <template #trigger>
            <n-button text class="header_button">
                <n-icon color="#ffac2d">
                    <star12-filled />
                </n-icon>
            </n-button>
        </template>
        该视图已经在收藏夹中。要删除本收藏吗？删除将无法恢复。
    </n-popconfirm>
</template>

<script setup>
import { NButton, NIcon, NPopconfirm } from 'naive-ui';
import { Star12Filled, Star12Regular } from '@vicons/fluent';
import { defineProps, defineEmits } from 'vue-demi';

const props = defineProps({
    inCollection: Boolean,
});

const emits = defineEmits([
    "addCollection",
    "removeCollection"
]);

function addCollection() {
    emits("addCollection");
}

function removeCollection() {
    emits("removeCollection");
}
</script>