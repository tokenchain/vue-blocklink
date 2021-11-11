import { RevertError } from '../../revert_error';
export var MakerPoolAssignmentErrorCodes;
(function (MakerPoolAssignmentErrorCodes) {
    MakerPoolAssignmentErrorCodes[MakerPoolAssignmentErrorCodes["MakerAddressAlreadyRegistered"] = 0] = "MakerAddressAlreadyRegistered";
    MakerPoolAssignmentErrorCodes[MakerPoolAssignmentErrorCodes["MakerAddressNotRegistered"] = 1] = "MakerAddressNotRegistered";
    MakerPoolAssignmentErrorCodes[MakerPoolAssignmentErrorCodes["MakerAddressNotPendingAdd"] = 2] = "MakerAddressNotPendingAdd";
    MakerPoolAssignmentErrorCodes[MakerPoolAssignmentErrorCodes["PoolIsFull"] = 3] = "PoolIsFull";
})(MakerPoolAssignmentErrorCodes || (MakerPoolAssignmentErrorCodes = {}));
export var OperatorShareErrorCodes;
(function (OperatorShareErrorCodes) {
    OperatorShareErrorCodes[OperatorShareErrorCodes["OperatorShareTooLarge"] = 0] = "OperatorShareTooLarge";
    OperatorShareErrorCodes[OperatorShareErrorCodes["CanOnlyDecreaseOperatorShare"] = 1] = "CanOnlyDecreaseOperatorShare";
})(OperatorShareErrorCodes || (OperatorShareErrorCodes = {}));
export var InvalidParamValueErrorCodes;
(function (InvalidParamValueErrorCodes) {
    InvalidParamValueErrorCodes[InvalidParamValueErrorCodes["InvalidCobbDouglasAlpha"] = 0] = "InvalidCobbDouglasAlpha";
    InvalidParamValueErrorCodes[InvalidParamValueErrorCodes["InvalidRewardDelegatedStakeWeight"] = 1] = "InvalidRewardDelegatedStakeWeight";
    InvalidParamValueErrorCodes[InvalidParamValueErrorCodes["InvalidMaximumMakersInPool"] = 2] = "InvalidMaximumMakersInPool";
    InvalidParamValueErrorCodes[InvalidParamValueErrorCodes["InvalidMinimumPoolStake"] = 3] = "InvalidMinimumPoolStake";
    InvalidParamValueErrorCodes[InvalidParamValueErrorCodes["InvalidEpochDuration"] = 4] = "InvalidEpochDuration";
})(InvalidParamValueErrorCodes || (InvalidParamValueErrorCodes = {}));
export var InitializationErrorCodes;
(function (InitializationErrorCodes) {
    InitializationErrorCodes[InitializationErrorCodes["MixinSchedulerAlreadyInitialized"] = 0] = "MixinSchedulerAlreadyInitialized";
    InitializationErrorCodes[InitializationErrorCodes["MixinParamsAlreadyInitialized"] = 1] = "MixinParamsAlreadyInitialized";
})(InitializationErrorCodes || (InitializationErrorCodes = {}));
export var ExchangeManagerErrorCodes;
(function (ExchangeManagerErrorCodes) {
    ExchangeManagerErrorCodes[ExchangeManagerErrorCodes["ExchangeAlreadyRegistered"] = 0] = "ExchangeAlreadyRegistered";
    ExchangeManagerErrorCodes[ExchangeManagerErrorCodes["ExchangeNotRegistered"] = 1] = "ExchangeNotRegistered";
})(ExchangeManagerErrorCodes || (ExchangeManagerErrorCodes = {}));
export class OnlyCallableByExchangeError extends RevertError {
    constructor(senderAddress) {
        super('OnlyCallableByExchangeError', 'OnlyCallableByExchangeError(address senderAddress)', { senderAddress });
    }
}
export class ExchangeManagerError extends RevertError {
    constructor(errorCode, senderAddress) {
        super('ExchangeManagerError', 'ExchangeManagerError(uint8 errorCode, address senderAddress)', {
            errorCode,
            senderAddress,
        });
    }
}
export class InsufficientBalanceError extends RevertError {
    constructor(amount, balance) {
        super('InsufficientBalanceError', 'InsufficientBalanceError(uint256 amount, uint256 balance)', {
            amount,
            balance,
        });
    }
}
export class OnlyCallableByPoolOperatorError extends RevertError {
    constructor(senderAddress, poolId) {
        super('OnlyCallableByPoolOperatorError', 'OnlyCallableByPoolOperatorError(address senderAddress, bytes32 poolId)', { senderAddress, poolId });
    }
}
export class MakerPoolAssignmentError extends RevertError {
    constructor(error, makerAddress, poolId) {
        super('MakerPoolAssignmentError', 'MakerPoolAssignmentError(uint8 error, address makerAddress, bytes32 poolId)', {
            error,
            makerAddress,
            poolId,
        });
    }
}
export class BlockTimestampTooLowError extends RevertError {
    constructor(epochEndTime, currentBlockTimestamp) {
        super('BlockTimestampTooLowError', 'BlockTimestampTooLowError(uint256 epochEndTime, uint256 currentBlockTimestamp)', { epochEndTime, currentBlockTimestamp });
    }
}
export class OnlyCallableByStakingContractError extends RevertError {
    constructor(senderAddress) {
        super('OnlyCallableByStakingContractError', 'OnlyCallableByStakingContractError(address senderAddress)', {
            senderAddress,
        });
    }
}
export class OnlyCallableIfInCatastrophicFailureError extends RevertError {
    constructor() {
        super('OnlyCallableIfInCatastrophicFailureError', 'OnlyCallableIfInCatastrophicFailureError()', {});
    }
}
export class OnlyCallableIfNotInCatastrophicFailureError extends RevertError {
    constructor() {
        super('OnlyCallableIfNotInCatastrophicFailureError', 'OnlyCallableIfNotInCatastrophicFailureError()', {});
    }
}
export class OperatorShareError extends RevertError {
    constructor(error, poolId, operatorShare) {
        super('OperatorShareError', 'OperatorShareError(uint8 error, bytes32 poolId, uint32 operatorShare)', {
            error,
            poolId,
            operatorShare,
        });
    }
}
export class PoolExistenceError extends RevertError {
    constructor(poolId, alreadyExists) {
        super('PoolExistenceError', 'PoolExistenceError(bytes32 poolId, bool alreadyExists)', {
            poolId,
            alreadyExists,
        });
    }
}
export class InvalidParamValueError extends RevertError {
    constructor(error) {
        super('InvalidParamValueError', 'InvalidParamValueError(uint8 error)', {
            error,
        });
    }
}
export class InvalidProtocolFeePaymentError extends RevertError {
    constructor(expectedProtocolFeePaid, actualProtocolFeePaid) {
        super('InvalidProtocolFeePaymentError', 'InvalidProtocolFeePaymentError(uint256 expectedProtocolFeePaid, uint256 actualProtocolFeePaid)', { expectedProtocolFeePaid, actualProtocolFeePaid });
    }
}
export class InitializationError extends RevertError {
    constructor(error) {
        super('InitializationError', 'InitializationError(uint8 error)', { error });
    }
}
export class ProxyDestinationCannotBeNilError extends RevertError {
    constructor() {
        super('ProxyDestinationCannotBeNilError', 'ProxyDestinationCannotBeNilError()', {});
    }
}
export class PreviousEpochNotFinalizedError extends RevertError {
    constructor(closingEpoch, unfinalizedPoolsRemaining) {
        super('PreviousEpochNotFinalizedError', 'PreviousEpochNotFinalizedError(uint256 closingEpoch, uint256 unfinalizedPoolsRemaining)', { closingEpoch, unfinalizedPoolsRemaining });
    }
}
export class PoolNotFinalizedError extends RevertError {
    constructor(poolId, epoch) {
        super('PoolNotFinalizedError', 'PoolNotFinalizedError(bytes32 poolId, uint256 epoch)', { poolId, epoch });
    }
}
const types = [
    BlockTimestampTooLowError,
    ExchangeManagerError,
    InitializationError,
    InsufficientBalanceError,
    InvalidProtocolFeePaymentError,
    InvalidParamValueError,
    MakerPoolAssignmentError,
    OnlyCallableByExchangeError,
    OnlyCallableByPoolOperatorError,
    OnlyCallableByStakingContractError,
    OnlyCallableIfInCatastrophicFailureError,
    OnlyCallableIfNotInCatastrophicFailureError,
    OperatorShareError,
    PoolExistenceError,
    PreviousEpochNotFinalizedError,
    ProxyDestinationCannotBeNilError,
    PoolNotFinalizedError,
];
for (const type of types) {
    RevertError.registerType(type);
}
//# sourceMappingURL=staking_revert_errors.js.map