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
    return cql.recommend(query,schema,config).result;
}