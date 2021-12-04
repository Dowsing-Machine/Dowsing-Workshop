import { defineStore } from "pinia";

import { compileQueryToSepcVegaLite } from "../Models/View";

import * as cql from "compassql"


export const RecommendStore = defineStore({
    id:"RecommendStore",
    state:()=>({
        specifiedView:null,
        relatedViews:[]
    }),
    actions:{
        changeSpecView(resultSet){
            if(resultSet==null){
                this.specifiedView=null;
            }
            else{
                this.specifiedView =cql.result.mapLeaves(resultSet,item=>item.toSpec()).items[0];
            }
        }
    }

});