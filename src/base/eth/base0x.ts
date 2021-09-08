// @ts-ignore
import {Web3Wrapper} from './0xw3w';
import {EventEmitter} from "eventemitter3"
import {assert} from './0xassert';
import {schemas} from './validations';
import {
    AbiEncoder,
    abiUtils,
    B,
    decodeBytesAsRevertError,
    decodeThrownErrorAsRevertError,
    providerUtils,
    RevertError,
    StringRevertError,
} from './utils';

import Account from 'ethereumjs-account';
import * as util from 'ethereumjs-util';
import VM from '@ethereumjs/vm';
// @ts-ignore
import * as _ from "lodash"
// @ts-ignore
import {DefaultStateManager} from "@ethereumjs/vm/dist/state";
import {
    ContractAbi,
    ContractEvent,
    SendTransactionOpts,
    AwaitTransactionSuccessOpts,
    ContractFunctionObj,
    ContractTxFunctionObj,
    SubscriptionErrors,
    ContractArtifact,
    AbiDefinition,
    AbiType,
    BlockParam,
    CallData,
    ConstructorAbi,
    DataItem,
    MethodAbi,
    SupportedProvider,
    TransactionReceiptWithDecodedLogs,
    TxData,
    TxDataPayable,
} from "./types";
// @ts-ignore
import {Eth} from 'web3-eth';
// @ts-ignore
export {SubscriptionManager} from './subscription_manager';

export interface AbiEncoderByFunctionSignature {
    [key: string]: AbiEncoder.Method;
}

const ARBITRARY_PRIVATE_KEY = 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109';

/**
 * Takes a MethodAbi and returns a function signature for ABI encoding/decoding
 * @return a function signature as a string, e.g. 'functionName(uint256, bytes[])'
 */
export function methodAbiToFunctionSignature(methodAbi: MethodAbi): string {
    const method = AbiEncoder.createMethod(methodAbi.name, methodAbi.inputs);
    return method.getSignature();
}

/**
 * Replaces unliked library references in the bytecode of a contract artifact
 * with real addresses and returns the bytecode.
 */
export function linkLibrariesInBytecode(
    artifact: ContractArtifact,
    libraryAddresses: { [libraryName: string]: string },
): string {
    const bytecodeArtifact = artifact.compilerOutput.evm.bytecode;
    let bytecode = bytecodeArtifact.object.substr(2);
    for (const link of Object.values(bytecodeArtifact.linkReferences)) {
        for (const [libraryName, libraryRefs] of Object.entries(link)) {
            const libraryAddress = libraryAddresses[libraryName];
            if (!libraryAddress) {
                throw new Error(
                    `${
                        artifact.contractName
                    } has an unlinked reference library ${libraryName} but no addresses was provided'.`,
                );
            }
            for (const ref of libraryRefs) {
                bytecode = [
                    bytecode.substring(0, ref.start * 2),
                    libraryAddress.toLowerCase().substr(2),
                    bytecode.substring((ref.start + ref.length) * 2),
                ].join('');
            }
        }
    }
    return `0x${bytecode}`;
}

function formatABIDataItem(type: string, components: any, value: any): any {
    const trailingArrayRegex = /\[\d*\]$/;
    if (type.match(trailingArrayRegex)) {
        const arrayItemType = type.replace(trailingArrayRegex, '');
        return _.map(value, val => (
            formatABIDataItem(arrayItemType, components, val)
        ));
    } else if (type === 'tuple') {
        const formattedTuple: { [componentName: string]: any } = {};
        _.forEach(components, componentABI => {
            formattedTuple[componentABI.name] = formatABIDataItem(
                componentABI.type,
                componentABI.components,
                value[componentABI.name],
            );
        });
        return formattedTuple;
    } else {
        return type.match(/^u?int\d*$/) ? value.toString() : value;
    }
}

// tslint:disable: max-classes-per-file
/**
 * @dev A promise-compatible type that exposes a `txHash` field.
 *      Not used by BaseContract, but generated contracts will return it in
 *      `awaitTransactionSuccessAsync()`.
 *      Maybe there's a better place for this.
 */
export class PromiseWithTransactionHash<T> implements Promise<T> {
    public readonly txHashPromise: Promise<string>;
    private readonly _promise: Promise<T>;

    constructor(txHashPromise: Promise<string>, promise: Promise<T>) {
        this.txHashPromise = txHashPromise;
        this._promise = promise;
    }

    // tslint:disable:promise-function-async
    // tslint:disable:async-suffix
    public then<TResult>(
        onFulfilled?: (v: T) => TResult | Promise<TResult>,
        onRejected?: (reason: any) => Promise<never>,
    ): Promise<TResult> {
        return this._promise.then<TResult>(onFulfilled, onRejected);
    }

    public catch<TResult>(onRejected?: (reason: any) => Promise<TResult>): Promise<TResult | T> {
        return this._promise.catch(onRejected);
    }

    public finally(onFinally?: (() => void) | null): Promise<T> {
        return this._promise.finally(onFinally);
    }

    // tslint:enable:promise-function-async
    // tslint:enable:async-suffix
    get [Symbol.toStringTag](): string {
        return this._promise[Symbol.toStringTag];
    }
}

export interface EncoderOverrides {
    encodeInput: (functionName: string, values: any) => string;
    decodeOutput: (functionName: string, data: string) => any;
}

export class BaseContract extends EventEmitter {
    protected _abiEncoderByFunctionSignature: AbiEncoderByFunctionSignature;
    protected _web3Wrapper: Web3Wrapper;
    protected _encoderOverrides: Partial<EncoderOverrides>;
    // @ts-ignore
    protected _contract: web3.eth.Contract;
    protected __debug: boolean = false;
    private _evmIfExists?: VM;
    private _evmAccountIfExists?: Buffer;

    public abi: ContractAbi;
    public address: string;
    public contractName: string;
    public constructorArgs: any[] = [];
    public _deployedBytecodeIfExists?: Buffer;

    protected decodeValues(params: any): Array<any> {
        let results = []
        // @ts-ignore
        if (w3.utils.isArray(params)) {
            const l = params.length
            for (let h = 0; h < l; h++) {
                // @ts-ignore
                if (w3.utils.isBigNumber(params[h])) {
                    // @ts-ignore
                    results.push(params[h].toString())
                } else {
                    console.log("parse outside :: ", params[h])
                }
            }
        } else {
            results = []
        }
        return results
    }

    public setDebug(bool: boolean) {
        this.__debug = bool
    }

    protected static _formatABIDataItemList(
        abis: DataItem[],
        values: any[],
        formatter: (type: string, value: any) => any,
    ): any {
        return values.map((value: any, i: number) => formatABIDataItem(abis[i].type, value, formatter));
    }

    protected static _lowercaseAddress(type: string, value: string): string {
        return type === 'address' ? value.toLowerCase() : value;
    }

    protected static _bigNumberToString(_type: string, value: any): any {
        return B.BigNumber.isBigNumber(value) ? value.toString() : value;
    }

    protected static _lookupConstructorAbi(abi: ContractAbi): ConstructorAbi {
        const constructorAbiIfExists = abi.find(
            (abiDefinition: AbiDefinition) => abiDefinition.type === AbiType.Constructor,
            // tslint:disable-next-line:no-unnecessary-type-assertion
        ) as ConstructorAbi | undefined;
        if (constructorAbiIfExists !== undefined) {
            return constructorAbiIfExists;
        } else {
            // If the constructor is not explicitly defined, it won't be included in the ABI. It is
            // still callable however, so we construct what the ABI would look like were it to exist.
            const defaultConstructorAbi: ConstructorAbi = {
                type: AbiType.Constructor,
                stateMutability: 'nonpayable',
                payable: false,
                inputs: [],
            };
            return defaultConstructorAbi;
        }
    }

    protected static _throwIfCallResultIsRevertError(rawCallResult: string): void {
        // Try to decode the call result as a revert error.
        let revert: RevertError;
        try {
            revert = decodeBytesAsRevertError(rawCallResult);
        } catch (err) {
            // Can't decode it as a revert error, so assume it didn't revert.
            return;
        }
        throw revert;
    }

    protected static _throwIfThrownErrorIsRevertError(error: Error): void {
        // Try to decode a thrown error.
        let revertError: RevertError;
        try {
            revertError = decodeThrownErrorAsRevertError(error);
        } catch (err) {
            // Can't decode it.
            return;
        }
        // Re-cast StringRevertErrors as plain Errors for backwards-compatibility.
        if (revertError instanceof StringRevertError) {
            throw new Error(revertError.values.message as string);
        }
        throw revertError;
    }

    protected static _throwIfUnexpectedEmptyCallResult(rawCallResult: string, methodAbi: AbiEncoder.Method): void {
        // With live nodes, we will receive an empty call result if:
        // 1. The function has no return value.
        // 2. The contract reverts without data.
        // 3. The contract reverts with an invalid opcode (`assert(false)` or `invalid()`).
        if (!rawCallResult || rawCallResult === '0x') {
            const returnValueDataItem = methodAbi.getReturnValueDataItem();
            if (returnValueDataItem.components === undefined || returnValueDataItem.components.length === 0) {
                // Expected no result (which makes it hard to tell if the call reverted).
                return;
            }
            throw new Error(`Function "${methodAbi.getSignature()}" reverted with no data`);
        }
    }

    // Throws if the given arguments cannot be safely/correctly encoded based on
    // the given inputAbi. An argument may not be considered safely encodeable
    // if it overflows the corresponding Solidity type, there is a bug in the
    // encoder, or the encoder performs unsafe type coercion.
    public static strictArgumentEncodingCheck(inputAbi: DataItem[], args: any[]): string {
        const abiEncoder = AbiEncoder.create(inputAbi);
        const params = abiUtils.parseEthersParams(inputAbi);
        const rawEncoded = abiEncoder.encode(args);
        const rawDecoded = abiEncoder.decodeAsArray(rawEncoded);
        for (let i = 0; i < rawDecoded.length; i++) {
            const original = args[i];
            const decoded = rawDecoded[i];
            if (!abiUtils.isAbiDataEqual(params.names[i], params.types[i], original, decoded)) {
                throw new Error(
                    `Cannot safely encode argument: ${params.names[i]} (${original}) of type ${
                        params.types[i]
                    }. (Possible type overflow or other encoding error)`,
                );
            }
        }
        return rawEncoded;
    }

    protected static async _applyDefaultsToContractTxDataAsync<T extends Partial<TxData | TxDataPayable>>(
        txData: T,
        estimateGasAsync?: (txData: T) => Promise<number>,
    ): Promise<TxData> {
        const txDataWithDefaults = BaseContract._removeUndefinedProperties<T>(txData);
        if (txDataWithDefaults.gas === undefined && estimateGasAsync !== undefined) {
            txDataWithDefaults.gas = await estimateGasAsync(txDataWithDefaults);
        }
        if (txDataWithDefaults.from !== undefined) {
            txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
        }
        return txDataWithDefaults as TxData;
    }

    protected static _assertCallParams(callData: Partial<CallData>, defaultBlock?: BlockParam): void {
        assert.doesConformToSchema('callData', callData, schemas.callDataSchema);
        if (defaultBlock !== undefined) {
            assert.isBlockParam('defaultBlock', defaultBlock);
        }
    }

    private static _removeUndefinedProperties<T>(props: any): T {
        const clonedProps = {...props};
        Object.keys(clonedProps).forEach(key => clonedProps[key] === undefined && delete clonedProps[key]);
        return clonedProps;
    }

    protected _promiseWithTransactionHash(
        txHashPromise: Promise<string>,
        opts: AwaitTransactionSuccessOpts,
    ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
            txHashPromise,
            (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                // When the transaction hash resolves, wait for it to be mined.
                return this._web3Wrapper.awaitTransactionSuccessAsync(
                    await txHashPromise,
                    opts.pollingIntervalMs,
                    opts.timeoutMs,
                );
            })(),
        );
    }

    protected async _applyDefaultsToTxDataAsync<T extends Partial<TxData | TxDataPayable>>(
        txData: T,
        estimateGasAsync?: (txData: T) => Promise<number>,
    ): Promise<TxData> {
        // Gas amount sourced with the following priorities:
        // 1. Optional param passed in to public method call
        // 2. Global config passed in at library instantiation
        // 3. Gas estimate calculation + safety margin
        // tslint:disable-next-line:no-object-literal-type-assertion
        // @ts-ignore
        const txDataWithDefaults = {
            to: this.address,
            ...this._web3Wrapper.getContractDefaults(),
            ...BaseContract._removeUndefinedProperties(txData),
        } as T;
        if (txDataWithDefaults.gas === undefined && estimateGasAsync !== undefined) {
            txDataWithDefaults.gas = await estimateGasAsync(txDataWithDefaults);
        }
        if (txDataWithDefaults.from !== undefined) {
            txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
        }
        return txDataWithDefaults as TxData;
    }

    protected async _evmExecAsync(encodedData: string): Promise<string> {
        const encodedDataBytes = Buffer.from(encodedData.substr(2), 'hex');
        const addressBuf = Buffer.from(this.address.substr(2), 'hex');
        const addressFromBuf = new util.Address(addressBuf)
        // should only run once, the first time it is called
        if (this._evmIfExists === undefined) {
            const vm = new VM({});
            // @ts-ignore
            const psm = new DefaultStateManager(vm.stateManager);
            // create an account with 1 ETH
            const accountPk = Buffer.from(ARBITRARY_PRIVATE_KEY, 'hex');
            const accountAddressStr = util.privateToAddress(accountPk);
            const accountAddress = new util.Address(accountAddressStr)
            const account = new util.Account();
            await psm.putAccount(accountAddress, account);

            // 'deploy' the contract
            if (this._deployedBytecodeIfExists === undefined) {
                const contractCode = await this._web3Wrapper.getContractCodeAsync(this.address);
                this._deployedBytecodeIfExists = Buffer.from(contractCode.substr(2), 'hex');
            }

            await psm.putContractCode(addressFromBuf, this._deployedBytecodeIfExists);

            // save for later
            this._evmIfExists = vm;
            this._evmAccountIfExists = accountAddressStr;
        }
        let rawCallResult;
        try {
            if (this._evmAccountIfExists) {
                const addressExist = new util.Address(this._evmAccountIfExists)
                const result = await this._evmIfExists.runCall({
                    to: addressFromBuf,
                    caller: addressExist,
                    origin: addressExist,
                    data: encodedDataBytes,
                });
                rawCallResult = `0x${result.execResult.returnValue.toString('hex')}`;
            }
        } catch (err) {
            BaseContract._throwIfThrownErrorIsRevertError(err);
            throw err;
        }

        BaseContract._throwIfCallResultIsRevertError(rawCallResult);
        return rawCallResult;
    }

    protected async _performCallAsync(callData: Partial<CallData>, defaultBlock?: BlockParam): Promise<string> {
        const callDataWithDefaults = await this._applyDefaultsToTxDataAsync(callData);
        let rawCallResult: string;
        try {
            rawCallResult = await this._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
        } catch (err) {
            BaseContract._throwIfThrownErrorIsRevertError(err);
            throw err;
        }
        BaseContract._throwIfCallResultIsRevertError(rawCallResult);
        return rawCallResult;
    }

    protected _lookupAbiEncoder(functionSignature: string): AbiEncoder.Method {
        const abiEncoder = this._abiEncoderByFunctionSignature[functionSignature];
        if (abiEncoder === undefined) {
            throw new Error(`Failed to lookup method with function signature '${functionSignature}'`);
        }
        return abiEncoder;
    }

    protected _lookupAbi(functionSignature: string): MethodAbi {
        const methodAbi = this.abi.find((abiDefinition: AbiDefinition) => {
            if (abiDefinition.type !== AbiType.Function) {
                return false;
            }
            // tslint:disable-next-line:no-unnecessary-type-assertion
            const abiFunctionSignature = new AbiEncoder.Method(abiDefinition as MethodAbi).getSignature();
            if (abiFunctionSignature === functionSignature) {
                return true;
            }
            return false;
        }) as MethodAbi;
        return methodAbi;
    }

    protected _strictEncodeArguments(functionSignature: string, functionArguments: any): string {
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

    /// @dev Constructs a contract wrapper.
    /// @param contractName Name of contract.
    /// @param abi of the contract.
    /// @param address of the deployed contract.
    /// @param supportedProvider for communicating with an ethereum node.
    /// @param logDecodeDependencies the name and ABI of contracts whose event logs are
    ///        decoded by this wrapper.
    /// @param deployedBytecode the deployedBytecode of the contract, used for executing
    ///        pure Solidity functions in memory. This is different from the bytecode.
    // @ts-ignore
    constructor(
        contractName: string,
        abi: ContractAbi,
        address: string,
        supportedProvider: SupportedProvider,
        callAndTxnDefaults?: Partial<CallData>,
        logDecodeDependencies?: { [contractName: string]: ContractAbi },
        deployedBytecode?: string,
        encoderOverrides?: Partial<EncoderOverrides>,
    ) {
        super();
        assert.isString('contractName', contractName);
        assert.isETHAddressHex('address', address);
        if (deployedBytecode !== undefined && deployedBytecode !== '') {
            // `deployedBytecode` might contain references to
            // unlinked libraries and, hence, would not be a hex string. We'll just
            // leave `_deployedBytecodeIfExists` empty if this is the case.
            // TODO(dorothy-zbornak): We should link the `deployedBytecode`
            // beforehand in the generated wrappers.
            try {
                assert.isHexString('deployedBytecode', deployedBytecode);
                // @ts-ignore
                this._deployedBytecodeIfExists = Buffer.from(deployedBytecode.substr(2), 'hex');
            } catch (err) {
                // Do nothing.
            }
        }
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        if (callAndTxnDefaults !== undefined) {
            assert.doesConformToSchema('callAndTxnDefaults', callAndTxnDefaults, schemas.callDataSchema);
        }// @ts-ignore
        this.contractName = contractName;// @ts-ignore
        this._web3Wrapper = new Web3Wrapper(provider, callAndTxnDefaults);// @ts-ignore

        this._encoderOverrides = encoderOverrides || {};// @ts-ignore
        this.abi = abi;// @ts-ignore
        this.address = address;// @ts-ignore
        const methodAbis = this.abi.filter(
            (abiDefinition: AbiDefinition) => abiDefinition.type === AbiType.Function,
        ) as MethodAbi[];
        // @ts-ignore
        this._abiEncoderByFunctionSignature = {};
        methodAbis.forEach(methodAbi => {
            const abiEncoder = new AbiEncoder.Method(methodAbi);
            const functionSignature = abiEncoder.getSignature();
            this._abiEncoderByFunctionSignature[functionSignature] = abiEncoder;
            this._web3Wrapper.abiDecoder.addABI(abi, contractName);
        });
        if (logDecodeDependencies) {
            Object.entries(logDecodeDependencies).forEach(([dependencyName, dependencyAbi]) =>
                this._web3Wrapper.abiDecoder.addABI(dependencyAbi, dependencyName),
            );
        }
    }
}
