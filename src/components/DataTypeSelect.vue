<template>
    <div style="margin:5px 0">
        <n-button-group size="small">
            <n-button round type="success" secondary>{{ name }}</n-button>
            <n-popselect 
            :value="type" 
            :options="options"
            @update:value="emits('update',$event)"
            >
                <n-button round secondary >
                    <n-icon v-if="type == 'quantitative'">
                        <NumberSymbol24Filled />
                    </n-icon>
                    <n-icon v-else-if="type == 'nominal'">
                        <BookLetter24Regular />
                    </n-icon>
                </n-button>
            </n-popselect>
        </n-button-group>
    </div>
</template>

<script setup>
import { defineProps,defineEmits } from 'vue-demi';
import { NPopselect, NButton, NIcon, NButtonGroup } from 'naive-ui';
import { NumberSymbol24Filled, BookLetter24Regular } from "@vicons/fluent";

const props = defineProps({
    name: String,
    type: String
})

const  emits=defineEmits(["update"])

const options = [
    {
        label: "nominal",
        value: "nominal"
    },
    {
        label: "quantitative",
        value: "quantitative"
    }
]

</script>