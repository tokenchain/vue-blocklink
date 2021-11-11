import { RevertError } from '../../revert_error';
export class SpenderERC20TransferFromFailedError extends RevertError {
    constructor(token, owner, to, amount, errorData) {
        super('SpenderERC20TransferFromFailedError', 'SpenderERC20TransferFromFailedError(address token, address owner, address to, uint256 amount, bytes errorData)', {
            token,
            owner,
            to,
            amount,
            errorData,
        });
    }
}
const types = [SpenderERC20TransferFromFailedError];
for (const type of types) {
    RevertError.registerType(type);
}
