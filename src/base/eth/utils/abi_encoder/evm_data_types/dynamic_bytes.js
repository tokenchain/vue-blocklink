import { SolidityTypes } from '../../../types';
import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { AbstractBlobDataType } from '../abstract_data_types/types/blob';
import { constants } from '../utils/constants';
export class DynamicBytesDataType extends AbstractBlobDataType {
    constructor(dataItem, dataTypeFactory) {
        super(dataItem, dataTypeFactory, DynamicBytesDataType._SIZE_KNOWN_AT_COMPILE_TIME);
        if (!DynamicBytesDataType.matchType(dataItem.type)) {
            throw new Error(`Tried to instantiate Dynamic Bytes with bad input: ${dataItem}`);
        }
    }
    static matchType(type) {
        return type === SolidityTypes.Bytes;
    }
    static _sanityCheckValue(value) {
        if (typeof value !== 'string') {
            return;
        }
        if (!_.startsWith(value, '0x')) {
            throw new Error(`Tried to encode non-hex value. Value must include '0x' prefix.`);
        }
        else if (value.length % 2 !== 0) {
            throw new Error(`Tried to assign ${value}, which is contains a half-byte. Use full bytes only.`);
        }
    }
    encodeValue(value) {
        DynamicBytesDataType._sanityCheckValue(value);
        const valueBuf = ethUtil.toBuffer(value);
        const wordsToStoreValuePadded = Math.ceil(valueBuf.byteLength / constants.EVM_WORD_WIDTH_IN_BYTES);
        const bytesToStoreValuePadded = wordsToStoreValuePadded * constants.EVM_WORD_WIDTH_IN_BYTES;
        const lengthBuf = ethUtil.toBuffer(valueBuf.byteLength);
        const lengthBufPadded = ethUtil.setLengthLeft(lengthBuf, constants.EVM_WORD_WIDTH_IN_BYTES);
        const valueBufPadded = ethUtil.setLengthRight(valueBuf, bytesToStoreValuePadded);
        const encodedValue = Buffer.concat([lengthBufPadded, valueBufPadded]);
        return encodedValue;
    }
    decodeValue(calldata) {
        const lengthBuf = calldata.popWord();
        const lengthHex = ethUtil.bufferToHex(lengthBuf);
        const length = parseInt(lengthHex, constants.HEX_BASE);
        const wordsToStoreValuePadded = Math.ceil(length / constants.EVM_WORD_WIDTH_IN_BYTES);
        const valueBufPadded = calldata.popWords(wordsToStoreValuePadded);
        const valueBuf = valueBufPadded.slice(0, length);
        const value = ethUtil.bufferToHex(valueBuf);
        DynamicBytesDataType._sanityCheckValue(value);
        return value;
    }
    getDefaultValue() {
        return DynamicBytesDataType._DEFAULT_VALUE;
    }
    getSignatureType() {
        return SolidityTypes.Bytes;
    }
}
DynamicBytesDataType._SIZE_KNOWN_AT_COMPILE_TIME = false;
DynamicBytesDataType._DEFAULT_VALUE = '0x';
