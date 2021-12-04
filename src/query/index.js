import * as cql from "compassql";
// import { recommend } from 'compassql/build/src/recommend';

// const cql=require("compassql");

import * as MARK from 'vega-lite/build/src/mark';
import { COLOR, COLUMN, ROW, SIZE, X, Y } from 'vega-lite/build/src/channel';
import _ from "lodash";

export const COUNT=Symbol();

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

function formEachEncoding(encoding,aggregate,columns) {
    const binEnabled=aggregate=="bin";
    const countEnabled=encoding==COUNT;
    if(countEnabled){
        return {
            field:"*",
            aggregate:"count",
            type:encoding?columns.find(c=>c.name==encoding).type:"?"
        }
    }
    else if(binEnabled){
        return {
            field:encoding,
            bin:true,
            type: encoding ? columns.find(c => c.name == encoding).type : "?"

        }
    }
    else{
        return {
            field:encoding,
            aggregate,
            type: encoding ? columns.find(c => c.name == encoding).type : "?"
        }
    }

}

function specEncodings(query,columns,filter) {
    return _([
        {   ...formEachEncoding(query["x_encoding"],query["x_aggregate"],columns),
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
    console.log(cql_query);
    const output = cql.recommend(cql_query, schema, DEFAULT_CQL_CONFIG);
    return output.result;
}


export function specific(query, data) {
    const {dataset, columns} = data;
    const encodings = specEncodings(query, columns, item => item.field !== null);
    return {
        spec: {
            mark: query.chart_type ? query.chart_type : "?",
            encodings: encodings.map(encoding => ({
                ...encoding,
            })),
            data: { values: dataset }
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
                type: "?",
            })),
            data: { values: dataset }
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
    const encodings = specEncodings(query, item => item.field !== null);

}