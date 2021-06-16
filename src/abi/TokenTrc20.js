import { version, Contract } from "tronweb";
import BaseContract from "../base/tron/base";
export class TokenTrc20 extends BaseContract {
    constructor(tron) {
        super();
        this.__debug = true;
        this.tronweb = null;
        this.based_version = version;
        this.tronweb = tron;
    }
    static Instance() {
        if (window && window.hasOwnProperty("_contractTrc20Token888")) {
            const obj = window._contractTrc20Token888;
            if (obj instanceof TokenTrc20) {
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
    async init(contract_address) {
        this.contract = await new Contract(this.tronweb, TokenTrc20.ABI(), contract_address);
        this.contract_address_t = contract_address;
        if (window && !window.hasOwnProperty("_contractTrc20Token888")) {
            window._contractTrc20Token888 = this;
        }
    }
    setDebug(bool) {
        this.__debug = bool;
    }
    isVersionCompatible() {
        return this.based_version === this.tronweb.version;
    }
    async addMinter(account) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.addMinter(account)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 addMinter");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async allowance(owner, spender) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.allowance(owner, spender)
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 allowance");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async approve(spender, amount) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.approve(spender, amount)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 approve");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async balanceOf(account) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.balanceOf(account)
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 balanceOf");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async burn(amount) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.burn(amount)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 burn");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async burnFrom(account, amount) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.burnFrom(account, amount)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 burnFrom");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async cap() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.cap()
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 cap");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async decimals() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.decimals()
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 decimals");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async decreaseAllowance(spender, subtractedValue) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.decreaseAllowance(spender, subtractedValue)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 decreaseAllowance");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async getDecimals() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.getDecimals()
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 getDecimals");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async increaseAllowance(spender, addedValue) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.increaseAllowance(spender, addedValue)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 increaseAllowance");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async isMinter(account) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.isMinter(account)
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 isMinter");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async mint(account, amount) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.mint(account, amount)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 mint");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async name() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.name()
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 name");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async renounceMinter() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.renounceMinter()
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 renounceMinter");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async symbol() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.symbol()
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 symbol");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async tokenName() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.tokenName()
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 tokenName");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async tokenSymbol() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.tokenSymbol()
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 tokenSymbol");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async totalSupply() {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        };
        let val = await this.contract.totalSupply()
            .call(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 totalSupply");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async transfer(recipient, amount) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.transfer(recipient, amount)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 transfer");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async transferFrom(sender, recipient, amount) {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        };
        let val = await this.contract.transferFrom(sender, recipient, amount)
            .send(callparams);
        if (this.__debug) {
            console.group("==> debug return raw 💮 transferFrom");
            console.log(val);
            console.groupEnd();
        }
        return val;
    }
    async startEventListeners() {
        await this.contract && this.contract.Approval().watch((err, _result) => {
            if (err)
                return console.error('Failed to bind event listener:', err);
            if (_result) {
                let { result, block, transaction, name, contract } = _result;
                if (this.__debug) {
                    console.group('New event received');
                    console.log('- Contract Address:', contract);
                    console.log('- Event Name:', name);
                    console.log('- Transaction:', transaction);
                    console.log('- Block number:', block);
                    console.log('- Result:', result, '\n');
                    console.groupEnd();
                }
                this.emit("event_Approval", result);
            }
        });
        await this.contract && this.contract.MinterAdded().watch((err, _result) => {
            if (err)
                return console.error('Failed to bind event listener:', err);
            if (_result) {
                let { result, block, transaction, name, contract } = _result;
                if (this.__debug) {
                    console.group('New event received');
                    console.log('- Contract Address:', contract);
                    console.log('- Event Name:', name);
                    console.log('- Transaction:', transaction);
                    console.log('- Block number:', block);
                    console.log('- Result:', result, '\n');
                    console.groupEnd();
                }
                this.emit("event_MinterAdded", result);
            }
        });
        await this.contract && this.contract.MinterRemoved().watch((err, _result) => {
            if (err)
                return console.error('Failed to bind event listener:', err);
            if (_result) {
                let { result, block, transaction, name, contract } = _result;
                if (this.__debug) {
                    console.group('New event received');
                    console.log('- Contract Address:', contract);
                    console.log('- Event Name:', name);
                    console.log('- Transaction:', transaction);
                    console.log('- Block number:', block);
                    console.log('- Result:', result, '\n');
                    console.groupEnd();
                }
                this.emit("event_MinterRemoved", result);
            }
        });
        await this.contract && this.contract.Transfer().watch((err, _result) => {
            if (err)
                return console.error('Failed to bind event listener:', err);
            if (_result) {
                let { result, block, transaction, name, contract } = _result;
                if (this.__debug) {
                    console.group('New event received');
                    console.log('- Contract Address:', contract);
                    console.log('- Event Name:', name);
                    console.log('- Transaction:', transaction);
                    console.log('- Block number:', block);
                    console.log('- Result:', result, '\n');
                    console.groupEnd();
                }
                this.emit("event_Transfer", result);
            }
        });
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
}
TokenTrc20.contractName = "TokenTrc20";
