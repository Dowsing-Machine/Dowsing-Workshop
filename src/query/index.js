import * as cql from "compassql";
// import { recommend } from 'compassql/build/src/recommend';

// const cql=require("compassql");

import * as MARK from 'vega-lite/build/src/mark';
import { COLOR, COLUMN, ROW, SIZE, X, Y } from 'vega-lite/build/src/channel';

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

function specEncodings(query){
    return ["x_encoding", "y_encoding", "category_encoding"].filter(e => query[e] !== null)
}


export function runQuery(fn,query,data){
    const cql_query=fn(query,data);
    const schema=cql.schema.build(data);
    const output=cql.recommend(cql_query,schema,DEFAULT_CQL_CONFIG);
    return output.result;
}


export function specific(query,data){
    const encodings = specEncodings(query);
    return {
        spec: {
            mark: query.chart_type ? query.chart_type : "?",
            encodings: encodings.map(field => ({
                field: query[field],
                channel: encoding2channel[field],
                type: "?"
            })),
            data: { values: data }
        },
        config: {
            "autoAddCount": false
        }
    }
}

export function alternative_encodings(query,data){
    const encodings = specEncodings(query);
    return {
        spec: {
            mark: "?",
            encodings: encodings.map(field => ({
                field: query[field],
                channel: "?",
                type: "?"
            })),
            data: { values: data }
        },
        groupBy: 'encoding',
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: {
            "autoAddCount": true
        }
    }
}

export function summaries(query,data){

}