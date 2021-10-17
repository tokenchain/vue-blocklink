import { BigNumber } from "bignumber.js";
import BN from 'bn.js';
export default class CoinDetail {
    constructor(address, dec, sym, name) {
        this.address = address;
        if (dec instanceof BigNumber) {
            this.decimal = dec.toNumber();
        }
        else {
            this.decimal = dec;
        }
        this.tokenName = name;
        this.tokenSymbol = sym;
        this.unlimited = {};
        this.holder = {};
        this.spender = {};
    }
    setHolder(address, bal) {
        let abal = 0;
        if (bal instanceof BigNumber) {
            abal = bal.toNumber();
        }
        else {
            abal = bal;
        }
        if (this.holder.hasOwnProperty(address)) {
            this.holder[address] = abal;
        }
        else {
            this.holder[address] = abal;
        }
    }
    async runAllowanceAmount(contract, owner_address, spender) {
        let g = await contract.allowance(owner_address, spender);
        let allowance = 0;
        if (g instanceof BigNumber) {
            allowance = g.toNumber();
        }
        else if (g instanceof BN) {
            allowance = g.toNumber();
        }
        else {
            allowance = g;
        }
        if (allowance >= 1000000000000000000000000000000000000) {
            this.setSpenderExtreme(owner_address, spender, true);
        }
        else {
            this.setSpenderNormal(owner_address, spender, allowance);
        }
    }
    setSpenderExtreme(coin_owner, spender, isAll) {
        return this._setDeep(this.unlimited, [coin_owner, spender], isAll);
    }
    setSpenderNormal(coin_owner, spender, allowance) {
        return this._setDeep(this.spender, [coin_owner, spender], allowance);
    }
    name() {
        return this.tokenName;
    }
    symbol() {
        return this.tokenSymbol;
    }
    amountCode(address) {
        return this.holder[address];
    }
    balance(address) {
        return this.amountCode(address);
    }
    byFloat(address) {
        return this.holder[address] / this.decimal;
    }
    showAllowance(coin_owner, spender) {
        if (this.spender.hasOwnProperty(coin_owner)) {
            if (this.spender[coin_owner].hasOwnProperty(spender)) {
                return this.spender[coin_owner][spender];
            }
        }
        return 0;
    }
    showAllowed(coin_owner, spender) {
        if (this.unlimited.hasOwnProperty(coin_owner)) {
            if (this.unlimited[coin_owner].hasOwnProperty(spender)) {
                return this.unlimited[coin_owner][spender];
            }
        }
        return false;
    }
    approvalStatus(coin_owner, spender) {
        const approvedAmount = this.showAllowance(coin_owner, spender);
        const isUnlimited = this.showAllowed(coin_owner, spender);
        return { approvedAmount, isUnlimited };
    }
    _setDeep(obj, path, value, setrecursively = false) {
        let properties = Array.isArray(path) ? path : path.split(".");
        if (properties.length > 1) {
            if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== "object")
                obj[properties[0]] = {};
            return this._setDeep(obj[properties[0]], properties.slice(1), value);
        }
        else {
            obj[properties[0]] = value;
            return true;
        }
    }
}
