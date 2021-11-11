import { RevertError } from '../../revert_error';
export class MismanagedMemoryError extends RevertError {
    constructor(freeMemPtr, addressArrayEndPtr) {
        super('MismanagedMemoryError', 'MismanagedMemoryError(uint256 freeMemPtr, uint256 addressArrayEndPtr)', {
            freeMemPtr,
            addressArrayEndPtr,
        });
    }
}
RevertError.registerType(MismanagedMemoryError);
//# sourceMappingURL=lib_address_array_revert_errors.js.map