<template>
    <n-space style="margin: 10px;">
        <n-tag v-for="tag in activateTags" :key="tag.label" :color="tag.color">{{ tag.label }}</n-tag>
    </n-space>
</template>
<script setup>
import { NTag,NSpace } from "naive-ui";
import { DebugStore } from '@/store/DebugStore';
import { computed } from "vue";
const debugStore = DebugStore();

const color_mapping = {
    "数据转换": { textColor: "#72b7b2", borderColor: "#72b7b2", color:"#e3f1f0"},
    "关联": { color: "#4c78a8" },
    "关联（趋势）": { color: "#f58518" },
    "对比": { borderColor: "#e45756",textColor: "#e45756", color:"#F8D4D4"},
    "确认值": { color: "#ddecdb",borderColor:"#54a24b",textColor:"#54a24b" },
    "聚类/异常": { color: "#eeca3b" },
}

const activateTags = computed(() => {
    return debugStore.predicts.slice(-6).filter(t => t.score[0] > 0.5).map(t => ({
        label: t.type,
        color: color_mapping[t.type],
        value: t.score[0]
    }));
})

</script>