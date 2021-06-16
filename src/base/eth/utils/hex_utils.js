import * as crypto from 'crypto';
import * as ethUtil from 'ethereumjs-util';
import { BigNumber } from './configured_bignumber';
const WORD_LENGTH = 32;
const WORD_CEIL = new BigNumber(2).pow(WORD_LENGTH * 8);
export const hexUtils = {
    concat,
    random,
    leftPad,
    rightPad,
    invert,
    slice,
    hash,
    size,
    toHex,
    isHex,
};
function concat(...args) {
    return ethUtil.bufferToHex(Buffer.concat(args.map(h => ethUtil.toBuffer(h))));
}
function random(_size = WORD_LENGTH) {
    return ethUtil.bufferToHex(crypto.randomBytes(_size));
}
function leftPad(n, _size = WORD_LENGTH) {
    return ethUtil.bufferToHex(ethUtil.setLengthLeft(ethUtil.toBuffer(hexUtils.toHex(n)), _size));
}
function rightPad(n, _size = WORD_LENGTH) {
    return ethUtil.bufferToHex(ethUtil.setLengthRight(ethUtil.toBuffer(hexUtils.toHex(n)), _size));
}
function invert(n, _size = WORD_LENGTH) {
    const buf = ethUtil.setLengthLeft(ethUtil.toBuffer(hexUtils.toHex(n)), _size);
    return ethUtil.bufferToHex(Buffer.from(buf.map(b => ~b)));
}
function slice(n, start, end) {
    const hex = hexUtils.toHex(n).substr(2);
    const sliceStart = start >= 0 ? start * 2 : Math.max(0, hex.length + start * 2);
    let sliceEnd = hex.length;
    if (end !== undefined) {
        sliceEnd = end >= 0 ? end * 2 : Math.max(0, hex.length + end * 2);
    }
    return '0x'.concat(hex.substring(sliceStart, sliceEnd));
}
function hash(n) {
    return ethUtil.bufferToHex(ethUtil.keccak256(ethUtil.toBuffer(hexUtils.toHex(n))));
}
function size(hex) {
    return Math.ceil((hex.length - 2) / 2);
}
function toHex(n, _size = WORD_LENGTH) {
    if (Buffer.isBuffer(n)) {
        return `0x${n.toString('hex')}`;
    }
    if (typeof n === 'string' && /^0x[0-9a-f]+$/i.test(n)) {
        return n;
    }
    let _n = new BigNumber(n);
    if (_n.isNegative()) {
        _n = new BigNumber(invert(toHex(_n.abs()), _size).substr(2), 16).plus(1).mod(WORD_CEIL);
    }
    return `0x${_n.toString(16)}`;
}
function isHex(s) {
    return /^0x[0-9a-f]+$/i.test(s);
}
export function isHexPrefixed(str) {
    if (typeof str !== 'string') {
        throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
    }
    return str.slice(0, 2) === '0x';
}
export function stripHexPrefix(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return isHexPrefixed(str) ? str.slice(2) : str;
}
