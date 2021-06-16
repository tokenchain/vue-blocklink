import { RevertError } from '../../revert_error';
export class MigrateCallFailedError extends RevertError {
    constructor(target, resultData) {
        super('MigrateCallFailedError', 'MigrateCallFailedError(address target, bytes resultData)', {
            target,
            resultData,
        });
    }
}
export class OnlyOwnerError extends RevertError {
    constructor(sender, owner) {
        super('OnlyOwnerError', 'OnlyOwnerError(address sender, bytes owner)', {
            sender,
            owner,
        });
    }
}
const types = [MigrateCallFailedError, OnlyOwnerError];
for (const type of types) {
    RevertError.registerType(type);
}
