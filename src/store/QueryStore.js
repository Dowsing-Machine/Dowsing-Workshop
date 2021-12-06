import _ from "lodash";
import { defineStore } from "pinia";

export const QueryStore = defineStore({
    id: "QueryStore",
    undoOption: {
        enabled: true,
    },
    state: () => ({
        x_encoding: null,
        x_aggregate: null,
        x_filter: null,
        // x_bin:false,
        y_encoding: null,
        // y_bin:false,
        y_aggregate: null,
        y_fillter: null,
        category_encoding: null,
        category_aggregate: null,
        category_filter: null,
        chart_type: null,
        filter: []   //[{filter:"...condiation",column:"...field",predicate:"range|oneOf"}]
    }),
    getters: {
        isSpecAggregate: state => {
            return state.x_aggregate && state.y_aggregate;
        },
        hasOpenPosition: state => {
            return !state.x_encoding || !state.y_encoding;
        },
        hasStyleChannel: state => {
            return !state.color_encoding;
        },
        hasSpecView: state => {
            return !(state.x_encoding == null && state.y_encoding == null && state.category_encoding == null);
        },
        getFilterByColumn(state) {
            return (column) => {
                const filter = state.filter.find(f => f&&(f.column == column));
                if (filter) {
                    return filter;
                }
                else {
                    return null;
                }
            }
        },
    },
    actions: {
        setFilterByColumn(column, filter) {
            const existFilter = this.filter.find(f => f&&(f.column == column));
            if (existFilter) {
                existFilter.filter=filter.filter;
            }
            else {
                this.filter.push(filter);
            }
        },
        refreshFilter(){
            this.filter=this.filter.filter(
                f=>f&&_.find(
                    [this.x_encoding,this.y_encoding,this.category_encoding],
                    c=>c==f.column
                )
            );
        },
        editEncoding(channel, encoding) {
            this.$patch(()=>{
                this[channel] = encoding;
                this.refreshFilter();
                if(channel=="x_encoding"){
                    this.x_aggregate=null;
                }
                else if(channel=="y_encoding"){
                    this.y_aggregate=null;
                }
                else if(channel=="category_encoding"){
                    this.category_aggregate=null;
                }
            })
        }
    }
});
