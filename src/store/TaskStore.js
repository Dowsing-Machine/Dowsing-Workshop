import { defineStore } from "pinia";
import axios from "axios";
import _ from "lodash";

const DEFAULT_TASKS = ["数据转换", "关联", "关联（趋势）", "对比", "确认值", "聚类/异常"];
const B = 2 ** 11;


function calPredicts(p, b, h, opts={}) {
    // p: current model output, Object[task]=Array, valur=[0,1]
    // b: custom setting for tasks, Object[task]=[-inf,+inf]
    // h: history state, Object[task]=[-inf, +inf]
    // a: alpha to control prefer history or current output, [0-1]
    // output: h(t)=b*(h(t-1)*a+p(t)*(1-a))
    const {
        a=0.5,
        mode="history",
        agg_func=x=>Math.max(...x)
    }=opts
    
    const ht = {}
    for (const task in p) {
        ht[task] = b[task] * ((h[task]) * a + agg_func(p[task]) * (1 - a));
        if (mode == "predict") {
            ht[task]=_.clamp(ht[task],0,1);
        }
    }
    // h=ht;
    
    return ht;
}

function punishTask(b, h, t, punish = 0) {
    b[t] = punish;
}

function addTask(b, task) {
    b[task] *= 1.1;
}

function initHistory(tasks = DEFAULT_TASKS, value = 0) {
    const res = {};
    for (const t of tasks) {
        res[t] = value;
    }
    return res;
}

function initCustom(tasks = DEFAULT_TASKS, value = 1) {
    const res = {};
    for (const t of tasks) {
        res[t] = value;
    }
    return res;
}

function getChart(chartId, weightW) {
    return weightW[chartId];
}

export const TaskStore = defineStore({
    id: "TaskStore",
    state: () => {
        const history = initHistory();
        const customs = {};
        return {
            history,
            customs,
            predicts: [],
            alpha: 0.5,
            // i:0
        };
    },
    getters: {
        // current_output:(state)=>{
        //     return state.predicts.slice(-(DEFAULT_TASKS.length));
        // },
        activate_task:(state)=>{
            if (state.predicts.length === 0) return [];
            const pre = state.predicts.slice(-1)[0];
            
            return _.toPairs(pre).map(item => {
                const [type, score] = item;
                return {
                    type,
                    score
                };
            }).filter(item => item.score > 0.5);

        }
    },
    actions: {
        async getPredicts(topic) {
            let res = await axios.get("http://localhost:5001/action", {
                params: {
                    topic
                }
            })

            const modelOut = {};

            for (const item of res.data.value) {
                modelOut[item.type] = item.score

                // newHis[item.type]=calPredicts(item.score,initCustom(),this.history);
                // newPre[item.type] = Math.min(Math.max(calPredicts(item.score, initCustom(), this.history),0),1);

            }
            // console.log(modelOut)
            // const newI=this.i+1;
            const newHis=calPredicts(modelOut,initCustom(),this.history);
            const newPre = calPredicts(
                modelOut, 
                initCustom(), 
                this.history,
                { mode: "predict" }
            );
            const newPredicts = this.predicts.concat(newPre);
            this.$patch({
                history: newHis,
                predicts: newPredicts
            })
            // this.predicts=newPredicts;

        },
        punishTask(t) {
            this.history[t] = -B;
            let newPre = calPredicts(
                this.history, 
                initCustom(), 
                this.history, 
                { agg_func: x => x, mode:"predict"}
            );
            this.predicts.push(newPre);
        },
        addTask(t) {
            this.history[t] = B;
            let newPre = calPredicts(
                this.history,
                initCustom(),
                this.history,
                { agg_func: x => x, mode: "predict" }
            );
            this.predicts.push(newPre);
        }

    },

});

