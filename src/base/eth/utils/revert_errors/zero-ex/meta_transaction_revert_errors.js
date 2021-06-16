import { RevertError } from '../../revert_error';
export class InvalidMetaTransactionsArrayLengthsError extends RevertError {
    constructor(mtxCount, signatureCount) {
        super('InvalidMetaTransactionsArrayLengthsError', 'InvalidMetaTransactionsArrayLengthsError(uint256 mtxCount, uint256 signatureCount)', {
            mtxCount,
            signatureCount,
        });
    }
}
export class MetaTransactionAlreadyExecutedError extends RevertError {
    constructor(mtxHash, executedBlockNumber) {
        super('MetaTransactionAlreadyExecutedError', 'MetaTransactionAlreadyExecutedError(bytes32 mtxHash, uint256 executedBlockNumber)', {
            mtxHash,
            executedBlockNumber,
        });
    }
}
export class MetaTransactionUnsupportedFunctionError extends RevertError {
    constructor(mtxHash, selector) {
        super('MetaTransactionUnsupportedFunctionError', 'MetaTransactionUnsupportedFunctionError(bytes32 mtxHash, bytes4 selector)', {
            mtxHash,
            selector,
        });
    }
}
export class MetaTransactionWrongSenderError extends RevertError {
    constructor(mtxHash, sender, expectedSender) {
        super('MetaTransactionWrongSenderError', 'MetaTransactionWrongSenderError(bytes32 mtxHash, address sender, address expectedSender)', {
            mtxHash,
            sender,
            expectedSender,
        });
    }
}
export class MetaTransactionExpiredError extends RevertError {
    constructor(mtxHash, time, expirationTime) {
        super('MetaTransactionExpiredError', 'MetaTransactionExpiredError(bytes32 mtxHash, uint256 time, uint256 expirationTime)', {
            mtxHash,
            time,
            expirationTime,
        });
    }
}
export class MetaTransactionGasPriceError extends RevertError {
    constructor(mtxHash, gasPrice, minGasPrice, maxGasPrice) {
        super('MetaTransactionGasPriceError', 'MetaTransactionGasPriceError(bytes32 mtxHash, uint256 gasPrice, uint256 minGasPrice, uint256 maxGasPrice)', {
            mtxHash,
            gasPrice,
            minGasPrice,
            maxGasPrice,
        });
    }
}
export class MetaTransactionInsufficientEthError extends RevertError {
    constructor(mtxHash, ethBalance, ethRequired) {
        super('MetaTransactionInsufficientEthError', 'MetaTransactionInsufficientEthError(bytes32 mtxHash, uint256 ethBalance, uint256 ethRequired)', {
            mtxHash,
            ethBalance,
            ethRequired,
        });
    }
}
export class MetaTransactionInvalidSignatureError extends RevertError {
    constructor(mtxHash, signature, errData) {
        super('MetaTransactionInvalidSignatureError', 'MetaTransactionInvalidSignatureError(bytes32 mtxHash, bytes signature, bytes errData)', {
            mtxHash,
            signature,
            errData,
        });
    }
}
export class MetaTransactionCallFailedError extends RevertError {
    constructor(mtxHash, callData, returnData) {
        super('MetaTransactionCallFailedError', 'MetaTransactionCallFailedError(bytes32 mtxHash, bytes callData, bytes returnData)', {
            mtxHash,
            callData,
            returnData,
        });
    }
}
const types = [
    InvalidMetaTransactionsArrayLengthsError,
    MetaTransactionAlreadyExecutedError,
    MetaTransactionUnsupportedFunctionError,
    MetaTransactionWrongSenderError,
    MetaTransactionExpiredError,
    MetaTransactionGasPriceError,
    MetaTransactionInsufficientEthError,
    MetaTransactionInvalidSignatureError,
    MetaTransactionCallFailedError,
];
for (const type of types) {
    RevertError.registerType(type);
}
