import { defineStore } from "pinia";

export const DebugStore=defineStore({
    id:"DebugStore",
    state:()=>({
        predicts:[],
        newItems:[]
    })
})