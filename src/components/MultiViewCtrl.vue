<template>
    <n-menu :options="options" mode="horizontal" @update:value="handleUpdate" :value="null"></n-menu>
</template>
<script setup>
import { NMenu, NIcon, NSpace, NButton } from 'naive-ui';
import { Add20Filled, ArrowUndo20Filled, ArrowRedo20Filled, Delete20Filled } from "@vicons/fluent";
import { computed, h } from 'vue-demi';
import { MVStore } from '@/store/MVStore';
import { ControlStore } from '../store/ControlStore';
import { QueryStore } from '../store/QueryStore';

import { stepBack, stepForward, debug } from "@/store/plugins/stateRecord";

const mvStore = MVStore();
const controlStore = ControlStore();
const queryStore = QueryStore();

const options = computed(() => ([
    // {
    //     label: "添加",
    //     key: "add",
    //     icon: () => h(
    //         NIcon,
    //         null,
    //         { default: () => h(Add20Filled) }
    //     )
    // },
    // {
    //     label: "删除",
    //     key: "delete",
    //     icon: () => h(
    //         NIcon,
    //         null,
    //         { default: () => h(Delete20Filled) }
    //     ),
    //     disabled: controlStore.currentViewId == null,
    // },
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
            queryStore.undo();
            break;
        case "redo":
            queryStore.redo();
            break;
        case "delete":
            mvStore.removeView(controlStore.currentViewId);
            break;
    }
}

</script>