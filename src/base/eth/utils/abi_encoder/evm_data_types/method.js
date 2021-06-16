import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { AbstractSetDataType } from '../abstract_data_types/types/set';
import { constants } from '../utils/constants';
import { TupleDataType } from './tuple';
export class MethodDataType extends AbstractSetDataType {
    constructor(abi, dataTypeFactory) {
        const methodDataItem = { type: 'method', name: abi.name, components: abi.inputs };
        super(methodDataItem, dataTypeFactory);
        this._methodSignature = this._computeSignature();
        this._methodSelector = this._computeSelector();
        const returnDataItem = { type: 'tuple', name: abi.name, components: abi.outputs };
        this._returnDataType = new TupleDataType(returnDataItem, this.getFactory());
    }
    encode(value, rules) {
        const calldata = super.encode(value, rules, this._methodSelector);
        return calldata;
    }
    decode(calldata, rules) {
        const value = super.decode(calldata, rules, this._methodSelector);
        return value;
    }
    strictDecode(calldata, rules) {
        const value = super.decode(calldata, { ...rules, isStrictMode: true }, this._methodSelector);
        const valueAsArray = _.isObject(value) ? _.values(value) : [value];
        switch (valueAsArray.length) {
            case 0:
                return undefined;
            case 1:
                return valueAsArray[0];
            default:
                return valueAsArray;
        }
    }
    encodeReturnValues(value, rules) {
        const returnData = this._returnDataType.encode(value, rules);
        return returnData;
    }
    decodeReturnValues(returndata, rules) {
        const returnValues = this._returnDataType.decode(returndata, rules);
        return returnValues;
    }
    strictDecodeReturnValue(returndata, rules) {
        const returnValues = this._returnDataType.decode(returndata, { ...rules, isStrictMode: true });
        const returnValuesAsArray = _.isObject(returnValues) ? _.values(returnValues) : [returnValues];
        switch (returnValuesAsArray.length) {
            case 0:
                return undefined;
            case 1:
                return returnValuesAsArray[0];
            default:
                return returnValuesAsArray;
        }
    }
    getSignatureType() {
        return this._methodSignature;
    }
    getSelector() {
        return this._methodSelector;
    }
    getReturnValueDataItem() {
        const returnValueDataItem = this._returnDataType.getDataItem();
        return returnValueDataItem;
    }
    _computeSignature() {
        const memberSignature = this._computeSignatureOfMembers();
        const methodSignature = `${this.getDataItem().name}${memberSignature}`;
        return methodSignature;
    }
    _computeSelector() {
        const signature = this._computeSignature();
        const selector = ethUtil.bufferToHex(ethUtil.toBuffer(ethUtil
            .keccak256(Buffer.from(signature))
            .slice(constants.HEX_SELECTOR_BYTE_OFFSET_IN_CALLDATA, constants.HEX_SELECTOR_LENGTH_IN_BYTES)));
        return selector;
    }
}
