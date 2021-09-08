import { BigNumber, B } from './configured_bignumber';
import { Numberish } from './types';

// tslint:disable:custom-no-magic-numbers

/**
 * Convert a token unit amount to weis. E.g., 10.1 ETH -> 10100000000000000000.
 */
export function fromTokenUnitAmount(units: Numberish, decimals: number = 18): BigNumber {
    return new B.BigNumber(units).times(new B.BigNumber(10).pow(decimals)).integerValue();
}

/**
 * Convert a wei amount to token units. E.g., 10100000000000000000 -> 10.1 ETH.
 */
export function toTokenUnitAmount(weis: Numberish, decimals: number = 18): BigNumber {
    return new B.BigNumber(weis).div(new B.BigNumber(10).pow(decimals));
}
