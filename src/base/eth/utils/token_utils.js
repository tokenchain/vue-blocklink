import { B } from './configured_bignumber';
export function fromTokenUnitAmount(units, decimals = 18) {
    return new B.BigNumber(units).times(new B.BigNumber(10).pow(decimals)).integerValue();
}
export function toTokenUnitAmount(weis, decimals = 18) {
    return new B.BigNumber(weis).div(new B.BigNumber(10).pow(decimals));
}
//# sourceMappingURL=token_utils.js.map