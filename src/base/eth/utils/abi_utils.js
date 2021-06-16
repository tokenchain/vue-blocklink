import { AbiType } from '../types';
import * as _ from 'lodash';
import { BigNumber } from './configured_bignumber';
function parseEthersParams(params) {
    const names = [];
    const types = [];
    params.forEach((param) => {
        if (param.components != null) {
            let suffix = '';
            const arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) {
                suffix = param.type.substring(arrayBracket);
            }
            const result = parseEthersParams(param.components);
            names.push({ name: param.name || null, names: result.names });
            types.push(`tuple(${result.types.join(',')})${suffix}`);
        }
        else {
            names.push(param.name || null);
            types.push(param.type);
        }
    });
    return {
        names,
        types,
    };
}
function isAbiDataEqual(name_p, type, x, y) {
    if (x === undefined && y === undefined) {
        return true;
    }
    else if (x === undefined && y !== undefined) {
        return false;
    }
    else if (x !== undefined && y === undefined) {
        return false;
    }
    if (_.endsWith(type, '[]')) {
        if (x.length !== y.length) {
            return false;
        }
        const newType = _.trimEnd(type, '[]');
        for (let i = 0; i < x.length; i++) {
            if (!isAbiDataEqual(name_p, newType, x[i], y[i])) {
                return false;
            }
        }
        return true;
    }
    if (_.startsWith(type, 'tuple(')) {
        if (_.isString(name_p)) {
            throw new Error('Internal error: type was tuple but names was a string');
        }
        else if (name_p === null) {
            throw new Error('Internal error: type was tuple but names was null');
        }
        const types = splitTupleTypes(type);
        if (types.length !== name_p.names.length) {
            throw new Error(`Internal error: parameter types/names length mismatch (${types.length} != ${name_p.names.length})`);
        }
        for (let i = 0; i < types.length; i++) {
            const nestedName = _.isString(name_p.names[i]) ? name_p.names[i] : name_p.names[i].name_p;
            if (!isAbiDataEqual(name_p.names[i], types[i], x[nestedName], y[nestedName])) {
                return false;
            }
        }
        return true;
    }
    else if (type === 'address' || type === 'bytes') {
        return _.isEqual(_.toLower(x), _.toLower(y));
    }
    else if (_.startsWith(type, 'uint') || _.startsWith(type, 'int')) {
        return new BigNumber(x).eq(new BigNumber(y));
    }
    return _.isEqual(x, y);
}
function splitTupleTypes(type) {
    if (_.endsWith(type, '[]')) {
        throw new Error('Internal error: array types are not supported');
    }
    else if (!_.startsWith(type, 'tuple(')) {
        throw new Error(`Internal error: expected tuple type but got non-tuple type: ${type}`);
    }
    const trimmedType = type.substring('tuple('.length, type.length - 1);
    const types = [];
    let currToken = '';
    let parenCount = 0;
    for (const char of trimmedType) {
        switch (char) {
            case '(':
                parenCount += 1;
                currToken += char;
                break;
            case ')':
                parenCount -= 1;
                currToken += char;
                break;
            case ',':
                if (parenCount === 0) {
                    types.push(currToken);
                    currToken = '';
                    break;
                }
                else {
                    currToken += char;
                    break;
                }
            default:
                currToken += char;
                break;
        }
    }
    types.push(currToken);
    return types;
}
function formatABIDataItem(abi, value, formatter) {
    const trailingArrayRegex = /\[\d*\]$/;
    if (abi.type.match(trailingArrayRegex)) {
        const arrayItemType = abi.type.replace(trailingArrayRegex, '');
        return _.map(value, val => {
            const arrayItemAbi = {
                ...abi,
                type: arrayItemType,
            };
            return formatABIDataItem(arrayItemAbi, val, formatter);
        });
    }
    else if (abi.type === 'tuple') {
        const formattedTuple = {};
        _.forEach(abi.components, componentABI => {
            formattedTuple[componentABI.name] = formatABIDataItem(componentABI, value[componentABI.name], formatter);
        });
        return formattedTuple;
    }
    else {
        return formatter(abi.type, value);
    }
}
export const abiUtils = {
    parseEthersParams,
    isAbiDataEqual,
    splitTupleTypes,
    formatABIDataItem,
    parseFunctionParam(param) {
        if (param.type === 'tuple') {
            const tupleComponents = param.components;
            const paramString = _.map(tupleComponents, component => abiUtils.parseFunctionParam(component));
            const tupleParamString = `{${paramString}}`;
            return tupleParamString;
        }
        return param.type;
    },
    getFunctionSignature(methodAbi) {
        const functionName = methodAbi.name;
        const parameterTypeList = _.map(methodAbi.inputs, (param) => abiUtils.parseFunctionParam(param));
        const functionSignature = `${functionName}(${parameterTypeList})`;
        return functionSignature;
    },
    renameOverloadedMethods(inputContractAbi) {
        const contractAbi = _.cloneDeep(inputContractAbi);
        const methodAbis = contractAbi.filter((abi) => abi.type === AbiType.Function);
        const methodAbisOrdered = _.sortBy(methodAbis, [
            (methodAbi) => {
                const functionSignature = abiUtils.getFunctionSignature(methodAbi);
                return functionSignature;
            },
        ]);
        const methodAbisByName = {};
        _.each(methodAbisOrdered, methodAbi => {
            (methodAbisByName[methodAbi.name] || (methodAbisByName[methodAbi.name] = [])).push(methodAbi);
        });
        _.each(methodAbisByName, methodAbisWithSameName => {
            _.each(methodAbisWithSameName, (methodAbi, i) => {
                if (methodAbisWithSameName.length > 1) {
                    const overloadedMethodId = i + 1;
                    const sanitizedMethodName = `${methodAbi.name}${overloadedMethodId}`;
                    const indexOfExistingAbiWithSanitizedMethodNameIfExists = _.findIndex(methodAbis, currentMethodAbi => currentMethodAbi.name === sanitizedMethodName);
                    if (indexOfExistingAbiWithSanitizedMethodNameIfExists >= 0) {
                        const methodName = methodAbi.name;
                        throw new Error(`Failed to rename overloaded method '${methodName}' to '${sanitizedMethodName}'. A method with this name already exists.`);
                    }
                    methodAbi.name = sanitizedMethodName;
                }
            });
        });
        return contractAbi;
    },
};
