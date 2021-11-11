import { RevertError } from '../../revert_error';
export var SignatureErrorCodes;
(function (SignatureErrorCodes) {
    SignatureErrorCodes[SignatureErrorCodes["InvalidLength"] = 0] = "InvalidLength";
    SignatureErrorCodes[SignatureErrorCodes["Unsupported"] = 1] = "Unsupported";
    SignatureErrorCodes[SignatureErrorCodes["Illegal"] = 2] = "Illegal";
    SignatureErrorCodes[SignatureErrorCodes["Invalid"] = 3] = "Invalid";
})(SignatureErrorCodes || (SignatureErrorCodes = {}));
export class SignatureError extends RevertError {
    constructor(errorCode, hash, signature) {
        super('SignatureError', 'SignatureError(uint8 errorCode, bytes32 hash, bytes signature)', {
            errorCode,
            hash,
            signature,
        });
    }
}
export class InvalidOriginError extends RevertError {
    constructor(expectedOrigin) {
        super('InvalidOriginError', 'InvalidOriginError(address expectedOrigin)', { expectedOrigin });
    }
}
export class ApprovalExpiredError extends RevertError {
    constructor(transactionHash, approvalExpirationTime) {
        super('ApprovalExpiredError', 'ApprovalExpiredError(bytes32 transactionHash, uint256 approvalExpirationTime)', {
            transactionHash,
            approvalExpirationTime,
        });
    }
}
export class InvalidApprovalSignatureError extends RevertError {
    constructor(transactionHash, approverAddress) {
        super('InvalidApprovalSignatureError', 'InvalidApprovalSignatureError(bytes32 transactionHash, address approverAddress)', { transactionHash, approverAddress });
    }
}
const types = [SignatureError, InvalidOriginError, ApprovalExpiredError, InvalidApprovalSignatureError];
for (const type of types) {
    RevertError.registerType(type);
}
