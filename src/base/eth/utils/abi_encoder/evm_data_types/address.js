import { SolidityTypes } from '../../../types';
import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { AbstractBlobDataType } from '../abstract_data_types/types/blob';
import { constants } from '../utils/constants';
export class AddressDataType extends AbstractBlobDataType {
    constructor(dataItem, dataTypeFactory) {
        super(dataItem, dataTypeFactory, AddressDataType._SIZE_KNOWN_AT_COMPILE_TIME);
        if (!AddressDataType.matchType(dataItem.type)) {
            throw new Error(`Tried to instantiate Address with bad input: ${dataItem}`);
        }
    }
    static matchType(type) {
        return type === SolidityTypes.Address;
    }
    encodeValue(value) {
        if (!ethUtil.isValidAddress(value)) {
            throw new Error(`Invalid address: '${value}'`);
        }
        const valueBuf = ethUtil.toBuffer(value);
        const encodedValueBuf = ethUtil.setLengthLeft(valueBuf, constants.EVM_WORD_WIDTH_IN_BYTES);
        return encodedValueBuf;
    }
    decodeValue(calldata) {
        const valueBufPadded = calldata.popWord();
        const valueBuf = valueBufPadded.slice(AddressDataType._DECODED_ADDRESS_OFFSET_IN_BYTES);
        const value = ethUtil.bufferToHex(valueBuf);
        const valueLowercase = _.toLower(value);
        return valueLowercase;
    }
    getDefaultValue() {
        return AddressDataType._DEFAULT_VALUE;
    }
    getSignatureType() {
        return SolidityTypes.Address;
    }
}
AddressDataType._SIZE_KNOWN_AT_COMPILE_TIME = true;
AddressDataType._ADDRESS_SIZE_IN_BYTES = 20;
AddressDataType._DECODED_ADDRESS_OFFSET_IN_BYTES = constants.EVM_WORD_WIDTH_IN_BYTES - AddressDataType._ADDRESS_SIZE_IN_BYTES;
AddressDataType._DEFAULT_VALUE = '0x0000000000000000000000000000000000000000';
//# sourceMappingURL=address.js.map