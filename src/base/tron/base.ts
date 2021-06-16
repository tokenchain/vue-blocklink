// @ts-ignore
import tron from "tronweb"
import { EventEmitter } from "eventemitter3"

export default class BaseContract extends EventEmitter {
  protected decodeValues(params: any): Array<any> {
    let results = []
    // @ts-ignore
    if (tron.utils.isArray(params)) {
      const l = params.length
      for (let h = 0; h < l; h++) {
        // @ts-ignore
        if (tron.utils.isBigNumber(params[h])) {
          // @ts-ignore
          results.push(params[h].toString())
        } else {
          console.log("parse outside :: ", params[h])
        }
      }
    } else {
      results = []
    }
    return results
  }
}
