import { RevertError } from '../../revert_error';
export class UnsupportedAssetProxyError extends RevertError {
    constructor(proxyId) {
        super('UnsupportedAssetProxyError', 'UnsupportedAssetProxyError(bytes4 proxyId)', { proxyId });
    }
}
export class Erc721AmountMustEqualOneError extends RevertError {
    constructor(amount) {
        super('Erc721AmountMustEqualOneError', 'Erc721AmountMustEqualOneError(uint256 amount)', {
            amount,
        });
    }
}
const types = [UnsupportedAssetProxyError, Erc721AmountMustEqualOneError];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=lib_asset_data_transfer_revert_errors.js.map