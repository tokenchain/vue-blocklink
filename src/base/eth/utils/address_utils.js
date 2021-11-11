import { addHexPrefix, isValidChecksumAddress } from 'ethereumjs-util';
import * as _ from 'lodash';
import { hexUtils, stripHexPrefix } from './hex_utils';
const BASIC_ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i;
const SAME_CASE_ADDRESS_REGEX = /^(0x)?([0-9a-f]{40}|[0-9A-F]{40})$/;
const ADDRESS_LENGTH = 40;
export const addressUtils = {
    isChecksumAddress(address) {
        return isValidChecksumAddress(address);
    },
    isAddress(address) {
        if (!BASIC_ADDRESS_REGEX.test(address)) {
            return false;
        }
        else if (SAME_CASE_ADDRESS_REGEX.test(address)) {
            return true;
        }
        else {
            const isValidChecksummedAddress = addressUtils.isChecksumAddress(address);
            return isValidChecksummedAddress;
        }
    },
    padZeros(address) {
        return addHexPrefix(_.padStart(stripHexPrefix(address), ADDRESS_LENGTH, '0'));
    },
    generatePseudoRandomAddress() {
        return hexUtils.random(20);
    },
};
