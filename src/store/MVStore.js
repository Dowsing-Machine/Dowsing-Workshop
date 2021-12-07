import _ from "lodash"

import { defineStore } from 'pinia'

import View from "@/models/View"
import { ControlStore } from "./ControlStore"



export const MVStore = defineStore({
    id: "MVStore",
    undoOption:{
        enabled: false,
        clone:(state)=>{
            return _.cloneDeep(state);
        },
    },
    recordOption:{
        enabled: true,
    },
    state: () => ({
        views: [],
    }),
    actions: {
        addView(view = null) {
            if (view == null) { view = new View() }
            this.views.push(view);
        },
        removeView(id) {
            const controlStore = ControlStore();
            const index=this.views.findIndex(view => view.id === id);
            this.views.splice(index, 1);
            controlStore.currentViewId=null;
        },
    },

})