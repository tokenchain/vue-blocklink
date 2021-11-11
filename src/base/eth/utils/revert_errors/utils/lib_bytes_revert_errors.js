import { RevertError } from '../../revert_error';
export var InvalidByteOperationErrorCodes;
(function (InvalidByteOperationErrorCodes) {
    InvalidByteOperationErrorCodes[InvalidByteOperationErrorCodes["FromLessThanOrEqualsToRequired"] = 0] = "FromLessThanOrEqualsToRequired";
    InvalidByteOperationErrorCodes[InvalidByteOperationErrorCodes["ToLessThanOrEqualsLengthRequired"] = 1] = "ToLessThanOrEqualsLengthRequired";
    InvalidByteOperationErrorCodes[InvalidByteOperationErrorCodes["LengthGreaterThanZeroRequired"] = 2] = "LengthGreaterThanZeroRequired";
    InvalidByteOperationErrorCodes[InvalidByteOperationErrorCodes["LengthGreaterThanOrEqualsFourRequired"] = 3] = "LengthGreaterThanOrEqualsFourRequired";
    InvalidByteOperationErrorCodes[InvalidByteOperationErrorCodes["LengthGreaterThanOrEqualsTwentyRequired"] = 4] = "LengthGreaterThanOrEqualsTwentyRequired";
    InvalidByteOperationErrorCodes[InvalidByteOperationErrorCodes["LengthGreaterThanOrEqualsThirtyTwoRequired"] = 5] = "LengthGreaterThanOrEqualsThirtyTwoRequired";
    InvalidByteOperationErrorCodes[InvalidByteOperationErrorCodes["LengthGreaterThanOrEqualsNestedBytesLengthRequired"] = 6] = "LengthGreaterThanOrEqualsNestedBytesLengthRequired";
    InvalidByteOperationErrorCodes[InvalidByteOperationErrorCodes["DestinationLengthGreaterThanOrEqualSourceLengthRequired"] = 7] = "DestinationLengthGreaterThanOrEqualSourceLengthRequired";
})(InvalidByteOperationErrorCodes || (InvalidByteOperationErrorCodes = {}));
export class InvalidByteOperationError extends RevertError {
    constructor(error, offset, required) {
        super('InvalidByteOperationError', 'InvalidByteOperationError(uint8 error, uint256 offset, uint256 required)', {
            error,
            offset,
            required,
        });
    }
}
RevertError.registerType(InvalidByteOperationError);
