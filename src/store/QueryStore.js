import { defineStore } from "pinia";

export  const QueryStore = defineStore({
    id:"QueryStore",
    undoOption:{
        enabled:true,
    },
    state:()=>({
        x_encoding:null,
        x_aggregate:null,
        x_bin:false,
        y_encoding:null,
        y_bin:false,
        y_aggregate:null,
        category_encoding:null,
        chart_type:null,
    }),
    getters:{
        isSpecAggregate:state=>{
            return state.x_aggregate&&state.y_aggregate;
        },
        hasOpenPosition:state=>{
            return !state.x_encoding||!state.y_encoding;
        },
        hasStyleChannel:state=>{
            return !state.color_encoding;
        },
        hasSpecView:state=>{
            return !(state.x_encoding==null&&state.y_encoding==null&&state.category_encoding==null);
        }
    }
});