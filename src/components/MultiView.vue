<template>
    <n-grid x-gap="12" y-gap="8" cols="3 1000:4">
        <n-grid-item v-for="view,i in views" :key="view.id">
            <single-view :view="view" :viewId="view.id" @fullscreen="onFullscreen(view)"></single-view>
        </n-grid-item>
    </n-grid>
</template>

<script setup>
import { MVStore } from '@/store/MVStore';
import SingleView from '@/components/SingleView.vue';
import hljs from 'highlight.js/lib/core'
import { computed, watch, ref, h } from 'vue-demi';
import { NGrid, NGridItem, useDialog } from "naive-ui"


const mvStore = new MVStore();

const views = computed(() => mvStore.views);


function onFullscreen(view) {
    dialog.create(
        {
            content: ()=>h(
                SingleView,
                {
                    view
                }
            )
        }
    )
}

const dialog = useDialog();


</script>