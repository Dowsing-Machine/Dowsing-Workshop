import * as cql from "compassql";
// import { recommend } from 'compassql/build/src/recommend';

// const cql=require("compassql");

import * as MARK from 'vega-lite/build/src/mark';
import { COLOR, COLUMN, ROW, SIZE, X, Y } from 'vega-lite/build/src/channel';
import _ from "lodash";

export const COUNT = "COUNT";

const DEFAULT_CQL_CONFIG = cql.config.extendConfig({
    enum: {
        mark: [MARK.POINT, MARK.BAR, MARK.LINE, MARK.TICK],
        channel: [X, Y, COLOR],

    },
});

const encoding2channel = {
    "x_encoding": "x",
    "y_encoding": "y",
    "category_encoding": "color"
}

function formEachEncoding(encoding, aggregate, columns) {
    const binEnabled = aggregate == "bin";
    const countEnabled = encoding === COUNT;
    if (countEnabled) {
        return {
            field: "*",
            aggregate: "count",
            type: "quantitative",
        }
    }
    else if (binEnabled) {
        return {
            field: encoding,
            bin: true,
            type: encoding ? columns.find(c => c.name == encoding).type : "?"

        }
    }
    else {
        return {
            field: encoding,
            aggregate,
            type: encoding ? columns.find(c => c.name == encoding).type : "?"
        }
    }

}

function specEncodings(query, columns, filter) {
    return _([
        {
            ...formEachEncoding(query["x_encoding"], query["x_aggregate"], columns),
            channel: "x"
        },
        {
            ...formEachEncoding(query["y_encoding"], query["y_aggregate"], columns),
            channel: "y",
        },
        {
            ...formEachEncoding(query["category_encoding"], query["category_aggregate"], columns),
            channel: "color",
        }
    ]).filter(filter).value();


    // return ["x_encoding", "y_encoding", "category_encoding"].filter(e => query[e] !== null)
}


export function runQuery(fn, query, data) {
    const cql_query = fn(query, data);
    const schema = cql.schema.build(data.dataset);
    // cql_query.spec={
    //     ...cql_query.spec,
        
    // };
    // console.log(cql_query);
    const output = cql.recommend(cql_query, schema, DEFAULT_CQL_CONFIG);
    return output.result;
}


export function specific(query, data) {
    const { dataset, columns } = data;
    const encodings = specEncodings(query, columns, item => item.field !== null);
    return {
        spec: {
            mark: query.chart_type ? query.chart_type : "?",
            encodings: encodings.map(encoding => ({
                ...encoding,
            })),
            // data: { values: dataset }
        },
        config: {
            "autoAddCount": false
        }
    }
}

export function alternative_encodings(query, data) {
    const { dataset, columns } = data;

    const encodings = specEncodings(query, columns, item => item.field !== null);
    return {
        spec: {
            mark: "?",
            encodings: encodings.map(encoding => ({
                ...encoding,
                channel: "?",
            })),
            // data: { values: dataset }
        },
        groupBy: 'encoding',
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: {
            "autoAddCount": true
        }
    }
}

export function summaries(query, data) {
    const { dataset, columns } = data;
    const encodings = specEncodings(query, columns, item => item.field !== null);
    let edit_encodings = _(encodings).filter(
        e => !(e.type == "quantitative" && e.aggregate == "count")
    ).map(encoding => {
        if (encoding.type == "quantitative" && encoding.aggregate != "count") {
            return {
                ...encoding,
                aggregate: "?",
                bin: "?"
            }
        }
        else {
            return encoding;
        }
    }).value();
    return {
        spec: {
            mark: "?",
            encodings: edit_encodings,
            // data: { values: dataset },
        },
        groupBy: 'fieldTransform',
        // fieldOrder should be the same, since we have similar fields
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        // aggregationQuality should be the same with group with similar transform
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: {
            autoAddCount: true,
            omitRaw: true
        }
    };
}

export function addQuantitativeField(query, data) {
    const { dataset, columns } = data;
    const encodings = specEncodings(query, columns, item => item.field !== null);
    return {
        spec: {
            filterSpecifiedView: undefined,
            mark: query.chart_type || "?",
            encodings: [
                ...encodings,
                {
                    channel: "?",
                    bin: "?",
                    aggregate: "?",
                    field: "?",
                    type: 'quantitative',
                    // description: 'Quantitative Fields'
                }
            ],
            // data: { values: dataset },
        },
        groupBy: 'field',
        // FieldOrder should dominates everything else
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        // aggregationQuality should be the same
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: { autoAddCount: true }
    }
}

export function addCategoricalField(query, data) {
    const { dataset, columns } = data;
    const encodings = specEncodings(query, columns, item => item.field !== null);
    return {
        spec: {
            filterSpecifiedView: undefined,
            mark: query.chart_type || "?",
            encodings: [
                ...encodings,
                {
                    channel: "?",
                    field: "?",
                    type: 'nominal',
                    // description: 'Categorical Fields'
                }
            ],
            // data: { values: dataset },
        },
        groupBy: 'field',
        // FieldOrder should dominates everything else
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        // aggregationQuality should be the same
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: { autoAddCount: true }
    }
}

export function univariteSummaries(query,data) {
    const { dataset, columns } = data;
    return {
        spec: {
            filterSpecifiedView: undefined,
            mark: "?",
            encodings: [
                {
                    channel: "?",
                    field: "?",
                    type: '?',
                    bin: "?",
                    // aggregate: "?"
                },
                {
                    channel: "?",
                    aggregate: "count",
                    type: "quantitative",
                    field: "*",
                }
            ],
            // data: { values: dataset },
        },
        groupBy: 'fieldTransform',
        // FieldOrder should dominates everything else
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        // aggregationQuality should be the same
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: { autoAddCount: false }
    }
}