import { SolidityTypes } from '../../../types';
import * as ethUtil from 'ethereumjs-util';
import { AbstractBlobDataType } from '../abstract_data_types/types/blob';
import { constants } from '../utils/constants';
export class StringDataType extends AbstractBlobDataType {
    constructor(dataItem, dataTypeFactory) {
        super(dataItem, dataTypeFactory, StringDataType._SIZE_KNOWN_AT_COMPILE_TIME);
        if (!StringDataType.matchType(dataItem.type)) {
            throw new Error(`Tried to instantiate String with bad input: ${dataItem}`);
        }
    }
    static matchType(type) {
        return type === SolidityTypes.String;
    }
    encodeValue(value) {
        const valueBuf = Buffer.from(value);
        const valueLengthInBytes = valueBuf.byteLength;
        const wordsToStoreValuePadded = Math.ceil(valueLengthInBytes / constants.EVM_WORD_WIDTH_IN_BYTES);
        const bytesToStoreValuePadded = wordsToStoreValuePadded * constants.EVM_WORD_WIDTH_IN_BYTES;
        const valueBufPadded = ethUtil.setLengthRight(valueBuf, bytesToStoreValuePadded);
        const lengthBuf = ethUtil.toBuffer(valueLengthInBytes);
        const lengthBufPadded = ethUtil.setLengthLeft(lengthBuf, constants.EVM_WORD_WIDTH_IN_BYTES);
        const encodedValue = Buffer.concat([lengthBufPadded, valueBufPadded]);
        return encodedValue;
    }
    decodeValue(calldata) {
        const lengthBufPadded = calldata.popWord();
        const lengthHexPadded = ethUtil.bufferToHex(lengthBufPadded);
        const length = parseInt(lengthHexPadded, constants.HEX_BASE);
        const wordsToStoreValuePadded = Math.ceil(length / constants.EVM_WORD_WIDTH_IN_BYTES);
        const valueBufPadded = calldata.popWords(wordsToStoreValuePadded);
        const valueBuf = valueBufPadded.slice(0, length);
        const value = valueBuf.toString('UTF-8');
        return value;
    }
    getDefaultValue() {
        return StringDataType._DEFAULT_VALUE;
    }
    getSignatureType() {
        return SolidityTypes.String;
    }
}
StringDataType._SIZE_KNOWN_AT_COMPILE_TIME = false;
StringDataType._DEFAULT_VALUE = '';
