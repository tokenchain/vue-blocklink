import { AbiType, } from '../types';
import * as ethers from 'ethers';
import * as _ from 'lodash';
import { AbiEncoder } from '.';
export class AbiDecoder {
    constructor(abiArrays) {
        this._eventIds = {};
        this._selectorToFunctionInfo = {};
        _.each(abiArrays, abi => {
            this.addABI(abi);
        });
    }
    static _getFunctionSelector(calldata) {
        const functionSelectorLength = 10;
        if (!calldata.startsWith('0x') || calldata.length < functionSelectorLength) {
            throw new Error(`Malformed calldata. Must include a hex prefix '0x' and 4-byte function selector. Got '${calldata}'`);
        }
        const functionSelector = calldata.substr(0, functionSelectorLength);
        return functionSelector;
    }
    tryToDecodeLogOrNoop(log) {
        const eventId = log.topics[0];
        const numIndexedArgs = log.topics.length - 1;
        if (this._eventIds[eventId] === undefined || this._eventIds[eventId][numIndexedArgs] === undefined) {
            return log;
        }
        const event = this._eventIds[eventId][numIndexedArgs];
        const indexedDataDecoders = _.mapValues(_.filter(event.inputs, { indexed: true }), input => AbiEncoder.create(input));
        const decodedIndexedData = _.map(log.topics.slice(1), (input, i) => indexedDataDecoders[i].decode(input));
        const decodedNonIndexedData = AbiEncoder.create(_.filter(event.inputs, { indexed: false })).decodeAsArray(log.data);
        const decodedArgs = {};
        let indexedOffset = 0;
        let nonIndexedOffset = 0;
        for (const param of event.inputs) {
            const value = param.indexed
                ? decodedIndexedData[indexedOffset++]
                : decodedNonIndexedData[nonIndexedOffset++];
            if (value === undefined) {
                return log;
            }
            decodedArgs[param.name] = value;
        }
        return {
            ...log,
            event: event.name,
            args: decodedArgs,
        };
    }
    decodeCalldataOrThrow(calldata, contractName) {
        const functionSelector = AbiDecoder._getFunctionSelector(calldata);
        const candidateFunctionInfos = this._selectorToFunctionInfo[functionSelector];
        if (candidateFunctionInfos === undefined) {
            throw new Error(`No functions registered for selector '${functionSelector}'`);
        }
        const functionInfo = _.find(candidateFunctionInfos, candidateFunctionInfo => {
            return (contractName === undefined || _.toLower(contractName) === _.toLower(candidateFunctionInfo.contractName));
        });
        if (functionInfo === undefined) {
            throw new Error(`No function registered with selector ${functionSelector} and contract name ${contractName}.`);
        }
        else if (functionInfo.abiEncoder === undefined) {
            throw new Error(`Function ABI Encoder is not defined, for function registered with selector ${functionSelector} and contract name ${contractName}.`);
        }
        const functionName = functionInfo.abiEncoder.getDataItem().name;
        const functionSignature = functionInfo.abiEncoder.getSignatureType();
        const functionArguments = functionInfo.abiEncoder.decode(calldata);
        const decodedCalldata = {
            functionName,
            functionSignature,
            functionArguments,
        };
        return decodedCalldata;
    }
    addABI(abiArray, contractName) {
        if (abiArray === undefined) {
            return;
        }
        const ethersInterface = new ethers.utils.Interface(abiArray);
        _.map(abiArray, (abi) => {
            switch (abi.type) {
                case AbiType.Event:
                    this._addEventABI(abi, ethersInterface);
                    break;
                case AbiType.Function:
                    this._addMethodABI(abi, contractName);
                    break;
                default:
                    break;
            }
        });
    }
    _addEventABI(eventAbi, ethersInterface) {
        const numIndexedArgs = _.reduce(eventAbi.inputs, (sum, input) => (input.indexed ? sum + 1 : sum), 0);
        const signature_s1 = _.map(eventAbi.inputs, (input) => {
            return input.type;
        }).join(',');
        const signature = `${eventAbi.name}(${signature_s1})`;
        const topic = ethersInterface.events[signature].name;
        this._eventIds[topic] = {
            ...this._eventIds[topic],
            [numIndexedArgs]: eventAbi,
        };
    }
    _addMethodABI(methodAbi, contractName) {
        const abiEncoder = new AbiEncoder.Method(methodAbi);
        const functionSelector = abiEncoder.getSelector();
        if (!(functionSelector in this._selectorToFunctionInfo)) {
            this._selectorToFunctionInfo[functionSelector] = [];
        }
        const functionSignature = abiEncoder.getSignature();
        this._selectorToFunctionInfo[functionSelector].push({
            functionSignature,
            abiEncoder,
            contractName,
        });
    }
}
//# sourceMappingURL=abi_decoder.js.map