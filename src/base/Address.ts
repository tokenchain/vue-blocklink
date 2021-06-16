import {keccak256} from "../utils/ethersUtils";

/**
 * Address validation functions
 * source: https://ethereum.stackexchange.com/a/1379/7804
 */

class Address {

    /**
     * Checks if the given string is an address
     *
     * @method isAddress
     * @param {String} address the given HEX adress
     * @return {Boolean}
     */
    static isHexAddress(address: string): boolean {
        if (!/^(0x)?[0-9a-f]{42}$/i.test(address)) {
            // check if it has the basic requirements of an address
            return false
        } else if (/^(0x)?[0-9a-f]{42}$/.test(address) || /^(0x)?[0-9A-F]{42}$/.test(address)) {
            // If it's all small caps or all all caps, return true
            return true
        } else {
            // Otherwise check each case
            return this.isChecksumHexAddress(address)
        }
    }

    /**
     * Checks if the given string is a checksummed address
     *
     * @method isChecksumAddress
     * @param {String} address the given HEX adress
     * @return {Boolean}
     */
    static isChecksumHexAddress(address: string): boolean {
        // Check each case
        address = address.replace("0x", "")
        const addressHash = Address.sha3(address.toLowerCase())
        for (let i = 0; i < 40; i++) {
            // the nth letter should be uppercase if the nth digit of casemap is 1
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i])
                || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                return false
            }
        }
        return true
    }


    static sha3(stringf: string, prefix = true): string {
        // @ts-ignore
        return (prefix ? '0x' : '') + keccak256(Buffer.from(stringf, 'utf-8')).toString().substring(2);
    }

}

const ADDRESS_SIZE = 34;
const ADDRESS_PREFIX = "41";
const ADDRESS_PREFIX_BYTE = 0x41;
const ADDRESS_PREFIX_REGEX = /^(41)/;
export {
    ADDRESS_SIZE,
    ADDRESS_PREFIX,
    ADDRESS_PREFIX_BYTE,
    ADDRESS_PREFIX_REGEX,
    Address
}
