import { RevertError } from '../../revert_error';
export var BatchMatchOrdersErrorCodes;
(function (BatchMatchOrdersErrorCodes) {
    BatchMatchOrdersErrorCodes[BatchMatchOrdersErrorCodes["ZeroLeftOrders"] = 0] = "ZeroLeftOrders";
    BatchMatchOrdersErrorCodes[BatchMatchOrdersErrorCodes["ZeroRightOrders"] = 1] = "ZeroRightOrders";
    BatchMatchOrdersErrorCodes[BatchMatchOrdersErrorCodes["InvalidLengthLeftSignatures"] = 2] = "InvalidLengthLeftSignatures";
    BatchMatchOrdersErrorCodes[BatchMatchOrdersErrorCodes["InvalidLengthRightSignatures"] = 3] = "InvalidLengthRightSignatures";
})(BatchMatchOrdersErrorCodes || (BatchMatchOrdersErrorCodes = {}));
export var ExchangeContextErrorCodes;
(function (ExchangeContextErrorCodes) {
    ExchangeContextErrorCodes[ExchangeContextErrorCodes["InvalidMaker"] = 0] = "InvalidMaker";
    ExchangeContextErrorCodes[ExchangeContextErrorCodes["InvalidTaker"] = 1] = "InvalidTaker";
    ExchangeContextErrorCodes[ExchangeContextErrorCodes["InvalidSender"] = 2] = "InvalidSender";
})(ExchangeContextErrorCodes || (ExchangeContextErrorCodes = {}));
export var FillErrorCode;
(function (FillErrorCode) {
    FillErrorCode[FillErrorCode["InvalidTakerAmount"] = 0] = "InvalidTakerAmount";
    FillErrorCode[FillErrorCode["TakerOverpay"] = 1] = "TakerOverpay";
    FillErrorCode[FillErrorCode["Overfill"] = 2] = "Overfill";
    FillErrorCode[FillErrorCode["InvalidFillPrice"] = 3] = "InvalidFillPrice";
})(FillErrorCode || (FillErrorCode = {}));
export var SignatureErrorCode;
(function (SignatureErrorCode) {
    SignatureErrorCode[SignatureErrorCode["BadOrderSignature"] = 0] = "BadOrderSignature";
    SignatureErrorCode[SignatureErrorCode["BadTransactionSignature"] = 1] = "BadTransactionSignature";
    SignatureErrorCode[SignatureErrorCode["InvalidLength"] = 2] = "InvalidLength";
    SignatureErrorCode[SignatureErrorCode["Unsupported"] = 3] = "Unsupported";
    SignatureErrorCode[SignatureErrorCode["Illegal"] = 4] = "Illegal";
    SignatureErrorCode[SignatureErrorCode["InappropriateSignatureType"] = 5] = "InappropriateSignatureType";
    SignatureErrorCode[SignatureErrorCode["InvalidSigner"] = 6] = "InvalidSigner";
})(SignatureErrorCode || (SignatureErrorCode = {}));
export var AssetProxyDispatchErrorCode;
(function (AssetProxyDispatchErrorCode) {
    AssetProxyDispatchErrorCode[AssetProxyDispatchErrorCode["InvalidAssetDataLength"] = 0] = "InvalidAssetDataLength";
    AssetProxyDispatchErrorCode[AssetProxyDispatchErrorCode["UnknownAssetProxy"] = 1] = "UnknownAssetProxy";
})(AssetProxyDispatchErrorCode || (AssetProxyDispatchErrorCode = {}));
export var TransactionErrorCode;
(function (TransactionErrorCode) {
    TransactionErrorCode[TransactionErrorCode["AlreadyExecuted"] = 0] = "AlreadyExecuted";
    TransactionErrorCode[TransactionErrorCode["Expired"] = 1] = "Expired";
})(TransactionErrorCode || (TransactionErrorCode = {}));
export var IncompleteFillErrorCode;
(function (IncompleteFillErrorCode) {
    IncompleteFillErrorCode[IncompleteFillErrorCode["IncompleteMarketBuyOrders"] = 0] = "IncompleteMarketBuyOrders";
    IncompleteFillErrorCode[IncompleteFillErrorCode["IncompleteMarketSellOrders"] = 1] = "IncompleteMarketSellOrders";
    IncompleteFillErrorCode[IncompleteFillErrorCode["IncompleteFillOrder"] = 2] = "IncompleteFillOrder";
})(IncompleteFillErrorCode || (IncompleteFillErrorCode = {}));
export class BatchMatchOrdersError extends RevertError {
    constructor(error) {
        super('BatchMatchOrdersError', 'BatchMatchOrdersError(uint8 error)', { error });
    }
}
export class SignatureError extends RevertError {
    constructor(error, hash, signer, signature) {
        super('SignatureError', 'SignatureError(uint8 error, bytes32 hash, address signer, bytes signature)', {
            error,
            hash,
            signer,
            signature,
        });
    }
}
export class SignatureValidatorNotApprovedError extends RevertError {
    constructor(signer, validator) {
        super('SignatureValidatorNotApprovedError', 'SignatureValidatorNotApprovedError(address signer, address validator)', {
            signer,
            validator,
        });
    }
}
export class SignatureWalletError extends RevertError {
    constructor(hash, wallet, signature, errorData) {
        super('SignatureWalletError', 'SignatureWalletError(bytes32 hash, address wallet, bytes signature, bytes errorData)', {
            hash,
            wallet,
            signature,
            errorData,
        });
    }
}
export class EIP1271SignatureError extends RevertError {
    constructor(verifyingContract, data, signature, errorData) {
        super('EIP1271SignatureError', 'EIP1271SignatureError(address verifyingContract, bytes data, bytes signature, bytes errorData)', {
            verifyingContract,
            data,
            signature,
            errorData,
        });
    }
}
export class OrderStatusError extends RevertError {
    constructor(orderHash, status) {
        super('OrderStatusError', 'OrderStatusError(bytes32 orderHash, uint8 status)', { orderHash, status });
    }
}
export class FillError extends RevertError {
    constructor(error, orderHash) {
        super('FillError', 'FillError(uint8 error, bytes32 orderHash)', { error, orderHash });
    }
}
export class OrderEpochError extends RevertError {
    constructor(maker, sender, currentEpoch) {
        super('OrderEpochError', 'OrderEpochError(address maker, address sender, uint256 currentEpoch)', {
            maker,
            sender,
            currentEpoch,
        });
    }
}
export class AssetProxyExistsError extends RevertError {
    constructor(assetProxyId, assetProxy) {
        super('AssetProxyExistsError', 'AssetProxyExistsError(bytes4 assetProxyId, address assetProxy)', {
            assetProxyId,
            assetProxy,
        });
    }
}
export class AssetProxyDispatchError extends RevertError {
    constructor(error, orderHash, assetData) {
        super('AssetProxyDispatchError', 'AssetProxyDispatchError(uint8 error, bytes32 orderHash, bytes assetData)', {
            error,
            orderHash,
            assetData,
        });
    }
}
export class AssetProxyTransferError extends RevertError {
    constructor(orderHash, assetData, errorData) {
        super('AssetProxyTransferError', 'AssetProxyTransferError(bytes32 orderHash, bytes assetData, bytes errorData)', {
            orderHash,
            assetData,
            errorData,
        });
    }
}
export class NegativeSpreadError extends RevertError {
    constructor(leftOrderHash, rightOrderHash) {
        super('NegativeSpreadError', 'NegativeSpreadError(bytes32 leftOrderHash, bytes32 rightOrderHash)', {
            leftOrderHash,
            rightOrderHash,
        });
    }
}
export class TransactionError extends RevertError {
    constructor(error, transactionHash) {
        super('TransactionError', 'TransactionError(uint8 error, bytes32 transactionHash)', { error, transactionHash });
    }
}
export class TransactionExecutionError extends RevertError {
    constructor(transactionHash, errorData) {
        super('TransactionExecutionError', 'TransactionExecutionError(bytes32 transactionHash, bytes errorData)', {
            transactionHash,
            errorData,
        });
    }
}
export class TransactionGasPriceError extends RevertError {
    constructor(transactionHash, actualGasPrice, requiredGasPrice) {
        super('TransactionGasPriceError', 'TransactionGasPriceError(bytes32 transactionHash, uint256 actualGasPrice, uint256 requiredGasPrice)', {
            transactionHash,
            actualGasPrice,
            requiredGasPrice,
        });
    }
}
export class TransactionInvalidContextError extends RevertError {
    constructor(transactionHash, currentContextAddress) {
        super('TransactionInvalidContextError', 'TransactionInvalidContextError(bytes32 transactionHash, address currentContextAddress)', {
            transactionHash,
            currentContextAddress,
        });
    }
}
export class IncompleteFillError extends RevertError {
    constructor(error, expectedAssetFillAmount, actualAssetFillAmount) {
        super('IncompleteFillError', 'IncompleteFillError(uint8 error, uint256 expectedAssetFillAmount, uint256 actualAssetFillAmount)', {
            error,
            expectedAssetFillAmount,
            actualAssetFillAmount,
        });
    }
}
export class ExchangeInvalidContextError extends RevertError {
    constructor(error, orderHash, contextAddress) {
        super('ExchangeInvalidContextError', 'ExchangeInvalidContextError(uint8 error, bytes32 orderHash, address contextAddress)', { error, orderHash, contextAddress });
    }
}
export class PayProtocolFeeError extends RevertError {
    constructor(orderHash, protocolFee, makerAddress, takerAddress, errorData) {
        super('PayProtocolFeeError', 'PayProtocolFeeError(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress, bytes errorData)', { orderHash, protocolFee, makerAddress, takerAddress, errorData });
    }
}
const types = [
    AssetProxyExistsError,
    AssetProxyDispatchError,
    AssetProxyTransferError,
    BatchMatchOrdersError,
    EIP1271SignatureError,
    ExchangeInvalidContextError,
    FillError,
    IncompleteFillError,
    NegativeSpreadError,
    OrderEpochError,
    OrderStatusError,
    PayProtocolFeeError,
    SignatureError,
    SignatureValidatorNotApprovedError,
    SignatureWalletError,
    TransactionError,
    TransactionExecutionError,
    TransactionGasPriceError,
    TransactionInvalidContextError,
];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=revert_errors.js.map