import { RevertError } from '../../revert_error';
export class IllegalReentrancyError extends RevertError {
    constructor() {
        super('IllegalReentrancyError', 'IllegalReentrancyError()', {});
    }
}
RevertError.registerType(IllegalReentrancyError);
