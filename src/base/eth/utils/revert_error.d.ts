/// <reference types="node" />
import { ObjectMap } from '../0xtypes';
import { DataItem, RevertErrorAbi } from '../types';
import { BigNumber } from './configured_bignumber';
declare type ArgTypes = string | BigNumber | number | boolean | RevertError | BigNumber[] | string[] | number[] | boolean[] | Array<BigNumber | number | string>;
declare type ValueMap = ObjectMap<ArgTypes | undefined>;
interface RevertErrorType {
    new (): RevertError;
}
export declare function registerRevertErrorType(revertClass: RevertErrorType, force?: boolean): void;
export declare function decodeBytesAsRevertError(bytes: string | Buffer, coerce?: boolean): RevertError;
export declare function decodeThrownErrorAsRevertError(error: Error, coerce?: boolean): RevertError;
export declare function coerceThrownErrorAsRevertError(error: Error): RevertError;
export declare abstract class RevertError extends Error {
    private static readonly _typeRegistry;
    readonly abi?: RevertErrorAbi;
    readonly values: ValueMap;
    protected readonly _raw?: string;
    static decode(bytes: string | Buffer | RevertError, coerce?: boolean): RevertError;
    static registerType(revertClass: RevertErrorType, force?: boolean): void;
    protected constructor(name: string, declaration?: string, values?: ValueMap, raw?: string);
    get name(): string;
    get typeName(): string;
    get selector(): string;
    get signature(): string;
    get arguments(): DataItem[];
    get [Symbol.toStringTag](): string;
    equals(other: RevertError | Buffer | string): boolean;
    encode(): string;
    toString(): string;
    private _getArgumentByName;
    private get _isAnyType();
    private get _isRawType();
    private get _hasAllArgumentValues();
}
interface GanacheTransactionRevertResult {
    error: 'revert';
    program_counter: number;
    return?: string;
    reason?: string;
}
interface GanacheTransactionRevertError extends Error {
    results: {
        [hash: string]: GanacheTransactionRevertResult;
    };
    hashes: string[];
}
interface ParityTransactionRevertError extends Error {
    code: number;
    data: string;
    message: string;
}
export declare function getThrownErrorRevertErrorBytes(error: Error | GanacheTransactionRevertError | ParityTransactionRevertError): string;
export declare class StringRevertError extends RevertError {
    constructor(message?: string);
}
export declare class AnyRevertError extends RevertError {
    constructor();
}
export declare class RawRevertError extends RevertError {
    constructor(encoded: string | Buffer);
}
export {};
//# sourceMappingURL=revert_error.d.ts.map