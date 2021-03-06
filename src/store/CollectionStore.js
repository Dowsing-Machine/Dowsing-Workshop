import { defineStore } from "pinia";

import _ from "lodash";

// let idx=0;

function findUseableLayout(layouts,size={w:4,h:2}){
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
        specIds:{},
        notes: {},
        idx:0,
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

                this.$patch(state=>{
                    this.collections.push(_.cloneDeep(spec));
                    if (!_.has(state.specIds, strSpec)) {
                        state.specIds[strSpec] = state.idx++;
                    }
                    state.layouts.push({
                        ...findUseableLayout(state.layouts),
                        i: state.specIds[strSpec]
                    });
                })

                // if(!_.has(this.specIds,strSpec)){
                //     this.specIds[strSpec] = this.idx++;
                // }
                // this.collections.push(_.cloneDeep(spec));
                // this.layouts.push({
                //     ...findUseableLayout(this.layouts),
                //     i:this.specIds[strSpec]
                // });
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
        },
        addNote(spec, note){
            // console.log(this.notes)
            this.notes[spec] = note
        },
        load(data){
            this.$patch(()=>{
                this.collections=data.collections;
                this.layouts=data.layout;
                this.notes=data.notes;
                this.specIds=data.specIds;
                this.idx=_.max(_.values(this.specIds))+1;
            })
        }
    }
});
