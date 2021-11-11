import { CalldataBlock } from '../calldata_block';
export class BlobCalldataBlock extends CalldataBlock {
    constructor(name, signature, parentName, blob) {
        const headerSizeInBytes = 0;
        const bodySizeInBytes = blob.byteLength;
        super(name, signature, parentName, headerSizeInBytes, bodySizeInBytes);
        this._blob = blob;
    }
    toBuffer() {
        return this._blob;
    }
    getRawData() {
        return this._blob;
    }
}
//# sourceMappingURL=blob.js.map