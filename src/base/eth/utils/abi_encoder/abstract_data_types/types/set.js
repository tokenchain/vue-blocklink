import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { BigNumber } from '../../../configured_bignumber';
import { SetCalldataBlock } from '../../calldata/blocks/set';
import { constants } from '../../utils/constants';
import { DataType } from '../data_type';
import { AbstractPointerDataType } from './pointer';
export class AbstractSetDataType extends DataType {
    constructor(dataItem, factory, isArray = false, arrayLength, arrayElementType) {
        super(dataItem, factory);
        this._memberIndexByName = {};
        this._members = [];
        this._isArray = isArray;
        this._arrayLength = arrayLength;
        this._arrayElementType = arrayElementType;
        if (isArray && arrayLength !== undefined) {
            [this._members, this._memberIndexByName] = this._createMembersWithLength(dataItem, arrayLength);
        }
        else if (!isArray) {
            [this._members, this._memberIndexByName] = this._createMembersWithKeys(dataItem);
        }
    }
    generateCalldataBlock(value, parentBlock) {
        const block = Array.isArray(value)
            ? this._generateCalldataBlockFromArray(value, parentBlock)
            : this._generateCalldataBlockFromObject(value, parentBlock);
        return block;
    }
    generateValue(calldata, rules) {
        let members = this._members;
        if (this._isArray && this._arrayLength === undefined) {
            const arrayLengthBuf = calldata.popWord();
            const arrayLengthHex = ethUtil.bufferToHex(arrayLengthBuf);
            const arrayLength = new BigNumber(arrayLengthHex, constants.HEX_BASE);
            [members] = this._createMembersWithLength(this.getDataItem(), arrayLength.toNumber());
        }
        calldata.startScope();
        let value;
        if (rules.shouldConvertStructsToObjects && !this._isArray) {
            value = {};
            _.each(this._memberIndexByName, (idx, key) => {
                const member = this._members[idx];
                const memberValue = member.generateValue(calldata, rules);
                value[key] = memberValue;
            });
        }
        else {
            value = [];
            _.each(members, (member, idx) => {
                const memberValue = member.generateValue(calldata, rules);
                value.push(memberValue);
            });
        }
        calldata.endScope();
        return value;
    }
    isStatic() {
        if (this._isArray && this._arrayLength === undefined) {
            return false;
        }
        const dependentMember = _.find(this._members, (member) => {
            return member instanceof AbstractPointerDataType;
        });
        const isStatic = dependentMember === undefined;
        return isStatic;
    }
    getDefaultValue(rules) {
        let defaultValue;
        if (this._isArray && this._arrayLength === undefined) {
            defaultValue = [];
        }
        else if (rules !== undefined && rules.shouldConvertStructsToObjects && !this._isArray) {
            defaultValue = {};
            _.each(this._memberIndexByName, (idx, key) => {
                const member = this._members[idx];
                const memberValue = member.getDefaultValue();
                defaultValue[key] = memberValue;
            });
        }
        else {
            defaultValue = [];
            _.each(this._members, (member, idx) => {
                const memberValue = member.getDefaultValue();
                defaultValue.push(memberValue);
            });
        }
        return defaultValue;
    }
    _generateCalldataBlockFromArray(value, parentBlock) {
        if (this._arrayLength !== undefined && value.length !== this._arrayLength) {
            throw new Error(`Expected array of ${JSON.stringify(this._arrayLength)} elements, but got array of length ${JSON.stringify(value.length)}`);
        }
        const parentName = parentBlock === undefined ? '' : parentBlock.getName();
        const block = new SetCalldataBlock(this.getDataItem().name, this.getSignature(), parentName);
        let members = this._members;
        if (this._isArray && this._arrayLength === undefined) {
            [members] = this._createMembersWithLength(this.getDataItem(), value.length);
            const lenBuf = ethUtil.setLengthLeft(ethUtil.toBuffer(`0x${value.length.toString(constants.HEX_BASE)}`), constants.EVM_WORD_WIDTH_IN_BYTES);
            block.setHeader(lenBuf);
        }
        const memberCalldataBlocks = [];
        _.each(members, (member, idx) => {
            const memberBlock = member.generateCalldataBlock(value[idx], block);
            memberCalldataBlocks.push(memberBlock);
        });
        block.setMembers(memberCalldataBlocks);
        return block;
    }
    _generateCalldataBlockFromObject(obj, parentBlock) {
        const parentName = parentBlock === undefined ? '' : parentBlock.getName();
        const block = new SetCalldataBlock(this.getDataItem().name, this.getSignature(), parentName);
        const memberCalldataBlocks = [];
        _.forEach(this._memberIndexByName, (memberIndex, memberName) => {
            if (!(memberName in obj)) {
                throw new Error(`Could not assign tuple to object: missing key '${memberName}' in object ${JSON.stringify(obj)}`);
            }
            const memberValue = obj[memberName];
            const memberBlock = this._members[memberIndex].generateCalldataBlock(memberValue, block);
            memberCalldataBlocks.push(memberBlock);
        });
        block.setMembers(memberCalldataBlocks);
        return block;
    }
    _computeSignatureOfMembers(isDetailed) {
        let signature = `(`;
        _.each(this._members, (member, i) => {
            signature += member.getSignature(isDetailed);
            if (i < this._members.length - 1) {
                signature += ',';
            }
        });
        signature += ')';
        return signature;
    }
    _createMembersWithKeys(dataItem) {
        if (dataItem.components === undefined) {
            throw new Error(`Tried to create a set using key/value pairs, but no components were defined by the input DataItem '${dataItem.name}'.`);
        }
        const members = [];
        const memberIndexByName = {};
        const memberNames = [];
        _.each(dataItem.components, (memberItem) => {
            let memberName = memberItem.name;
            let nameIdx = 0;
            while (_.includes(memberNames, memberName) || _.isEmpty(memberName)) {
                nameIdx++;
                memberName = `${memberItem.name}_${nameIdx}`;
            }
            memberNames.push(memberName);
            const childDataItem = {
                type: memberItem.type,
                name: `${dataItem.name}.${memberName}`,
            };
            const components = memberItem.components;
            if (components !== undefined) {
                childDataItem.components = components;
            }
            const child = this.getFactory().create(childDataItem, this);
            memberIndexByName[memberName] = members.length;
            members.push(child);
        });
        return [members, memberIndexByName];
    }
    _createMembersWithLength(dataItem, length) {
        const members = [];
        const memberIndexByName = {};
        const range = _.range(length);
        _.each(range, (idx) => {
            const memberDataItem = {
                type: this._arrayElementType === undefined ? '' : this._arrayElementType,
                name: `${dataItem.name}[${idx.toString(constants.DEC_BASE)}]`,
            };
            const components = dataItem.components;
            if (components !== undefined) {
                memberDataItem.components = components;
            }
            const memberType = this.getFactory().create(memberDataItem, this);
            memberIndexByName[idx.toString(constants.DEC_BASE)] = members.length;
            members.push(memberType);
        });
        return [members, memberIndexByName];
    }
}
