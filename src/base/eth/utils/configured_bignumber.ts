import * as B from 'bignumber.js';

declare type BigNumber = B.BigNumber
B.BigNumber.config({
    // By default BigNumber's `toString` method converts to exponential notation if the value has
    // more then 20 digits. We want to avoid this behavior, so we set EXPONENTIAL_AT to a high number
    EXPONENTIAL_AT: 1000,
    // Note(albrow): This is the lowest value for which
    // `x.div(y).floor() === x.divToInt(y)`
    // for all values of x and y <= MAX_UINT256, where MAX_UINT256 is the
    // maximum number represented by the uint256 type in Solidity (2^256-1).
    DECIMAL_PLACES: 78,
});

// HACK: CLobber config and set to prevent imported packages from poisoning
// global BigNumber config
(orig => (B.BigNumber.config = (..._args: any[]) => orig({})))(B.BigNumber.config);
B.BigNumber.set = B.BigNumber.config;

export {BigNumber, B};
