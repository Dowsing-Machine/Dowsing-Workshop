<template>
    <n-menu :options="options" mode="horizontal" @update:value="handleUpdate" :value="null"></n-menu>
    <div v-if="false">
        <n-button @click="stepBack">回滚</n-button>
        <n-button @click="stepForward">前进</n-button>
        <n-button @click="debug">调试</n-button>
    </div>
</template>
<script setup>
import { NMenu, NIcon, NSpace, NButton } from 'naive-ui';
import { Add20Filled, ArrowUndo20Filled, ArrowRedo20Filled, Delete20Filled } from "@vicons/fluent";
import { computed, h } from 'vue-demi';
import { MVStore } from '@/store/MVStore';
import { ControlStore } from '../store/ControlStore';

import { stepBack, stepForward, debug } from "@/store/plugins/stateRecord";

const mvStore = MVStore();
const controlStore = ControlStore();


const options = computed(() => ([
    {
        label: "添加",
        key: "add",
        icon: () => h(
            NIcon,
            null,
            { default: () => h(Add20Filled) }
        )
    },
    {
        label: "删除",
        key: "delete",
        icon: () => h(
            NIcon,
            null,
            { default: () => h(Delete20Filled) }
        ),
        disabled: controlStore.currentViewId == null,
    },
    {
        label: "撤销",
        key: "undo",
        icon: () => h(
            NIcon,
            null,
            { default: () => h(ArrowUndo20Filled) }
        )
    },
    {
        label: "重做",
        key: "redo",
        icon: () => h(
            NIcon,
            null,
            { default: () => h(ArrowRedo20Filled) }
        )
    },
]))


const handleUpdate = (key) => {
    switch (key) {
        case "add":
            mvStore.addView();
            break;
        case "undo":
            mvStore.undo();
            break;
        case "redo":
            mvStore.redo();
            break;
        case "delete":
            mvStore.removeView(controlStore.currentViewId);
            break;
    }
}

</script>