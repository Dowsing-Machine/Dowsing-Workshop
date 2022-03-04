<template>
    <n-card style="width: fit-content;margin:5px;max-width:100%" hoverable>
        <template #header>
            <n-space>
                <n-tag
                    v-for="channel in channels"
                    :key="channel.channel"
                    :type="channel.isWildCard ? 'warning' : ''"
                >
                    <div v-if="channel.aggregate">{{ channel.aggregate }}({{ channel.field }})</div>
                    <div v-else-if="channel.bin">Bin({{ channel.field }})</div>
                    <div v-else>{{ channel.field }}</div>
                </n-tag>
            </n-space>
        </template>
        <template #header-extra>
            <n-space style="margin-left: 10px;">
                <n-popover  
                    trigger="click"
                    @update:show="onToggle"
                >
                    <template #trigger>
                        <n-button text class="header_button">
                            <n-icon>
                                <comment-note24-regular />
                            </n-icon>
                        </n-button>
                    </template>
                    <n-input type="textarea" :value="noteValue" @update:value="addNote($event)"></n-input>
                </n-popover>

                <add-collection-btn-vue
                    :in-collection="collectionStore.inCollection(vegalite)!=null"
                    @addCollection="addCollection"
                    @removeCollection="removeCollection"
                >
                </add-collection-btn-vue>

                <!-- <n-button
                    v-if="!collectionStore.inCollection(vegalite)"
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
                </n-button> -->
                <n-button text class="header_button" @click="specify">
                    <n-icon>
                        <arrow-up16-filled />
                    </n-icon>
                </n-button>
            </n-space>
        </template>
        <div style="overflow: auto;">
            <chart-raw-vue :vegalite="vegalite" style="max-height: 500px;"></chart-raw-vue>
        </div>
    </n-card>
</template>
<script setup>
import { NCard, NButton, NIcon, NTag, NSpace, NPopover, NInput, NPopconfirm } from 'naive-ui';
import ChartRawVue from './ChartRaw.vue';
import AddCollectionBtnVue from './AddCollectionBtn.vue';

import { defineProps, computed, ref, getCurrentInstance } from 'vue-demi';
import { QueryStore } from '../store/QueryStore';
import { CollectionStore } from '../store/CollectionStore';

import { Tag24Filled, Square20Filled, FullScreenMaximize24Filled, ZoomIn24Regular, CommentNote24Regular, Star12Regular, Star12Filled, ArrowUp16Filled } from "@vicons/fluent"

import {spec2query} from "@/utils/specify";

import _ from "lodash";
import { COUNT } from "../query";

const queryStore = QueryStore();
const collectionStore = CollectionStore();
const { proxy } = getCurrentInstance();


const props = defineProps({
    vegalite: Object,
    group:Object
})

const noteValue = computed(() => {
    if (collectionStore.notes[JSON.stringify({...props.vegalite, 'data': null})] != null) {
        return collectionStore.notes[JSON.stringify({...props.vegalite, 'data': null})]
    }
    else {
        return ''
    }
})

function isWildCard(encoding) {
    if (_.find(
        [
            {
                field: queryStore.x_encoding,
                channel: "x",
                aggregate: queryStore.x_aggregate,
            },
            {
                field: queryStore.y_encoding,
                channel: "y",
                aggregate: queryStore.y_aggregate,
            },
            {
                field: queryStore.category_encoding,
                channel: "color",
            }
        ]
        , (item) => {
            return item.field == encoding.field && item.aggregate == encoding.aggregate || item.field == COUNT && encoding.aggregate == "count" && encoding.field == "*";
        })) {
        return false;
    }
    return true;
}

const channels = computed(() => {
    return _(props.vegalite.encoding).toPairs().map(([k, v]) => {
        return {
            channel: k,
            type: v.type,
            field: v.field,
            aggregate: v.aggregate || (v.bin && "bin"),
            // bin: ,
        }
    }).map(e => ({
        ...e,
        isWildCard: isWildCard(e),
    })).value();
})

// function specifyEncoding(encoding, field) {
//     if (encoding[field]) {
//         if (encoding[field].field == "*") {
//             return null;
//         }
//         else {
//             return encoding[field].field;
//         }
//     }
//     else {
//         return null;
//     }
// }

// function specifyAggregate(encoding, field) {
//     if (encoding[field]) {
//         if (encoding[field].bin) {
//             return "bin";
//         }
//         else {
//             encoding[field].aggregate
//         }
//     }
//     else {
//         return null;
//     }
// }

// function specifyChannel(encoding, field) {
//     if (encoding[field]) {
//         if (encoding[field].field == "*" && encoding[field].aggregate == "count") {
//             return {
//                 field: COUNT,
//                 aggregate: null,
//             };
//         }
//         else {
//             if (encoding[field].bin) {
//                 return {
//                     field: encoding[field].field,
//                     aggregate: "bin",
//                 };
//             }
//             else {
//                 return {
//                     field: encoding[field].field,
//                     aggregate: encoding[field].aggregate,
//                 };
//             }
//         }
//     }
//     else {
//         return {
//             field: null,
//             aggregate: null,
//         };
//     }
// }

// function spec2query(vegalite) {
//     return {
//         x_encoding: specifyChannel(vegalite.encoding, "x").field,
//         y_encoding: specifyChannel(vegalite.encoding, "y").field,
//         category_encoding: specifyChannel(vegalite.encoding, "color").field,
//         x_aggregate: specifyChannel(vegalite.encoding, "x").aggregate,
//         y_aggregate: specifyChannel(vegalite.encoding, "y").aggregate,
//         category_aggregate: specifyChannel(vegalite.encoding, "color").aggregate,
//         chart_type: vegalite.mark,
//     }
// }

function specify() {



    proxy.$EventBus.emit(`user:specify:${props.group?.type??'same'}`,{
        vegalite: props.vegalite,
        from:"recommend",
    })
    queryStore.$patch(spec2query(props.vegalite));
}

function addCollection() {
    proxy.$EventBus.emit(`user:collection:add`,{
        vegalite: {...props.vegalite, 'data': null},
    });
    collectionStore.add({...props.vegalite, 'data': null});
}

function removeCollection() {
    proxy.$EventBus.emit(`user:collection:remove`,{
        vegalite: {...props.vegalite, 'data': null},
    });
    collectionStore.remove({...props.vegalite, 'data': null});
}

function addNote(noteValue) {
    proxy.$EventBus.emit(`user:note:add`,{
        target: JSON.stringify({...props.vegalite, 'data': null}),
        note: noteValue,
    });
    addCollection();
    collectionStore.addNote(JSON.stringify({...props.vegalite, 'data': null}), noteValue)
}

function onToggle(){
    proxy.$EventBus.emit("user:control:note:toggle",{
        target: props.vegalite,
        insideCollection:false
    });
}
</script>
