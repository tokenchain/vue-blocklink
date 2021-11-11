import * as _ from 'lodash';
import { generateDataItemFromSignature } from './utils/signature_parser';
import { AddressDataType } from './evm_data_types/address';
import { ArrayDataType } from './evm_data_types/array';
import { BoolDataType } from './evm_data_types/bool';
import { DynamicBytesDataType } from './evm_data_types/dynamic_bytes';
import { IntDataType } from './evm_data_types/int';
import { MethodDataType } from './evm_data_types/method';
import { PointerDataType } from './evm_data_types/pointer';
import { StaticBytesDataType } from './evm_data_types/static_bytes';
import { StringDataType } from './evm_data_types/string';
import { TupleDataType } from './evm_data_types/tuple';
import { UIntDataType } from './evm_data_types/uint';
export class Address extends AddressDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class Bool extends BoolDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class Int extends IntDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class UInt extends UIntDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class StaticBytes extends StaticBytesDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class DynamicBytes extends DynamicBytesDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class String extends StringDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class Pointer extends PointerDataType {
    constructor(destDataType, parentDataType) {
        super(destDataType, parentDataType, EvmDataTypeFactory.getInstance());
    }
}
export class Tuple extends TupleDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class Array extends ArrayDataType {
    constructor(dataItem) {
        super(dataItem, EvmDataTypeFactory.getInstance());
    }
}
export class Method extends MethodDataType {
    constructor(abi) {
        super(abi, EvmDataTypeFactory.getInstance());
    }
}
export class EvmDataTypeFactory {
    constructor() {
    }
    static getInstance() {
        if (!EvmDataTypeFactory._instance) {
            EvmDataTypeFactory._instance = new EvmDataTypeFactory();
        }
        return EvmDataTypeFactory._instance;
    }
    create(dataItem, parentDataType) {
        let dataType;
        if (Array.matchType(dataItem.type)) {
            dataType = new Array(dataItem);
        }
        else if (Address.matchType(dataItem.type)) {
            dataType = new Address(dataItem);
        }
        else if (Bool.matchType(dataItem.type)) {
            dataType = new Bool(dataItem);
        }
        else if (Int.matchType(dataItem.type)) {
            dataType = new Int(dataItem);
        }
        else if (UInt.matchType(dataItem.type)) {
            dataType = new UInt(dataItem);
        }
        else if (StaticBytes.matchType(dataItem.type)) {
            dataType = new StaticBytes(dataItem);
        }
        else if (Tuple.matchType(dataItem.type)) {
            dataType = new Tuple(dataItem);
        }
        else if (DynamicBytes.matchType(dataItem.type)) {
            dataType = new DynamicBytes(dataItem);
        }
        else if (String.matchType(dataItem.type)) {
            dataType = new String(dataItem);
        }
        if (dataType === undefined) {
            throw new Error(`Unrecognized data type: '${dataItem.type}'`);
        }
        else if (parentDataType !== undefined && !dataType.isStatic()) {
            const pointerToDataType = new Pointer(dataType, parentDataType);
            return pointerToDataType;
        }
        return dataType;
    }
}
export function create(input) {
    const dataItem = consolidateDataItemsIntoSingle(input);
    const dataType = EvmDataTypeFactory.getInstance().create(dataItem);
    return dataType;
}
function consolidateDataItemsIntoSingle(input) {
    let dataItem;
    if (_.isArray(input)) {
        const dataItems = input;
        dataItem = {
            name: '',
            type: 'tuple',
            components: dataItems,
        };
    }
    else {
        dataItem = _.isString(input) ? generateDataItemFromSignature(input) : input;
    }
    return dataItem;
}
export function createMethod(methodName, input, output) {
    const methodInput = input === undefined ? [] : consolidateDataItemsIntoArray(input);
    const methodOutput = output === undefined ? [] : consolidateDataItemsIntoArray(output);
    const methodAbi = {
        name: methodName,
        inputs: methodInput,
        outputs: methodOutput,
        type: 'function',
        constant: false,
        payable: false,
        stateMutability: 'nonpayable',
    };
    const dataType = new Method(methodAbi);
    return dataType;
}
function consolidateDataItemsIntoArray(input) {
    let dataItems;
    if (_.isArray(input) && _.isEmpty(input)) {
        dataItems = [];
    }
    else if (_.isArray(input) && _.isString(input[0])) {
        dataItems = [];
        _.each(input, (signature) => {
            const dataItem = generateDataItemFromSignature(signature);
            dataItems.push(dataItem);
        });
    }
    else if (_.isArray(input)) {
        dataItems = input;
    }
    else if (typeof input === 'string') {
        const dataItem = generateDataItemFromSignature(input);
        dataItems = [dataItem];
    }
    else {
        dataItems = [input];
    }
    return dataItems;
}
