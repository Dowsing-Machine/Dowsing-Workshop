import _ from "lodash"

import { defineStore } from 'pinia'

const DEFAULT_VIEW = {
    chart_type: "bar",
    x_encoding: null,
    x_aggregate: null,
    y_encoding: null,
    y_aggregate: null,
    category_encoding: null,
    category_mark: null,
    group_by: null,
    task_mark:null,
};

export const MVStore=defineStore({
    id:"MVStore",
    state:()=>({
        currentViewId:null,
        views:[],
        mode:"添加"
    }),
    getters:{
        currentView:state=>{
            if(state.currentViewId==null){
                state.addView();
                state.currentViewId=state.views.length-1;
            }
            return state.views[state.currentViewId];
        },
        
    },
    actions:{
        selectView(id=null){
            this.currentViewId=id;
            this.mode = "修改";
        },
        addView(view=DEFAULT_VIEW){
            this.views.push(_.clone(view));
            this.mode = "添加";
        },
        removeView(id){
            this.views.splice(id,1);
            this.selectView(null);
        },
        editView(id,view){
            this.views[id]=view;
        },
    },
})