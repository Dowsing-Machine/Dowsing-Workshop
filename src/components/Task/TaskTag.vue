<template>
    <div class="flex flex-nowrap mx-2">
        <div class="flex flex-wrap flex-grow flex-col" :warp="false">
            <transition-group name="tag">
                <n-tag
                    closable
                    v-for="tag in activateTags"
                    :key="tag.label"
                    :color="tag.status == 'normal' ? tag.color : 'grey'"
                    @close="punishTask(tag.label)"
                    class="mx-1 my-1"
                    :style="{
                        width: `${tag.length * 90}%`,
                    }"
                    bordered
                >
                    {{ tag.label }}
                </n-tag>
            </transition-group>
        </div>

        <n-dropdown
            :options="dropdownOpts"
            placement="right-start"
            show-arrow
            :on-select="onSelected"
        >
            <n-button circle class="m-1" type="primary">+</n-button>
        </n-dropdown>
    </div>
</template>
<script setup>
import { NTag, NSpace, NButton, NDropdown, NIcon } from "naive-ui";
// import { DebugStore } from '@/store/DebugStore';
import { TaskStore } from "../../store/TaskStore";
import { computed } from "vue";
import _ from "lodash";
import { Square16Filled } from "@vicons/fluent";
import { CloseRound } from "@vicons/material";
import { h } from "vue";
// const debugStore = DebugStore();
const taskStore = TaskStore();
const color_mapping = {
    "数据转换": { textColor: "#72b7b2", borderColor: "#72b7b2", color: "#e3f1f0" },
    "关联": { color: "#dbe4ee", borderColor: "#4c78a8", textColor: "#4c78a8" },
    "关联（趋势）": { textColor: "#f58518", color: "#fde7d1", borderColor: "#f58518" },
    "对比": { borderColor: "#e45756", textColor: "#e45756", color: "#F8D4D4" },
    "确认值": { color: "#ddecdb", borderColor: "#54a24b", textColor: "#54a24b" },
    "聚类/异常": { color: "#fcf4d8", borderColor: "#eeca3b", textColor: "#eeca3b" },
}

const activateTags = computed(() => {
    return _.sortBy(taskStore.activate_task.map(item => {
        return {
            label: item.type,
            color: color_mapping[item.type],
            value: item.score,
            length: _.round(item.score, 2),
            status: "normal",
        }
    }), i => -i.value);
})

function punishTask(task) {
    taskStore.punishTask(task);
}

function renderIcon(color) {
    return () => {
        return h(NIcon, null, {
            default: () => h(Square16Filled, { color: color })
        })
    }
}

const dropdownOpts = [
    {
        label: "数据转换",
        icon: renderIcon(color_mapping["数据转换"].borderColor),
        key: "数据转换",
    },

    {
        label: "关联",
        icon: renderIcon(color_mapping["关联"].borderColor),
        key: "关联",
    },
    {
        label: "关联（趋势）",
        icon: renderIcon(color_mapping["关联（趋势）"].borderColor),
        key: "关联（趋势）",
    },
    {
        label: "对比",
        icon: renderIcon(color_mapping["对比"].borderColor),
        key: "对比",
    },
    {
        label: "确认值",
        icon: renderIcon(color_mapping["确认值"].borderColor),
        key: "确认值",
    },
    {
        label: "聚类/异常",
        icon: renderIcon(color_mapping["聚类/异常"].borderColor),
        key: "聚类/异常",
    },
]

function onSelected(key) {
    taskStore.addTask(key);
}
</script>

<style scoped>
.tag-enter-from,
.tag-leave-to {
    /* @apply scale-x-0; */
    transform: scaleX(0);
    transform-origin: left;
}

.tag-enter-active,
.tag-leave-active {
    @apply transition-all duration-500;
}

.tag-move {
    @apply transition-all duration-500;
}

.n-tag:deep(.n-tag__content) {
    @apply flex-1;
}
</style>