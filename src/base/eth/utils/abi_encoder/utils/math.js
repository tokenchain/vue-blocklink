import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { B } from '../../configured_bignumber';
import { constants } from '../utils/constants';
function sanityCheckBigNumberRange(value_, minValue, maxValue) {
    const value = new B.BigNumber(value_, 10);
    if (value.isGreaterThan(maxValue)) {
        throw new Error(`Tried to assign value of ${value}, which exceeds max value of ${maxValue}`);
    }
    else if (value.isLessThan(minValue)) {
        throw new Error(`Tried to assign value of ${value}, which exceeds min value of ${minValue}`);
    }
    else if (value.isNaN()) {
        throw new Error(`Tried to assign NaN value`);
    }
}
function bigNumberToPaddedBuffer(value) {
    return ethUtil.setLengthLeft(ethUtil.toBuffer(new ethUtil.BN(value.toFixed(0))), constants.EVM_WORD_WIDTH_IN_BYTES);
}
export function encodeNumericValue(value_) {
    const value = new B.BigNumber(value_, 10);
    if (value.isGreaterThanOrEqualTo(0)) {
        const encodedPositiveValue = bigNumberToPaddedBuffer(value);
        return encodedPositiveValue;
    }
    const valueBin = value.times(-1).toString(constants.BIN_BASE);
    let invertedValueBin = '1'.repeat(constants.EVM_WORD_WIDTH_IN_BITS - valueBin.length);
    _.each(valueBin, (bit) => {
        invertedValueBin += bit === '1' ? '0' : '1';
    });
    const invertedValue = new B.BigNumber(invertedValueBin, constants.BIN_BASE);
    const negativeValue = invertedValue.plus(1);
    const encodedValue = bigNumberToPaddedBuffer(negativeValue);
    return encodedValue;
}
export function safeEncodeNumericValue(value, minValue, maxValue) {
    sanityCheckBigNumberRange(value, minValue, maxValue);
    const encodedValue = encodeNumericValue(value);
    return encodedValue;
}
export function decodeNumericValue(encodedValue, minValue) {
    const valueHex = ethUtil.bufferToHex(encodedValue);
    const value = new B.BigNumber(valueHex, constants.HEX_BASE);
    if (!minValue.isLessThan(0)) {
        return value;
    }
    const valueBin = value.toString(constants.BIN_BASE);
    const isValueNegative = valueBin.length === constants.EVM_WORD_WIDTH_IN_BITS && _.startsWith(valueBin[0], '1');
    if (!isValueNegative) {
        return value;
    }
    let invertedValueBin = '';
    _.each(valueBin, (bit) => {
        invertedValueBin += bit === '1' ? '0' : '1';
    });
    const invertedValue = new B.BigNumber(invertedValueBin, constants.BIN_BASE);
    const positiveValue = invertedValue.plus(1);
    const negativeValue = positiveValue.times(-1);
    return negativeValue;
}
export function safeDecodeNumericValue(encodedValue, minValue, maxValue) {
    const value = decodeNumericValue(encodedValue, minValue);
    sanityCheckBigNumberRange(value, minValue, maxValue);
    return value;
}
//# sourceMappingURL=math.js.map