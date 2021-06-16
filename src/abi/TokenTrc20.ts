/* DO NOT EDIT THE BELOW FILE AS THIS IS LIKELY WILL BE GENERATED AGAIN AND REWRITE OVER IT */
// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace no-camelcase
// tslint:disable:no-unused-variable
import TronWeb, {BigNumber, version, Contract} from "tronweb"
import BaseContract from "../base/tron/base"

// eslint-disable-next-line import/named
export interface ApprovalEventArgs {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface MinterAddedEventArgs {
    account: string;
}

export interface MinterRemovedEventArgs {
    account: string;
}

export interface TransferEventArgs {
    from: string;
    to: string;
    value: BigNumber;
}

type Param = {
    type: string,
    value: any
}

export interface ContractInterface {
    addMinter(account: string): Promise<void>

    allowance(owner: string, spender: string): Promise<BigNumber>

    approve(spender: string, amount: string): Promise<boolean>

    balanceOf(account: string): Promise<BigNumber>

    burn(amount: string): Promise<void>

    burnFrom(account: string, amount: string): Promise<void>

    cap(): Promise<BigNumber>

    decimals(): Promise<BigNumber>

    decreaseAllowance(spender: string, subtractedValue: string): Promise<boolean>

    getDecimals(): Promise<BigNumber>

    increaseAllowance(spender: string, addedValue: string): Promise<boolean>

    isMinter(account: string): Promise<boolean>

    mint(account: string, amount: string): Promise<boolean>

    name(): Promise<string>

    renounceMinter(): Promise<void>

    symbol(): Promise<string>

    tokenName(): Promise<string>

    tokenSymbol(): Promise<string>

    totalSupply(): Promise<BigNumber>

    transfer(recipient: string, amount: string): Promise<boolean>

    transferFrom(sender: string, recipient: string, amount: string): Promise<boolean>
}

// @ts-ignore
export class TokenTrc20 extends BaseContract implements ContractInterface {

    public static deployedBytecode: string | undefined;
    public static contractName = "TokenTrc20";
    __debug: boolean = true;

    tronweb: TronWeb = null;
    contract: Contract;
    contract_address_t: string;
    based_version: string = version;

    constructor(tron: TronWeb) {
        super();
        this.tronweb = tron
    }

    public static Instance(): (TokenTrc20 | any | boolean) {
        if (window && window.hasOwnProperty("_contractTrc20Token888")) {
            // @ts-ignore
            const obj = window._contractTrc20Token888
            if (obj instanceof TokenTrc20) {
                return (obj) as TokenTrc20
            } else {
                return (obj) as TokenTrc20
            }
        } else {
            return false
        }
    }

    async init(contract_address: string) {
        this.contract = await new Contract(this.tronweb, TokenTrc20.ABI(), contract_address);
        /**this.contract = await this.tronweb.contract().new({
            abi:CONTRACT_ABI,
            bytecode: TokenTrc20.deployedBytecode
        });**/
        this.contract_address_t = contract_address;
        if (window && !window.hasOwnProperty("_contractTrc20Token888")) {
            // @ts-ignore
            window._contractTrc20Token888 = this
        }
    }

    setDebug(bool: boolean) {
        this.__debug = bool
    }

    public isVersionCompatible(): boolean {
        return this.based_version === this.tronweb.version
    }


    // @ts-ignore
    public async addMinter(account: string): Promise<void> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.addMinter(account)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 addMinter");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async allowance(owner: string, spender: string): Promise<BigNumber> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.allowance(owner, spender)
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 allowance");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async approve(spender: string, amount: string): Promise<boolean> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.approve(spender, amount)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 approve");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async balanceOf(account: string): Promise<BigNumber> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.balanceOf(account)
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 balanceOf");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async burn(amount: string): Promise<void> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.burn(amount)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 burn");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async burnFrom(account: string, amount: string): Promise<void> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.burnFrom(account, amount)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 burnFrom");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async cap(): Promise<BigNumber> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.cap()
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 cap");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async decimals(): Promise<BigNumber> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.decimals()
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 decimals");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async decreaseAllowance(spender: string, subtractedValue: string): Promise<boolean> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.decreaseAllowance(spender, subtractedValue)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 decreaseAllowance");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async getDecimals(): Promise<BigNumber> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.getDecimals()
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 getDecimals");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async increaseAllowance(spender: string, addedValue: string): Promise<boolean> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.increaseAllowance(spender, addedValue)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 increaseAllowance");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async isMinter(account: string): Promise<boolean> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.isMinter(account)
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 isMinter");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async mint(account: string, amount: string): Promise<boolean> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.mint(account, amount)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 mint");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async name(): Promise<string> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.name()
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 name");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async renounceMinter(): Promise<void> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.renounceMinter()
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 renounceMinter");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async symbol(): Promise<string> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.symbol()
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 symbol");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async tokenName(): Promise<string> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.tokenName()
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 tokenName");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async tokenSymbol(): Promise<string> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.tokenSymbol()
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 tokenSymbol");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async totalSupply(): Promise<BigNumber> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: true,
            callValue: 0,
        }
        let val = await this.contract.totalSupply()
            .call(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 totalSupply");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async transfer(recipient: string, amount: string): Promise<boolean> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.transfer(recipient, amount)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 transfer");
            console.log(val);
            console.groupEnd();
        }
        return val
    }


    // @ts-ignore
    public async transferFrom(sender: string, recipient: string, amount: string): Promise<boolean> {
        let callparams = {
            userFeePercentage: 30,
            feeLimit: 100000000,
            shouldPollResponse: true,
            _isConstant: false,
            callValue: 0,
        }
        let val = await this.contract.transferFrom(sender, recipient, amount)
            .send(callparams)

        ;


        if (this.__debug) {
            console.group("==> debug return raw 💮 transferFrom");
            console.log(val);
            console.groupEnd();
        }
        return val
    }

    async startEventListeners(): Promise<any> {
        // @ts-ignore
        await this.contract && this.contract.Approval().watch((err, _result) => {
            if (err) return console.error('Failed to bind event listener:', err);

            if (_result) {
                let {result, block, transaction, name, contract} = _result;


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
        // @ts-ignore
        await this.contract && this.contract.MinterAdded().watch((err, _result) => {
            if (err) return console.error('Failed to bind event listener:', err);

            if (_result) {
                let {result, block, transaction, name, contract} = _result;


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
        // @ts-ignore
        await this.contract && this.contract.MinterRemoved().watch((err, _result) => {
            if (err) return console.error('Failed to bind event listener:', err);

            if (_result) {
                let {result, block, transaction, name, contract} = _result;


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
        // @ts-ignore
        await this.contract && this.contract.Transfer().watch((err, _result) => {
            if (err) return console.error('Failed to bind event listener:', err);

            if (_result) {
                let {result, block, transaction, name, contract} = _result;


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

    /**
     * @returns The contract ABI
     */
    public static ABI(): any {
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
