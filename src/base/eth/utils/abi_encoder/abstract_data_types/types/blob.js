import { BlobCalldataBlock } from '../../calldata/blocks/blob';
import { DataType } from '../data_type';
export class AbstractBlobDataType extends DataType {
    constructor(dataItem, factory, sizeKnownAtCompileTime) {
        super(dataItem, factory);
        this._sizeKnownAtCompileTime = sizeKnownAtCompileTime;
    }
    generateCalldataBlock(value, parentBlock) {
        const encodedValue = this.encodeValue(value);
        const name = this.getDataItem().name;
        const signature = this.getSignature();
        const parentName = parentBlock === undefined ? '' : parentBlock.getName();
        const block = new BlobCalldataBlock(name, signature, parentName, encodedValue);
        return block;
    }
    generateValue(calldata, rules) {
        const value = this.decodeValue(calldata);
        return value;
    }
    isStatic() {
        return this._sizeKnownAtCompileTime;
    }
}
