import { SolidityTypes } from '../../../types';
import { B } from '../../configured_bignumber';
import { AbstractBlobDataType } from '../abstract_data_types/types/blob';
import { constants } from '../utils/constants';
import * as EncoderMath from '../utils/math';
export class UIntDataType extends AbstractBlobDataType {
    constructor(dataItem, dataTypeFactory) {
        super(dataItem, dataTypeFactory, UIntDataType._SIZE_KNOWN_AT_COMPILE_TIME);
        if (!UIntDataType.matchType(dataItem.type)) {
            throw new Error(`Tried to instantiate UInt with bad input: ${dataItem}`);
        }
        this._width = UIntDataType._decodeWidthFromType(dataItem.type);
        this._maxValue = UIntDataType._WIDTH_TO_MAX_VALUE[this._width];
    }
    static matchType(type) {
        return UIntDataType._MATCHER.test(type);
    }
    static _decodeWidthFromType(type) {
        const matches = UIntDataType._MATCHER.exec(type);
        const width = matches !== null && matches.length === 2 && matches[1] !== undefined
            ? parseInt(matches[1], constants.DEC_BASE)
            : UIntDataType._DEFAULT_WIDTH;
        return width;
    }
    encodeValue(value) {
        const encodedValue = EncoderMath.safeEncodeNumericValue(value, UIntDataType._MIN_VALUE, this._maxValue);
        return encodedValue;
    }
    decodeValue(calldata) {
        const valueBuf = calldata.popWord();
        const value = EncoderMath.safeDecodeNumericValue(valueBuf, UIntDataType._MIN_VALUE, this._maxValue);
        if (this._width === constants.NUMBER_OF_BYTES_IN_UINT8) {
            return value.toNumber();
        }
        return value;
    }
    getDefaultValue() {
        const defaultValue = UIntDataType._DEFAULT_VALUE;
        if (this._width === constants.NUMBER_OF_BYTES_IN_UINT8) {
            return defaultValue.toNumber();
        }
        return defaultValue;
    }
    getSignatureType() {
        return `${SolidityTypes.Uint}${this._width}`;
    }
}
UIntDataType._MATCHER = RegExp('^uint(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256){0,1}$');
UIntDataType._SIZE_KNOWN_AT_COMPILE_TIME = true;
UIntDataType._MAX_WIDTH = 256;
UIntDataType._DEFAULT_WIDTH = UIntDataType._MAX_WIDTH;
UIntDataType._MIN_VALUE = new B.BigNumber(0);
UIntDataType._DEFAULT_VALUE = new B.BigNumber(0);
UIntDataType._WIDTH_TO_MAX_VALUE = Object.assign({}, ...[...new Array(32)].map((_x, i) => {
    const width = (i + 1) * 8;
    return { [width]: new B.BigNumber(2).exponentiatedBy(width).minus(1) };
}));
