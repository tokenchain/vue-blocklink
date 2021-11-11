import { AbiDecoder, intervalUtils, logUtils } from './utils';
import { marshaller, Web3Wrapper } from './0xw3w';
import { BlockParamLiteral, } from './types';
import { BlockAndLogStreamer } from 'ethereumjs-blockstream';
import { SubscriptionErrors } from './types';
import { filterUtils } from './utils/filter_utils';
const DEFAULT_BLOCK_POLLING_INTERVAL = 1000;
export class SubscriptionManager {
    constructor(abi, prov) {
        this.abi = abi;
        this._web3Wrapper = new Web3Wrapper(prov);
        this._filters = {};
        this._filterCallbacks = {};
        this._blockAndLogStreamerIfExists = undefined;
        this._onLogAddedSubscriptionToken = undefined;
        this._onLogRemovedSubscriptionToken = undefined;
    }
    static _onBlockAndLogStreamerError(isVerbose, err) {
        if (isVerbose) {
            logUtils.warn(err);
        }
    }
    unsubscribeAll() {
        const filterTokens = Object.keys(this._filterCallbacks);
        filterTokens.forEach(filterToken => this.unsubscribe(filterToken));
    }
    unsubscribe(filterToken, err) {
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
    subscribe(address, eventName, indexFilterValues, abi, callback, isVerbose = false, blockPollingIntervalMs) {
        const filter = filterUtils.getFilter(address, eventName, indexFilterValues, abi);
        if (this._blockAndLogStreamerIfExists === undefined) {
            this._startBlockAndLogStream(isVerbose, blockPollingIntervalMs);
        }
        const filterToken = filterUtils.generateUUID();
        this._filters[filterToken] = filter;
        this._filterCallbacks[filterToken] = callback;
        return filterToken;
    }
    async getLogsAsync(address, eventName, blockRange, indexFilterValues, abi) {
        const filter = filterUtils.getFilter(address, eventName, indexFilterValues, abi, blockRange);
        const logs = await this._web3Wrapper.getLogsAsync(filter);
        const logsWithDecodedArguments = logs.map(this._tryToDecodeLogOrNoop.bind(this));
        return logsWithDecodedArguments;
    }
    _tryToDecodeLogOrNoop(log) {
        const abiDecoder = new AbiDecoder([this.abi]);
        const logWithDecodedArgs = abiDecoder.tryToDecodeLogOrNoop(log);
        return logWithDecodedArgs;
    }
    _onLogStateChanged(isRemoved, blockHash, rawLogs) {
        const logs = rawLogs.map(rawLog => marshaller.unmarshalLog(rawLog));
        logs.forEach(log => {
            Object.entries(this._filters).forEach(([filterToken, filter]) => {
                if (filterUtils.matchesFilter(log, filter)) {
                    const decodedLog = this._tryToDecodeLogOrNoop(log);
                    const logEvent = {
                        log: decodedLog,
                        isRemoved,
                    };
                    this._filterCallbacks[filterToken](null, logEvent);
                }
            });
        });
    }
    _startBlockAndLogStream(isVerbose, blockPollingIntervalMs) {
        if (this._blockAndLogStreamerIfExists !== undefined) {
            throw new Error(SubscriptionErrors.SubscriptionAlreadyPresent);
        }
        this._blockAndLogStreamerIfExists = new BlockAndLogStreamer(this._blockstreamGetBlockOrNullAsync.bind(this), this._blockstreamGetLogsAsync.bind(this), SubscriptionManager._onBlockAndLogStreamerError.bind(this, isVerbose));
        const catchAllLogFilter = {};
        this._blockAndLogStreamerIfExists.addLogFilter(catchAllLogFilter);
        const _blockPollingIntervalMs = blockPollingIntervalMs === undefined ? DEFAULT_BLOCK_POLLING_INTERVAL : blockPollingIntervalMs;
        this._blockAndLogStreamIntervalIfExists = intervalUtils.setAsyncExcludingInterval(this._reconcileBlockAsync.bind(this), _blockPollingIntervalMs, SubscriptionManager._onBlockAndLogStreamerError.bind(this, isVerbose));
        let isRemoved = false;
        this._onLogAddedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogsAdded(this._onLogStateChanged.bind(this, isRemoved));
        isRemoved = true;
        this._onLogRemovedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogsRemoved(this._onLogStateChanged.bind(this, isRemoved));
    }
    async _blockstreamGetBlockOrNullAsync(hash) {
        const shouldIncludeTransactionData = false;
        const blockOrNull = await this._web3Wrapper.sendRawPayloadAsync({
            method: 'eth_getBlockByHash',
            params: [hash, shouldIncludeTransactionData],
        });
        return blockOrNull;
    }
    async _blockstreamGetLatestBlockOrNullAsync() {
        const shouldIncludeTransactionData = false;
        const blockOrNull = await this._web3Wrapper.sendRawPayloadAsync({
            method: 'eth_getBlockByNumber',
            params: [BlockParamLiteral.Latest, shouldIncludeTransactionData],
        });
        return blockOrNull;
    }
    async _blockstreamGetLogsAsync(filterOptions) {
        const logs = await this._web3Wrapper.sendRawPayloadAsync({
            method: 'eth_getLogs',
            params: [filterOptions],
        });
        return logs;
    }
    _stopBlockAndLogStream() {
        if (this._blockAndLogStreamerIfExists === undefined) {
            throw new Error(SubscriptionErrors.SubscriptionNotFound);
        }
        this._blockAndLogStreamerIfExists.unsubscribeFromOnLogsAdded(this._onLogAddedSubscriptionToken);
        this._blockAndLogStreamerIfExists.unsubscribeFromOnLogsRemoved(this._onLogRemovedSubscriptionToken);
        intervalUtils.clearAsyncExcludingInterval(this._blockAndLogStreamIntervalIfExists);
        delete this._blockAndLogStreamerIfExists;
    }
    async _reconcileBlockAsync() {
        const latestBlockOrNull = await this._blockstreamGetLatestBlockOrNullAsync();
        if (latestBlockOrNull === null) {
            return;
        }
        if (this._blockAndLogStreamerIfExists !== undefined) {
            await this._blockAndLogStreamerIfExists.reconcileNewBlock(latestBlockOrNull);
        }
    }
}
//# sourceMappingURL=subscription_manager.js.map