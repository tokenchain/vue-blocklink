import { assert } from '../0xassert';
import { schemas } from '../validations';
import { AbiDecoder, addressUtils, intervalUtils, promisify, providerUtils } from '../utils';
import { B } from '../utils/configured_bignumber';
import { BlockParamLiteral, } from '../types';
import * as _ from 'lodash';
import { marshaller } from './marshaller';
import { NodeType, Web3WrapperErrors, } from './types';
import { utils } from './utils';
const BASE_TEN = 10;
const uniqueVersionIds = {
    geth: 'Geth',
    ganache: 'EthereumJS TestRPC',
};
export class Web3Wrapper {
    constructor(supportedProvider, callAndTxnDefaults = {}) {
        this.isZeroExWeb3Wrapper = true;
        this.abiDecoder = new AbiDecoder([]);
        this._supportedProvider = supportedProvider;
        this._provider = providerUtils.standardizeOrThrow(supportedProvider);
        this._callAndTxnDefaults = callAndTxnDefaults;
        this._jsonRpcRequestId = 1;
    }
    static isAddress(address) {
        return addressUtils.isAddress(address);
    }
    static toUnitAmount(amount, decimals) {
        assert.isValidBaseUnitAmount('amount', amount);
        assert.isNumber('decimals', decimals);
        const aUnit = new B.BigNumber(BASE_TEN).pow(decimals);
        const unit = amount.div(aUnit);
        return unit;
    }
    static toBaseUnitAmount(amount, decimals) {
        assert.isNumber('decimals', decimals);
        const unit = new B.BigNumber(BASE_TEN).pow(decimals);
        const baseUnitAmount = unit.times(amount);
        const hasDecimals = baseUnitAmount.decimalPlaces() !== 0;
        if (hasDecimals) {
            throw new Error(`Invalid unit amount: ${amount.toString(BASE_TEN)} - Too many decimal places`);
        }
        return baseUnitAmount;
    }
    static toWei(ethAmount) {
        assert.isBigNumber('ethAmount', ethAmount);
        const ETH_DECIMALS = 18;
        const balanceWei = Web3Wrapper.toBaseUnitAmount(ethAmount, ETH_DECIMALS);
        return balanceWei;
    }
    static _assertBlockParam(blockParam) {
        if (_.isNumber(blockParam)) {
            return;
        }
        else if (_.isString(blockParam)) {
            assert.doesBelongToStringEnum('blockParam', blockParam, BlockParamLiteral);
        }
    }
    static _assertBlockParamOrString(blockParam) {
        try {
            Web3Wrapper._assertBlockParam(blockParam);
        }
        catch (err) {
            try {
                assert.isHexString('blockParam', blockParam);
                return;
            }
            catch (err) {
                throw new Error(`Expected blockParam to be of type "string | BlockParam", encountered ${blockParam}`);
            }
        }
    }
    static _normalizeTxReceiptStatus(status) {
        if (_.isString(status)) {
            return utils.convertHexToNumber(status);
        }
        else if (status === undefined) {
            return null;
        }
        else {
            return status;
        }
    }
    getContractDefaults() {
        return this._callAndTxnDefaults;
    }
    getProvider() {
        return this._supportedProvider;
    }
    setProvider(supportedProvider) {
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        this._provider = provider;
    }
    async isSenderAddressAvailableAsync(senderAddress) {
        assert.isETHAddressHex('senderAddress', senderAddress);
        const addresses = await this.getAvailableAddressesAsync();
        const normalizedAddress = senderAddress.toLowerCase();
        return _.includes(addresses, normalizedAddress);
    }
    async getNodeVersionAsync() {
        const nodeVersion = await this.sendRawPayloadAsync({ method: 'web3_clientVersion' });
        return nodeVersion;
    }
    async getNetworkIdAsync() {
        const networkIdStr = await this.sendRawPayloadAsync({ method: 'net_version' });
        const networkId = _.parseInt(networkIdStr);
        return networkId;
    }
    async getChainIdAsync() {
        const chainIdStr = await this.sendRawPayloadAsync({ method: 'eth_chainId' });
        const chainId = _.parseInt(chainIdStr);
        return chainId;
    }
    async getTransactionReceiptIfExistsAsync(txHash) {
        assert.isHexString('txHash', txHash);
        const transactionReceiptRpc = await this.sendRawPayloadAsync({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
        });
        if (transactionReceiptRpc !== null && transactionReceiptRpc.blockNumber !== null) {
            transactionReceiptRpc.status = Web3Wrapper._normalizeTxReceiptStatus(transactionReceiptRpc.status);
            const transactionReceipt = marshaller.unmarshalTransactionReceipt(transactionReceiptRpc);
            return transactionReceipt;
        }
        else {
            return undefined;
        }
    }
    async getTransactionByHashAsync(txHash) {
        assert.isHexString('txHash', txHash);
        const transactionRpc = await this.sendRawPayloadAsync({
            method: 'eth_getTransactionByHash',
            params: [txHash],
        });
        const transaction = marshaller.unmarshalTransaction(transactionRpc);
        return transaction;
    }
    async getBalanceInWeiAsync(owner, defaultBlock) {
        assert.isETHAddressHex('owner', owner);
        if (defaultBlock !== undefined) {
            Web3Wrapper._assertBlockParam(defaultBlock);
        }
        const marshalledDefaultBlock = marshaller.marshalBlockParam(defaultBlock);
        const encodedOwner = marshaller.marshalAddress(owner);
        const balanceInWei = await this.sendRawPayloadAsync({
            method: 'eth_getBalance',
            params: [encodedOwner, marshalledDefaultBlock],
        });
        return new B.BigNumber(balanceInWei);
    }
    async doesContractExistAtAddressAsync(address) {
        assert.isETHAddressHex('address', address);
        const code = await this.getContractCodeAsync(address);
        const isCodeEmpty = /^0x0{0,40}$/i.test(code);
        return !isCodeEmpty;
    }
    async getContractCodeAsync(address, defaultBlock) {
        assert.isETHAddressHex('address', address);
        if (defaultBlock !== undefined) {
            Web3Wrapper._assertBlockParam(defaultBlock);
        }
        const marshalledDefaultBlock = marshaller.marshalBlockParam(defaultBlock);
        const encodedAddress = marshaller.marshalAddress(address);
        const code = await this.sendRawPayloadAsync({
            method: 'eth_getCode',
            params: [encodedAddress, marshalledDefaultBlock],
        });
        return code;
    }
    async getTransactionTraceAsync(txHash, traceParams) {
        assert.isHexString('txHash', txHash);
        const trace = await this.sendRawPayloadAsync({
            method: 'debug_traceTransaction',
            params: [txHash, traceParams],
        });
        return trace;
    }
    async signMessageAsync(address, message) {
        assert.isETHAddressHex('address', address);
        assert.isString('message', message);
        const signData = await this.sendRawPayloadAsync({
            method: 'eth_sign',
            params: [address, message],
        });
        return signData;
    }
    async signTypedDataAsync(address, typedData) {
        assert.isETHAddressHex('address', address);
        assert.doesConformToSchema('typedData', typedData, schemas.eip712TypedDataSchema);
        const methodsToTry = ['eth_signTypedData_v4', 'eth_signTypedData_v3', 'eth_signTypedData'];
        let lastErr;
        for (const method of methodsToTry) {
            try {
                return await this.sendRawPayloadAsync({
                    method,
                    params: [address, method === 'eth_signTypedData' ? typedData : JSON.stringify(typedData)],
                });
            }
            catch (err) {
                lastErr = err;
                if (!/(not handled|does not exist|not supported)/.test(err.message)) {
                    throw err;
                }
            }
        }
        throw lastErr;
    }
    async getBlockNumberAsync() {
        const blockNumberHex = await this.sendRawPayloadAsync({
            method: 'eth_blockNumber',
            params: [],
        });
        const blockNumber = utils.convertHexToNumberOrNull(blockNumberHex);
        return blockNumber;
    }
    async getAccountNonceAsync(address, defaultBlock) {
        assert.isETHAddressHex('address', address);
        if (defaultBlock !== undefined) {
            Web3Wrapper._assertBlockParam(defaultBlock);
        }
        const marshalledDefaultBlock = marshaller.marshalBlockParam(defaultBlock);
        const encodedAddress = marshaller.marshalAddress(address);
        const nonceHex = await this.sendRawPayloadAsync({
            method: 'eth_getTransactionCount',
            params: [encodedAddress, marshalledDefaultBlock],
        });
        assert.isHexString('nonce', nonceHex);
        return parseInt(nonceHex.substr(2), 16);
    }
    async getBlockIfExistsAsync(blockParam) {
        Web3Wrapper._assertBlockParamOrString(blockParam);
        const encodedBlockParam = marshaller.marshalBlockParam(blockParam);
        const method = utils.isHexStrict(blockParam) ? 'eth_getBlockByHash' : 'eth_getBlockByNumber';
        const shouldIncludeTransactionData = false;
        const blockWithoutTransactionDataWithHexValuesOrNull = await this.sendRawPayloadAsync({
            method,
            params: [encodedBlockParam, shouldIncludeTransactionData],
        });
        let blockWithoutTransactionDataIfExists;
        if (blockWithoutTransactionDataWithHexValuesOrNull !== null) {
            blockWithoutTransactionDataIfExists = marshaller.unmarshalIntoBlockWithoutTransactionData(blockWithoutTransactionDataWithHexValuesOrNull);
        }
        return blockWithoutTransactionDataIfExists;
    }
    async getBlockWithTransactionDataAsync(blockParam) {
        Web3Wrapper._assertBlockParamOrString(blockParam);
        let encodedBlockParam = blockParam;
        if (_.isNumber(blockParam)) {
            encodedBlockParam = utils.numberToHex(blockParam);
        }
        const method = utils.isHexStrict(blockParam) ? 'eth_getBlockByHash' : 'eth_getBlockByNumber';
        const shouldIncludeTransactionData = true;
        const blockWithTransactionDataWithHexValues = await this.sendRawPayloadAsync({
            method,
            params: [encodedBlockParam, shouldIncludeTransactionData],
        });
        const blockWithoutTransactionData = marshaller.unmarshalIntoBlockWithTransactionData(blockWithTransactionDataWithHexValues);
        return blockWithoutTransactionData;
    }
    async getBlockTimestampAsync(blockParam) {
        Web3Wrapper._assertBlockParamOrString(blockParam);
        const blockIfExists = await this.getBlockIfExistsAsync(blockParam);
        if (blockIfExists === undefined) {
            throw new Error(`Failed to fetch block with blockParam: ${JSON.stringify(blockParam)}`);
        }
        return blockIfExists.timestamp;
    }
    async getAvailableAddressesAsync() {
        const addresses = await this.sendRawPayloadAsync({
            method: 'eth_accounts',
            params: [],
        });
        const normalizedAddresses = _.map(addresses, address => address.toLowerCase());
        return normalizedAddresses;
    }
    async takeSnapshotAsync() {
        const snapshotId = Number(await this.sendRawPayloadAsync({ method: 'evm_snapshot', params: [] }));
        return snapshotId;
    }
    async revertSnapshotAsync(snapshotId) {
        assert.isNumber('snapshotId', snapshotId);
        const didRevert = await this.sendRawPayloadAsync({ method: 'evm_revert', params: [snapshotId] });
        return didRevert;
    }
    async mineBlockAsync() {
        await this.sendRawPayloadAsync({ method: 'evm_mine', params: [] });
    }
    async increaseTimeAsync(timeDelta) {
        assert.isNumber('timeDelta', timeDelta);
        const version = await this.getNodeVersionAsync();
        if (_.includes(version, uniqueVersionIds.geth)) {
            return this.sendRawPayloadAsync({ method: 'debug_increaseTime', params: [timeDelta] });
        }
        else if (_.includes(version, uniqueVersionIds.ganache)) {
            return this.sendRawPayloadAsync({ method: 'evm_increaseTime', params: [timeDelta] });
        }
        else {
            throw new Error(`Unknown client version: ${version}`);
        }
    }
    async getLogsAsync(filter) {
        if (filter.blockHash !== undefined && (filter.fromBlock !== undefined || filter.toBlock !== undefined)) {
            throw new Error(`Cannot specify 'blockHash' as well as 'fromBlock'/'toBlock' in the filter supplied to 'getLogsAsync'`);
        }
        let fromBlock = filter.fromBlock;
        if (_.isNumber(fromBlock)) {
            fromBlock = utils.numberToHex(fromBlock);
        }
        let toBlock = filter.toBlock;
        if (_.isNumber(toBlock)) {
            toBlock = utils.numberToHex(toBlock);
        }
        const serializedFilter = {
            ...filter,
            fromBlock,
            toBlock,
        };
        const payload = {
            method: 'eth_getLogs',
            params: [serializedFilter],
        };
        const rawLogs = await this.sendRawPayloadAsync(payload);
        const formattedLogs = _.map(rawLogs, marshaller.unmarshalLog.bind(marshaller));
        return formattedLogs;
    }
    async estimateGasAsync(txData) {
        assert.doesConformToSchema('txData', txData, schemas.txDataSchema);
        const txDataHex = marshaller.marshalTxData(txData);
        const gasHex = await this.sendRawPayloadAsync({ method: 'eth_estimateGas', params: [txDataHex] });
        const gas = utils.convertHexToNumber(gasHex);
        return gas;
    }
    async createAccessListAsync(callData, defaultBlock) {
        assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
            schemas.addressSchema,
            schemas.numberSchema,
            schemas.jsNumber,
        ]);
        const rawResult = await this.sendRawPayloadAsync({
            method: 'eth_createAccessList',
            params: [marshaller.marshalCallData(callData), marshaller.marshalBlockParam(defaultBlock)],
        });
        if (rawResult.error) {
            throw new Error(rawResult.error);
        }
        return {
            accessList: rawResult.accessList.reduce((o, v) => {
                o[v.address] = o[v.address] || [];
                o[v.address].push(...(v.storageKeys || []));
                return o;
            }, {}),
            gasUsed: parseInt(rawResult.gasUsed.slice(2), 16),
        };
    }
    async callAsync(callData, defaultBlock) {
        assert.doesConformToSchema('callData', callData, schemas.callDataSchema);
        if (defaultBlock !== undefined) {
            Web3Wrapper._assertBlockParam(defaultBlock);
        }
        const marshalledDefaultBlock = marshaller.marshalBlockParam(defaultBlock);
        const callDataHex = marshaller.marshalCallData(callData);
        const overrides = marshaller.marshalCallOverrides(callData.overrides || {});
        const rawCallResult = await this.sendRawPayloadAsync({
            method: 'eth_call',
            params: [callDataHex, marshalledDefaultBlock, ...(Object.keys(overrides).length === 0 ? [] : [overrides])],
        });
        return rawCallResult;
    }
    async sendTransactionAsync(txData) {
        assert.doesConformToSchema('txData', txData, schemas.txDataSchema);
        const txDataHex = marshaller.marshalTxData(txData);
        const txHash = await this.sendRawPayloadAsync({ method: 'eth_sendTransaction', params: [txDataHex] });
        return txHash;
    }
    async awaitTransactionMinedAsync(txHash, pollingIntervalMs = 1000, timeoutMs) {
        assert.isHexString('txHash', txHash);
        assert.isNumber('pollingIntervalMs', pollingIntervalMs);
        if (timeoutMs !== undefined) {
            assert.isNumber('timeoutMs', timeoutMs);
        }
        let transactionReceipt = await this.getTransactionReceiptIfExistsAsync(txHash);
        if (transactionReceipt !== undefined) {
            const logsWithDecodedArgs = _.map(transactionReceipt.logs, this.abiDecoder.tryToDecodeLogOrNoop.bind(this.abiDecoder));
            const transactionReceiptWithDecodedLogArgs = {
                ...transactionReceipt,
                logs: logsWithDecodedArgs,
            };
            return transactionReceiptWithDecodedLogArgs;
        }
        let wasTimeoutExceeded = false;
        if (timeoutMs) {
            setTimeout(() => (wasTimeoutExceeded = true), timeoutMs);
        }
        const txReceiptPromise = new Promise((resolve, reject) => {
            const intervalId = intervalUtils.setAsyncExcludingInterval(async () => {
                if (wasTimeoutExceeded) {
                    intervalUtils.clearAsyncExcludingInterval(intervalId);
                    return reject(Web3WrapperErrors.TransactionMiningTimeout);
                }
                transactionReceipt = await this.getTransactionReceiptIfExistsAsync(txHash);
                if (transactionReceipt !== undefined) {
                    intervalUtils.clearAsyncExcludingInterval(intervalId);
                    const logsWithDecodedArgs = _.map(transactionReceipt.logs, this.abiDecoder.tryToDecodeLogOrNoop.bind(this.abiDecoder));
                    const transactionReceiptWithDecodedLogArgs = {
                        ...transactionReceipt,
                        logs: logsWithDecodedArgs,
                    };
                    resolve(transactionReceiptWithDecodedLogArgs);
                }
            }, pollingIntervalMs, (err) => {
                intervalUtils.clearAsyncExcludingInterval(intervalId);
                reject(err);
            });
        });
        const txReceipt = await txReceiptPromise;
        return txReceipt;
    }
    async awaitTransactionSuccessAsync(txHash, pollingIntervalMs = 1000, timeoutMs) {
        const receipt = await this.awaitTransactionMinedAsync(txHash, pollingIntervalMs, timeoutMs);
        if (receipt.status !== 1) {
            throw new Error(`Transaction failed: ${txHash}`);
        }
        return receipt;
    }
    async setHeadAsync(blockNumber) {
        assert.isNumber('blockNumber', blockNumber);
        await this.sendRawPayloadAsync({ method: 'debug_setHead', params: [utils.numberToHex(blockNumber)] });
    }
    async sendRawPayloadAsync(payload) {
        if (!payload.method) {
            throw new Error(`Must supply method in JSONRPCRequestPayload, tried: [${payload}]`);
        }
        const payloadWithDefaults = {
            id: this._jsonRpcRequestId++,
            params: [],
            jsonrpc: '2.0',
            ...payload,
        };
        const sendAsync = promisify(this._provider.sendAsync.bind(this._provider));
        const response = await sendAsync(payloadWithDefaults);
        if (!response) {
            throw new Error(`No response`);
        }
        const errorMessage = response.error ? response.error.message || response.error : undefined;
        if (errorMessage) {
            throw new Error(errorMessage);
        }
        if (response.result === undefined) {
            throw new Error(`JSON RPC response has no result`);
        }
        return response.result;
    }
    async getNodeTypeAsync() {
        const version = await this.getNodeVersionAsync();
        if (_.includes(version, uniqueVersionIds.geth)) {
            return NodeType.Geth;
        }
        else if (_.includes(version, uniqueVersionIds.ganache)) {
            return NodeType.Ganache;
        }
        else {
            throw new Error(`Unknown client version: ${version}`);
        }
    }
}
//# sourceMappingURL=web3_wrapper.js.map