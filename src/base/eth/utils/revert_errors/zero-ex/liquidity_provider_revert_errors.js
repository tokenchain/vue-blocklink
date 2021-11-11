import { RevertError } from '../../revert_error';
export class LiquidityProviderIncompleteSellError extends RevertError {
    constructor(providerAddress, makerToken, takerToken, sellAmount, boughtAmount, minBuyAmount) {
        super('LiquidityProviderIncompleteSellError', 'LiquidityProviderIncompleteSellError(address providerAddress, address makerToken, address takerToken, uint256 sellAmount, uint256 boughtAmount, uint256 minBuyAmount)', {
            providerAddress,
            makerToken,
            takerToken,
            sellAmount,
            boughtAmount,
            minBuyAmount,
        });
    }
}
export class NoLiquidityProviderForMarketError extends RevertError {
    constructor(xAsset, yAsset) {
        super('NoLiquidityProviderForMarketError', 'NoLiquidityProviderForMarketError(address xAsset, address yAsset)', {
            xAsset,
            yAsset,
        });
    }
}
const types = [LiquidityProviderIncompleteSellError, NoLiquidityProviderForMarketError];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=liquidity_provider_revert_errors.js.map