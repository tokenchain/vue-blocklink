import { Web3Wrapper } from './0xw3w';
import { EventEmitter } from "eventemitter3";
import { assert } from './0xassert';
import { schemas } from './validations';
import { AbiEncoder, abiUtils, BigNumber, decodeBytesAsRevertError, decodeThrownErrorAsRevertError, providerUtils, StringRevertError, } from './utils';
import Account from 'ethereumjs-account';
import * as util from 'ethereumjs-util';
import { default as VM } from 'ethereumjs-vm';
import * as _ from "lodash";
import PStateManager from 'ethereumjs-vm/dist/state/promisified';
import { AbiType, } from "./types";
export { linkLibrariesInBytecode, methodAbiToFunctionSignature } from './utils';
export { SubscriptionManager } from './subscription_manager';
const ARBITRARY_PRIVATE_KEY = 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109';
function formatABIDataItem(type, components, value) {
    const trailingArrayRegex = /\[\d*\]$/;
    if (type.match(trailingArrayRegex)) {
        const arrayItemType = type.replace(trailingArrayRegex, '');
        return _.map(value, val => (formatABIDataItem(arrayItemType, components, val)));
    }
    else if (type === 'tuple') {
        const formattedTuple = {};
        _.forEach(components, componentABI => {
            formattedTuple[componentABI.name] = formatABIDataItem(componentABI.type, componentABI.components, value[componentABI.name]);
        });
        return formattedTuple;
    }
    else {
        return type.match(/^u?int\d*$/) ? value.toString() : value;
    }
}
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
export class BaseContract extends EventEmitter {
    constructor(contractName, abi, address, supportedProvider, callAndTxnDefaults, logDecodeDependencies, deployedBytecode, encoderOverrides) {
        this.constructorArgs = [];
        assert.isString('contractName', contractName);
        assert.isETHAddressHex('address', address);
        if (deployedBytecode !== undefined && deployedBytecode !== '') {
            try {
                assert.isHexString('deployedBytecode', deployedBytecode);
                this._deployedBytecodeIfExists = Buffer.from(deployedBytecode.substr(2), 'hex');
            }
            catch (err) {
            }
        }
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        if (callAndTxnDefaults !== undefined) {
            assert.doesConformToSchema('callAndTxnDefaults', callAndTxnDefaults, schemas.callDataSchema);
        }
        this.contractName = contractName;
        this._web3Wrapper = new Web3Wrapper(provider, callAndTxnDefaults);
        this._encoderOverrides = encoderOverrides || {};
        this.abi = abi;
        this.address = address;
        const methodAbis = this.abi.filter((abiDefinition) => abiDefinition.type === AbiType.Function);
        this._abiEncoderByFunctionSignature = {};
        methodAbis.forEach(methodAbi => {
            const abiEncoder = new AbiEncoder.Method(methodAbi);
            const functionSignature = abiEncoder.getSignature();
            this._abiEncoderByFunctionSignature[functionSignature] = abiEncoder;
            this._web3Wrapper.abiDecoder.addABI(abi, contractName);
        });
        if (logDecodeDependencies) {
            Object.entries(logDecodeDependencies).forEach(([dependencyName, dependencyAbi]) => this._web3Wrapper.abiDecoder.addABI(dependencyAbi, dependencyName));
        }
    }
    decodeValues(params) {
        let results = [];
        if (w3.utils.isArray(params)) {
            const l = params.length;
            for (let h = 0; h < l; h++) {
                if (w3.utils.isBigNumber(params[h])) {
                    results.push(params[h].toString());
                }
                else {
                    console.log("parse outside :: ", params[h]);
                }
            }
        }
        else {
            results = [];
        }
        return results;
    }
    static _formatABIDataItemList(abis, values, formatter) {
        return values.map((value, i) => formatABIDataItem(abis[i].type, value, formatter));
    }
    static _lowercaseAddress(type, value) {
        return type === 'address' ? value.toLowerCase() : value;
    }
    static _bigNumberToString(_type, value) {
        return BigNumber.isBigNumber(value) ? value.toString() : value;
    }
    static _lookupConstructorAbi(abi) {
        const constructorAbiIfExists = abi.find((abiDefinition) => abiDefinition.type === AbiType.Constructor);
        if (constructorAbiIfExists !== undefined) {
            return constructorAbiIfExists;
        }
        else {
            const defaultConstructorAbi = {
                type: AbiType.Constructor,
                stateMutability: 'nonpayable',
                payable: false,
                inputs: [],
            };
            return defaultConstructorAbi;
        }
    }
    static _throwIfCallResultIsRevertError(rawCallResult) {
        let revert;
        try {
            revert = decodeBytesAsRevertError(rawCallResult);
        }
        catch (err) {
            return;
        }
        throw revert;
    }
    static _throwIfThrownErrorIsRevertError(error) {
        let revertError;
        try {
            revertError = decodeThrownErrorAsRevertError(error);
        }
        catch (err) {
            return;
        }
        if (revertError instanceof StringRevertError) {
            throw new Error(revertError.values.message);
        }
        throw revertError;
    }
    static _throwIfUnexpectedEmptyCallResult(rawCallResult, methodAbi) {
        if (!rawCallResult || rawCallResult === '0x') {
            const returnValueDataItem = methodAbi.getReturnValueDataItem();
            if (returnValueDataItem.components === undefined || returnValueDataItem.components.length === 0) {
                return;
            }
            throw new Error(`Function "${methodAbi.getSignature()}" reverted with no data`);
        }
    }
    static strictArgumentEncodingCheck(inputAbi, args) {
        const abiEncoder = AbiEncoder.create(inputAbi);
        const params = abiUtils.parseEthersParams(inputAbi);
        const rawEncoded = abiEncoder.encode(args);
        const rawDecoded = abiEncoder.decodeAsArray(rawEncoded);
        for (let i = 0; i < rawDecoded.length; i++) {
            const original = args[i];
            const decoded = rawDecoded[i];
            if (!abiUtils.isAbiDataEqual(params.names[i], params.types[i], original, decoded)) {
                throw new Error(`Cannot safely encode argument: ${params.names[i]} (${original}) of type ${params.types[i]}. (Possible type overflow or other encoding error)`);
            }
        }
        return rawEncoded;
    }
    static async _applyDefaultsToContractTxDataAsync(txData, estimateGasAsync) {
        const txDataWithDefaults = BaseContract._removeUndefinedProperties(txData);
        if (txDataWithDefaults.gas === undefined && estimateGasAsync !== undefined) {
            txDataWithDefaults.gas = await estimateGasAsync(txDataWithDefaults);
        }
        if (txDataWithDefaults.from !== undefined) {
            txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
        }
        return txDataWithDefaults;
    }
    static _assertCallParams(callData, defaultBlock) {
        assert.doesConformToSchema('callData', callData, schemas.callDataSchema);
        if (defaultBlock !== undefined) {
            assert.isBlockParam('defaultBlock', defaultBlock);
        }
    }
    static _removeUndefinedProperties(props) {
        const clonedProps = { ...props };
        Object.keys(clonedProps).forEach(key => clonedProps[key] === undefined && delete clonedProps[key]);
        return clonedProps;
    }
    _promiseWithTransactionHash(txHashPromise, opts) {
        return new PromiseWithTransactionHash(txHashPromise, (async () => {
            return this._web3Wrapper.awaitTransactionSuccessAsync(await txHashPromise, opts.pollingIntervalMs, opts.timeoutMs);
        })());
    }
    async _applyDefaultsToTxDataAsync(txData, estimateGasAsync) {
        const txDataWithDefaults = {
            to: this.address,
            ...this._web3Wrapper.getContractDefaults(),
            ...BaseContract._removeUndefinedProperties(txData),
        };
        if (txDataWithDefaults.gas === undefined && estimateGasAsync !== undefined) {
            txDataWithDefaults.gas = await estimateGasAsync(txDataWithDefaults);
        }
        if (txDataWithDefaults.from !== undefined) {
            txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
        }
        return txDataWithDefaults;
    }
    async _evmExecAsync(encodedData) {
        const encodedDataBytes = Buffer.from(encodedData.substr(2), 'hex');
        const addressBuf = Buffer.from(this.address.substr(2), 'hex');
        if (this._evmIfExists === undefined) {
            const vm = new VM({});
            const psm = new PStateManager(vm.stateManager);
            const accountPk = Buffer.from(ARBITRARY_PRIVATE_KEY, 'hex');
            const accountAddress = util.privateToAddress(accountPk);
            const account = new Account({ balance: 1e18 });
            await psm.putAccount(accountAddress, account);
            if (this._deployedBytecodeIfExists === undefined) {
                const contractCode = await this._web3Wrapper.getContractCodeAsync(this.address);
                this._deployedBytecodeIfExists = Buffer.from(contractCode.substr(2), 'hex');
            }
            await psm.putContractCode(addressBuf, this._deployedBytecodeIfExists);
            this._evmIfExists = vm;
            this._evmAccountIfExists = accountAddress;
        }
        let rawCallResult;
        try {
            const result = await this._evmIfExists.runCall({
                to: addressBuf,
                caller: this._evmAccountIfExists,
                origin: this._evmAccountIfExists,
                data: encodedDataBytes,
            });
            rawCallResult = `0x${result.execResult.returnValue.toString('hex')}`;
        }
        catch (err) {
            BaseContract._throwIfThrownErrorIsRevertError(err);
            throw err;
        }
        BaseContract._throwIfCallResultIsRevertError(rawCallResult);
        return rawCallResult;
    }
    async _performCallAsync(callData, defaultBlock) {
        const callDataWithDefaults = await this._applyDefaultsToTxDataAsync(callData);
        let rawCallResult;
        try {
            rawCallResult = await this._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
        }
        catch (err) {
            BaseContract._throwIfThrownErrorIsRevertError(err);
            throw err;
        }
        BaseContract._throwIfCallResultIsRevertError(rawCallResult);
        return rawCallResult;
    }
    _lookupAbiEncoder(functionSignature) {
        const abiEncoder = this._abiEncoderByFunctionSignature[functionSignature];
        if (abiEncoder === undefined) {
            throw new Error(`Failed to lookup method with function signature '${functionSignature}'`);
        }
        return abiEncoder;
    }
    _lookupAbi(functionSignature) {
        const methodAbi = this.abi.find((abiDefinition) => {
            if (abiDefinition.type !== AbiType.Function) {
                return false;
            }
            const abiFunctionSignature = new AbiEncoder.Method(abiDefinition).getSignature();
            if (abiFunctionSignature === functionSignature) {
                return true;
            }
            return false;
        });
        return methodAbi;
    }
    _strictEncodeArguments(functionSignature, functionArguments) {
        if (this._encoderOverrides.encodeInput) {
            return this._encoderOverrides.encodeInput(functionSignature.split('(')[0], functionArguments);
        }
        const abiEncoder = this._lookupAbiEncoder(functionSignature);
        const inputAbi = abiEncoder.getDataItem().components;
        if (inputAbi === undefined) {
            throw new Error(`Undefined Method Input ABI`);
        }
        const abiEncodedArguments = abiEncoder.encode(functionArguments);
        return abiEncodedArguments;
    }
}
