import {Balancer, TronTRC20Token} from "../base/tron/types";

export default class CoinDetail implements TronTRC20Token {
    address: string;
    decimal: number;
    holder: Balancer;

    constructor(address: string, dec: number) {
        this.address = address
        this.decimal = dec
        this.holder = {}
    }

    setHolder(address: string, bal: number) {
        if (this.holder.hasOwnProperty(address)) {
            this.holder[address] = bal
        } else {
            this.holder[address] = bal
        }
    }

    bySun(address: string): number {
        return this.holder[address]
    }

    byFloat(address: string): number {
        return this.holder[address] / this.decimal
    }
}
