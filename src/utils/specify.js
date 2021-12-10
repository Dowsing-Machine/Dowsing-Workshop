
import { COUNT } from "@/query";


export function specifyChannel(encoding, field) {
    if (encoding[field]) {
        if (encoding[field].field == "*" && encoding[field].aggregate == "count") {
            return {
                field: COUNT,
                aggregate: null,
            };
        }
        else {
            if (encoding[field].bin) {
                return {
                    field: encoding[field].field,
                    aggregate: "bin",
                };
            }
            else {
                return {
                    field: encoding[field].field,
                    aggregate: encoding[field].aggregate,
                };
            }
        }
    }
    else {
        return {
            field: null,
            aggregate: null,
        };
    }
}

export function spec2query(vegalite) {
    return {
        x_encoding: specifyChannel(vegalite.encoding, "x").field,
        y_encoding: specifyChannel(vegalite.encoding, "y").field,
        category_encoding: specifyChannel(vegalite.encoding, "color").field,
        x_aggregate: specifyChannel(vegalite.encoding, "x").aggregate,
        y_aggregate: specifyChannel(vegalite.encoding, "y").aggregate,
        category_aggregate: specifyChannel(vegalite.encoding, "color").aggregate,
        chart_type: vegalite.mark,
    }
}
