import * as cql from "compassql";

onmessage = function(e) {
    switch(e.data.method){
        case "recommend":
            postMessage({
                result: recommend(e.data.query,e.data.schema,e.data.config)
            });
            break;
    }
}

function recommend(query,schema,config){
    // data=JSON.parse(data);
    // const schema = cql.schema.build(data);
    const data_schema = new cql.schema.Schema(schema);
    console.log("recommend", query, data_schema,config);
    return cql.recommend(query, data_schema,config).result;
}