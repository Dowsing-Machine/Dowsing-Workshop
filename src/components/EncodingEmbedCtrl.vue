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
                <n-button
                    round
                    :type="encoding ? 'primary' : 'default'"
                    style="flex: auto;"
                >{{ columnPlacehold }}</n-button>
            </n-popselect>

            <n-popover
                trigger="click"
                :show="showFilter"
                @update:show="onFilterOpen"
                @clickoutside="showFilter = false"
                :disabled="disableFilterAndAggregate"
            >
                <template #trigger>
                    <n-button :disabled="disableFilterAndAggregate">
                        <n-icon>
                            <filter16-filled />
                        </n-icon>
                    </n-button>
                </template>
                <div v-if="type == 'quantitative'">
                    <n-slider
                        :value="filter.filter"
                        range
                        :step="1"
                        :max="column.max"
                        :min="column.min"
                        style="margin:10px 0"
                        @update:value="onFilterUpdate"
                    />
                    <n-space vertical>
                        <n-input-number size="small" v-model:value="filter.filter[0]" />
                        <n-input-number size="small" v-model:value="filter.filter[1]" />
                    </n-space>
                </div>
                <div v-else-if="type == 'nominal'">
                    <n-checkbox-group
                        :value="filter.filter"
                        @update:value="onFilterUpdate"
                        :disabled="disableFilterAndAggregate"
                    >
                        <n-space warp style="max-width: 240px;max-height: 400px;overflow: auto;">
                            <n-checkbox
                                v-for="item in column.unique"
                                :key="item"
                                :value="item"
                                :label="item"
                            ></n-checkbox>
                        </n-space>
                    </n-checkbox-group>
                </div>
            </n-popover>

            <n-popselect
                :value="aggregate"
                :options="SUPPORTED_AGGREGATE"
                @update:value="onAggregateUpdate"
                :disabled="!encoding"
            >
                <n-button round :disabled="disableFilterAndAggregate">
                    <n-icon :color="aggregate == null ? null : themeVars.primaryColor">
                        <Autosum24Filled />
                    </n-icon>
                </n-button>
            </n-popselect>
        </n-button-group>
    </div>
</template>
<script setup>
import { NButton, NButtonGroup, NIcon, NPopselect, NTooltip, NSlider, useThemeVars, NPopover, NSpace, NInputNumber, NCheckbox, NCheckboxGroup } from 'naive-ui';
import { NumberSymbol24Filled, BookLetter24Regular, Settings24Regular, MathFormula24Filled, Autosum24Filled, Question24Filled, Filter16Filled } from "@vicons/fluent";

import _ from "lodash"

import { defineProps, defineEmits, computed, ref } from "vue-demi";

import { nextTick } from 'vue-demi';

import { COUNT } from "@/query";

const props = defineProps({
    encoding: String,
    aggregate: String,
    filter: [Object, null],
    columns: Array
});

const column = computed(() => {
    console.log(props.columns, props.encoding, _.find(props.columns, { name: props.encoding }))
    return _.find(props.columns, { name: props.encoding });
})

const themeVars = useThemeVars();

const emits = defineEmits([
    "update:encoding",
    "update:aggregate",
    "update:filter"
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
        label: "分箱",
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
    if (props.encoding == COUNT) return "quantitative";
    return _.find(props.columns, column => column.name === props.encoding).type;
})

function onEncodingUpdate(value) {
    // emits("update:filter", null);
    if (value === NULL) {
        emits('update:encoding', null);
    }
    else {
        emits('update:encoding', value);

    }
}

function onAggregateUpdate(value) {
    // emits("update:filter", null);

    if (value === NULL) {
        emits('update:aggregate', null);
    }
    else {
        emits('update:aggregate', value);
    }
}

const showFilter = ref(false);

async function onFilterOpen() {
    // 当Filter打开的时候，如果没有配置filter就需要配置filter
    if (props.filter == null) {
        if (type.value == "quantitative") {
            emits('update:filter', {
                filter: [column.value.min, column.value.max],
                column: column.value.name,
                predicate: "range"
            });
        }
        else {
            emits('update:filter', {
                filter: column.value.unique,
                column: column.value.name,
                predicate: "oneOf"
            });
        }
    }
    showFilter.value = true;
}


function onFilterUpdate(value) {
    emits('update:filter', {
        filter: value
    });
}

const disableFilterAndAggregate = computed(() => {
    return !props.encoding || props.encoding == COUNT;
})

</script>