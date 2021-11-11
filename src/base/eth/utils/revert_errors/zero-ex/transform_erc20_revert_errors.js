import { RevertError } from '../../revert_error';
export class InsufficientEthAttachedError extends RevertError {
    constructor(ethAttached, ethNeeded) {
        super('InsufficientEthAttachedError', 'InsufficientEthAttachedError(uint256 ethAttached, uint256 ethNeeded)', {
            ethAttached,
            ethNeeded,
        });
    }
}
export class IncompleteTransformERC20Error extends RevertError {
    constructor(outputToken, outputTokenAmount, minOutputTokenAmount) {
        super('IncompleteTransformERC20Error', 'IncompleteTransformERC20Error(address outputToken, uint256 outputTokenAmount, uint256 minOutputTokenAmount)', {
            outputToken,
            outputTokenAmount,
            minOutputTokenAmount,
        });
    }
}
export class NegativeTransformERC20OutputError extends RevertError {
    constructor(outputToken, outputTokenLostAmount) {
        super('NegativeTransformERC20OutputError', 'NegativeTransformERC20OutputError(address outputToken, uint256 outputTokenLostAmount)', {
            outputToken,
            outputTokenLostAmount,
        });
    }
}
export class TransformerFailedError extends RevertError {
    constructor(transformer, transformerData, resultData) {
        super('TransformerFailedError', 'TransformerFailedError(address transformer, bytes transformerData, bytes resultData)', {
            transformer,
            transformerData,
            resultData,
        });
    }
}
export class OnlyCallableByDeployerError extends RevertError {
    constructor(caller, deployer) {
        super('OnlyCallableByDeployerError', 'OnlyCallableByDeployerError(address caller, address deployer)', {
            caller,
            deployer,
        });
    }
}
export class InvalidExecutionContextError extends RevertError {
    constructor(actualContext, expectedContext) {
        super('InvalidExecutionContextError', 'InvalidExecutionContextError(address actualContext, address expectedContext)', {
            actualContext,
            expectedContext,
        });
    }
}
export var InvalidTransformDataErrorCode;
(function (InvalidTransformDataErrorCode) {
    InvalidTransformDataErrorCode[InvalidTransformDataErrorCode["InvalidTokens"] = 0] = "InvalidTokens";
    InvalidTransformDataErrorCode[InvalidTransformDataErrorCode["InvalidArrayLength"] = 1] = "InvalidArrayLength";
})(InvalidTransformDataErrorCode || (InvalidTransformDataErrorCode = {}));
export class InvalidTransformDataError extends RevertError {
    constructor(errorCode, transformData) {
        super('InvalidTransformDataError', 'InvalidTransformDataError(uint8 errorCode, bytes transformData)', {
            errorCode,
            transformData,
        });
    }
}
export class IncompleteFillSellQuoteError extends RevertError {
    constructor(sellToken, soldAmount, sellAmount) {
        super('IncompleteFillSellQuoteError', 'IncompleteFillSellQuoteError(address sellToken, uint256 soldAmount, uint256 sellAmount)', {
            sellToken,
            soldAmount,
            sellAmount,
        });
    }
}
export class IncompleteFillBuyQuoteError extends RevertError {
    constructor(buyToken, boughtAmount, buyAmount) {
        super('IncompleteFillBuyQuoteError', 'IncompleteFillBuyQuoteError(address buyToken, uint256 boughtAmount, uint256 buyAmount)', {
            buyToken,
            boughtAmount,
            buyAmount,
        });
    }
}
export class InsufficientTakerTokenError extends RevertError {
    constructor(tokenBalance, tokensNeeded) {
        super('InsufficientTakerTokenError', 'InsufficientTakerTokenError(uint256 tokenBalance, uint256 tokensNeeded)', {
            tokenBalance,
            tokensNeeded,
        });
    }
}
export class InsufficientProtocolFeeError extends RevertError {
    constructor(ethBalance, ethNeeded) {
        super('InsufficientProtocolFeeError', 'InsufficientProtocolFeeError(uint256 ethBalance, uint256 ethNeeded)', {
            ethBalance,
            ethNeeded,
        });
    }
}
export class InvalidERC20AssetDataError extends RevertError {
    constructor(assetData) {
        super('InvalidERC20AssetDataError', 'InvalidERC20AssetDataError(bytes assetData)', {
            assetData,
        });
    }
}
export class WrongNumberOfTokensReceivedError extends RevertError {
    constructor(actual, expected) {
        super('WrongNumberOfTokensReceivedError', 'WrongNumberOfTokensReceivedError(uint256 actual, uint256 expected)', {
            actual,
            expected,
        });
    }
}
export class InvalidTokenReceivedError extends RevertError {
    constructor(token) {
        super('InvalidTokenReceivedError', 'InvalidTokenReceivedError(address token)', {
            token,
        });
    }
}
export class InvalidTakerFeeTokenError extends RevertError {
    constructor(token) {
        super('InvalidTakerFeeTokenError', 'InvalidTakerFeeTokenError(address token)', {
            token,
        });
    }
}
const types = [
    InsufficientEthAttachedError,
    IncompleteTransformERC20Error,
    NegativeTransformERC20OutputError,
    TransformerFailedError,
    IncompleteFillSellQuoteError,
    IncompleteFillBuyQuoteError,
    InsufficientTakerTokenError,
    InsufficientProtocolFeeError,
    InvalidERC20AssetDataError,
    WrongNumberOfTokensReceivedError,
    InvalidTokenReceivedError,
    InvalidTransformDataError,
    InvalidTakerFeeTokenError,
    OnlyCallableByDeployerError,
    InvalidExecutionContextError,
];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=transform_erc20_revert_errors.js.map