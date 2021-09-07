import { assert } from "../base/eth/0xassert";
import { BaseContract } from "../base/eth/base";
import { SubscriptionManager } from "../base/eth/subscription_manager";
import { schemas } from "../base/eth/validations";
export var Ori20Events;
(function (Ori20Events) {
    Ori20Events["Approval"] = "Approval";
    Ori20Events["MinterAdded"] = "MinterAdded";
    Ori20Events["MinterRemoved"] = "MinterRemoved";
    Ori20Events["Transfer"] = "Transfer";
})(Ori20Events || (Ori20Events = {}));
export class Ori20Contract extends BaseContract {
    constructor(address, supportedProvider, ww3) {
        super('Ori20', Ori20Contract.ABI(), address, supportedProvider, ww3);
        this._methodABIIndex = {};
        this._subscriptionManager = new SubscriptionManager(Ori20Contract.ABI(), supportedProvider);
        Ori20Contract.ABI().forEach((item, index) => {
            if (item.type === 'function') {
                const methodAbi = item;
                this._methodABIIndex[methodAbi.name] = index;
            }
        });
    }
    static Instance() {
        if (window && window.hasOwnProperty("__eth_contract_Ori20")) {
            const obj = window.__eth_contract_Ori20;
            if (obj instanceof Ori20Contract) {
                return (obj);
            }
            else {
                return (obj);
            }
        }
        else {
            return false;
        }
    }
    static async init(contract_address, supportedProvider, ww3) {
        const contractInstance = await new Ori20Contract(contract_address, supportedProvider, ww3);
        contractInstance.constructorArgs = [];
        if (window && !window.hasOwnProperty("__eth_contract_Ori20")) {
            window.__eth_contract_Ori20 = contractInstance;
        }
        return contractInstance;
    }
    static ABI() {
        const abi = [
            {
                inputs: [],
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'constructor',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'owner',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'spender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'value',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Approval',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                        indexed: true,
                    },
                ],
                name: 'MinterAdded',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                        indexed: true,
                    },
                ],
                name: 'MinterRemoved',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'from',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'to',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'value',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Transfer',
                outputs: [],
                type: 'event',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'addMinter',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        name: 'spender',
                        type: 'address',
                    },
                ],
                name: 'allowance',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'approve',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'balanceOf',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'burn',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'burnFrom',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'cap',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'decimals',
                outputs: [
                    {
                        name: '',
                        type: 'uint8',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        name: 'subtractedValue',
                        type: 'uint256',
                    },
                ],
                name: 'decreaseAllowance',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'getDecimals',
                outputs: [
                    {
                        name: '',
                        type: 'uint8',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'gov',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        name: 'addedValue',
                        type: 'uint256',
                    },
                ],
                name: 'increaseAllowance',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'isMinter',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'mint',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'name',
                outputs: [
                    {
                        name: '',
                        type: 'string',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'removeMinter',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [],
                name: 'renounceMinter',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'symbol',
                outputs: [
                    {
                        name: '',
                        type: 'string',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'tokenName',
                outputs: [
                    {
                        name: '',
                        type: 'string',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'tokenSymbol',
                outputs: [
                    {
                        name: '',
                        type: 'string',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'totalSupply',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'recipient',
                        type: 'address',
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'transfer',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                    },
                    {
                        name: 'recipient',
                        type: 'address',
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'transferFrom',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ];
        return abi;
    }
    async addMinter(account) {
        const self = this;
        assert.isString('account', account);
        const promizz = self._contract.methods.addMinter(account);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async addMinterGas(account) {
        const self = this;
        const gasAmount = await self._contract.methods.addMinter(account).estimateGas();
        return gasAmount;
    }
    ;
    async allowance(owner, spender) {
        const self = this;
        assert.isString('owner', owner);
        assert.isString('spender', spender);
        const promizz = self._contract.methods.allowance(owner, spender);
        const result = await promizz.call();
        return result;
    }
    ;
    async allowanceGas(owner, spender) {
        const self = this;
        const gasAmount = await self._contract.methods.allowance(owner, spender).estimateGas();
        return gasAmount;
    }
    ;
    async approve(spender, amount) {
        const self = this;
        assert.isString('spender', spender);
        assert.isNumberOrBigNumber('amount', amount);
        const promizz = self._contract.methods.approve(spender, amount);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async approveGas(spender, amount) {
        const self = this;
        const gasAmount = await self._contract.methods.approve(spender, amount).estimateGas();
        return gasAmount;
    }
    ;
    async balanceOf(account) {
        const self = this;
        assert.isString('account', account);
        const promizz = self._contract.methods.balanceOf(account);
        const result = await promizz.call();
        return result;
    }
    ;
    async balanceOfGas(account) {
        const self = this;
        const gasAmount = await self._contract.methods.balanceOf(account).estimateGas();
        return gasAmount;
    }
    ;
    async burn(amount) {
        const self = this;
        assert.isNumberOrBigNumber('amount', amount);
        const promizz = self._contract.methods.burn(amount);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async burnGas(amount) {
        const self = this;
        const gasAmount = await self._contract.methods.burn(amount).estimateGas();
        return gasAmount;
    }
    ;
    async burnFrom(account, amount) {
        const self = this;
        assert.isString('account', account);
        assert.isNumberOrBigNumber('amount', amount);
        const promizz = self._contract.methods.burnFrom(account, amount);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async burnFromGas(account, amount) {
        const self = this;
        const gasAmount = await self._contract.methods.burnFrom(account, amount).estimateGas();
        return gasAmount;
    }
    ;
    async cap() {
        const self = this;
        const promizz = self._contract.methods.cap();
        const result = await promizz.call();
        return result;
    }
    ;
    async capGas() {
        const self = this;
        const gasAmount = await self._contract.methods.cap().estimateGas();
        return gasAmount;
    }
    ;
    async decimals() {
        const self = this;
        const promizz = self._contract.methods.decimals();
        const result = await promizz.call();
        return result;
    }
    ;
    async decimalsGas() {
        const self = this;
        const gasAmount = await self._contract.methods.decimals().estimateGas();
        return gasAmount;
    }
    ;
    async decreaseAllowance(spender, subtractedValue) {
        const self = this;
        assert.isString('spender', spender);
        assert.isNumberOrBigNumber('subtractedValue', subtractedValue);
        const promizz = self._contract.methods.decreaseAllowance(spender, subtractedValue);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async decreaseAllowanceGas(spender, subtractedValue) {
        const self = this;
        const gasAmount = await self._contract.methods.decreaseAllowance(spender, subtractedValue).estimateGas();
        return gasAmount;
    }
    ;
    async getDecimals() {
        const self = this;
        const promizz = self._contract.methods.getDecimals();
        const result = await promizz.call();
        return result;
    }
    ;
    async getDecimalsGas() {
        const self = this;
        const gasAmount = await self._contract.methods.getDecimals().estimateGas();
        return gasAmount;
    }
    ;
    async gov() {
        const self = this;
        const promizz = self._contract.methods.gov();
        const result = await promizz.call();
        return result;
    }
    ;
    async govGas() {
        const self = this;
        const gasAmount = await self._contract.methods.gov().estimateGas();
        return gasAmount;
    }
    ;
    async increaseAllowance(spender, addedValue) {
        const self = this;
        assert.isString('spender', spender);
        assert.isNumberOrBigNumber('addedValue', addedValue);
        const promizz = self._contract.methods.increaseAllowance(spender, addedValue);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async increaseAllowanceGas(spender, addedValue) {
        const self = this;
        const gasAmount = await self._contract.methods.increaseAllowance(spender, addedValue).estimateGas();
        return gasAmount;
    }
    ;
    async isMinter(account) {
        const self = this;
        assert.isString('account', account);
        const promizz = self._contract.methods.isMinter(account);
        const result = await promizz.call();
        return result;
    }
    ;
    async isMinterGas(account) {
        const self = this;
        const gasAmount = await self._contract.methods.isMinter(account).estimateGas();
        return gasAmount;
    }
    ;
    async mint(account, amount) {
        const self = this;
        assert.isString('account', account);
        assert.isNumberOrBigNumber('amount', amount);
        const promizz = self._contract.methods.mint(account, amount);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async mintGas(account, amount) {
        const self = this;
        const gasAmount = await self._contract.methods.mint(account, amount).estimateGas();
        return gasAmount;
    }
    ;
    async name() {
        const self = this;
        const promizz = self._contract.methods.name();
        const result = await promizz.call();
        return result;
    }
    ;
    async nameGas() {
        const self = this;
        const gasAmount = await self._contract.methods.name().estimateGas();
        return gasAmount;
    }
    ;
    async removeMinter(account) {
        const self = this;
        assert.isString('account', account);
        const promizz = self._contract.methods.removeMinter(account);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async removeMinterGas(account) {
        const self = this;
        const gasAmount = await self._contract.methods.removeMinter(account).estimateGas();
        return gasAmount;
    }
    ;
    async renounceMinter() {
        const self = this;
        const promizz = self._contract.methods.renounceMinter();
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async renounceMinterGas() {
        const self = this;
        const gasAmount = await self._contract.methods.renounceMinter().estimateGas();
        return gasAmount;
    }
    ;
    async symbol() {
        const self = this;
        const promizz = self._contract.methods.symbol();
        const result = await promizz.call();
        return result;
    }
    ;
    async symbolGas() {
        const self = this;
        const gasAmount = await self._contract.methods.symbol().estimateGas();
        return gasAmount;
    }
    ;
    async tokenName() {
        const self = this;
        const promizz = self._contract.methods.tokenName();
        const result = await promizz.call();
        return result;
    }
    ;
    async tokenNameGas() {
        const self = this;
        const gasAmount = await self._contract.methods.tokenName().estimateGas();
        return gasAmount;
    }
    ;
    async tokenSymbol() {
        const self = this;
        const promizz = self._contract.methods.tokenSymbol();
        const result = await promizz.call();
        return result;
    }
    ;
    async tokenSymbolGas() {
        const self = this;
        const gasAmount = await self._contract.methods.tokenSymbol().estimateGas();
        return gasAmount;
    }
    ;
    async totalSupply() {
        const self = this;
        const promizz = self._contract.methods.totalSupply();
        const result = await promizz.call();
        return result;
    }
    ;
    async totalSupplyGas() {
        const self = this;
        const gasAmount = await self._contract.methods.totalSupply().estimateGas();
        return gasAmount;
    }
    ;
    async transfer(recipient, amount) {
        const self = this;
        assert.isString('recipient', recipient);
        assert.isNumberOrBigNumber('amount', amount);
        const promizz = self._contract.methods.transfer(recipient, amount);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async transferGas(recipient, amount) {
        const self = this;
        const gasAmount = await self._contract.methods.transfer(recipient, amount).estimateGas();
        return gasAmount;
    }
    ;
    async transferFrom(sender, recipient, amount) {
        const self = this;
        assert.isString('sender', sender);
        assert.isString('recipient', recipient);
        assert.isNumberOrBigNumber('amount', amount);
        const promizz = self._contract.methods.transferFrom(sender, recipient, amount);
        const result = await promizz.send({
            from: this._blockwrap.getAccountAddress(),
            gas: this.gas,
            gasPrice: this.gasPrice
        }).on('transactionHash', (hash) => {
            this.onBroadcast(hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            this.onConfirmation(receipt);
        }).on('receipt', (r) => {
            this.pushReceiptSuccess(r);
        }).on('error', (error, receipt) => {
            this.onError(receipt, error);
        }).catch((e) => {
            this.catchErro(e);
        });
        return result;
    }
    ;
    async transferFromGas(sender, recipient, amount) {
        const self = this;
        const gasAmount = await self._contract.methods.transferFrom(sender, recipient, amount).estimateGas();
        return gasAmount;
    }
    ;
    subscribe(eventName, indexFilterValues, callback, isVerbose = false, blockPollingIntervalMs) {
        assert.doesBelongToStringEnum('eventName', eventName, Ori20Events);
        assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
        assert.isFunction('callback', callback);
        const subscriptionToken = this._subscriptionManager.subscribe(this._address, eventName, indexFilterValues, Ori20Contract.ABI(), callback, isVerbose, blockPollingIntervalMs);
        return subscriptionToken;
    }
    unsubscribe(subscriptionToken) {
        this._subscriptionManager.unsubscribe(subscriptionToken);
    }
    unsubscribeAll() {
        this._subscriptionManager.unsubscribeAll();
    }
    async getLogsAsync(eventName, blockRange, indexFilterValues) {
        assert.doesBelongToStringEnum('eventName', eventName, Ori20Events);
        assert.doesConformToSchema('blockRange', blockRange, schemas.blockRangeSchema);
        assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
        const logs = await this._subscriptionManager.getLogsAsync(this._address, eventName, blockRange, indexFilterValues, Ori20Contract.ABI());
        return logs;
    }
}
Ori20Contract.contractName = 'Ori20';
