import { RevertError } from '../../revert_error';
export class OnlyCallableBySelfError extends RevertError {
    constructor(sender) {
        super('OnlyCallableBySelfError', 'OnlyCallableBySelfError(address sender)', {
            sender,
        });
    }
}
export class IllegalReentrancyError extends RevertError {
    constructor(selector, reentrancyFlags) {
        super('IllegalReentrancyError', 'IllegalReentrancyError(bytes4 selector, uint256 reentrancyFlags)', {
            selector,
            reentrancyFlags,
        });
    }
}
const types = [OnlyCallableBySelfError, IllegalReentrancyError];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=common_revert_errors.js.map