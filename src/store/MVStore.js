import _ from "lodash"

import { defineStore } from 'pinia'

import View from "@/models/View"

export const MVStore = defineStore({
    id: "MVStore",
    state: () => ({
        currentViewId: null,
        views: [],
        mode: "添加",
        tempView: new View(),
    }),
    getters: {
        currentView: state => {
            if (state.currentViewId == null) {
                // state.addView();
                // state.currentViewId = state.views.length - 1;
                return state.tempView;
            }
            else return state.views[state.currentViewId];
        },
        nextViewId: state => {
            return state.views.length;
        },

    },
    actions: {
        selectView(id = null) {
            this.currentViewId = id;
            this.mode = id ? "修改" : "添加";
        },
        addView(view = null) {
            if (view == null) { view = this.tempView }
            this.views.push(view);
            this.mode = "添加";
            this.selectView(view.id);
            this.tempView = new View();
        },
        removeView(id) {
            this.views.splice(id, 1);
            this.selectView(null);
        },
        editView(id, view) {
            this.views[id] = view;
        },
    },
})