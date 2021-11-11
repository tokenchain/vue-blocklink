import { addressUtils } from '../utils';
import { BlockParamLiteral, } from '../types';
import * as _ from 'lodash';
import { utils } from './utils';
export const marshaller = {
    unmarshalIntoBlockWithoutTransactionData(blockWithHexValues) {
        const block = {
            ...blockWithHexValues,
            gasLimit: utils.convertHexToNumber(blockWithHexValues.gasLimit),
            gasUsed: utils.convertHexToNumber(blockWithHexValues.gasUsed),
            size: utils.convertHexToNumber(blockWithHexValues.size),
            timestamp: utils.convertHexToNumber(blockWithHexValues.timestamp),
            number: blockWithHexValues.number === null ? null : utils.convertHexToNumber(blockWithHexValues.number),
            difficulty: utils.convertAmountToBigNumber(blockWithHexValues.difficulty),
            totalDifficulty: utils.convertAmountToBigNumber(blockWithHexValues.totalDifficulty),
        };
        return block;
    },
    unmarshalIntoBlockWithTransactionData(blockWithHexValues) {
        const block = {
            ...blockWithHexValues,
            gasLimit: utils.convertHexToNumber(blockWithHexValues.gasLimit),
            gasUsed: utils.convertHexToNumber(blockWithHexValues.gasUsed),
            size: utils.convertHexToNumber(blockWithHexValues.size),
            timestamp: utils.convertHexToNumber(blockWithHexValues.timestamp),
            number: blockWithHexValues.number === null ? null : utils.convertHexToNumber(blockWithHexValues.number),
            difficulty: utils.convertAmountToBigNumber(blockWithHexValues.difficulty),
            totalDifficulty: utils.convertAmountToBigNumber(blockWithHexValues.totalDifficulty),
            transactions: [],
        };
        block.transactions = _.map(blockWithHexValues.transactions, (tx) => {
            const transaction = marshaller.unmarshalTransaction(tx);
            return transaction;
        });
        return block;
    },
    unmarshalTransaction(txRpc) {
        const tx = {
            ...txRpc,
            blockNumber: txRpc.blockNumber !== null ? utils.convertHexToNumber(txRpc.blockNumber) : null,
            transactionIndex: txRpc.transactionIndex !== null ? utils.convertHexToNumber(txRpc.transactionIndex) : null,
            nonce: utils.convertHexToNumber(txRpc.nonce),
            gas: utils.convertHexToNumber(txRpc.gas),
            gasPrice: utils.convertAmountToBigNumber(txRpc.gasPrice),
            value: utils.convertAmountToBigNumber(txRpc.value),
        };
        return tx;
    },
    unmarshalTransactionReceipt(txReceiptRpc) {
        const txReceipt = {
            ...txReceiptRpc,
            blockNumber: utils.convertHexToNumber(txReceiptRpc.blockNumber),
            transactionIndex: utils.convertHexToNumber(txReceiptRpc.transactionIndex),
            cumulativeGasUsed: utils.convertHexToNumber(txReceiptRpc.cumulativeGasUsed),
            gasUsed: utils.convertHexToNumber(txReceiptRpc.gasUsed),
            logs: _.map(txReceiptRpc.logs, marshaller.unmarshalLog.bind(marshaller)),
        };
        return txReceipt;
    },
    unmarshalTxData(txDataRpc) {
        if (txDataRpc.from === undefined) {
            throw new Error(`txData must include valid 'from' value.`);
        }
        const txData = {
            to: txDataRpc.to,
            from: txDataRpc.from,
            data: txDataRpc.data,
            value: txDataRpc.value !== undefined ? utils.convertAmountToBigNumber(txDataRpc.value) : undefined,
            gas: txDataRpc.gas !== undefined ? utils.convertHexToNumber(txDataRpc.gas) : undefined,
            gasPrice: txDataRpc.gasPrice !== undefined ? utils.convertAmountToBigNumber(txDataRpc.gasPrice) : undefined,
            nonce: txDataRpc.nonce !== undefined ? utils.convertHexToNumber(txDataRpc.nonce) : undefined,
        };
        return txData;
    },
    marshalTxData(txData) {
        if (txData.from === undefined) {
            throw new Error(`txData must include valid 'from' value.`);
        }
        const callTxDataBase = {
            ...txData,
        };
        delete callTxDataBase.from;
        const callTxDataBaseRPC = marshaller._marshalCallTxDataBase(callTxDataBase);
        const txDataRPC = {
            ...callTxDataBaseRPC,
            from: marshaller.marshalAddress(txData.from),
        };
        const prunableIfUndefined = ['gasPrice', 'gas', 'value', 'nonce'];
        _.each(txDataRPC, (value, key) => {
            if (value === undefined && _.includes(prunableIfUndefined, key)) {
                delete txDataRPC[key];
            }
        });
        return txDataRPC;
    },
    marshalCallData(callData) {
        const callTxDataBase = {
            ...callData,
        };
        delete callTxDataBase.from;
        delete callTxDataBase.overrides;
        const callTxDataBaseRPC = marshaller._marshalCallTxDataBase(callTxDataBase);
        const callDataRPC = {
            ...callTxDataBaseRPC,
            from: callData.from === undefined ? undefined : marshaller.marshalAddress(callData.from),
        };
        return callDataRPC;
    },
    marshalCallOverrides(overrides) {
        const marshalled = {};
        for (const address in overrides) {
            if (address) {
                const override = overrides[address];
                const marshalledAddress = marshaller.marshalAddress(address);
                const marshalledOverride = (marshalled[marshalledAddress] = {});
                if (override.code !== undefined) {
                    marshalledOverride.code = override.code;
                }
                if (override.nonce !== undefined) {
                    marshalledOverride.nonce = utils.encodeAmountAsHexString(override.nonce);
                }
                if (override.balance !== undefined) {
                    marshalledOverride.balance = utils.encodeAmountAsHexString(override.balance);
                }
                if (Object.keys(marshalledOverride).length === 0) {
                    delete marshalled[marshalledAddress];
                }
            }
        }
        return marshalled;
    },
    marshalAddress(address) {
        if (addressUtils.isAddress(address)) {
            return ethUtil.addHexPrefix(address);
        }
        throw new Error(`Invalid address encountered: ${address}`);
    },
    marshalBlockParam(blockParam) {
        if (blockParam === undefined) {
            return BlockParamLiteral.Latest;
        }
        const encodedBlockParam = _.isNumber(blockParam) ? utils.numberToHex(blockParam) : blockParam;
        return encodedBlockParam;
    },
    unmarshalLog(rawLog) {
        const formattedLog = {
            ...rawLog,
            logIndex: utils.convertHexToNumberOrNull(rawLog.logIndex),
            blockNumber: utils.convertHexToNumberOrNull(rawLog.blockNumber),
            transactionIndex: utils.convertHexToNumberOrNull(rawLog.transactionIndex),
        };
        return formattedLog;
    },
    _marshalCallTxDataBase(callTxDataBase) {
        let accessList;
        if (callTxDataBase.accessList && Object.keys(callTxDataBase.accessList).length) {
            accessList = Object.entries(callTxDataBase.accessList).map(([address, storageKeys]) => ({
                address,
                storageKeys,
            }));
        }
        const callTxDataBaseRPC = {
            data: callTxDataBase.data,
            to: callTxDataBase.to === undefined ? undefined : marshaller.marshalAddress(callTxDataBase.to),
            gasPrice: callTxDataBase.gasPrice === undefined
                ? undefined
                : utils.encodeAmountAsHexString(callTxDataBase.gasPrice),
            gas: callTxDataBase.gas === undefined ? undefined : utils.encodeAmountAsHexString(callTxDataBase.gas),
            value: callTxDataBase.value === undefined ? undefined : utils.encodeAmountAsHexString(callTxDataBase.value),
            nonce: callTxDataBase.nonce === undefined ? undefined : utils.encodeAmountAsHexString(callTxDataBase.nonce),
            ...(accessList ? { type: 0x1, accessList } : {}),
        };
        return callTxDataBaseRPC;
    },
};
