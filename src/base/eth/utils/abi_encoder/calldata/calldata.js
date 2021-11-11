import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { constants } from '../utils/constants';
import { stripHexPrefix } from '../../../utils/hex_utils';
import { PointerCalldataBlock } from './blocks/pointer';
import { SetCalldataBlock } from './blocks/set';
import { CalldataIterator, ReverseCalldataIterator } from './iterator';
export class Calldata {
    constructor(rules) {
        this._rules = rules;
        this._selector = '';
        this._root = undefined;
    }
    setRoot(block) {
        this._root = block;
    }
    setSelector(selector) {
        if (!_.startsWith(selector, '0x')) {
            throw new Error(`Expected selector to be hex. Missing prefix '0x'`);
        }
        else if (selector.length !== constants.HEX_SELECTOR_LENGTH_IN_CHARS) {
            throw new Error(`Invalid selector '${selector}'`);
        }
        this._selector = selector;
    }
    toString() {
        if (this._root === undefined) {
            throw new Error('expected root');
        }
        if (this._rules.shouldOptimize) {
            this._optimize();
        }
        const iterator = new CalldataIterator(this._root);
        let offset = 0;
        for (const block of iterator) {
            block.setOffset(offset);
            offset += block.getSizeInBytes();
        }
        const hexString = this._rules.shouldAnnotate
            ? this._toHumanReadableCallData()
            : this._toEvmCompatibeCallDataHex();
        return hexString;
    }
    _optimize() {
        if (this._root === undefined) {
            throw new Error('expected root');
        }
        const iterator = new ReverseCalldataIterator(this._root);
        const blocksByHash = {};
        for (const block of iterator) {
            if (block instanceof PointerCalldataBlock) {
                const dependencyBlockHashBuf = block.getDependency().computeHash();
                const dependencyBlockHash = ethUtil.bufferToHex(dependencyBlockHashBuf);
                if (dependencyBlockHash in blocksByHash) {
                    const blockWithSameHash = blocksByHash[dependencyBlockHash];
                    if (blockWithSameHash !== block.getDependency()) {
                        block.setAlias(blockWithSameHash);
                    }
                }
                continue;
            }
            const blockHashBuf = block.computeHash();
            const blockHash = ethUtil.bufferToHex(blockHashBuf);
            if (!(blockHash in blocksByHash)) {
                blocksByHash[blockHash] = block;
            }
        }
    }
    _toEvmCompatibeCallDataHex() {
        if (this._root === undefined) {
            throw new Error('expected root');
        }
        const selectorBuffer = ethUtil.toBuffer(this._selector || '0x');
        const valueBufs = [selectorBuffer];
        const iterator = new CalldataIterator(this._root);
        for (const block of iterator) {
            valueBufs.push(block.toBuffer());
        }
        const combinedBuffers = Buffer.concat(valueBufs);
        const hexValue = ethUtil.bufferToHex(combinedBuffers);
        return hexValue;
    }
    _toHumanReadableCallData() {
        if (this._root === undefined) {
            throw new Error('expected root');
        }
        const offsetPadding = 10;
        const valuePadding = 74;
        const namePadding = 80;
        const evmWordStartIndex = 0;
        const emptySize = 0;
        let hexValue = `${this._selector}`;
        let offset = 0;
        const functionName = this._root.getName();
        const iterator = new CalldataIterator(this._root);
        for (const block of iterator) {
            const size = block.getSizeInBytes();
            const name = block.getName();
            const parentName = block.getParentName();
            const prettyName = name.replace(`${parentName}.`, '').replace(`${functionName}.`, '');
            let offsetStr = '';
            let valueStr = '';
            let nameStr = '';
            let lineStr = '';
            if (size === emptySize) {
                offsetStr = ' '.repeat(offsetPadding);
                valueStr = ' '.repeat(valuePadding);
                nameStr = `### ${prettyName.padEnd(namePadding)}`;
                lineStr = `\n${offsetStr}${valueStr}${nameStr}`;
            }
            else {
                offsetStr = `0x${offset.toString(constants.HEX_BASE)}`.padEnd(offsetPadding);
                valueStr = stripHexPrefix(ethUtil.bufferToHex(block.toBuffer().slice(evmWordStartIndex, constants.EVM_WORD_WIDTH_IN_BYTES)))
                    .padEnd(valuePadding);
                if (block instanceof SetCalldataBlock) {
                    nameStr = `### ${prettyName.padEnd(namePadding)}`;
                    lineStr = `\n${offsetStr}${valueStr}${nameStr}`;
                }
                else {
                    nameStr = `    ${prettyName.padEnd(namePadding)}`;
                    lineStr = `${offsetStr}${valueStr}${nameStr}`;
                }
            }
            for (let j = constants.EVM_WORD_WIDTH_IN_BYTES; j < size; j += constants.EVM_WORD_WIDTH_IN_BYTES) {
                offsetStr = `0x${(offset + j).toString(constants.HEX_BASE)}`.padEnd(offsetPadding);
                valueStr = stripHexPrefix(ethUtil.bufferToHex(block.toBuffer().slice(j, j + constants.EVM_WORD_WIDTH_IN_BYTES)))
                    .padEnd(valuePadding);
                nameStr = ' '.repeat(namePadding);
                lineStr = `${lineStr}\n${offsetStr}${valueStr}${nameStr}`;
            }
            hexValue = `${hexValue}\n${lineStr}`;
            offset += size;
        }
        return hexValue;
    }
}
//# sourceMappingURL=calldata.js.map