import {
    BatchRequest,
    Extension,
    Log,
    PromiEvent,
    provider,
    Providers,
    RLPEncodedTransaction,
    Transaction,
    TransactionConfig,
    TransactionReceipt,
    Common,
    hardfork,
    chain,
    BlockNumber,
    LogsOptions,
    PastLogsOptions
} from 'web3-core';
import * as net from 'net';
import {Bzz} from 'web3-bzz';
import {Eth} from 'web3-eth';
import {Personal} from 'web3-eth-personal';
import {Network} from 'web3-net';
import {Shh} from 'web3-shh';
import {Utils, AbiItem} from 'web3-utils';

import {EventEmitter} from "eventemitter3"
import Web3 from "web3";

export class BaseContract extends EventEmitter {

    // @ts-ignore
    protected _contract: Eth.Contract;
    protected __debug: boolean = false;
    public constructorArgs: any[] = [];
    public _deployedBytecodeIfExists?: Buffer;
    public _address: string = "";
    public _provider: provider;
    protected _errorHandler: any = false;
    protected _broadcastHandler: any = false;
    protected _confirmHandler: any = false;
    protected _receiptListSuccess: any[] = [];
    protected _receiptListFailure: any[] = [];

    public gas: number = 1000000
    public gasPrice: number | string = 20000000000


    public setDebug(bool: boolean): void {
        this.__debug = bool
    }

    public setResource(gas: number, gas_price: number): void {
        this.gas = gas
        this.gasPrice = gas_price
    }

    public setHandlers(confirm, broadcast, err): void {
        this._errorHandler = err
        this._broadcastHandler = broadcast
        this._confirmHandler = confirm
    }

    protected onError(receipt: any, err: any): void {
        if (!this._errorHandler) return;
        this._receiptListFailure.push(receipt)
        this._errorHandler(err)
    }

    protected onBroadcast(hash: string): void {
        if (!this._broadcastHandler) return;
        this._broadcastHandler(hash)
    }

    protected onConfirmation(receipt: any): void {
        if (!this._confirmHandler) return;
        // this._receiptListSuccess.push(receipt)
        this._confirmHandler(receipt)
    }

    protected pushReceiptSuccess(r): void {
        this._receiptListSuccess.push(r)
    }

    public getReceiptsSuccess(): Array<any> {
        return this._receiptListSuccess
    }

    public getReceiptsFailure(): Array<any> {
        return this._receiptListFailure
    }

    constructor(
        contractName: string,
        abi: AbiItem[],
        address: string,
        supportedProvider: provider,
        webww3: Web3
    ) {
        super();
        // @ts-ignore
        this._address = address
        this._provider = supportedProvider
        this._contract = new webww3.eth.Contract(abi, address);
    }
}
