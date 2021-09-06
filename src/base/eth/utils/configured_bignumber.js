import { BigNumber } from 'bignumber.js';
BigNumber.config({
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 78,
});
const isNode = false;
if (isNode) {
    const util = require('util');
    BigNumber.prototype[util.inspect.custom] = function () {
        return this.toString();
    };
}
(orig => (BigNumber.config = (..._args) => orig({})))(BigNumber.config);
BigNumber.set = BigNumber.config;
export { BigNumber };
