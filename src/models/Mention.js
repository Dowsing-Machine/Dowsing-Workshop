const DEFAULT_Mention = {
    text: "please enter your mention here",
}

import {reactive} from "vue"

class Mention{
    constructor(options){
        Object.assign(this, DEFAULT_Mention);
        Object.assign(this, options);
        reactive(this);
    }
}

export default Mention;
