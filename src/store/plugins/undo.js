import _ from "lodash"
import createStack from '../../utils/undo_stacker';
import View from "@/models/view";
import { isProxy, toRaw, watch, effectScope } from "vue-demi";

const scope = effectScope();

export function Undo({ store, options }) {
    if (!options.undoOption) return;
    const { undoOption } = options;
    if(!undoOption.enabled) return;

    const cloneState=undoOption.clone||_.cloneDeep;
    const diff=undoOption.diff||_.constant(true);

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
        watch(store, (state,prevState) => {
            if (preventUpdateOnSubscribe) {
                preventUpdateOnSubscribe = false;
                return;
            }
            if(!diff(state,prevState)){
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
