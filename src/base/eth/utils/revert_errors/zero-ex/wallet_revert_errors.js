import { RevertError } from '../../revert_error';
export class WalletExecuteCallFailedError extends RevertError {
    constructor(wallet, callTarget, callData, callValue, errorData) {
        super('WalletExecuteCallFailedError', 'WalletExecuteCallFailedError(address wallet, address callTarget, bytes callData, uint256 callValue, bytes errorData)', {
            wallet,
            callTarget,
            callData,
            callValue,
            errorData,
        });
    }
}
export class WalletExecuteDelegateCallFailedError extends RevertError {
    constructor(wallet, callTarget, callData, errorData) {
        super('WalletExecuteDelegateCallFailedError', 'WalletExecuteDelegateCallFailedError(address wallet, address callTarget, bytes callData, bytes errorData)', {
            wallet,
            callTarget,
            callData,
            errorData,
        });
    }
}
const types = [WalletExecuteCallFailedError, WalletExecuteDelegateCallFailedError];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=wallet_revert_errors.js.map