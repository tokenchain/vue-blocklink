import { Ori20Contract } from "./ori20";
import CoinDetail from "./CoinDetail";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
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
    isAddress(test) {
        return this.w3.utils.isAddress(test);
    }
    w3Utils() {
        return this.w3.utils;
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
        const send_amount = new BigNumber(amount);
        await contract.transfer(toaddress, send_amount);
    }
    keccak256(data) {
        return this.w3.utils.keccak256(data);
    }
    sha(data) {
        return this.w3.utils.soliditySha3(data);
    }
    async balance() {
        return await this.w3.eth.getBalance(this.getAccountAddress());
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
    async coinExample() {
        return await this.getCoinDetail("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
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
            const b = await contract.balanceOf(address);
            this.tokens[erc20_address].setHolder(address, b);
        }
        return this.tokens[erc20_address];
    }
    async getThirdTokenBalanceSun(address, erc20_address) {
        const conver = await this.getThirdTokenBalance(address, erc20_address);
        return conver.amountCode(address);
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
        const contr = await Ori20Contract.init(erc20_address, this.ethereumCore, this.w3);
        contr.setResource(this.gas, this.gasPrice);
        contr.setBlockLink(this);
        return contr;
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
    setHandlers(confirm, broadcast, err) {
        this.errorHandler = err;
        this.boardcastHandler = broadcast;
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
