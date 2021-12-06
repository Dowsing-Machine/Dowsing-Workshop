import { defineStore } from 'pinia'

import * as cql from "compassql";
// const cql=require('compassql');

import CarJSON from '@/assets/carjson.json'
import _ from 'lodash'

export const DatasetStore=defineStore({
    id:"DatasetStore",
    recordOption:{
        enabled:true,
        clone:(state)=>({
            userDefinedColType:_.cloneDeep(state.userDefinedColType)
        }),
        diff: (newState, state)=>{
            const res = !_.isEqual(state.userDefinedColType, newState.userDefinedColType)
            console.log("diff", res, state.userDefinedColType, newState.userDefinedColType);
            return res;
        }
    },
    state:()=>({
        dataset:CarJSON,
        userDefinedColType:{}
    }),
    getters:{
        columns:state=>{
            if(state.dataset.length>0){
                const columns = _.keys(state.dataset[0])
                const res=[];
                for(let col of columns){
                    let colData = _.map(state.dataset,col);
                    let unique = _.uniq(colData).sort();
                    let numbersCount = _(colData).map(_.isNumber).sum();
                    let numberRatio = numbersCount/colData.length;
                    let uniqueRatio = unique.length/colData.length;
                    // console.log(numberRatio,uniqueRatio);
                    if(state.userDefinedColType[col]!=null){
                        res.push({
                            name:col,
                            type:state.userDefinedColType[col],
                            min: _(colData).filter(_.isNumber).min(),
                            max: _(colData).filter(_.isNumber).max(),
                            unique,
                        })
                    }
                    else if(numberRatio>0.9 && uniqueRatio>0.1){
                        res.push({
                            name:col,
                            type:"quantitative",
                            min: _(colData).filter(_.isNumber).min(),
                            max: _(colData).filter(_.isNumber).max(),
                            unique,
                        });
                    }
                    else{
                        res.push({
                            name:col,
                            type:"nominal",
                            min: _(colData).filter(_.isNumber).min(),
                            max: _(colData).filter(_.isNumber).max(),
                            unique,
                        });
                    }
                }
                return res;
            }
            else{
                return []
            }
        },
        schema:state=>{
            return cql.schema.build(state.columns);
        }
    },
    actions:{
        defineColType(col,type){
            this.userDefinedColType[col]=type;
        },
        clearDefinedColType(){
            this.userDefinedColType={};
        }
    }
})
