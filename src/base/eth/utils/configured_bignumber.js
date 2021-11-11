import * as B from 'bignumber.js';
B.BigNumber.config({
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 78,
});
(orig => (B.BigNumber.config = (..._args) => orig({})))(B.BigNumber.config);
B.BigNumber.set = B.BigNumber.config;
export { B };
//# sourceMappingURL=configured_bignumber.js.map