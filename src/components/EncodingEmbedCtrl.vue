<template>
    <div style="margin:5px 0">
        <n-button-group size="small" style="width: 100%;">
            <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                    <n-button round>
                        <n-icon v-if="type == 'quantitative'">
                            <NumberSymbol24Filled />
                        </n-icon>
                        <n-icon v-else-if="type == 'nominal'">
                            <BookLetter24Regular />
                        </n-icon>
                        <n-icon v-else>
                            <Question24Filled></Question24Filled>
                        </n-icon>
                    </n-button>
                </template>
                {{ type }}
            </n-tooltip>

            <n-popselect
                :value="encoding"
                :options="encodingOptions"
                @update:value="onEncodingUpdate"
            >
                <n-button round :type="encoding ? 'primary' : 'default'" style="flex: auto;">
                    {{ columnPlacehold }}
                </n-button>
            </n-popselect>

            <n-popselect
                :value="aggregate"
                :options="SUPPORTED_AGGREGATE"
                @update:value="onAggregateUpdate"

            >
                <n-button round>
                    <n-icon :color="aggregate == null ? null : themeVars.primaryColor">
                        <Autosum24Filled />
                    </n-icon>
                </n-button>
            </n-popselect>
        </n-button-group>
    </div>
</template>
<script setup>
import { NButton, NButtonGroup, NIcon, NPopselect, NTooltip, NSlider, useThemeVars } from 'naive-ui';
import { NumberSymbol24Filled, BookLetter24Regular, Settings24Regular, MathFormula24Filled, Autosum24Filled, Question24Filled } from "@vicons/fluent";

import _ from "lodash"

import { defineProps, defineEmits, computed, ref } from "vue-demi";

import {COUNT} from "@/query";

const props = defineProps({
    encoding: String,
    aggregate: String,
    columns: Array
});

const themeVars = useThemeVars();

const emits = defineEmits([
    "update:encoding",
    "update:aggregate"
]);

const NULL = Symbol();

const SUPPORTED_AGGREGATE = [
    {
        label: "空",
        value: NULL
    },
    {
        label: "求和",
        value: "sum"
    },
    {
        label: "平均值",
        value: "mean"
    },
    {
        label: "最大值",
        value: "max"
    },
    {
        label: "最小值",
        value: "min"
    },
    {
        label: "装箱",
        value: "bin"
    }
];

const columnPlacehold = computed(() => {
    if (!props.aggregate && !props.encoding) {
        return "请选择字段";
    }
    else if (!props.aggregate) {
        return props.encoding;
    }
    else {
        const shortColumn = _.truncate(props.encoding, { length: 12 });
        return `${props.aggregate}(${shortColumn})`;
    }
})

const encodingOptions = computed(() => {
    return [
        {
            label: "空",
            value: NULL
        },
        ...props.columns.map(column => ({
            label: column.name,
            value: column.name
        })),
        {
            label: "COUNT",
            value: COUNT
        }
    ]
})

const type = computed(() => {
    if (!props.encoding) return "unknown";
    if(props.encoding==COUNT) return "quantitative";
    return _.find(props.columns, column => column.name === props.encoding).type;
})

function onEncodingUpdate(value) {
    if (value === NULL) {
        emits('update:encoding', null);
    }
    else {
        emits('update:encoding', value);

    }
}

function onAggregateUpdate(value) {
    if (value === NULL) {
        emits('update:aggregate', null);
    }
    else {
        emits('update:aggregate', value);
    }
}

</script>