import { defineStore } from "pinia";

import _ from "lodash";

export const CollectionStore = defineStore({
    id: "CollectionStore",
    state: () => ({
        collections: [],
        notes: {}
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
                this.collections.push(_.cloneDeep(spec));
            }
        },
        remove(spec){
            if(this.inCollection(spec)){
                this.collections = _.filter(this.collections, (c)=>{
                    return !_.isEqual(c, spec);
                });
            }
        },
        addNote(spec, note){
            console.log(this.notes)
            this.notes[spec] = note
        }
    }
});
