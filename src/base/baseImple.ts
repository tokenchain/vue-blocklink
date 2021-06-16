// @ts-ignore
import {isArray, isBigNumber} from "../utils/index"
import {EventEmitter} from "eventemitter3"

export default class BaseContract extends EventEmitter {
    protected decodeValues(params) {
        const results = []
        if (isArray(params)) {
            const l = params.length
            for (let h = 0; h < l; h++) {
                if (isBigNumber(params[h])) {
                    // @ts-ignore
                    results.push(params[h].toNumber())
                } else {
                    console.log("parse outside :: ", params[h])
                }
            }
        }
        return results
    }
}
