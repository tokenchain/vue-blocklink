import { keccak256 } from "../utils/ethersUtils";
class Address {
    static isHexAddress(address) {
        if (!/^(0x)?[0-9a-f]{42}$/i.test(address)) {
            return false;
        }
        else if (/^(0x)?[0-9a-f]{42}$/.test(address) || /^(0x)?[0-9A-F]{42}$/.test(address)) {
            return true;
        }
        else {
            return this.isChecksumHexAddress(address);
        }
    }
    static isChecksumHexAddress(address) {
        address = address.replace("0x", "");
        const addressHash = Address.sha3(address.toLowerCase());
        for (let i = 0; i < 40; i++) {
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i])
                || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                return false;
            }
        }
        return true;
    }
    static sha3(stringf, prefix = true) {
        return (prefix ? '0x' : '') + keccak256(Buffer.from(stringf, 'utf-8')).toString().substring(2);
    }
}
const ADDRESS_SIZE = 34;
const ADDRESS_PREFIX = "41";
const ADDRESS_PREFIX_BYTE = 0x41;
const ADDRESS_PREFIX_REGEX = /^(41)/;
export { ADDRESS_SIZE, ADDRESS_PREFIX, ADDRESS_PREFIX_BYTE, ADDRESS_PREFIX_REGEX, Address };
