import { RevertError } from '../../revert_error';
export var SignatureValidationErrorCodes;
(function (SignatureValidationErrorCodes) {
    SignatureValidationErrorCodes[SignatureValidationErrorCodes["AlwaysInvalid"] = 0] = "AlwaysInvalid";
    SignatureValidationErrorCodes[SignatureValidationErrorCodes["InvalidLength"] = 1] = "InvalidLength";
    SignatureValidationErrorCodes[SignatureValidationErrorCodes["Unsupported"] = 2] = "Unsupported";
    SignatureValidationErrorCodes[SignatureValidationErrorCodes["Illegal"] = 3] = "Illegal";
    SignatureValidationErrorCodes[SignatureValidationErrorCodes["WrongSigner"] = 4] = "WrongSigner";
})(SignatureValidationErrorCodes || (SignatureValidationErrorCodes = {}));
export class SignatureValidationError extends RevertError {
    constructor(code, hash, signerAddress, signature) {
        super('SignatureValidationError', 'SignatureValidationError(uint8 code, bytes32 hash, address signerAddress, bytes signature)', {
            code,
            hash,
            signerAddress,
            signature,
        });
    }
}
const types = [SignatureValidationError];
for (const type of types) {
    RevertError.registerType(type);
}
