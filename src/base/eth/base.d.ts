/// <reference types="node" />
import { provider } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { EventEmitter } from "eventemitter3";
import Web3 from "web3";
import BlockWrap from "../../abi/BlockWrap";
export declare class BaseContract extends EventEmitter {
    protected _contract: Contract;
    protected __debug: boolean;
    constructorArgs: any[];
    _deployedBytecodeIfExists?: Buffer;
    _address: string;
    _provider: provider;
    _ww3: Web3;
    _blockwrap: BlockWrap;
    protected _errorHandler: any;
    protected _broadcastHandler: any;
    protected _confirmHandler: any;
    protected _receiptListSuccess: any[];
    protected _receiptListFailure: any[];
    gas: number;
    gasPrice: number | string;
    setDebug(bool: boolean): void;
    setBlockLink(bw: BlockWrap): void;
    setResource(gas: number, gas_price: number): void;
    setHandlers(confirm: any, broadcast: any, err: any): void;
    protected onError(receipt: any, err: any): void;
    protected catchErro(err: any): void;
    protected onBroadcast(hash: string): void;
    protected onConfirmation(receipt: any): void;
    protected pushReceiptSuccess(r: any): void;
    getReceiptsSuccess(): Array<any>;
    getReceiptsFailure(): Array<any>;
    constructor(contractName: string, abi: AbiItem[], address: string, supportedProvider: provider, webww3: Web3);
}
//# sourceMappingURL=base.d.ts.map