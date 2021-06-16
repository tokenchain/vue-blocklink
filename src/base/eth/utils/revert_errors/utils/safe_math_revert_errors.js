import { RevertError } from '../../revert_error';
export var BinOpErrorCodes;
(function (BinOpErrorCodes) {
    BinOpErrorCodes[BinOpErrorCodes["AdditionOverflow"] = 0] = "AdditionOverflow";
    BinOpErrorCodes[BinOpErrorCodes["MultiplicationOverflow"] = 1] = "MultiplicationOverflow";
    BinOpErrorCodes[BinOpErrorCodes["SubtractionUnderflow"] = 2] = "SubtractionUnderflow";
    BinOpErrorCodes[BinOpErrorCodes["DivisionByZero"] = 3] = "DivisionByZero";
})(BinOpErrorCodes || (BinOpErrorCodes = {}));
export var DowncastErrorCodes;
(function (DowncastErrorCodes) {
    DowncastErrorCodes[DowncastErrorCodes["ValueTooLargeToDowncastToUint32"] = 0] = "ValueTooLargeToDowncastToUint32";
    DowncastErrorCodes[DowncastErrorCodes["ValueTooLargeToDowncastToUint64"] = 1] = "ValueTooLargeToDowncastToUint64";
    DowncastErrorCodes[DowncastErrorCodes["ValueTooLargeToDowncastToUint96"] = 2] = "ValueTooLargeToDowncastToUint96";
    DowncastErrorCodes[DowncastErrorCodes["ValueTooLargeToDowncastToUint128"] = 3] = "ValueTooLargeToDowncastToUint128";
})(DowncastErrorCodes || (DowncastErrorCodes = {}));
export class Uint256BinOpError extends RevertError {
    constructor(error, a, b) {
        super('Uint256BinOpError', 'Uint256BinOpError(uint8 error, uint256 a, uint256 b)', {
            error,
            a,
            b,
        });
    }
}
export class Uint96BinOpError extends RevertError {
    constructor(error, a, b) {
        super('Uint96BinOpError', 'Uint96BinOpError(uint8 error, uint96 a, uint96 b)', {
            error,
            a,
            b,
        });
    }
}
export class Uint64BinOpError extends RevertError {
    constructor(error, a, b) {
        super('Uint64BinOpError', 'Uint64BinOpError(uint8 error, uint64 a, uint64 b)', {
            error,
            a,
            b,
        });
    }
}
export class Uint256DowncastError extends RevertError {
    constructor(error, a) {
        super('Uint256DowncastError', 'Uint256DowncastError(uint8 error, uint256 a)', {
            error,
            a,
        });
    }
}
const types = [Uint256BinOpError, Uint96BinOpError, Uint64BinOpError, Uint256DowncastError];
for (const type of types) {
    RevertError.registerType(type);
}
