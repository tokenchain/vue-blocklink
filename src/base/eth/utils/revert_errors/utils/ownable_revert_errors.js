import { RevertError } from '../../revert_error';
export class OnlyOwnerError extends RevertError {
    constructor(sender, owner) {
        super('OnlyOwnerError', 'OnlyOwnerError(address sender, address owner)', {
            sender,
            owner,
        });
    }
}
export class TransferOwnerToZeroError extends RevertError {
    constructor() {
        super('TransferOwnerToZeroError', 'TransferOwnerToZeroError()', {});
    }
}
const types = [OnlyOwnerError, TransferOwnerToZeroError];
for (const type of types) {
    RevertError.registerType(type);
}
