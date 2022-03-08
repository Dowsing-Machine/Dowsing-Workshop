<template>
    <n-space vertical class="p-3">
        <n-card v-for="vl in vls" >
            <chart-v-l-vue :spec="vl"></chart-v-l-vue>
        </n-card>
    </n-space>
</template>
<script setup>
import ChartVLVue from '../Basic/ChartVL.vue';
import { NCard } from 'naive-ui';
import _ from "lodash";

import { DebugStore } from '../../store/DebugStore';
import { DatasetStore } from '../../store/DatasetStore';
import { TaskStore } from '../../store/TaskStore';
import Draco from "draco-vis";
import * as DracoCore from "draco-vis";
import { computed, ref, watch } from 'vue';
const draco = new Draco();
const debugStore = DebugStore();
const datasetStore = DatasetStore();
const taskStore = TaskStore();

import weights_learned from "./weights_learned.json";
import { NSpace } from 'naive-ui';

const hard_programs = [
    ":- not mark(point); not mark(bar); not mark(line).",
    "task(summary) :- utask(transform).",
    ":- not channel(_,x); not channel(_,y); not channel(_,color).",
    // ":- channel(_,shape).",
    ":- channel(_,shape).",
    ":- channel(_,detail).",
    "encoding(e0).",
    ":- not field(e0,_).",
    "encoding(e1).",
    ":- not field(e1,_).",
    // "encoding(e2).",
    // ":- not field(e2,_).",
    // `data("${datasetStore.name}").`,
    ":- {aggregate(_, mean)}>=2."
]

const task_asps = [
    "soft(confirm_mark):- utask(confirm), not mark(line).",
    "soft(correlation_mark):- utask(correlation), mark(point).",
    "soft(trend_mark):- utask(trend), mark(line;bar).",
    // "task(summary) :- utask(transform).",
    // "soft(compare_color):- utask(transform), encoding(E), channel(E,color).",

    'soft(trend_aggregate_x):- utask(trend), encoding(E), channel(E,x),not aggregate(E,_).',
    'soft(trend_x_temporal):- utask(trend), encoding(E), field(E,F), type(E,temporal), channel(E,x).',
    'soft(correlation_x_quantitative):- utask(correlation), encoding(E), field(E,F), type(E,quantitative), channel(E,x).',
    "soft(transform_aggregate_y):- utask(transform), encoding(E), channel(E,y), aggregate(E,_).",

]

const task_weights = {
    // 'confirm_mark': 490,
    // 'correlation_mark': 120,
    // 'trend_mark': 463,
    // 'transform_aggregate_y': 874,
    // // 'transform_aggregate_color': 512,
    // 'trend_aggregate_x': 0,
    // 'trend_x_temporal': 747,
    // 'correlation_x_quantitative': 902
    'confirm_mark': -100,
    'correlation_mark': -100,
    'trend_mark': -200,
    'transform_aggregate_y': -300,
    // 'transform_aggregate_color': 512,
    'trend_aggregate_x': -100,
    'trend_x_temporal': -300,
    'correlation_x_quantitative': -200 
}

const task_map = {
    "数据转换": "transform",
    "确认值": "confirm",
    "关联": "correlation",
    "关联（趋势）": "trend",
    "对比": "compare",
    "聚类/异常": "other",
}

const re_task_names = new RegExp(`(${Object.values(task_map).join('|')})`);

const soft = _.clone(draco.soft);
let inited = false;

draco.init().then(() => {
    //   initeded.value = true;
    //   for (const asp of task_asps) {
    //     const name = asp.match(/soft\((.*?)\)/)[1];
    //     const weight = task_weights[name];
    //     draco.soft.push({
    //       name, weight, asp, description: "test", type: "soft"
    //     });
    inited = true;
    //   }
});

const res = ref({});

// watch(()=>taskStore.activate_task,()=>{
//     console.log("task changed");
// })

// watch(taskStore,()=>{
//     console.log("task changed");
// })

watch(() => taskStore.activate_task, () => {
    if (!inited) return;
    const tsL = taskStore.predicts.length;
    if (tsL == 0) return;
    // console.log('predicts changed');
    const dataSchema = DracoCore.data2schema(datasetStore.dataset);
    for (const col in dataSchema.stats) {
        const isDate = ["year", "date", "month", "day"].includes(col.toLowerCase());
        if (isDate) {
            dataSchema.stats[col].type = 'datetime';
        }
    }
    const dataASP = DracoCore.schema2asp(dataSchema);
    console.log(dataASP);
    // const tasks = _(taskStore.predicts[tsL-1]).toPairs().map(i=>({
    //     type:task_map[i[0]],
    //     score:i[1]
    // })).filter(i=>i.score>0.5).value();
    const tasks = taskStore.activate_task;
    // const tasks = debugStore.predict_tasks.map(i => ({
    //     type: task_map[i.type],
    //     score: i.score,
    // }));
    const taskFASPs = tasks.map(i => `utask(${task_map[i.type]}).`);
    let task_weights_available = [];
    if (tasks.length > 0) {
        const re = new RegExp(tasks.map(i => task_map[i.type]).join('|'));
        console.log(re);
        // const re = new RegExp(tasks.map(i => i.type).join('|'));
        task_weights_available = task_asps.filter(i => re.test(i)).map(i => {
            const name = i.match(/soft\((.*?)\)/)[1];
            const short_name = name.match(re_task_names)[1];
            const task = tasks.find(j => task_map[j.type] == short_name);
            if(task==null){
                console.error(`task ${short_name} not found`,name,i,tasks);
            }
            const weight = Math.round(task_weights[name] * task.score * 0.1);
            return {
                name, weight, asp: i, description: "test", type: "soft"
            };
        });
    }
    
    // const task_weights_available = task_asps.filter(i => re.test(i)).map(i => {
    //     const name = i.match(/soft\((.*?)\)/)[1];
    //     const short_name = name.match(re_task_names)[1];
    //     const task = tasks.find(j => j.type == short_name);
    //     const weight = Math.round(task_weights[name] * task.score[0] * 1);
    //     return {
    //         name, weight, asp: i, description: "test", type: "soft"
    //     };
    // });
    const softW = [
        // ...soft.map(i => ({
        //     ...i,
        //     weight: weights_learned[i.name]
        // })),
        ...soft,
        ...task_weights_available
    ];
    console.log("softW", task_weights_available);
    const weight_assign = task_weights_available.map(i => `soft_weight(${i.name},${i.weight}).`)
    draco.soft = softW;
    const program = [
        ...dataASP,
        ...taskFASPs,
        ...weight_assign,
        ...hard_programs,
    ].join("\n");
    console.log("program", program);
    res.value = draco.solve(program, { models: 10 });
})

const vls = computed(() => {
    return (res.value.specs ?? []).map(i => ({
        ...i,
        data: {
            values: datasetStore.dataset,
        }
    }))
})

</script>