import { defineStore } from 'pinia'

import CarJSON from '@/assets/carjson.json'
import _ from 'lodash'

export const DatasetStore=defineStore({
    id:"DatasetStore",
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
                    let unique = _.uniq(colData);
                    let numbersCount = _(colData).map(_.isNumber).sum();
                    let numberRatio = numbersCount/colData.length;
                    let uniqueRatio = unique.length/colData.length;
                    // console.log(numberRatio,uniqueRatio);
                    if(state.userDefinedColType[col]!=null){
                        res.push({
                            name:col,
                            type:state.userDefinedColType[col]
                        })
                    }
                    else if(numberRatio>0.9 && uniqueRatio>0.1){
                        res.push({
                            name:col,
                            type:"quantitative"
                        });
                    }
                    else{
                        res.push({
                            name:col,
                            type:"nominal"
                        });
                    }
                }
                return res;
            }
            else{
                return []
            }
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
