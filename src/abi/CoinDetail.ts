import {Balancer, Spending, Web3ERC20Token, Unlimited} from "../base/eth/types"
import {BigNumber} from "bignumber.js";
import {Ori20Contract} from "./ori20";
import BN from 'bn.js'

export default class CoinDetail implements Web3ERC20Token {
    address: string;
    decimal: number;
    tokenName: string;
    tokenSymbol: string;
    holder: Balancer;
    spender: Spending;
    unlimited: Unlimited;

    constructor(address: string, dec: any, sym: string, name: string) {
        this.address = address
        if (dec instanceof BigNumber) {
            this.decimal = dec.toNumber()
        } else {
            this.decimal = dec
        }
        this.tokenName = name
        this.tokenSymbol = sym
        this.unlimited = {}
        this.holder = {}
        this.spender = {}
    }

    public setHolder(address: string, bal: any): void {
        let abal = 0
        if (bal instanceof BigNumber) {
            abal = bal.toNumber()
        } else {
            abal = bal
        }
        if (this.holder.hasOwnProperty(address)) {
            this.holder[address] = abal
        } else {
            this.holder[address] = abal
        }
    }

    public async runAllowanceAmount(contract: Ori20Contract, owner_address: string, spender: string): Promise<void> {
        let g = await contract.allowance(owner_address, spender);
        let allowance = 0
        //  const actual = allowance.toNumber()
        if (g instanceof BigNumber) {
            allowance = g.toNumber()
        } else if (g instanceof BN) {
            allowance = g.toNumber()
        } else {
            allowance = g
        }
        if (allowance >= 1000000000000000000000000000000000000) {
            this.setSpenderExtreme(owner_address, spender, true)
        } else {
            this.setSpenderNormal(owner_address, spender, allowance);
        }
    }

    public setSpenderExtreme(coin_owner: string, spender: string, isAll: boolean): boolean {
        return this._setDeep(this.unlimited, [coin_owner, spender], isAll)
    }

    public setSpenderNormal(coin_owner: string, spender: string, allowance: number): boolean {
        return this._setDeep(this.spender, [coin_owner, spender], allowance)
    }

    public name(): string {
        return this.tokenName
    }

    public symbol(): string {
        return this.tokenSymbol
    }

    public amountCode(address: string): number {
        return this.holder[address]
    }

    public balance(address: string): number {
        return this.amountCode(address)
    }

    public byFloat(address: string): number {
        return this.holder[address] / this.decimal
    }

    public showAllowance(coin_owner: string, spender: string): number {
        if (this.spender.hasOwnProperty(coin_owner)) {
            if (this.spender[coin_owner].hasOwnProperty(spender)) {
                return this.spender[coin_owner][spender]
            }
        }
        return 0
    }

    public showAllowed(coin_owner: string, spender: string): boolean {
        if (this.unlimited.hasOwnProperty(coin_owner)) {
            if (this.unlimited[coin_owner].hasOwnProperty(spender)) {
                return this.unlimited[coin_owner][spender]
            }
        }
        return false
    }

    public approvalStatus(coin_owner: string, spender: string): any {
        const approvedAmount = this.showAllowance(coin_owner, spender)
        const isUnlimited = this.showAllowed(coin_owner, spender)
        return {approvedAmount, isUnlimited}
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
    private _setDeep(obj: object, path: any, value: number | string | boolean, setrecursively = false): boolean {
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
