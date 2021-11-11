import * as ethUtil from 'ethereumjs-util';
import { PointerCalldataBlock } from '../../calldata/blocks/pointer';
import { constants } from '../../utils/constants';
import { DataType } from '../data_type';
export class AbstractPointerDataType extends DataType {
    constructor(dataItem, factory, destination, parent) {
        super(dataItem, factory);
        this._destination = destination;
        this._parent = parent;
    }
    generateCalldataBlock(value, parentBlock) {
        if (parentBlock === undefined) {
            throw new Error(`DependentDataType requires a parent block to generate its block`);
        }
        const destinationBlock = this._destination.generateCalldataBlock(value, parentBlock);
        const name = this.getDataItem().name;
        const signature = this.getSignature();
        const parentName = parentBlock.getName();
        const block = new PointerCalldataBlock(name, signature, parentName, destinationBlock, parentBlock);
        return block;
    }
    generateValue(calldata, rules) {
        const destinationOffsetBuf = calldata.popWord();
        const destinationOffsetHex = ethUtil.bufferToHex(destinationOffsetBuf);
        const destinationOffsetRelative = parseInt(destinationOffsetHex, constants.HEX_BASE);
        const destinationOffsetAbsolute = calldata.toAbsoluteOffset(destinationOffsetRelative);
        const currentOffset = calldata.getOffset();
        calldata.setOffset(destinationOffsetAbsolute);
        const value = this._destination.generateValue(calldata, rules);
        calldata.setOffset(currentOffset);
        return value;
    }
    isStatic() {
        return true;
    }
}
//# sourceMappingURL=pointer.js.map