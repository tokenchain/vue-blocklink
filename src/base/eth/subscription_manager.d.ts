import { BlockRange, LogEntry, LogWithDecodedArgs, RawLog } from './types';
import { AbiItem } from 'web3-utils';
import { EventCallback, IndexedFilterValues } from './0xtypes';
import { provider } from 'web3-core';
export declare class SubscriptionManager<ContractEventArgs, ContractEvents extends string> {
    abi: AbiItem[];
    private _blockAndLogStreamerIfExists;
    private _blockAndLogStreamIntervalIfExists?;
    private readonly _web3Wrapper;
    private readonly _filters;
    private readonly _filterCallbacks;
    private _onLogAddedSubscriptionToken;
    private _onLogRemovedSubscriptionToken;
    private static _onBlockAndLogStreamerError;
    constructor(abi: AbiItem[], prov: provider);
    unsubscribeAll(): void;
    unsubscribe(filterToken: string, err?: Error): void;
    subscribe<ArgsType extends ContractEventArgs>(address: string, eventName: ContractEvents, indexFilterValues: IndexedFilterValues, abi: AbiItem[], callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
    getLogsAsync<ArgsType extends ContractEventArgs>(address: string, eventName: ContractEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues, abi: AbiItem[]): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    protected _tryToDecodeLogOrNoop<ArgsType extends ContractEventArgs>(log: LogEntry): LogWithDecodedArgs<ArgsType> | RawLog;
    private _onLogStateChanged;
    private _startBlockAndLogStream;
    private _blockstreamGetBlockOrNullAsync;
    private _blockstreamGetLatestBlockOrNullAsync;
    private _blockstreamGetLogsAsync;
    private _stopBlockAndLogStream;
    private _reconcileBlockAsync;
}
//# sourceMappingURL=subscription_manager.d.ts.map