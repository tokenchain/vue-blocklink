import { RevertError } from '../../revert_error';
export var ValueErrorCodes;
(function (ValueErrorCodes) {
    ValueErrorCodes[ValueErrorCodes["TooSmall"] = 0] = "TooSmall";
    ValueErrorCodes[ValueErrorCodes["TooLarge"] = 1] = "TooLarge";
})(ValueErrorCodes || (ValueErrorCodes = {}));
export var BinOpErrorCodes;
(function (BinOpErrorCodes) {
    BinOpErrorCodes[BinOpErrorCodes["AdditionOverflow"] = 0] = "AdditionOverflow";
    BinOpErrorCodes[BinOpErrorCodes["MultiplicationOverflow"] = 1] = "MultiplicationOverflow";
    BinOpErrorCodes[BinOpErrorCodes["DivisionByZero"] = 2] = "DivisionByZero";
    BinOpErrorCodes[BinOpErrorCodes["DivisionOverflow"] = 3] = "DivisionOverflow";
})(BinOpErrorCodes || (BinOpErrorCodes = {}));
export class SignedValueError extends RevertError {
    constructor(error, n) {
        super('SignedValueError', 'SignedValueError(uint8 error, int256 n)', {
            error,
            n,
        });
    }
}
export class UnsignedValueError extends RevertError {
    constructor(error, n) {
        super('UnsignedValueError', 'UnsignedValueError(uint8 error, uint256 n)', {
            error,
            n,
        });
    }
}
export class BinOpError extends RevertError {
    constructor(error, a, b) {
        super('BinOpError', 'BinOpError(uint8 error, int256 a, int256 b)', {
            error,
            a,
            b,
        });
    }
}
const types = [SignedValueError, UnsignedValueError, BinOpError];
for (const type of types) {
    RevertError.registerType(type);
}
