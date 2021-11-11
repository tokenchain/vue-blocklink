import { RevertError } from '../../revert_error';
export class InvalidFromAddressError extends RevertError {
    constructor(from) {
        super('InvalidFromAddressError', 'InvalidFromAddressError(address from)', { from });
    }
}
export class AmountsLengthMustEqualOneError extends RevertError {
    constructor(amountsLength) {
        super('AmountsLengthMustEqualOneError', 'AmountsLengthMustEqualOneError(uint256 amountsLength)', {
            amountsLength,
        });
    }
}
export class TooFewBrokerAssetsProvidedError extends RevertError {
    constructor(numBrokeredAssets) {
        super('TooFewBrokerAssetsProvidedError', 'TooFewBrokerAssetsProvidedError(uint256 numBrokeredAssets)', {
            numBrokeredAssets,
        });
    }
}
export class InvalidFunctionSelectorError extends RevertError {
    constructor(selector) {
        super('InvalidFunctionSelectorError', 'InvalidFunctionSelectorError(bytes4 selector)', { selector });
    }
}
export class OnlyERC1155ProxyError extends RevertError {
    constructor(sender) {
        super('OnlyERC1155ProxyError', 'OnlyERC1155ProxyError(address sender)', { sender });
    }
}
const types = [
    InvalidFromAddressError,
    AmountsLengthMustEqualOneError,
    TooFewBrokerAssetsProvidedError,
    InvalidFunctionSelectorError,
    OnlyERC1155ProxyError,
];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=revert_errors.js.map