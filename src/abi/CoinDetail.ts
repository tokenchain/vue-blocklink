import {Balancer, Spending, TronTRC20Token, Unlimited} from "../base/tron/types";

export default class CoinDetail implements TronTRC20Token {
    address: string;
    decimal: number;
    tokenName: string;
    tokenSymbol: string;
    holder: Balancer;
    spender: Spending;
    unlimited: Unlimited;

    constructor(address: string, dec: number, sym: string, name: string) {
        this.address = address
        this.decimal = dec
        this.tokenName = name
        this.tokenSymbol = sym
        this.unlimited = {}
        this.holder = {}
        this.spender = {}
    }

    setHolder(address: string, bal: number) {
        if (this.holder.hasOwnProperty(address)) {
            this.holder[address] = bal
        } else {
            this.holder[address] = bal
        }
    }

    setSpenderAllowed(coin_owner: string, spender: string, isAll: boolean) {
        this._setDeep(this.unlimited, [coin_owner, spender], isAll)
    }

    setSpender(coin_owner: string, spender: string, allowance: number) {
        this._setDeep(this.spender, [coin_owner, spender], allowance)
    }

    name(): string {
        return this.tokenName
    }

    symbol(): string {
        return this.tokenSymbol
    }

    bySun(address: string): number {
        return this.holder[address]
    }

    byFloat(address: string): number {
        return this.holder[address] / this.decimal
    }

    showAllowance(coin_owner: string, spender: string): number {
        if (this.spender.hasOwnProperty(coin_owner)) {
            if (this.spender[coin_owner].hasOwnProperty(spender)) {
                return this.spender[coin_owner][spender]
            }
        }
        return 0
    }

    showAllowed(coin_owner: string, spender: string): boolean {
        if (this.unlimited.hasOwnProperty(coin_owner)) {
            if (this.unlimited[coin_owner].hasOwnProperty(spender)) {
                return this.unlimited[coin_owner][spender]
            }
        }
        return false
    }


    /**
     * Dynamically sets a deeply nested value in an object.
     * Optionally "bores" a path to it if its undefined.
     * @function
     * @param {!object} obj  - The object which contains the value you want to change/set.
     * @param {!array} path  - The array representation of path to the value you want to change/set.
     * @param {!mixed} value - The value you want to set it to.
     * @param {boolean} setrecursively - If true, will set value of non-existing path as well.
     */
    _setDeep(obj: object, path: any, value: number | string | boolean, setrecursively = false): boolean {
        /*       path.reduce((a, b, level) => {
                   if (setrecursively && typeof a[b] === "undefined" && level !== path.length) {
                       a[b] = {};
                       return a[b];
                   }

                   if (level === path.length) {
                       a[b] = value;
                       return value;
                   }
                   return a[b];
               }, obj);

       */
        // this is a super simple parsing, you will want to make this more complex to handle correctly any path
        // it will split by the dots at first and then simply pass along the array (on next iterations)
        let properties = Array.isArray(path) ? path : path.split(".")

        // Not yet at the last property so keep digging
        if (properties.length > 1) {
            // The property doesn't exists OR is not an object (and so we overwritte it) so we create it
            if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== "object") obj[properties[0]] = {}
            // We iterate.
            return this._setDeep(obj[properties[0]], properties.slice(1), value)
            // This is the last property - the one where to set the value
        } else {
            // We set the value to the last property
            obj[properties[0]] = value
            return true // this is the end
        }
    }

}
