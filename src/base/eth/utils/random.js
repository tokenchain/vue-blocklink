import { BigNumber } from './configured_bignumber';
const MAX_DIGITS_IN_UNSIGNED_256_INT = 78;
export function generatePseudoRandom256BitNumber() {
    const randomNumber = BigNumber.random(MAX_DIGITS_IN_UNSIGNED_256_INT);
    const factor = new BigNumber(10).pow(MAX_DIGITS_IN_UNSIGNED_256_INT - 1);
    const randomNumberScaledTo256Bits = randomNumber.times(factor).integerValue();
    return randomNumberScaledTo256Bits;
}
