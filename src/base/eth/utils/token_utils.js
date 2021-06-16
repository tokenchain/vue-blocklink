import { BigNumber } from './configured_bignumber';
export function fromTokenUnitAmount(units, decimals = 18) {
    return new BigNumber(units).times(new BigNumber(10).pow(decimals)).integerValue();
}
export function toTokenUnitAmount(weis, decimals = 18) {
    return new BigNumber(weis).div(new BigNumber(10).pow(decimals));
}
