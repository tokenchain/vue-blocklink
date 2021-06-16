import { RevertError } from '../../revert_error';
export class DivisionByZeroError extends RevertError {
    constructor() {
        super('DivisionByZeroError', 'DivisionByZeroError()', {});
    }
}
export class RoundingError extends RevertError {
    constructor(numerator, denominator, target) {
        super('RoundingError', 'RoundingError(uint256 numerator, uint256 denominator, uint256 target)', {
            numerator,
            denominator,
            target,
        });
    }
}
const types = [DivisionByZeroError, RoundingError];
for (const type of types) {
    RevertError.registerType(type);
}
