import * as _ from 'lodash';
import { Calldata } from '../calldata/calldata';
import { RawCalldata } from '../calldata/raw_calldata';
import { constants } from '../utils/constants';
export class DataType {
    constructor(dataItem, factory) {
        this._dataItem = dataItem;
        this._factory = factory;
    }
    getDataItem() {
        return this._dataItem;
    }
    getFactory() {
        return this._factory;
    }
    encode(value, rules, selector) {
        const rules_ = { ...constants.DEFAULT_ENCODING_RULES, ...rules };
        const calldata = new Calldata(rules_);
        if (selector !== undefined) {
            calldata.setSelector(selector);
        }
        const block = this.generateCalldataBlock(value);
        calldata.setRoot(block);
        const encodedCalldata = calldata.toString();
        return encodedCalldata;
    }
    decode(calldata, rules, selector) {
        if (selector !== undefined && !_.startsWith(calldata, selector)) {
            throw new Error(`Tried to decode calldata, but it was missing the function selector. Expected prefix '${selector}'. Got '${calldata}'.`);
        }
        const hasSelector = selector !== undefined;
        const rawCalldata = new RawCalldata(calldata, hasSelector);
        const rules_ = { ...constants.DEFAULT_DECODING_RULES, ...rules };
        const value = rules_.isStrictMode || rawCalldata.getSizeInBytes() > 0
            ? this.generateValue(rawCalldata, rules_)
            : this.getDefaultValue(rules_);
        return value;
    }
    decodeAsArray(returndata, rules) {
        const value = this.decode(returndata, rules);
        const valuesAsArray = _.isObject(value) ? _.values(value) : [value];
        return valuesAsArray;
    }
    getSignature(isDetailed) {
        if (_.isEmpty(this._dataItem.name) || !isDetailed) {
            return this.getSignatureType();
        }
        const name = this.getDataItem().name;
        const lastIndexOfScopeDelimiter = name.lastIndexOf('.');
        const isScopedName = lastIndexOfScopeDelimiter !== undefined && lastIndexOfScopeDelimiter > 0;
        const shortName = isScopedName ? name.substr(lastIndexOfScopeDelimiter + 1) : name;
        const detailedSignature = `${shortName} ${this.getSignatureType()}`;
        return detailedSignature;
    }
}
