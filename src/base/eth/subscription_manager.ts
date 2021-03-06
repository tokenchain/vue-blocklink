import {AbiDecoder, intervalUtils, logUtils} from './utils';
import {AbiDefinition, marshaller, SupportedProvider, Web3Wrapper} from './0xw3w';
import {
    BlockParamLiteral,
    BlockRange,
    ContractAbi,
    FilterObject,
    LogEntry,
    LogWithDecodedArgs,
    RawLog,
    RawLogEntry,
} from './types';
// @ts-ignore
import {Block, BlockAndLogStreamer, Log} from 'ethereumjs-blockstream';

import {Utils, AbiItem} from 'web3-utils';

import {EventCallback, IndexedFilterValues} from './0xtypes';
import {
    provider
} from 'web3-core';
import {SubscriptionErrors} from './types';
// @ts-ignore
import {filterUtils} from './utils/filter_utils';

const DEFAULT_BLOCK_POLLING_INTERVAL = 1000;

export class SubscriptionManager<ContractEventArgs, ContractEvents extends string> {
    public abi: AbiItem[];
    private _blockAndLogStreamerIfExists: BlockAndLogStreamer<Block, Log> | undefined;
    private _blockAndLogStreamIntervalIfExists?: NodeJS.Timer;
    private readonly _web3Wrapper: Web3Wrapper;
    private readonly _filters: { [filterToken: string]: FilterObject };
    private readonly _filterCallbacks: {
        [filterToken: string]: EventCallback<ContractEventArgs>;
    };
    private _onLogAddedSubscriptionToken: string | undefined;
    private _onLogRemovedSubscriptionToken: string | undefined;

    private static _onBlockAndLogStreamerError(isVerbose: boolean, err: Error): void {
        // Since Blockstream errors are all recoverable, we simply log them if the verbose
        // config is passed in.
        if (isVerbose) {
            logUtils.warn(err);
        }
    }

    constructor(abi: AbiItem[], prov: provider) {
        this.abi = abi;
        this._web3Wrapper = new Web3Wrapper(prov as SupportedProvider);
        // this._web3Wrapper = web3Wrapper;
        this._filters = {};
        this._filterCallbacks = {};
        this._blockAndLogStreamerIfExists = undefined;
        this._onLogAddedSubscriptionToken = undefined;
        this._onLogRemovedSubscriptionToken = undefined;
    }

    public unsubscribeAll(): void {
        const filterTokens = Object.keys(this._filterCallbacks);
        filterTokens.forEach(filterToken => this.unsubscribe(filterToken));
    }

    public unsubscribe(filterToken: string, err?: Error): void {
        if (this._filters[filterToken] === undefined) {
            throw new Error(SubscriptionErrors.SubscriptionNotFound);
        }
        if (err !== undefined) {
            const callback = this._filterCallbacks[filterToken];
            callback(err, undefined);
        }
        delete this._filters[filterToken];
        delete this._filterCallbacks[filterToken];
        if (Object.keys(this._filters).length === 0) {
            this._stopBlockAndLogStream();
        }
    }

    public subscribe<ArgsType extends ContractEventArgs>(
        address: string,
        eventName: ContractEvents,
        indexFilterValues: IndexedFilterValues,
        abi: AbiItem[],
        callback: EventCallback<ArgsType>,
        isVerbose: boolean = false,
        blockPollingIntervalMs?: number,
    ): string {
        const filter = filterUtils.getFilter(address, eventName, indexFilterValues, abi);
        if (this._blockAndLogStreamerIfExists === undefined) {
            this._startBlockAndLogStream(isVerbose, blockPollingIntervalMs);
        }
        const filterToken = filterUtils.generateUUID();
        this._filters[filterToken] = filter;
        this._filterCallbacks[filterToken] = callback as EventCallback<ContractEventArgs>; // tslint:disable-line:no-unnecessary-type-assertion
        return filterToken;
    }

    public async getLogsAsync<ArgsType extends ContractEventArgs>(
        address: string,
        eventName: ContractEvents,
        blockRange: BlockRange,
        indexFilterValues: IndexedFilterValues,
        abi: AbiItem[],
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> {
        const filter = filterUtils.getFilter(address, eventName, indexFilterValues, abi, blockRange);
        const logs = await this._web3Wrapper.getLogsAsync(filter);
        const logsWithDecodedArguments = logs.map(this._tryToDecodeLogOrNoop.bind(this)) as any[];
        return logsWithDecodedArguments;
    }

    protected _tryToDecodeLogOrNoop<ArgsType extends ContractEventArgs>(
        log: LogEntry,
    ): LogWithDecodedArgs<ArgsType> | RawLog {
        const abiDecoder = new AbiDecoder([this.abi] as AbiDefinition[][]);
        const logWithDecodedArgs = abiDecoder.tryToDecodeLogOrNoop(log);
        return logWithDecodedArgs;
    }

    private _onLogStateChanged<ArgsType extends ContractEventArgs>(
        isRemoved: boolean,
        blockHash: string,
        rawLogs: Log[], // actually expected to be RawLogEntry, but the Blockstream's interface demands Log
    ): void {
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const logs: LogEntry[] = (rawLogs as RawLogEntry[]).map(rawLog => marshaller.unmarshalLog(rawLog));
        logs.forEach(log => {
            Object.entries(this._filters).forEach(([filterToken, filter]) => {
                if (filterUtils.matchesFilter(log, filter)) {
                    const decodedLog = this._tryToDecodeLogOrNoop(log) as LogWithDecodedArgs<ArgsType>;
                    const logEvent = {
                        log: decodedLog,
                        isRemoved,
                    };
                    this._filterCallbacks[filterToken](null, logEvent);
                }
            });
        });
    }

    private _startBlockAndLogStream(isVerbose: boolean, blockPollingIntervalMs?: number): void {
        if (this._blockAndLogStreamerIfExists !== undefined) {
            throw new Error(SubscriptionErrors.SubscriptionAlreadyPresent);
        }
        this._blockAndLogStreamerIfExists = new BlockAndLogStreamer(
            this._blockstreamGetBlockOrNullAsync.bind(this),
            this._blockstreamGetLogsAsync.bind(this),
            SubscriptionManager._onBlockAndLogStreamerError.bind(this, isVerbose),
        );
        const catchAllLogFilter = {};
        this._blockAndLogStreamerIfExists.addLogFilter(catchAllLogFilter);
        const _blockPollingIntervalMs =
            blockPollingIntervalMs === undefined ? DEFAULT_BLOCK_POLLING_INTERVAL : blockPollingIntervalMs;
        this._blockAndLogStreamIntervalIfExists = intervalUtils.setAsyncExcludingInterval(
            this._reconcileBlockAsync.bind(this),
            _blockPollingIntervalMs,
            SubscriptionManager._onBlockAndLogStreamerError.bind(this, isVerbose),
        );
        let isRemoved = false;
        this._onLogAddedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogsAdded(
            this._onLogStateChanged.bind(this, isRemoved),
        );
        isRemoved = true;
        this._onLogRemovedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogsRemoved(
            this._onLogStateChanged.bind(this, isRemoved),
        );
    }

    // This method only exists in order to comply with the expected interface of Blockstream's constructor
    private async _blockstreamGetBlockOrNullAsync(hash: string): Promise<Block | null> {
        const shouldIncludeTransactionData = false;
        const blockOrNull = await this._web3Wrapper.sendRawPayloadAsync<Block | null>({
            method: 'eth_getBlockByHash',
            params: [hash, shouldIncludeTransactionData],
        });
        return blockOrNull;
    }

    // This method only exists in order to comply with the expected interface of Blockstream's constructor
    private async _blockstreamGetLatestBlockOrNullAsync(): Promise<Block | null> {
        const shouldIncludeTransactionData = false;
        const blockOrNull = await this._web3Wrapper.sendRawPayloadAsync<Block | null>({
            method: 'eth_getBlockByNumber',
            params: [BlockParamLiteral.Latest, shouldIncludeTransactionData],
        });
        return blockOrNull;
    }

    // This method only exists in order to comply with the expected interface of Blockstream's constructor
    private async _blockstreamGetLogsAsync(filterOptions: FilterObject): Promise<Log[]> {
        const logs = await this._web3Wrapper.sendRawPayloadAsync<Log[]>({
            method: 'eth_getLogs',
            params: [filterOptions],
        });
        return logs as Log[];
    }

    private _stopBlockAndLogStream(): void {
        if (this._blockAndLogStreamerIfExists === undefined) {
            throw new Error(SubscriptionErrors.SubscriptionNotFound);
        }
        this._blockAndLogStreamerIfExists.unsubscribeFromOnLogsAdded(this._onLogAddedSubscriptionToken as string);
        this._blockAndLogStreamerIfExists.unsubscribeFromOnLogsRemoved(this._onLogRemovedSubscriptionToken as string);
        intervalUtils.clearAsyncExcludingInterval(this._blockAndLogStreamIntervalIfExists as NodeJS.Timer);
        delete this._blockAndLogStreamerIfExists;
    }

    private async _reconcileBlockAsync(): Promise<void> {
        const latestBlockOrNull = await this._blockstreamGetLatestBlockOrNullAsync();
        if (latestBlockOrNull === null) {
            return; // noop
        }
        // We need to coerce to Block type cause Web3.Block includes types for mempool blocks
        if (this._blockAndLogStreamerIfExists !== undefined) {
            // If we clear the interval while fetching the block - this._blockAndLogStreamer will be undefined
            await this._blockAndLogStreamerIfExists.reconcileNewBlock(latestBlockOrNull);
        }
    }
}
