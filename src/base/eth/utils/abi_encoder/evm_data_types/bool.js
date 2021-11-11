import { SolidityTypes } from '../../../types';
import * as ethUtil from 'ethereumjs-util';
import { B } from '../../configured_bignumber';
import { AbstractBlobDataType } from '../abstract_data_types/types/blob';
import { constants } from '../utils/constants';
export class BoolDataType extends AbstractBlobDataType {
    constructor(dataItem, dataTypeFactory) {
        super(dataItem, dataTypeFactory, BoolDataType._SIZE_KNOWN_AT_COMPILE_TIME);
        if (!BoolDataType.matchType(dataItem.type)) {
            throw new Error(`Tried to instantiate Bool with bad input: ${dataItem}`);
        }
    }
    static matchType(type) {
        return type === SolidityTypes.Bool;
    }
    encodeValue(value) {
        const encodedValue = value ? '0x1' : '0x0';
        const encodedValueBuf = ethUtil.setLengthLeft(ethUtil.toBuffer(encodedValue), constants.EVM_WORD_WIDTH_IN_BYTES);
        return encodedValueBuf;
    }
    decodeValue(calldata) {
        const valueBuf = calldata.popWord();
        const valueHex = ethUtil.bufferToHex(valueBuf);
        const valueNumber = valueHex === '0x' ? new B.BigNumber(0) : new B.BigNumber(valueHex, constants.HEX_BASE);
        if (!(valueNumber.isEqualTo(0) || valueNumber.isEqualTo(1))) {
            throw new Error(`Failed to decode boolean. Expected 0x0 or 0x1, got ${valueHex}`);
        }
        const value = !valueNumber.isEqualTo(0);
        return value;
    }
    getDefaultValue() {
        return BoolDataType._DEFAULT_VALUE;
    }
    getSignatureType() {
        return SolidityTypes.Bool;
    }
}
BoolDataType._SIZE_KNOWN_AT_COMPILE_TIME = true;
BoolDataType._DEFAULT_VALUE = false;
//# sourceMappingURL=bool.js.map