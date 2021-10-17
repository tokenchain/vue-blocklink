import {Ori20Contract} from "./ori20";
import type {
    WebLinkTokenMap, Web3ERC20Token, WatchAssetParams, AddEthereumChainParameter, TransactionReceipt, ContractTokenMap
} from "../base/eth/types";
import {Vue} from "vue/types/vue";
import CoinDetail from "./CoinDetail";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import Web3 from "web3";
import {Utils} from 'web3-utils';
import {TransactionConfig} from 'web3-core';
import BN from 'bn.js'
import * as _ from "lodash";

/**
 * BlockWrap extension interaction functionality
 */
export default class BlockWrap {
    ethereumCore: any
    tokens: WebLinkTokenMap
    contracts: ContractTokenMap;
    w3: Web3
    debug: boolean = false
    errorHandler: any;
    confirmHandler: any;
    boardcastHandler: any;
    accounts: Array<string> = [];
    gas: number = 1000000
    gasPrice: number | string = 21000000000

    /**
     * Initiates BlockWrap support object.
     *
     * @param {Object} ethereumCore ethereumCore entity object
     *           (details: https://github.com/tronprotocol/tron-web)
     */
    constructor(webThree, ethereumCore) {
        this.ethereumCore = ethereumCore
        this.w3 = webThree as Web3
        this.tokens = {}
        this.contracts = {}
    }

    setDebug(x: boolean): void {
        this.debug = x
    }

    /**
     * Checks if BlockWrap browser extension is installed
     */
    isInstalled(): boolean {
        return this.ethereumCore.isConnected()
    }

    /**
     * Checks if user is logged in to the BlockWrap plugin
     */
    isLoggedIn(): boolean {
        return this.ethereumCore && this.ethereumCore.isConnected()
    }

    /**
     *
     * Is this an address?
     */
    isAddress(test: any): boolean {
        return this.w3.utils.isAddress(test)
    }

    /**
     *
     * Is this an address?
     */
    w3Utils(): Utils {
        return this.w3.utils
    }

    /**
     * Checks if user is logged in to the BlockWrap plugin.
     * Alias for isLoggedIn() method.
     */
    async isUnlocked(): Promise<boolean> {
        return await this.ethereumCore._metamask.isUnlocked()
    }

    /**
     * Returns logged in user Tron address
     */
    getAccountAddress(): string {
        return this.accounts[0]
    }

    setAccounts(data): void {
        if (this.debug) {
            console.log("set account now", data)
        }
        this.accounts = _.map(data, (e) => this.w3.utils.toChecksumAddress(e))
    }

    setResource(gas: number, gas_price: number): void {
        this.gas = gas
        this.gasPrice = gas_price

        //const f = this.w3.utils.toBN(1)
        //const need = this.w3.utils.toWei(f, "gwei")
        if (this.debug) {
            // console.log(need)
        }

        this._setOtherRrc(gas, gas_price)
    }

    private _setOtherRrc(gas: number, gas_price: number): void {
        for (let b in this.contracts) {
            this.contracts[b].setResource(gas, gas_price)
        }
    }

    haveAccounts(): boolean {
        return this.accounts.length > 0
    }

    NewContractFallback(abi: any[] = [], address: string = ""): any {
        const contract = this.w3.eth.Contract
        // @ts-ignore
        contract.setProvider(this.ethereumCore)
        return new contract(abi, address, {
            from: this.accounts[0], // default from address
            gasPrice: String(this.gasPrice)  // default gas price in wei, 20 gwei in this case
        })
    }

    // @ts-ignore
    async sendCoin(amount: any, toaddress: string): Promise<TransactionReceipt> {
        const conf: TransactionConfig = {
            value: amount,
            to: toaddress,
            gas: this.gas,
            gasPrice: this.gasPrice,
            from: this.accounts[0]
        }
        await this.w3.eth.sendTransaction(conf).on("confirmation", this.confirmHandler).catch(this.errorHandler);
        //return receipt;
    }

    public async sendToken(amount: any, toaddress: string, erc20_address: string): Promise<void> {
        const contract = await this.NewToken(erc20_address);
        // @ts-ignore
        const send_amount = new BN(amount);
        await contract.transfer(toaddress, send_amount);
    }

    public async approveToken(erc20_address: string, spender_address: string, amount_sun: any): Promise<void> {
        const contract = await this.NewToken(erc20_address);
        //const am = new BigNumber(amount_sun)
        const am = this.w3.utils.toBN(amount_sun)
        await contract.approve(spender_address, am)
    }

    public async approveTokenUnlimited(erc20_address: string, spender_address: string) {
        const contract = await this.NewToken(erc20_address);
        // const am = new BigNumber({s: 1, e: 2, c: [1000000000000000000, 1000000000000000000], _isBigNumber: true});
        // const am = new BigNumber("1234567891200000000000000000000000000");
        // const am = new BN("1000");
        // console.log(am)
        let amc = "1000000000000000000000000"
        // const val = this.w3.utils.toWei(am, 'ether')
        const am = this.w3.utils.toBN(amc)
        console.log(am)
        let val = am
        await contract.approve(spender_address, val);
    }

    public async getMyTokenBalance(trc20_coin: string): Promise<number> {
        return await this.getTokenBalanceWei(this.getAccountAddress(), trc20_coin)
    }

    /**
     * get the keccak256
     * @param data
     */
    public keccak256(data: any): string {
        return this.w3.utils.keccak256(data)
    }

    /**
     *
     * @param data
     */
    public sha(data: any): string | null {
        return this.w3.utils.soliditySha3(data)
    }

    public async balance(): Promise<string> {
        return await this.w3.eth.getBalance(this.getAccountAddress())
    }

    /**
     * doesnt work on the older version
     * @deprecated
     */
    async getCoinPlatform(): Promise<number> {
        // @ts-ignore
        return await this.w3.eth.getBalance(this.getAccountAddress())
    }

    async getMyCoinDetail(trc20_coin: string): Promise<CoinDetail> {
        return await this.getCoinDetail(trc20_coin, this.getAccountAddress())
    }

    async coinExample(): Promise<CoinDetail> {
        return await this.getMyCoinDetail("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }

    public async initCoinDetail(erc20: string, me: string): Promise<CoinDetail> {
        const contract = await this.NewToken(erc20)
        const a = await contract.balanceOf(me)
        const d = await contract.decimals()
        const s = await contract.symbol()
        const name = await contract.name()
        const detail = new CoinDetail(erc20, d, s, name)
        detail.setHolder(me, a)
        this.tokens[erc20] = detail
        this.contracts[erc20] = contract
        return detail
    }


    /**
     * get TRC20 token in balance
     * @param address
     * @param erc20_address
     */
    public async getCoinDetail(erc20_address: string, address: string): Promise<CoinDetail> {
        if (!this.isLoggedIn()) {
            throw "wallet is not login"
        }
        if (!this.tokens.hasOwnProperty(erc20_address)) {
            // console.log("init coin detail")
            await this.initCoinDetail(erc20_address, address)
        } else {
            let contract = this.contracts[erc20_address]
            if (!contract) {
                contract = await this.NewToken(erc20_address)
                this.contracts[erc20_address] = contract
            }
            const b = await contract.balanceOf(address)
            // @ts-ignore
            this.tokens[erc20_address].setHolder(address, b)
        }

        // @ts-ignore
        return this.tokens[erc20_address];
    }

    async getContractToken(erc20_address: string): Promise<Ori20Contract> {
        let contract = this.contracts[erc20_address]
        if (!contract) {
            if (this.debug) {
                console.log("new contract token ...")
            }
            contract = await this.NewToken(erc20_address)
            this.contracts[erc20_address] = contract
        }
        return contract
    }

    async getTokenBalanceWei(address: string, erc20_address: string): Promise<number> {
        if (!this.tokens.hasOwnProperty(erc20_address)) {
            const conver = await this.getCoinDetail(erc20_address, address);
            return conver.amountCode(address);
        } else {
            let contract = this.contracts[erc20_address]
            // tokende.holder[address] = await contract.balanceOf(address)
            const b = await contract.balanceOf(address)
            // @ts-ignore
            this.tokens[erc20_address].setHolder(address, b)
            return b.toNumber()
        }
    }

    async NewToken(erc20_address: string): Promise<Ori20Contract> {
        const contr = await Ori20Contract.init(erc20_address, this.ethereumCore, this.w3)
        // @ts-ignore
        contr.setResource(this.gas, this.gasPrice);
        contr.setBlockLink(this)
        return contr
    }

    getListedCoins(): WebLinkTokenMap {
        return this.tokens
    }

    explainTrc20(payload: Web3ERC20Token): number {
        const me = this.getAccountAddress()
        return payload.holder[me]
    }

    eventListener(message: any, vueInstance: Vue) {
    }

    setHandlers(confirm, broadcast, err): void {
        this.errorHandler = err
        this.boardcastHandler = broadcast
        this.confirmHandler = confirm
    }

    metamask_decrypt(encryptedMessage, account_address, callback): void {
        if (!this.ethereumCore) return;
        this.ethereumCore
            .request({
                method: 'eth_decrypt',
                params: [encryptedMessage, account_address],
            })
            .then((decryptedMessage) => {
                if (this.debug) {
                    console.log('The decrypted message is:', decryptedMessage)
                }
                callback(decryptedMessage)
            })
            .catch(this.errorHandler)
    }

    metamask_message_sign(encryptionPublicKey, message): string {
        return ethUtil.bufferToHex(
            Buffer.from(JSON.stringify(
                sigUtil.encrypt(
                    encryptionPublicKey,
                    {data: message},
                    'x25519-xsalsa20-poly1305'
                )
            ), 'utf8')
        );
    }


    metamask_add_token(token_conf: WatchAssetParams): void {
        this.ethereumCore
            .request({
                method: 'wallet_watchAsset',
                params: token_conf,
            })
            .then((success) => {
                if (success) {
                    if (this.debug) {
                        console.log('FOO successfully added to wallet!')
                    }
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(this.errorHandler)
    }


    metamask_add_chain(chain_conf: AddEthereumChainParameter): void {
        this.ethereumCore
            .request({
                method: 'wallet_addEthereumChain',
                params: chain_conf,
            })
            .then((success) => {
                if (success) {
                    if (this.debug) {
                        console.log('Chain is successfully added to wallet!')
                    }
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(this.errorHandler)
    }
}
