import {Address} from "../base/Address"
import {TokenTrc20} from "./TokenTrc20";
import {
    TronLinkEventCaller,
    TronLinkTabReply,
    AccorToken,
    TronLinkTunnelMessage,
    TronTRC20Token, WatchAssetParams, AddEthereumChainParameter
} from "../base/tron/types";
import {Vue} from "vue/types/vue";
import {txtUnit} from "./../utils/bnx";
import CoinDetail from "./CoinDetail";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";


/**
 * BlockAcon extension interaction functionality
 */
export default class BlockAcon {
    ethereumCore: any
    tokens: AccorToken
    debug: boolean
    selected_function_reply: string
    selected_function_human_operation: string
    selected_function_caller: TronLinkEventCaller
    errorHandler: any;


    /**
     * Initiates BlockAcon support object.
     *
     * @param {Object} ethereumCore ethereumCore entity object
     *           (details: https://github.com/tronprotocol/tron-web)
     */
    constructor(ethereumCore) {
        this.ethereumCore = ethereumCore
        this.tokens = {}
        this.selected_function_human_operation = ""
    }

    /**
     * Checks if BlockAcon browser extension is installed
     */
    isInstalled(): boolean {
        return !!this.ethereumCore
    }

    /**
     * Checks if user is logged in to the BlockAcon plugin
     */
    isLoggedIn(): boolean {
        return this.ethereumCore && this.ethereumCore.ready
    }

    /**
     * Checks if user is logged in to the BlockAcon plugin.
     * Alias for isLoggedIn() method.
     */
    isUnlocked(): boolean {
        return this.isLoggedIn()
    }

    /**
     * Returns logged in user Tron address
     */
    getAccountAddress(): string {
        return this.ethereumCore.defaultAddress.base58
    }

    /**
     * returns the address with 41e...
     */
    getAccountAddressHex(): string {
        return this.ethereumCore.defaultAddress.hex
    }

    /**
     * returns the address with 0x...
     */
    getAccountAddress0x(): string {
        return "0x" + this.getAccountAddressHex().substr(2)
    }

    NewContract(abi: any[] = [], address: boolean = false): any {
        return new this.ethereumCore.Contract(this.ethereumCore, abi, address)
    }

    removeAllFunctionCalls(): void {
        this.selected_function_human_operation = ""
    }

    /**
     * Converts Tron address from one format to another.
     *
     * @param {String, Number} address Address to convert
     * @param {String} fromFormat From format string
     * @param {String} toFormat To format string
     */
    convertAddress(address, fromFormat: string, toFormat: string): string {
        if (fromFormat == toFormat) {
            throw "From and To address formats are equal"
        }

        switch (toFormat) {
            case "hex":
                switch (fromFormat) {
                    case "base58":
                    case "tron":
                    case "trx":
                        return "0x" + this.ethereumCore.address.toHex(address)
                }
                break
            case "base58":
            case "tron":
            case "trx":
                switch (fromFormat) {
                    case "hex":
                        if (!Address.isHexAddress(address)) {
                            throw "Invalid hex address"
                        }

                        if (address.startsWith("0x")) {
                            address = address.substr(2)
                        }

                        return this.ethereumCore.address.fromHex(address)
                }
                break
        }

        throw "Invalid address formats"
    }

    /**
     * doesnt work on the older version
     * @deprecated
     */
    async getCoinPlatform(): Promise<number> {
        let wallet_trx_coin = 0
        wallet_trx_coin = await this.ethereumCore.trx.getBalance(this.getAccountAddress())
        return wallet_trx_coin
    }

    /**
     * the working version of get balance of coin trx the simple way
     * @param cb function callback
     * @param cberr function callback
     */
    getCoinTRX(cb, cberr): void {
        this.ethereumCore.trx.getBalance(this.getAccountAddress(), (err, x) => {
            if (err == null) {
                cb(x)
            } else {
                cberr(err)
            }
        })
    }

    async getCoin(trc20_coin: string): Promise<number> {
        return await this.getThirdTokenBalanceSun(this.getAccountAddress(), trc20_coin)
    }

    async getCoinFlo(trc20_coin: string): Promise<number> {
        return await this.getThirdTokenBalanceFloat(this.getAccountAddress(), trc20_coin)
    }

    async coinDPFlo(): Promise<number> {
        return await this.getCoinFlo("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }

    async coinCOLAFlo(): Promise<number> {
        return await this.getCoinFlo("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG")
    }

    async coinBTCFlo(): Promise<number> {
        return await this.getCoinFlo("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9")
    }

    async coinETHFlo(): Promise<number> {
        return await this.getCoinFlo("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF")
    }

    async coinSUNFlo(): Promise<number> {
        return await this.getCoinFlo("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9")
    }

    async coinUSDTFlo(): Promise<number> {
        return await this.getCoinFlo("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    }

    async coinDP(): Promise<number> {
        return await this.getCoin("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }

    async coinCOLA(): Promise<number> {
        return await this.getCoin("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG")
    }

    async coinBTC(): Promise<number> {
        return await this.getCoin("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9")
    }

    async coinETH(): Promise<number> {
        return await this.getCoin("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF")
    }

    async coinSUN(): Promise<number> {
        return await this.getCoin("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9")
    }

    async coinUSDT(): Promise<number> {
        return await this.getCoin("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    }

    async getCoinDetail(trc20_coin: string): Promise<CoinDetail> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), trc20_coin)
    }

    async coinDPDetail(): Promise<CoinDetail> {
        return await this.getCoinDetail("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }

    async coinCOLADetail(): Promise<CoinDetail> {
        return await this.getCoinDetail("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG")
    }

    async coinBTCDetail(): Promise<CoinDetail> {
        return await this.getCoinDetail("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9")
    }

    async coinETHDetail(): Promise<CoinDetail> {
        return await this.getCoinDetail("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF")
    }

    async coinSUNDetail(): Promise<CoinDetail> {
        return await this.getCoinDetail("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9")
    }

    async coinUSDTDetail(): Promise<CoinDetail> {
        return await this.getCoinDetail("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    }

    /**
     * get TRC20 token in balance
     * @param address
     * @param trc20_address
     */
    async getThirdTokenBalance(address: string, trc20_address: string): Promise<CoinDetail> {
        if (!this.isLoggedIn()) {
            throw "wallet is not login"
        }
        const contract = await this.NewToken(trc20_address)
        if (!this.tokens.hasOwnProperty(trc20_address)) {
            const a = await contract.balanceOf(address)
            const d = await contract.decimals()
            const s = await contract.symbol()
            const name = await contract.name()
            const detail = new CoinDetail(trc20_address, d, s, name)
            detail.setHolder(address, a)
            this.tokens[trc20_address] = detail
        } else {
            const apbalance = await contract.balanceOf(address)
            this.tokens[trc20_address].setHolder(address, txtUnit(apbalance))
        }

        // @ts-ignore
        return this.tokens[trc20_address];
    }

    async getThirdTokenBalanceSun(address: string, trc20_address: string): Promise<number> {
        const conver = await this.getThirdTokenBalance(address, trc20_address)
        return conver.bySun(address)
    }

    async getThirdTokenBalanceFloat(address: string, trc20_address: string): Promise<number> {
        const conver = await this.getThirdTokenBalance(address, trc20_address)
        return conver.byFloat(address)
    }

    /**
     * to approve prespending TRC20 token on the go..
     * @param trc20_address
     * @param spender_address
     * @param amount_sun
     * @constructor
     */
    async ApproveSpendingToken(trc20_address: string, spender_address: string, amount_sun: number): Promise<boolean> {
        const token = await this.NewToken(trc20_address)
        return await token.approve(spender_address, String(amount_sun))
    }

    async NewToken(trc20_address: string): Promise<TokenTrc20> {
        const contract = new TokenTrc20(this.ethereumCore)
        contract.setDebug(false)
        await contract.init(trc20_address)
        return contract
    }

    getListedCoins(): AccorToken {
        return this.tokens
    }

    explainTrc20(payload: TronTRC20Token): number {
        const me = this.getAccountAddress()
        return payload.holder[me]
    }

    setCallbackFunctionCall(function_selector: string, caller: TronLinkEventCaller) {
        this.selected_function_human_operation = function_selector
        this.selected_function_caller = caller
    }

    __signOp(payload: TronLinkTunnelMessage): boolean {
        if (this.selected_function_human_operation == payload.data.input.function_selector) {
            this.selected_function_caller.signer(payload)
            return true
        } else {
            return false
        }
    }

    __signReply(payload: TronLinkTabReply): boolean {
        if (this.selected_function_caller != undefined && this.selected_function_human_operation != "") {
            this.selected_function_caller.reply(payload)
            this.selected_function_human_operation = ""
            return true
        } else {
            return false
        }
    }

    __debugMessage(data_message_raw: any): boolean {
        if (this.selected_function_caller) {
            this.selected_function_caller.debug(data_message_raw)
            return true
        } else {
            return false
        }
    }

    eventListener(message: any, vueInstance: Vue) {


    }

    setErrorHandler(errHand): void {
        this.errorHandler = errHand
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
