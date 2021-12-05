import { defineStore } from "pinia";

import _ from "lodash";

let idx=0;

function findUseableLayout(layouts,size={w:2,h:2}){
    return {
        x:0,
        y:_(layouts).map(l=>l.y).max()||0,
        ...size
    }
}

export const CollectionStore = defineStore({
    id: "CollectionStore",
    state: () => ({
        collections: [],
        layouts: [],
        specIds:{}
    }),
    getters: {
        inCollection: state => {
            return (spec) => {
                return _.find(state.collections, spec);
            }
        },
    },
    actions: {
        add(spec){
            if(this.inCollection(spec)){
                return;
            }
            else{
                const strSpec = JSON.stringify(spec);
                if(!_.has(this.specIds,strSpec)){
                    this.specIds[strSpec] = idx++;
                }
                this.collections.push(_.cloneDeep(spec));
                this.layouts.push({
                    ...findUseableLayout(this.layouts),
                    i:this.specIds[strSpec]
                });
            }
        },
        remove(spec){
            if(this.inCollection(spec)){
                this.collections = _.filter(this.collections, (c)=>{
                    return !_.isEqual(c, spec);
                });
                const strSpec = JSON.stringify(spec);
                this.layouts = _.filter(this.layouts, (l)=>{
                    return l.i!==this.specIds[strSpec];
                });
            }
        }
    }
});