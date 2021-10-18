/* DO NOT EDIT THE BELOW FILE AS THIS IS LIKELY WILL BE GENERATED AGAIN AND REWRITE OVER IT */

// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable

import * as ethers from 'ethers';
// import {BigNumber} from 'bignumber.js'
import BN from 'bn.js'
import {assert} from "../base/eth/0xassert";
import {BlockRange, DecodedLogArgs, LogWithDecodedArgs, MethodAbi} from "../base/eth/types";
import {BaseContract} from "../base/eth/base";
import {SubscriptionManager} from "../base/eth/subscription_manager";
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

import {Utils, AbiItem} from 'web3-utils';
import {EventCallback, IndexedFilterValues} from "../base/eth/0xtypes";
import Web3 from "web3";

// tslint:enable:no-unused-variable
export interface ContractInterface {

    addMinter(account: string,): Promise<void>

    allowance(owner: string, spender: string,): Promise<BN>

    approve(spender: string, amount: BN,): Promise<void>

    balanceOf(account: string,): Promise<BN>

    burn(amount: BN,): Promise<void>

    burnFrom(account: string, amount: BN,): Promise<void>

    cap(): Promise<BN>

    decimals(): Promise<BN>

    decreaseAllowance(spender: string, subtractedValue: BN,): Promise<boolean>

    getDecimals(): Promise<BN>

    gov(): Promise<string>

    increaseAllowance(spender: string, addedValue: BN,): Promise<boolean>

    isMinter(account: string,): Promise<boolean>

    mint(account: string, amount: BN,): Promise<boolean>

    name(): Promise<string>

    removeMinter(account: string,): Promise<void>

    renounceMinter(): Promise<void>

    symbol(): Promise<string>

    tokenName(): Promise<string>

    tokenSymbol(): Promise<string>

    totalSupply(): Promise<BN>

    transfer(recipient: string, amount: BN,): Promise<boolean>

    transferFrom(sender: string, recipient: string, amount: BN,): Promise<boolean>
}

export type Ori20EventArgs =
    | Ori20ApprovalEventArgs
    | Ori20MinterAddedEventArgs
    | Ori20MinterRemovedEventArgs
    | Ori20TransferEventArgs;

export enum Ori20Events {
    Approval = 'Approval',
    MinterAdded = 'MinterAdded',
    MinterRemoved = 'MinterRemoved',
    Transfer = 'Transfer',
}

export interface Ori20ApprovalEventArgs extends DecodedLogArgs {
    owner: string;
    spender: string;
    value: BN;
}

export interface Ori20MinterAddedEventArgs extends DecodedLogArgs {
    account: string;
}

export interface Ori20MinterRemovedEventArgs extends DecodedLogArgs {
    account: string;
}

export interface Ori20TransferEventArgs extends DecodedLogArgs {
    from: string;
    to: string;
    value: BN;
}


/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class Ori20Contract extends BaseContract implements ContractInterface {
    /**
     * @ignore
     */
    public static deployedBytecode: string | undefined;
    public static readonly contractName = 'Ori20';
    private readonly _methodABIIndex: { [name: string]: number } = {};

    public static Instance(): (Ori20Contract | any | boolean) {
        if (window && window.hasOwnProperty("__eth_contract_Ori20")) {
            // @ts-ignore
            const obj = window.__eth_contract_Ori20
            if (obj instanceof Ori20Contract) {
                return (obj) as Ori20Contract
            } else {
                return (obj) as Ori20Contract
            }
        } else {
            return false
        }
    }

    static async init(
        contract_address: string,
        supportedProvider: provider,
        ww3: Web3
    ): Promise<Ori20Contract> {
        const contractInstance = await new Ori20Contract(
            contract_address,
            supportedProvider,
            ww3
        );

        contractInstance.constructorArgs = [];

        if (window && !window.hasOwnProperty("__eth_contract_Ori20")) {
            // @ts-ignore
            window.__eth_contract_Ori20 = contractInstance
        }

        return contractInstance
    }

    /**
     * @returns The contract ABI
     */
    public static ABI(): AbiItem[] {
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
        ] as AbiItem[];
        return abi;
    }

    /**
     the listed content for the contract functions
     **/


    public async addMinter(account: string,): Promise<void> {
        const self = this as any as Ori20Contract;

        assert.isString('account', account);

        const promizz = self._contract.methods.addMinter(
            account,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async addMinterGas(account: string,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.addMinter(account,).estimateGas();
        return gasAmount;
    };


    public async allowance(owner: string, spender: string,): Promise<BN> {
        const self = this as any as Ori20Contract;

        assert.isString('owner', owner);
        assert.isString('spender', spender);

        const promizz = self._contract.methods.allowance(
            owner,
            spender,
        )

        const result = await promizz.call();
        return result;
    };


    public async allowanceGas(owner: string, spender: string,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.allowance(owner, spender,).estimateGas();
        return gasAmount;
    };


    public async approve(spender: string, amount: any): Promise<void> {
        const self = this as any as Ori20Contract;

        assert.isString('spender', spender);
        assert.isNumberOrBigNumber('amount', amount);

        const promizz = self._contract.methods.approve(
            spender,
            amount,
        )

        await promizz.send({
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
            this.catchErro(e)
        });

    };


    public async approveGas(spender: string, amount: BN,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.approve(spender, amount,).estimateGas();
        return gasAmount;
    };


    public async balanceOf(account: string,): Promise<BN> {
        const self = this as any as Ori20Contract;

        assert.isString('account', account);

        const promizz = self._contract.methods.balanceOf(
            account,
        )

        const result = await promizz.call();
        return result;
    };


    public async balanceOfGas(account: string,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.balanceOf(account,).estimateGas();
        return gasAmount;
    };


    public async burn(amount: BN,): Promise<void> {
        const self = this as any as Ori20Contract;

        assert.isNumberOrBigNumber('amount', amount);

        const promizz = self._contract.methods.burn(
            amount,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async burnGas(amount: BN,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.burn(amount,).estimateGas();
        return gasAmount;
    };


    public async burnFrom(account: string, amount: BN,): Promise<void> {
        const self = this as any as Ori20Contract;

        assert.isString('account', account);
        assert.isNumberOrBigNumber('amount', amount);

        const promizz = self._contract.methods.burnFrom(
            account,
            amount,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async burnFromGas(account: string, amount: BN,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.burnFrom(account, amount,).estimateGas();
        return gasAmount;
    };


    public async cap(): Promise<BN> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.cap(
        )

        const result = await promizz.call();
        return result;
    };


    public async capGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.cap().estimateGas();
        return gasAmount;
    };


    public async decimals(): Promise<BN> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.decimals(
        )

        const result = await promizz.call();
        return result;
    };


    public async decimalsGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.decimals().estimateGas();
        return gasAmount;
    };


    public async decreaseAllowance(spender: string, subtractedValue: BN,): Promise<boolean> {
        const self = this as any as Ori20Contract;

        assert.isString('spender', spender);
        assert.isNumberOrBigNumber('subtractedValue', subtractedValue);

        const promizz = self._contract.methods.decreaseAllowance(
            spender,
            subtractedValue,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async decreaseAllowanceGas(spender: string, subtractedValue: BN,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.decreaseAllowance(spender, subtractedValue,).estimateGas();
        return gasAmount;
    };


    public async getDecimals(): Promise<BN> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.getDecimals(
        )

        const result = await promizz.call();
        return result;
    };


    public async getDecimalsGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.getDecimals().estimateGas();
        return gasAmount;
    };


    public async gov(): Promise<string> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.gov(
        )

        const result = await promizz.call();
        return result;
    };


    public async govGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.gov().estimateGas();
        return gasAmount;
    };


    public async increaseAllowance(spender: string, addedValue: BN,): Promise<boolean> {
        const self = this as any as Ori20Contract;

        assert.isString('spender', spender);
        assert.isNumberOrBigNumber('addedValue', addedValue);

        const promizz = self._contract.methods.increaseAllowance(
            spender,
            addedValue,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async increaseAllowanceGas(spender: string, addedValue: BN,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.increaseAllowance(spender, addedValue,).estimateGas();
        return gasAmount;
    };


    public async isMinter(account: string,): Promise<boolean> {
        const self = this as any as Ori20Contract;

        assert.isString('account', account);

        const promizz = self._contract.methods.isMinter(
            account,
        )

        const result = await promizz.call();
        return result;
    };


    public async isMinterGas(account: string,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.isMinter(account,).estimateGas();
        return gasAmount;
    };


    public async mint(account: string, amount: BN,): Promise<boolean> {
        const self = this as any as Ori20Contract;

        assert.isString('account', account);
        assert.isNumberOrBigNumber('amount', amount);

        const promizz = self._contract.methods.mint(
            account,
            amount,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async mintGas(account: string, amount: BN,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.mint(account, amount,).estimateGas();
        return gasAmount;
    };


    public async name(): Promise<string> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.name(
        )

        const result = await promizz.call();
        return result;
    };


    public async nameGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.name().estimateGas();
        return gasAmount;
    };


    public async removeMinter(account: string,): Promise<void> {
        const self = this as any as Ori20Contract;

        assert.isString('account', account);

        const promizz = self._contract.methods.removeMinter(
            account,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async removeMinterGas(account: string,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.removeMinter(account,).estimateGas();
        return gasAmount;
    };


    public async renounceMinter(): Promise<void> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.renounceMinter(
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async renounceMinterGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.renounceMinter().estimateGas();
        return gasAmount;
    };


    public async symbol(): Promise<string> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.symbol(
        )

        const result = await promizz.call();
        return result;
    };


    public async symbolGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.symbol().estimateGas();
        return gasAmount;
    };


    public async tokenName(): Promise<string> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.tokenName(
        )

        const result = await promizz.call();
        return result;
    };


    public async tokenNameGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.tokenName().estimateGas();
        return gasAmount;
    };


    public async tokenSymbol(): Promise<string> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.tokenSymbol(
        )

        const result = await promizz.call();
        return result;
    };


    public async tokenSymbolGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.tokenSymbol().estimateGas();
        return gasAmount;
    };


    public async totalSupply(): Promise<BN> {
        const self = this as any as Ori20Contract;


        const promizz = self._contract.methods.totalSupply(
        )

        const result = await promizz.call();
        return result;
    };


    public async totalSupplyGas(): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.totalSupply().estimateGas();
        return gasAmount;
    };


    public async transfer(recipient: string, amount: BN,): Promise<boolean> {
        const self = this as any as Ori20Contract;

        assert.isString('recipient', recipient);
        assert.isNumberOrBigNumber('amount', amount);

        const promizz = self._contract.methods.transfer(
            recipient,
            amount,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async transferGas(recipient: string, amount: BN,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.transfer(recipient, amount,).estimateGas();
        return gasAmount;
    };


    public async transferFrom(sender: string, recipient: string, amount: BN,): Promise<boolean> {
        const self = this as any as Ori20Contract;

        assert.isString('sender', sender);
        assert.isString('recipient', recipient);
        assert.isNumberOrBigNumber('amount', amount);

        const promizz = self._contract.methods.transferFrom(
            sender,
            recipient,
            amount,
        )

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
            this.catchErro(e)
        });
        return result;
    };


    public async transferFromGas(sender: string, recipient: string, amount: BN,): Promise<number> {
        const self = this as any as Ori20Contract;
        const gasAmount = await self._contract.methods.transferFrom(sender, recipient, amount,).estimateGas();
        return gasAmount;
    };


    constructor(
        address: string,
        supportedProvider: provider,
        ww3: Web3
    ) {
        super('Ori20', Ori20Contract.ABI(), address, supportedProvider, ww3);
        /*  Ori20Contract.ABI().forEach((item, index) => {
              if (item.type === 'function') {
                  const methodAbi = item as MethodAbi;
                  this._methodABIIndex[methodAbi.name] = index;
              }
          });*/


    }
}

// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
