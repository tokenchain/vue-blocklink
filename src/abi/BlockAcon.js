import { Address } from "../base/Address";
import { TokenTrc20 } from "./TokenTrc20";
import { txtUnit } from "./../utils/bnx";
import CoinDetail from "./CoinDetail";
export default class BlockAcon {
    constructor(tronWeb) {
        this.tronWeb = tronWeb;
        this.tokens = {};
        this.selected_function_human_operation = "";
    }
    isInstalled() {
        return !!this.tronWeb;
    }
    isLoggedIn() {
        return this.tronWeb && this.tronWeb.ready;
    }
    isUnlocked() {
        return this.isLoggedIn();
    }
    getAccountAddress() {
        return this.tronWeb.defaultAddress.base58;
    }
    getAccountAddressHex() {
        return this.tronWeb.defaultAddress.hex;
    }
    getAccountAddress0x() {
        return "0x" + this.getAccountAddressHex().substr(2);
    }
    NewContract(abi = [], address = false) {
        return new this.tronWeb.Contract(this.tronWeb, abi, address);
    }
    removeAllFunctionCalls() {
        this.selected_function_human_operation = "";
    }
    convertAddress(address, fromFormat, toFormat) {
        if (fromFormat == toFormat) {
            throw "From and To address formats are equal";
        }
        switch (toFormat) {
            case "hex":
                switch (fromFormat) {
                    case "base58":
                    case "tron":
                    case "trx":
                        return "0x" + this.tronWeb.address.toHex(address);
                }
                break;
            case "base58":
            case "tron":
            case "trx":
                switch (fromFormat) {
                    case "hex":
                        if (!Address.isHexAddress(address)) {
                            throw "Invalid hex address";
                        }
                        if (address.startsWith("0x")) {
                            address = address.substr(2);
                        }
                        return this.tronWeb.address.fromHex(address);
                }
                break;
        }
        throw "Invalid address formats";
    }
    async getCoinPlatform() {
        let wallet_trx_coin = 0;
        wallet_trx_coin = await this.tronWeb.trx.getBalance(this.getAccountAddress());
        return wallet_trx_coin;
    }
    getCoinTRX(cb, cberr) {
        this.tronWeb.trx.getBalance(this.getAccountAddress(), (err, x) => {
            if (err == null) {
                cb(x);
            }
            else {
                cberr(err);
            }
        });
    }
    async getCoin(trc20_coin) {
        return await this.getThirdTokenBalanceSun(this.getAccountAddress(), trc20_coin);
    }
    async getCoinFlo(trc20_coin) {
        return await this.getThirdTokenBalanceFloat(this.getAccountAddress(), trc20_coin);
    }
    async coinDPFlo() {
        return await this.getCoinFlo("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
    }
    async coinCOLAFlo() {
        return await this.getCoinFlo("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG");
    }
    async coinBTCFlo() {
        return await this.getCoinFlo("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9");
    }
    async coinETHFlo() {
        return await this.getCoinFlo("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF");
    }
    async coinSUNFlo() {
        return await this.getCoinFlo("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9");
    }
    async coinUSDTFlo() {
        return await this.getCoinFlo("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
    }
    async coinDP() {
        return await this.getCoin("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
    }
    async coinCOLA() {
        return await this.getCoin("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG");
    }
    async coinBTC() {
        return await this.getCoin("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9");
    }
    async coinETH() {
        return await this.getCoin("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF");
    }
    async coinSUN() {
        return await this.getCoin("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9");
    }
    async coinUSDT() {
        return await this.getCoin("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
    }
    async getCoinDetail(trc20_coin) {
        return await this.getThirdTokenBalance(this.getAccountAddress(), trc20_coin);
    }
    async coinDPDetail() {
        return await this.getCoinDetail("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
    }
    async coinCOLADetail() {
        return await this.getCoinDetail("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG");
    }
    async coinBTCDetail() {
        return await this.getCoinDetail("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9");
    }
    async coinETHDetail() {
        return await this.getCoinDetail("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF");
    }
    async coinSUNDetail() {
        return await this.getCoinDetail("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9");
    }
    async coinUSDTDetail() {
        return await this.getCoinDetail("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
    }
    async getThirdTokenBalance(address, trc20_address) {
        if (!this.isLoggedIn()) {
            throw "wallet is not login";
        }
        const contract = await this.NewToken(trc20_address);
        if (!this.tokens.hasOwnProperty(trc20_address)) {
            const a = await contract.balanceOf(address);
            const d = await contract.decimals();
            const detail = new CoinDetail(trc20_address, d);
            detail.setHolder(address, a);
            this.tokens[trc20_address] = detail;
        }
        else {
            const apbalance = await contract.balanceOf(address);
            this.tokens[trc20_address].setHolder(address, txtUnit(apbalance));
        }
        return this.tokens[trc20_address];
    }
    async getThirdTokenBalanceSun(address, trc20_address) {
        const conver = await this.getThirdTokenBalance(address, trc20_address);
        return conver.bySun(address);
    }
    async getThirdTokenBalanceFloat(address, trc20_address) {
        const conver = await this.getThirdTokenBalance(address, trc20_address);
        return conver.byFloat(address);
    }
    async ApproveSpendingToken(trc20_address, spender_address, amount_sun) {
        const token = await this.NewToken(trc20_address);
        return await token.approve(spender_address, String(amount_sun));
    }
    async NewToken(trc20_address) {
        const contract = new TokenTrc20(this.tronWeb);
        contract.setDebug(false);
        await contract.init(trc20_address);
        return contract;
    }
    getListedCoins() {
        return this.tokens;
    }
    explainTrc20(payload) {
        const me = this.getAccountAddress();
        return payload.holder[me];
    }
    setCallbackFunctionCall(function_selector, caller) {
        this.selected_function_human_operation = function_selector;
        this.selected_function_caller = caller;
    }
    __signOp(payload) {
        if (this.selected_function_human_operation == payload.data.input.function_selector) {
            this.selected_function_caller.signer(payload);
            return true;
        }
        else {
            return false;
        }
    }
    __signReply(payload) {
        if (this.selected_function_caller != undefined && this.selected_function_human_operation != "") {
            this.selected_function_caller.reply(payload);
            this.selected_function_human_operation = "";
            return true;
        }
        else {
            return false;
        }
    }
    __debugMessage(data_message_raw) {
        if (this.selected_function_caller) {
            this.selected_function_caller.debug(data_message_raw);
            return true;
        }
        else {
            return false;
        }
    }
    eventListener(message, vueInstance) {
    }
}
