import { RevertError } from '../../revert_error';
export class AuthorizedAddressMismatchError extends RevertError {
    constructor(authorized, target) {
        super('AuthorizedAddressMismatchError', 'AuthorizedAddressMismatchError(address authorized, address target)', {
            authorized,
            target,
        });
    }
}
export class IndexOutOfBoundsError extends RevertError {
    constructor(index, len) {
        super('IndexOutOfBoundsError', 'IndexOutOfBoundsError(uint256 index, uint256 len)', { index, len });
    }
}
export class SenderNotAuthorizedError extends RevertError {
    constructor(sender) {
        super('SenderNotAuthorizedError', 'SenderNotAuthorizedError(address sender)', { sender });
    }
}
export class TargetAlreadyAuthorizedError extends RevertError {
    constructor(target) {
        super('TargetAlreadyAuthorizedError', 'TargetAlreadyAuthorizedError(address target)', { target });
    }
}
export class TargetNotAuthorizedError extends RevertError {
    constructor(target) {
        super('TargetNotAuthorizedError', 'TargetNotAuthorizedError(address target)', { target });
    }
}
export class ZeroCantBeAuthorizedError extends RevertError {
    constructor() {
        super('ZeroCantBeAuthorizedError', 'ZeroCantBeAuthorizedError()', {});
    }
}
const types = [
    AuthorizedAddressMismatchError,
    IndexOutOfBoundsError,
    SenderNotAuthorizedError,
    TargetAlreadyAuthorizedError,
    TargetNotAuthorizedError,
    ZeroCantBeAuthorizedError,
];
for (const type of types) {
    RevertError.registerType(type);
}
