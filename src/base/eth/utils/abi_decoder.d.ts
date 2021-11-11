import { AbiDefinition, DecodedLogArgs, LogEntry, LogWithDecodedArgs, RawLog } from '../types';
import { DecodedCalldata } from './types';
export declare class AbiDecoder {
    private readonly _eventIds;
    private readonly _selectorToFunctionInfo;
    private static _getFunctionSelector;
    constructor(abiArrays: AbiDefinition[][]);
    tryToDecodeLogOrNoop<ArgsType extends DecodedLogArgs>(log: LogEntry): LogWithDecodedArgs<ArgsType> | RawLog;
    decodeCalldataOrThrow(calldata: string, contractName?: string): DecodedCalldata;
    addABI(abiArray: AbiDefinition[], contractName?: string): void;
    private _addEventABI;
    private _addMethodABI;
}
//# sourceMappingURL=abi_decoder.d.ts.map