import { defineStore } from "pinia";

function calPredicts(p,b,h,alpha=0.5){
    let res={}
    for(const task of model_output){
        res[task.type] = (history[task.type] ?? 0) * alpha + task.score * (1 - alpha);
    }

}

export const DebugStore=defineStore({
    id:"DebugStore",
    state:function(){return{
        predicts:[],
        history:{},
        alpha:0.5
    }},
    getters:{
        predict_tasks:(state)=>{
            const model_output = state.predicts.slice(-6);
            for(const task of model_output){
                history[task.type] = (history[task.type]??0)*state.alpha+task.score*(1-state.alpha);
            }


            return state.predicts.slice(-6).filter(t => t.score[0] > 0.5)??[];
        }
    },
    actions:{
        async updatePredict(action){
            let res = await axios.get("http://localhost:5001/action", {
                params: {
                    topic: action
                }
            })
            const newPredicts=this.predicts.concat(res.data.value);


        }
    }
})