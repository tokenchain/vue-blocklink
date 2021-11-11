import { RevertError } from '../../revert_error';
export class NotImplementedError extends RevertError {
    constructor(selector) {
        super('NotImplementedError', 'NotImplementedError(bytes4 selector)', {
            selector,
        });
    }
}
export class InvalidBootstrapCallerError extends RevertError {
    constructor(caller, expectedCaller) {
        super('InvalidBootstrapCallerError', 'InvalidBootstrapCallerError(address caller, address expectedCaller)', {
            caller,
            expectedCaller,
        });
    }
}
export class InvalidDieCallerError extends RevertError {
    constructor(caller, expectedCaller) {
        super('InvalidDieCallerError', 'InvalidDieCallerError(address caller, address expectedCaller)', {
            caller,
            expectedCaller,
        });
    }
}
export class BootstrapCallFailedError extends RevertError {
    constructor(target, resultData) {
        super('BootstrapCallFailedError', 'BootstrapCallFailedError(address target, bytes resultData)', {
            target,
            resultData,
        });
    }
}
const types = [BootstrapCallFailedError, InvalidBootstrapCallerError, InvalidDieCallerError, NotImplementedError];
for (const type of types) {
    RevertError.registerType(type);
}
