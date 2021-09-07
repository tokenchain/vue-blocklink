import { Address } from "../base/Address";
import { Ori20Contract } from "./ori20";
import CoinDetail from "./CoinDetail";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import { BigNumber } from '../base/eth/utils';
export default class BlockWrap {
    constructor(webThree, ethereumCore) {
        this.debug = false;
        this.accounts = [];
        this.gas = 1000000;
        this.gasPrice = 20000000000;
        this.ethereumCore = ethereumCore;
        this.w3 = webThree;
        this.tokens = {};
    }
    isInstalled() {
        return this.ethereumCore.isConnected();
    }
    isLoggedIn() {
        return this.ethereumCore && this.ethereumCore.isConnected();
    }
    async isUnlocked() {
        return await this.ethereumCore._metamask.isUnlocked();
    }
    getAccountAddress() {
        return this.accounts[0];
    }
    setAccounts(data) {
        this.accounts = data;
    }
    setResource(gas, gas_price) {
        this.gas = gas;
        this.gasPrice = gas_price;
    }
    haveAccounts() {
        return this.accounts.length > 0;
    }
    NewContract(abi = [], address = "") {
        const contract = this.w3.eth.Contract;
        contract.setProvider(this.ethereumCore);
        return new contract(abi, address, {
            from: this.accounts[0],
            gasPrice: String(this.gasPrice)
        });
    }
    async sendCoin(amount, toaddress) {
        const conf = {
            value: amount,
            to: toaddress,
            gas: this.gas,
            gasPrice: this.gasPrice,
            from: this.accounts[0]
        };
        await this.w3.eth.sendTransaction(conf).on("confirmation", this.confirmHandler).catch(this.errorHandler);
    }
    async sendToken(amount, toaddress, erc20_address) {
        const contract = await this.NewToken(erc20_address);
        contract.setResource(this.gas, this.gasPrice);
        const send_amount = BigNumber.from(amount);
        console.log(send_amount);
        await contract.transfer(toaddress, send_amount);
    }
    convertAddress(address, fromFormat, toFormat) {
        if (fromFormat == toFormat) {
            throw "From and To address formats are equal";
        }
        switch (toFormat) {
            case "hex":
                switch (fromFormat) {
                    case "base58":
                    case "eth":
                        return "0x" + this.ethereumCore.address.toHex(address);
                }
                break;
            case "base58":
            case "eth":
                switch (fromFormat) {
                    case "hex":
                        if (!Address.isHexAddress(address)) {
                            throw "Invalid hex address";
                        }
                        if (address.startsWith("0x")) {
                            address = address.substr(2);
                        }
                        return this.ethereumCore.address.fromHex(address);
                }
                break;
        }
        throw "Invalid address formats";
    }
    async getCoinPlatform() {
        return await this.w3.eth.getBalance(this.getAccountAddress());
    }
    async getCoin(trc20_coin) {
        return await this.getThirdTokenBalanceSun(this.getAccountAddress(), trc20_coin);
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
    async getThirdTokenBalance(address, erc20_address) {
        if (!this.isLoggedIn()) {
            throw "wallet is not login";
        }
        const contract = await this.NewToken(erc20_address);
        console.log("contract started .. ");
        if (!this.tokens.hasOwnProperty(erc20_address)) {
            const a = await contract.balanceOf(address);
            const d = await contract.decimals();
            const s = await contract.symbol();
            const name = await contract.name();
            console.log(d);
            const detail = new CoinDetail(erc20_address, d, s, name);
            detail.setHolder(address, a);
            this.tokens[erc20_address] = detail;
        }
        else {
            const abbalance = await contract.balanceOf(address);
        }
        return this.tokens[erc20_address];
    }
    async getThirdTokenBalanceSun(address, erc20_address) {
        const conver = await this.getThirdTokenBalance(address, erc20_address);
        return conver.bySun(address);
    }
    async getThirdTokenBalanceFloat(address, erc20_address) {
        const conver = await this.getThirdTokenBalance(address, erc20_address);
        return conver.byFloat(address);
    }
    async ApproveSpendingToken(erc20_address, spender_address, amount_sun) {
        const token = await this.NewToken(erc20_address);
        return await token.approve(spender_address, BigNumber.from(amount_sun));
    }
    async NewToken(erc20_address) {
        return await Ori20Contract.init(erc20_address, this.ethereumCore, this.w3);
    }
    getListedCoins() {
        return this.tokens;
    }
    explainTrc20(payload) {
        const me = this.getAccountAddress();
        return payload.holder[me];
    }
    eventListener(message, vueInstance) {
    }
    setHandlers(confirm, boardcast, err) {
        this.errorHandler = err;
        this.boardcastHandler = boardcast;
        this.confirmHandler = confirm;
    }
    setDebug(debugx) {
        this.debug = debugx;
    }
    metamask_decrypt(encryptedMessage, account_address, callback) {
        if (!this.ethereumCore)
            return;
        this.ethereumCore
            .request({
            method: 'eth_decrypt',
            params: [encryptedMessage, account_address],
        })
            .then((decryptedMessage) => {
            if (this.debug) {
                console.log('The decrypted message is:', decryptedMessage);
            }
            callback(decryptedMessage);
        })
            .catch(this.errorHandler);
    }
    metamask_message_sign(encryptionPublicKey, message) {
        return ethUtil.bufferToHex(Buffer.from(JSON.stringify(sigUtil.encrypt(encryptionPublicKey, { data: message }, 'x25519-xsalsa20-poly1305')), 'utf8'));
    }
    metamask_add_token(token_conf) {
        this.ethereumCore
            .request({
            method: 'wallet_watchAsset',
            params: token_conf,
        })
            .then((success) => {
            if (success) {
                if (this.debug) {
                    console.log('FOO successfully added to wallet!');
                }
            }
            else {
                throw new Error('Something went wrong.');
            }
        })
            .catch(this.errorHandler);
    }
    metamask_add_chain(chain_conf) {
        this.ethereumCore
            .request({
            method: 'wallet_addEthereumChain',
            params: chain_conf,
        })
            .then((success) => {
            if (success) {
                if (this.debug) {
                    console.log('Chain is successfully added to wallet!');
                }
            }
            else {
                throw new Error('Something went wrong.');
            }
        })
            .catch(this.errorHandler);
    }
}