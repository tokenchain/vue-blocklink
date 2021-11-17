import { Ori20Contract } from "./ori20";
import CoinDetail from "./CoinDetail";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import BN from 'bn.js';
import * as _ from "lodash";
export default class BlockWrap {
    constructor(webThree, ethereumCore) {
        this.debug = false;
        this.accounts = [];
        this.gas = 1000000;
        this.gasPrice = 21000000000;
        this.ethereumCore = ethereumCore;
        this.w3 = webThree;
        this.tokens = {};
        this.contracts = {};
    }
    setDebug(x) {
        this.debug = x;
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
        if (this.debug) {
            console.log("set account now", data);
        }
        this.accounts = _.map(data, (e) => this.w3.utils.toChecksumAddress(e));
    }
    setResource(gas, gas_price) {
        this.gas = gas;
        this.gasPrice = gas_price;
        if (this.debug) {
        }
        this._setOtherRrc(gas, gas_price);
    }
    _setOtherRrc(gas, gas_price) {
        for (let b in this.contracts) {
            this.contracts[b].setResource(gas, gas_price);
        }
    }
    haveAccounts() {
        return this.accounts.length > 0;
    }
    NewContractFallback(abi = [], address = "") {
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
        const send_amount = new BN(amount);
        await contract.transfer(toaddress, send_amount);
    }
    async approveToken(erc20_address, spender_address, amount_sun) {
        const contract = await this.NewToken(erc20_address);
        const am = this.w3.utils.toBN(amount_sun);
        await contract.approve(spender_address, am);
    }
    async approveTokenUnlimited(erc20_address, spender_address) {
        const contract = await this.NewToken(erc20_address);
        let amc = "1000000000000000000000000";
        const am = this.w3.utils.toBN(amc);
        console.log(am);
        let val = am;
        await contract.approve(spender_address, val);
    }
    async getMyTokenBalance(trc20_coin) {
        return await this.getTokenBalanceWei(this.getAccountAddress(), trc20_coin);
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
    async getMyCoinDetail(trc20_coin) {
        return await this.getCoinDetail(trc20_coin, this.getAccountAddress());
    }
    async coinExample() {
        return await this.getMyCoinDetail("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
    }
    async initCoinDetail(erc20, me) {
        const contract = await this.NewToken(erc20);
        const a = await contract.balanceOf(me);
        const d = await contract.decimals();
        const s = await contract.symbol();
        const name = await contract.name();
        const detail = new CoinDetail(erc20, d, s, name);
        detail.setHolder(me, a);
        this.tokens[erc20] = detail;
        this.contracts[erc20] = contract;
        return detail;
    }
    async getCoinDetail(erc20_address, address) {
        if (!this.isLoggedIn()) {
            throw "wallet is not login";
        }
        if (!this.tokens.hasOwnProperty(erc20_address)) {
            await this.initCoinDetail(erc20_address, address);
        }
        else {
            let contract = this.contracts[erc20_address];
            if (!contract) {
                contract = await this.NewToken(erc20_address);
                this.contracts[erc20_address] = contract;
            }
            const b = await contract.balanceOf(address);
            this.tokens[erc20_address].setHolder(address, b);
        }
        return this.tokens[erc20_address];
    }
    async getContractToken(erc20_address) {
        let contract = this.contracts[erc20_address];
        if (!contract) {
            if (this.debug) {
                console.log("new contract token ...");
            }
            contract = await this.NewToken(erc20_address);
            this.contracts[erc20_address] = contract;
        }
        return contract;
    }
    async getTokenBalanceWei(address, erc20_address) {
        if (!this.tokens.hasOwnProperty(erc20_address)) {
            const conver = await this.getCoinDetail(erc20_address, address);
            return conver.amountCode(address);
        }
        else {
            let contract = this.contracts[erc20_address];
            const b = await contract.balanceOf(address);
            this.tokens[erc20_address].setHolder(address, b);
            return b.toNumber();
        }
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
    ensureChainParameterPatch(conf) {
        const ishex = this.w3Utils().isHexStrict(conf.chainId);
        let conf2 = conf;
        if (!ishex) {
            const chainID = this.w3Utils().toHex(conf.chainId);
            conf2 = Object.assign({}, conf, {
                chainId: chainID
            });
            console.log(chainID);
        }
        console.log(conf);
        console.log(conf2);
        return conf2;
    }
    metamask_add_chain(chain_conf) {
        const conf = this.ensureChainParameterPatch(chain_conf);
        this.ethereumCore
            .request({
            method: 'wallet_addEthereumChain',
            params: [conf],
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
    async metamask_detect_chain_process_flow(conf) {
        const conf2 = this.ensureChainParameterPatch(conf);
        try {
            await this.ethereumCore.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: conf2.chainId }],
            });
        }
        catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await this.ethereumCore.request({
                        method: "wallet_addEthereumChain",
                        params: [conf2],
                    });
                }
                catch (addError) {
                    this.errorHandler(addError);
                }
            }
            else {
                this.errorHandler(switchError);
            }
        }
    }
}
