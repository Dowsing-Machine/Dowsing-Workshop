<template>
    <n-menu :options="options" mode="horizontal" @update:value="handleUpdate" :value="null"></n-menu>
</template>
<script setup>
import { NMenu, NIcon } from 'naive-ui';
import { Add20Filled, ArrowUndo20Filled, ArrowRedo20Filled, Delete20Filled } from "@vicons/fluent";
import { computed, h } from 'vue-demi';
import { MVStore } from '@/store/MVStore';
const mvStore = MVStore();

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
        disabled: mvStore.currentViewId == null,
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
            break;
        case "redo":
            break;
    }
}
</script>