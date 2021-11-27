import { defineStore } from 'pinia'

import CarJSON from '@/assets/carjson.json'
import _ from 'lodash'

export const DatasetStore=defineStore({
    id:"DatasetStore",
    state:()=>({
        dataset:CarJSON,
    }),
    getters:{
        columns:state=>{
            if(state.dataset.length>0){
                return _.keys(state.dataset[0])
            }
            else{
                return []
            }
        },
    }
})
