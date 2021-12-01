const DEFAULT_VIEW = {
    chart_type: "bar",
    x_encoding: null,
    x_aggregate: null,
    x_filter: [, ],
    y_encoding: null,
    y_aggregate: null,
    y_filter: [0, 100],
    category_encoding: null,
    category_mark: null,
    category_filter: d => true,
    group_by: null,
    task_mark: null,
}

import { reactive } from "vue"
let idCount = 0;

class View {
    constructor(options) {
        Object.assign(this, DEFAULT_VIEW);
        Object.assign(this, options);
        this.id = idCount++;
        reactive(this);
    }

    static clone(view){
        return new View(view);
    }

    compileToVegaLite(dataset) {
        let vl = {
            "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
            "data": {
                "values": dataset
            },
            "mark": this.chart_type,
            "width": "container",
            "height": 200,
            "encoding": {
                "x": {
                    "field": this.x_encoding,
                    "range": this.x_filter,
                    // "type": "nominal",
                    "aggregate": this.x_aggregate,
                    "axis": {
                        "title": this.x_aggregate ? `${this.x_aggregate}(${this.x_encoding})` : this.x_encoding
                    }
                },
                "y": {
                    "field": this.y_encoding,
                    "range": this.y_filter,
                    // "type": "quantitative",
                    "aggregate": this.y_aggregate,
                    "axis": {
                        "title": this.y_aggregate ? `${this.y_aggregate}(${this.y_encoding})` : this.y_encoding
                    }
                },
                "color": {
                    "field": this.category_encoding,
                    // "type": "nominal",
                    "axis": {
                        "title": this.category_encoding
                    }
                }
            },
            "transform": [
                {
                    "filter": {"and": [{"field": this.x_encoding, "range": this.x_filter}, {"field": this.y_encoding, "range": this.y_filter}]}
                }
            ]
        }
        return vl;
    }
}

export default View;
