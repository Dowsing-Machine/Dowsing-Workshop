import _ from "lodash"

import { defineStore } from 'pinia'

import View from "@/models/View"
import createStack from "@/utils/undo_stacker"
import { ControlStore } from "./ControlStore"



export const MVStore = defineStore({
    id: "MVStore",
    undoOption:{
        enabled: true,
        clone:(state)=>{
            return _.cloneDeep(state);
        },
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