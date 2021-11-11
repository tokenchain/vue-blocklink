import { RevertError } from '../../revert_error';
export class NotInRollbackHistoryError extends RevertError {
    constructor(selector, targetImpl) {
        super('NotInRollbackHistoryError', 'NotInRollbackHistoryError(bytes4 selector, address targetImpl)', {
            selector,
            targetImpl,
        });
    }
}
const types = [NotInRollbackHistoryError];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=simple_function_registry_revert_errors.js.map