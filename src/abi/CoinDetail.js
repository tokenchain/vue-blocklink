export default class CoinDetail {
    constructor(address, dec) {
        this.address = address;
        this.decimal = dec;
        this.holder = {};
    }
    setHolder(address, bal) {
        if (this.holder.hasOwnProperty(address)) {
            this.holder[address] = bal;
        }
        else {
            this.holder[address] = bal;
        }
    }
    bySun(address) {
        return this.holder[address];
    }
    byFloat(address) {
        return this.holder[address] / this.decimal;
    }
}
