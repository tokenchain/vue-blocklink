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
import {Contract} from 'web3-eth-contract';
import {Utils, AbiItem} from 'web3-utils';

import {EventEmitter} from "eventemitter3"
import Web3 from "web3";
import BlockWrap from "../../abi/BlockWrap";

export class BaseContract extends EventEmitter {

    // @ts-ignore
    protected _contract: Contract;
    protected __debug: boolean = false;
    public constructorArgs: any[] = [];
    public _deployedBytecodeIfExists?: Buffer;
    public _address: string = "";
    public _provider: provider;
    public _ww3: Web3;
    public _blockwrap: BlockWrap;
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

    public setBlockLink(bw: BlockWrap): void {
        if (!bw) return;
        this._blockwrap = bw
        this.setHandlers(this._blockwrap.confirmHandler, this._blockwrap.boardcastHandler, this._blockwrap.errorHandler)
    }

    public setResource(gas: number, gas_price: number): void {
        this.gas = gas
        this.gasPrice = gas_price
    }

    public setHandlers(confirm, broadcast, err): void {
        if (err) {
            this._errorHandler = err
        }

        if (broadcast) {
            this._broadcastHandler = broadcast
        }

        if (confirm) {
            this._confirmHandler = confirm
        }

    }

    protected onError(receipt: any, err: any): void {
        if (!this._errorHandler || !receipt) return;
        //console.log("error 1", receipt, err)
        this._receiptListFailure.push(receipt)
        this._errorHandler(err)
    }

    protected catchErro(err): void {
        if (!this._errorHandler) return;
        //console.log("error 2")
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
        this._ww3 = webww3
    }
}
