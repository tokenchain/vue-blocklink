import {Ori20Contract} from "./ori20";
import type {
    WebLinkTokenMap, Web3ERC20Token, WatchAssetParams, AddEthereumChainParameter, TransactionReceipt
} from "../base/eth/types";
import {Vue} from "vue/types/vue";
import CoinDetail from "./CoinDetail";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import Web3 from "web3";
import {Utils} from 'web3-utils';
import {PromiEvent, TransactionConfig} from 'web3-core';
import {BigNumber} from "../base/eth/utils";

/**
 * BlockWrap extension interaction functionality
 */
export default class BlockWrap {
    ethereumCore: any
    tokens: WebLinkTokenMap
    w3: Web3
    debug: boolean = false
    errorHandler: any;
    confirmHandler: any;
    boardcastHandler: any;
    accounts: Array<string> = [];
    gas: number = 1000000
    gasPrice: number | string = 20000000000

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
        this.accounts = data
    }

    setResource(gas: number, gas_price: number): void {
        this.gas = gas
        this.gasPrice = gas_price
    }

    haveAccounts(): boolean {
        return this.accounts.length > 0
    }

    NewContract(abi: any[] = [], address: string = ""): any {
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

    async sendToken(amount: any, toaddress: string, erc20_address: string): Promise<void> {
        const contract = await this.NewToken(erc20_address);
        // @ts-ignore
        const send_amount = new BigNumber(amount);
        await contract.transfer(toaddress, send_amount);
    }

    public keccak256(data: any): string {
        return this.w3.utils.keccak256(data)
    }

    public sha(data: any): string {
        return this.w3.utils.soliditySha3(data)
    }

    /**
     * doesnt work on the older version
     * @deprecated
     */
    async getCoinPlatform(): Promise<number> {
        // @ts-ignore
        return await this.w3.eth.getBalance(this.getAccountAddress())
    }

    async getCoin(trc20_coin: string): Promise<number> {
        return await this.getThirdTokenBalanceSun(this.getAccountAddress(), trc20_coin)
    }

    async getCoinDetail(trc20_coin: string): Promise<CoinDetail> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), trc20_coin)
    }

    async coinExample(): Promise<CoinDetail> {
        return await this.getCoinDetail("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }


    /**
     * get TRC20 token in balance
     * @param address
     * @param erc20_address
     */
    async getThirdTokenBalance(address: string, erc20_address: string): Promise<CoinDetail> {
        if (!this.isLoggedIn()) {
            throw "wallet is not login"
        }
        const contract = await this.NewToken(erc20_address)
        console.log("contract started .. ")
        if (!this.tokens.hasOwnProperty(erc20_address)) {
            const a = await contract.balanceOf(address)
            const d = await contract.decimals()
            const s = await contract.symbol()
            const name = await contract.name()
            console.log(d)
            const detail = new CoinDetail(erc20_address, d, s, name)
            detail.setHolder(address, a)
            this.tokens[erc20_address] = detail
        } else {
            const abbalance = await contract.balanceOf(address)
            // this.tokens[erc20_address].setHolder(address, txtUnit(apbalance))
        }

        // @ts-ignore
        return this.tokens[erc20_address];
    }

    async getThirdTokenBalanceSun(address: string, erc20_address: string): Promise<number> {
        const conver = await this.getThirdTokenBalance(address, erc20_address)
        return conver.bySun(address)
    }

    async getThirdTokenBalanceFloat(address: string, erc20_address: string): Promise<number> {
        const conver = await this.getThirdTokenBalance(address, erc20_address)
        return conver.byFloat(address)
    }

    /**
     * to approve prespending TRC20 token on the go..
     * @param erc20_address
     * @param spender_address
     * @param amount_sun
     * @constructor
     */
    async ApproveSpendingToken(erc20_address: string, spender_address: string, amount_sun: number): Promise<boolean> {
        const token = await this.NewToken(erc20_address)
        // @ts-ignore
        return await token.approve(spender_address, BigNumber.from(amount_sun))
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

    setDebug(debugx): void {
        this.debug = debugx
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
