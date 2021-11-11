import * as _ from 'lodash';
import { CalldataBlock } from '../calldata_block';
export class SetCalldataBlock extends CalldataBlock {
    constructor(name, signature, parentName) {
        super(name, signature, parentName, 0, 0);
        this._members = [];
        this._header = undefined;
    }
    getRawData() {
        const rawDataComponents = [];
        if (this._header !== undefined) {
            rawDataComponents.push(this._header);
        }
        _.each(this._members, (member) => {
            const memberBuffer = member.getRawData();
            rawDataComponents.push(memberBuffer);
        });
        const rawData = Buffer.concat(rawDataComponents);
        return rawData;
    }
    setMembers(members) {
        this._members = members;
    }
    setHeader(header) {
        this._setHeaderSize(header.byteLength);
        this._header = header;
    }
    toBuffer() {
        if (this._header !== undefined) {
            return this._header;
        }
        return Buffer.from('');
    }
    getMembers() {
        return this._members;
    }
}
