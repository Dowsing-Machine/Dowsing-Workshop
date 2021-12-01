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

import _ from "lodash";
import { reactive, computed } from "vue"
let idCount = 0;

class View {
    constructor(options) {
        Object.assign(this, DEFAULT_VIEW);
        Object.assign(this, options);
        this.id = idCount++;
        reactive(this);
    }

    static clone(view) {
        return new View(view);
    }

    compileToVegaLite(dataset, columns, render_options = {}) {
        return computed(() => {
            let x_type = this.x_encoding?_.find(columns.value, { name: this.x_encoding }).type:null;
            let y_type = this.y_encoding?_.find(columns.value, { name: this.y_encoding }).type:null;
            // let category_type = _.find(columns, { name: this.category_encoding }).type;
            let vl = {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "data": {
                    "values": dataset.value
                },
                "mark": this.chart_type,
                "width": "container",
                "height": 200,
                "encoding": {
                    "x": {
                        "field": this.x_encoding,
                        "type": x_type,
                        "aggregate": this.x_aggregate,
                        "axis": {
                            "title": this.x_aggregate ? `${this.x_aggregate}(${this.x_encoding})` : this.x_encoding
                        }
                    },
                    "y": {
                        "field": this.y_encoding,
                        "type": y_type,
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
            },
            return _.assign(vl, render_options);
        })

    }
}

export default View;
