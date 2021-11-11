import { EventEmitter } from "eventemitter3";
export class BaseContract extends EventEmitter {
    constructor(contractName, abi, address, supportedProvider, webww3) {
        super();
        this.__debug = false;
        this.constructorArgs = [];
        this._address = "";
        this._errorHandler = false;
        this._broadcastHandler = false;
        this._confirmHandler = false;
        this._receiptListSuccess = [];
        this._receiptListFailure = [];
        this.gas = 1000000;
        this.gasPrice = 20000000000;
        this._address = address;
        this._provider = supportedProvider;
        this._contract = new webww3.eth.Contract(abi, address);
        this._ww3 = webww3;
    }
    setDebug(bool) {
        this.__debug = bool;
    }
    setBlockLink(bw) {
        if (!bw)
            return;
        this._blockwrap = bw;
        this.setHandlers(this._blockwrap.confirmHandler, this._blockwrap.boardcastHandler, this._blockwrap.errorHandler);
    }
    setResource(gas, gas_price) {
        this.gas = gas;
        this.gasPrice = gas_price;
    }
    setHandlers(confirm, broadcast, err) {
        if (err) {
            this._errorHandler = err;
        }
        if (broadcast) {
            this._broadcastHandler = broadcast;
        }
        if (confirm) {
            this._confirmHandler = confirm;
        }
    }
    onError(receipt, err) {
        if (!this._errorHandler || !receipt)
            return;
        this._receiptListFailure.push(receipt);
        this._errorHandler(err);
    }
    catchErro(err) {
        if (!this._errorHandler)
            return;
        this._errorHandler(err);
    }
    onBroadcast(hash) {
        if (!this._broadcastHandler)
            return;
        this._broadcastHandler(hash);
    }
    onConfirmation(receipt) {
        if (!this._confirmHandler)
            return;
        this._confirmHandler(receipt);
    }
    pushReceiptSuccess(r) {
        this._receiptListSuccess.push(r);
    }
    getReceiptsSuccess() {
        return this._receiptListSuccess;
    }
    getReceiptsFailure() {
        return this._receiptListFailure;
    }
}
//# sourceMappingURL=base.js.map