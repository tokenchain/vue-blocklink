import { BlockParam, BlockWithoutTransactionData, BlockWithTransactionData, CallData, CallTxDataBase, GethCallOverrides, LogEntry, RawLogEntry, Transaction, TransactionReceipt, TxData } from '../types';
import { BlockWithoutTransactionDataRPC, BlockWithTransactionDataRPC, CallDataRPC, CallTxDataBaseRPC, GethCallOverridesRPC, TransactionReceiptRPC, TransactionRPC, TxDataRPC } from './types';
export declare const marshaller: {
    unmarshalIntoBlockWithoutTransactionData(blockWithHexValues: BlockWithoutTransactionDataRPC): BlockWithoutTransactionData;
    unmarshalIntoBlockWithTransactionData(blockWithHexValues: BlockWithTransactionDataRPC): BlockWithTransactionData;
    unmarshalTransaction(txRpc: TransactionRPC): Transaction;
    unmarshalTransactionReceipt(txReceiptRpc: TransactionReceiptRPC): TransactionReceipt;
    unmarshalTxData(txDataRpc: TxDataRPC): TxData;
    marshalTxData(txData: Partial<TxData>): Partial<TxDataRPC>;
    marshalCallData(callData: Partial<CallData>): Partial<CallDataRPC>;
    marshalCallOverrides(overrides: GethCallOverrides): GethCallOverridesRPC;
    marshalAddress(address: string): string;
    marshalBlockParam(blockParam: BlockParam | string | number | undefined): string | undefined;
    unmarshalLog(rawLog: RawLogEntry): LogEntry;
    _marshalCallTxDataBase(callTxDataBase: Partial<CallTxDataBase>): Partial<CallTxDataBaseRPC>;
};
//# sourceMappingURL=marshaller.d.ts.map