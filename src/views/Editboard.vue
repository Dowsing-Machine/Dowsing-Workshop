<template>
    <n-space vertical size="large">
        <n-layout>
            <n-layout-header bordered class="main-header" style="font-size: 2em">
                Dowsing Workshop
            </n-layout-header>
            <n-layout has-sider class="main-middle">
                <n-layout-sider bordered>数据控制面板
                    <data-control></data-control>
                </n-layout-sider>
                <n-layout-content>
                    <n-layout has-sider class="main-middle">
                        <n-layout-sider bordered>
                            单视图控制面板
                        </n-layout-sider>
                        <n-layout-content>
                            多视图界面
                        </n-layout-content>
                    </n-layout>
                </n-layout-content>
            </n-layout>
            <n-layout-footer class="main-footer">
                <n-space justify="space-between">
                    <div>Dowsing</div>
                    <div>VCL318</div>
                </n-space>
            </n-layout-footer>
        </n-layout>
    </n-space>
</template>

<script setup>
import { NLayout, NLayoutHeader, NLayoutFooter, NLayoutSider, NLayoutContent, NSpace } from 'naive-ui';

import DataControl from "@/components/DataControl.vue";

const style = {
    header: {
        height: "64px",
        padding_y: "12px",
        padding_x: "24px",
    },
    footer: {
        height: "28px",
        padding_x: "24px",
        padding_y: "2px"
    },
};
</script>

<style scoped>
.main-header {
    height: v-bind("style.header.height");
    padding: v-bind("style.header.padding_y") v-bind("style.header.padding_x");
}

.main-footer {
    height: v-bind("style.footer.height");
    padding: v-bind("style.footer.padding_y") v-bind("style.footer.padding_x");
}

.main-middle {
    height: calc(
        100vh - v-bind("style.header.height") - v-bind("style.footer.height")
    );
}
</style>