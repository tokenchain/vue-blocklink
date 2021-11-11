export class PromiseWithTransactionHash {
    constructor(txHashPromise, promise) {
        this.txHashPromise = txHashPromise;
        this._promise = promise;
    }
    then(onFulfilled, onRejected) {
        return this._promise.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
        return this._promise.catch(onRejected);
    }
    finally(onFinally) {
        return this._promise.finally(onFinally);
    }
    get [Symbol.toStringTag]() {
        return this._promise[Symbol.toStringTag];
    }
}
export var SubscriptionErrors;
(function (SubscriptionErrors) {
    SubscriptionErrors["SubscriptionNotFound"] = "SUBSCRIPTION_NOT_FOUND";
    SubscriptionErrors["SubscriptionAlreadyPresent"] = "SUBSCRIPTION_ALREADY_PRESENT";
})(SubscriptionErrors || (SubscriptionErrors = {}));
export var OpCode;
(function (OpCode) {
    OpCode["Stop"] = "STOP";
    OpCode["Add"] = "ADD";
    OpCode["Mul"] = "MUL";
    OpCode["Sub"] = "SUB";
    OpCode["Div"] = "DIV";
    OpCode["SDiv"] = "SDIV";
    OpCode["Mod"] = "MOD";
    OpCode["SMod"] = "SMOD";
    OpCode["AddMod"] = "ADDMOD";
    OpCode["MulMod"] = "MULMOD";
    OpCode["Exp"] = "EXP";
    OpCode["SignExtend"] = "SIGNEXTEND";
    OpCode["Lt"] = "LT";
    OpCode["Gt"] = "GT";
    OpCode["SLt"] = "SLT";
    OpCode["SGt"] = "SGT";
    OpCode["Eq"] = "EQ";
    OpCode["IsZero"] = "ISZERO";
    OpCode["And"] = "AND";
    OpCode["Or"] = "OR";
    OpCode["Xor"] = "XOR";
    OpCode["Not"] = "NOT";
    OpCode["Byte"] = "BYTE";
    OpCode["Sha3"] = "SHA3";
    OpCode["Address"] = "ADDRESS";
    OpCode["Balance"] = "BALANCE";
    OpCode["Origin"] = "ORIGIN";
    OpCode["Caller"] = "CALLER";
    OpCode["CallValue"] = "CALLVALUE";
    OpCode["CallDataLoad"] = "CALLDATALOAD";
    OpCode["CallDataSize"] = "CALLDATASIZE";
    OpCode["CallDataCopy"] = "CALLDATACOPY";
    OpCode["CodeSize"] = "CODESIZE";
    OpCode["CodeCopy"] = "CODECOPY";
    OpCode["GasPrice"] = "GASPRICE";
    OpCode["ExtCodeSize"] = "EXTCODESIZE";
    OpCode["ExtCodeCopy"] = "EXTCODECOPY";
    OpCode["ReturnDataSize"] = "RETURNDATASIZE";
    OpCode["ReturnDataCopy"] = "RETURNDATACOPY";
    OpCode["BlockHash"] = "BLOCKHASH";
    OpCode["Coinbase"] = "COINBASE";
    OpCode["TimeStamp"] = "TimeStamp";
    OpCode["Number"] = "NUMBER";
    OpCode["Difficulty"] = "DIFFICULTY";
    OpCode["Gaslimit"] = "GASLIMIT";
    OpCode["Pop"] = "POP";
    OpCode["MLoad"] = "MLOAD";
    OpCode["MStore"] = "MSTORE";
    OpCode["MStore8"] = "MSTORE8";
    OpCode["SLoad"] = "SLOAD";
    OpCode["SStore"] = "SSTORE";
    OpCode["Jump"] = "JUMP";
    OpCode["Jumpi"] = "JUMPI";
    OpCode["Pc"] = "PC";
    OpCode["MSize"] = "MSIZE";
    OpCode["Gas"] = "GAS";
    OpCode["JumpDest"] = "JUMPDEST";
    OpCode["Push1"] = "PUSH1";
    OpCode["Push2"] = "PUSH2";
    OpCode["Push3"] = "PUSH3";
    OpCode["Push4"] = "PUSH4";
    OpCode["Push5"] = "PUSH5";
    OpCode["Push6"] = "PUSH6";
    OpCode["Push7"] = "PUSH7";
    OpCode["Push8"] = "PUSH8";
    OpCode["Push9"] = "PUSH9";
    OpCode["Push10"] = "PUSH10";
    OpCode["Push11"] = "PUSH11";
    OpCode["Push12"] = "PUSH12";
    OpCode["Push13"] = "PUSH13";
    OpCode["Push14"] = "PUSH14";
    OpCode["Push15"] = "PUSH15";
    OpCode["Push16"] = "PUSH16";
    OpCode["Push17"] = "PUSH17";
    OpCode["Push18"] = "PUSH18";
    OpCode["Push19"] = "PUSH19";
    OpCode["Push20"] = "PUSH20";
    OpCode["Push21"] = "PUSH21";
    OpCode["Push22"] = "PUSH22";
    OpCode["Push23"] = "PUSH23";
    OpCode["Push24"] = "PUSH24";
    OpCode["Push25"] = "PUSH25";
    OpCode["Push26"] = "PUSH26";
    OpCode["Push27"] = "PUSH27";
    OpCode["Push28"] = "PUSH28";
    OpCode["Push29"] = "PUSH29";
    OpCode["Push30"] = "PUSH30";
    OpCode["Push31"] = "PUSH31";
    OpCode["Push32"] = "PUSH32";
    OpCode["Dup1"] = "DUP1";
    OpCode["Dup2"] = "DUP2";
    OpCode["Dup3"] = "DUP3";
    OpCode["Dup4"] = "DUP4";
    OpCode["Dup5"] = "DUP5";
    OpCode["Dup6"] = "DUP6";
    OpCode["Dup7"] = "DUP7";
    OpCode["Dup8"] = "DUP8";
    OpCode["Dup9"] = "DUP9";
    OpCode["Dup10"] = "DUP10";
    OpCode["Dup11"] = "DUP11";
    OpCode["Dup12"] = "DUP12";
    OpCode["Dup13"] = "DUP13";
    OpCode["Dup14"] = "DUP14";
    OpCode["Dup15"] = "DUP15";
    OpCode["Dup16"] = "DUP16";
    OpCode["Swap1"] = "SWAP1";
    OpCode["Swap2"] = "SWAP2";
    OpCode["Swap3"] = "SWAP3";
    OpCode["Swap4"] = "SWAP4";
    OpCode["Swap5"] = "SWAP5";
    OpCode["Swap6"] = "SWAP6";
    OpCode["Swap7"] = "SWAP7";
    OpCode["Swap8"] = "SWAP8";
    OpCode["Swap9"] = "SWAP9";
    OpCode["Swap10"] = "SWAP10";
    OpCode["Swap11"] = "SWAP11";
    OpCode["Swap12"] = "SWAP12";
    OpCode["Swap13"] = "SWAP13";
    OpCode["Swap14"] = "SWAP14";
    OpCode["Swap15"] = "SWAP15";
    OpCode["Swap16"] = "SWAP16";
    OpCode["Log1"] = "LOG1";
    OpCode["Log2"] = "LOG2";
    OpCode["Log3"] = "LOG3";
    OpCode["Log4"] = "LOG4";
    OpCode["Create"] = "CREATE";
    OpCode["Call"] = "CALL";
    OpCode["CallCode"] = "CALLCODE";
    OpCode["Return"] = "RETURN";
    OpCode["DelegateCall"] = "DELEGATECALL";
    OpCode["StaticCall"] = "STATICCALL";
    OpCode["Revert"] = "REVERT";
    OpCode["Invalid"] = "INVALID";
    OpCode["SelfDestruct"] = "SELFDESTRUCT";
})(OpCode || (OpCode = {}));
export var AbiType;
(function (AbiType) {
    AbiType["Function"] = "function";
    AbiType["Constructor"] = "constructor";
    AbiType["Event"] = "event";
    AbiType["Fallback"] = "fallback";
})(AbiType || (AbiType = {}));
export var BlockParamLiteral;
(function (BlockParamLiteral) {
    BlockParamLiteral["Earliest"] = "earliest";
    BlockParamLiteral["Latest"] = "latest";
    BlockParamLiteral["Pending"] = "pending";
})(BlockParamLiteral || (BlockParamLiteral = {}));
export var SolidityTypes;
(function (SolidityTypes) {
    SolidityTypes["Address"] = "address";
    SolidityTypes["Bool"] = "bool";
    SolidityTypes["Bytes"] = "bytes";
    SolidityTypes["Int"] = "int";
    SolidityTypes["String"] = "string";
    SolidityTypes["Tuple"] = "tuple";
    SolidityTypes["Uint256"] = "uint256";
    SolidityTypes["Uint8"] = "uint8";
    SolidityTypes["Uint"] = "uint";
})(SolidityTypes || (SolidityTypes = {}));
//# sourceMappingURL=types.js.map