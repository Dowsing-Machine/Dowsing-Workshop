const DEFAULT_VIEW = {
    chart_type: "bar",
    x_encoding: null,
    x_aggregate: null,
    x_filter:d=>true,
    y_encoding: null,
    y_aggregate: null,
    y_filter:d=>true,
    category_encoding: null,
    category_mark: null,
    category_filter:d=>true,
    group_by: null,
    task_mark: null,
}

import {reactive} from "vue"
import {DatasetStore} from "@/store/DatasetStore"

const datasetStore=DatasetStore();

class View{
    constructor(options){
        Object.assign(this, DEFAULT_VIEW);
        Object.assign(this, options);
        reactive(this);
    }

    compileToVegaLite(){
        const data_value=datasetStore.dataset.filter(this.x_filter).filter(this.y_filter).filter(this.category_filter);

        let vl = {
            "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
            "data": {
                "values": data_value
            },
            "mark": this.chart_type,
            // "width": "container",
            // "height": "container",
            "encoding": {
                "x": {
                    "field": this.x_encoding,
                    // "type": "nominal",
                    "aggregate": this.x_aggregate,
                    "axis": {
                        "title": this.x_encoding
                    }
                },
                "y": {
                    "field": this.y_encoding,
                    // "type": "quantitative",
                    "aggregate": this.y_aggregate,
                    "axis": {
                        "title": this.y_encoding
                    }
                },
                "color": {
                    "field": this.category_encoding,
                    // "type": "nominal",
                    "axis": {
                        "title": this.category_encoding
                    }
                }
            }
        }
        return vl;
    }
}

export default View;