import { RevertError } from '../../revert_error';
export class UnregisteredAssetProxyError extends RevertError {
    constructor() {
        super('UnregisteredAssetProxyError', 'UnregisteredAssetProxyError()', {});
    }
}
export class CompleteBuyFailedError extends RevertError {
    constructor(expectedAssetBuyAmount, actualAssetBuyAmount) {
        super('CompleteBuyFailedError', 'CompleteBuyFailedError(uint256 expectedAssetBuyAmount, uint256 actualAssetBuyAmount)', { expectedAssetBuyAmount, actualAssetBuyAmount });
    }
}
export class CompleteSellFailedError extends RevertError {
    constructor(expectedAssetSellAmount, actualAssetSellAmount) {
        super('CompleteSellFailedError', 'CompleteSellFailedError(uint256 expectedAssetSellAmount, uint256 actualAssetSellAmount)', { expectedAssetSellAmount, actualAssetSellAmount });
    }
}
export class UnsupportedFeeError extends RevertError {
    constructor(takerFeeAssetData) {
        super('UnsupportedFeeError', 'UnsupportedFeeError(bytes takerFeeAssetData)', { takerFeeAssetData });
    }
}
export class OverspentWethError extends RevertError {
    constructor(wethSpent, msgValue) {
        super('OverspentWethError', 'OverspentWethError(uint256 wethSpent, uint256 msgValue)', {
            wethSpent,
            msgValue,
        });
    }
}
export class MsgValueCannotEqualZeroError extends RevertError {
    constructor() {
        super('MsgValueCannotEqualZeroError', 'MsgValueCannotEqualZeroError()', {});
    }
}
const types = [
    UnregisteredAssetProxyError,
    CompleteBuyFailedError,
    CompleteSellFailedError,
    UnsupportedFeeError,
    OverspentWethError,
    MsgValueCannotEqualZeroError,
];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=revert_errors.js.map