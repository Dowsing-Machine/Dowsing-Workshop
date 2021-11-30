import { defineStore } from 'pinia'

export const ControlStore= defineStore({
    id: 'control',
    state: ()=>({
        currentViewId: null,
    }),
})