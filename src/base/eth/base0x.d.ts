/// <reference types="node" />
import { Web3Wrapper } from './0xw3w';
import { EventEmitter } from "eventemitter3";
import { AbiEncoder } from './utils';
import { ContractAbi, AwaitTransactionSuccessOpts, ContractArtifact, BlockParam, CallData, ConstructorAbi, DataItem, MethodAbi, SupportedProvider, TransactionReceiptWithDecodedLogs, TxData, TxDataPayable } from "./types";
import { Contract } from 'web3-eth-contract';
export { SubscriptionManager } from './subscription_manager';
export interface AbiEncoderByFunctionSignature {
    [key: string]: AbiEncoder.Method;
}
export declare function methodAbiToFunctionSignature(methodAbi: MethodAbi): string;
export declare function linkLibrariesInBytecode(artifact: ContractArtifact, libraryAddresses: {
    [libraryName: string]: string;
}): string;
export declare class PromiseWithTransactionHash<T> implements Promise<T> {
    readonly txHashPromise: Promise<string>;
    private readonly _promise;
    constructor(txHashPromise: Promise<string>, promise: Promise<T>);
    then<TResult>(onFulfilled?: (v: T) => TResult | Promise<TResult>, onRejected?: (reason: any) => Promise<never>): Promise<TResult>;
    catch<TResult>(onRejected?: (reason: any) => Promise<TResult>): Promise<TResult | T>;
    finally(onFinally?: (() => void) | null): Promise<T>;
    get [Symbol.toStringTag](): string;
}
export interface EncoderOverrides {
    encodeInput: (functionName: string, values: any) => string;
    decodeOutput: (functionName: string, data: string) => any;
}
export declare class BaseContract extends EventEmitter {
    protected _abiEncoderByFunctionSignature: AbiEncoderByFunctionSignature;
    protected _web3Wrapper: Web3Wrapper;
    protected _encoderOverrides: Partial<EncoderOverrides>;
    protected _contract: Contract;
    protected __debug: boolean;
    private _evmIfExists?;
    private _evmAccountIfExists?;
    abi: ContractAbi;
    address: string;
    contractName: string;
    constructorArgs: any[];
    _deployedBytecodeIfExists?: Buffer;
    protected decodeValues(params: any): Array<any>;
    setDebug(bool: boolean): void;
    protected static _formatABIDataItemList(abis: DataItem[], values: any[], formatter: (type: string, value: any) => any): any;
    protected static _lowercaseAddress(type: string, value: string): string;
    protected static _bigNumberToString(_type: string, value: any): any;
    protected static _lookupConstructorAbi(abi: ContractAbi): ConstructorAbi;
    protected static _throwIfCallResultIsRevertError(rawCallResult: string): void;
    protected static _throwIfThrownErrorIsRevertError(error: Error): void;
    protected static _throwIfUnexpectedEmptyCallResult(rawCallResult: string, methodAbi: AbiEncoder.Method): void;
    static strictArgumentEncodingCheck(inputAbi: DataItem[], args: any[]): string;
    protected static _applyDefaultsToContractTxDataAsync<T extends Partial<TxData | TxDataPayable>>(txData: T, estimateGasAsync?: (txData: T) => Promise<number>): Promise<TxData>;
    protected static _assertCallParams(callData: Partial<CallData>, defaultBlock?: BlockParam): void;
    private static _removeUndefinedProperties;
    protected _promiseWithTransactionHash(txHashPromise: Promise<string>, opts: AwaitTransactionSuccessOpts): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>;
    protected _applyDefaultsToTxDataAsync<T extends Partial<TxData | TxDataPayable>>(txData: T, estimateGasAsync?: (txData: T) => Promise<number>): Promise<TxData>;
    protected _evmExecAsync(encodedData: string): Promise<string>;
    protected _performCallAsync(callData: Partial<CallData>, defaultBlock?: BlockParam): Promise<string>;
    protected _lookupAbiEncoder(functionSignature: string): AbiEncoder.Method;
    protected _lookupAbi(functionSignature: string): MethodAbi;
    protected _strictEncodeArguments(functionSignature: string, functionArguments: any): string;
    constructor(contractName: string, abi: ContractAbi, address: string, supportedProvider: SupportedProvider, callAndTxnDefaults?: Partial<CallData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string, encoderOverrides?: Partial<EncoderOverrides>);
}
//# sourceMappingURL=base0x.d.ts.map