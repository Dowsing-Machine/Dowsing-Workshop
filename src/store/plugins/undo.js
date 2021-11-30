import _ from "lodash"
import createStack from '../../utils/undo_stacker';
import View from "@/models/view";
import { isProxy, toRaw, watch, effectScope } from "vue-demi";

const scope = effectScope();


function cloneState(state) {
    const res = _.cloneDeep(state);
    return res
}

export function ViewUndo({ store, options }) {
    if (!options.isView) return;
    const stack = createStack(cloneState(store));
    let preventUpdateOnSubscribe = false;
    store.undo = () => {
        preventUpdateOnSubscribe = true;
        let undo = stack.undo();
        store.$patch(undo);
    }
    store.redo = () => {
        preventUpdateOnSubscribe = true;
        store.$patch(stack.redo());
    }
    scope.run(() => {
        watch(store, (state) => {
            if (preventUpdateOnSubscribe) {
                preventUpdateOnSubscribe = false;
                return;
            }

            state = cloneState(state);
            stack.push(state);
        })
    }
    )


    // store.$subscribe((_,state) => {
    //     console.log("subscribe",_);
    //     if (preventUpdateOnSubscribe) {
    //         console.log("preventUpdateOnSubscribe");
    //         preventUpdateOnSubscribe = false;
    //         return;
    //     }

    //     state=cloneState(state);
    //     stack.push(state);
    // })
}
