import { RevertError } from '../../revert_error';
export class UnregisteredAssetProxyError extends RevertError {
    constructor() {
        super('UnregisteredAssetProxyError', 'UnregisteredAssetProxyError()', {});
    }
}
export class InsufficientEthForFeeError extends RevertError {
    constructor(ethFeeRequired, ethAvailable) {
        super('InsufficientEthForFeeError', 'InsufficientEthForFeeError(uint256 ethFeeRequired, uint256 ethAvailable)', { ethFeeRequired, ethAvailable });
    }
}
export class DefaultFunctionWethContractOnlyError extends RevertError {
    constructor(senderAddress) {
        super('DefaultFunctionWethContractOnlyError', 'DefaultFunctionWethContractOnlyError(address senderAddress)', {
            senderAddress,
        });
    }
}
export class EthFeeLengthMismatchError extends RevertError {
    constructor(ethFeesLength, feeRecipientsLength) {
        super('EthFeeLengthMismatchError', 'EthFeeLengthMismatchError(uint256 ethFeesLength, uint256 feeRecipientsLength)', {
            ethFeesLength,
            feeRecipientsLength,
        });
    }
}
const types = [InsufficientEthForFeeError, DefaultFunctionWethContractOnlyError, EthFeeLengthMismatchError];
for (const type of types) {
    RevertError.registerType(type);
}
