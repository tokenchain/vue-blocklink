import { BigNumber } from './configured_bignumber';
import * as ethUtil from 'ethereumjs-util';
import * as jsSHA3 from 'js-sha3';
import * as uuid from 'uuid/v4';
import * as _ from 'lodash';
const TOPIC_LENGTH = 32;
export const filterUtils = {
    generateUUID() {
        return uuid();
    },
    getFilter(address, eventName, indexFilterValues, abi, blockRange) {
        const eventAbi = _.find(abi, (abiDefinition) => {
            return abiDefinition.name === eventName;
        });
        const eventSignature = filterUtils.getEventSignatureFromAbiByName(eventAbi);
        const topicForEventSignature = ethUtil.addHexPrefix(jsSHA3.keccak256(eventSignature));
        const topicsForIndexedArgs = filterUtils.getTopicsForIndexedArgs(eventAbi, indexFilterValues);
        const topics = [topicForEventSignature, ...topicsForIndexedArgs];
        let filter = {
            address,
            topics,
        };
        if (blockRange !== undefined) {
            filter = {
                ...blockRange,
                ...filter,
            };
        }
        return filter;
    },
    getEventSignatureFromAbiByName(eventAbi) {
        const types = eventAbi.inputs.map(i => i.type);
        return `${eventAbi.name}(${types.join(',')})`;
    },
    getTopicsForIndexedArgs(abi, indexFilterValues) {
        const topics = [];
        for (const eventInput of abi.inputs) {
            if (!eventInput.indexed) {
                continue;
            }
            if (indexFilterValues[eventInput.name] === undefined) {
                topics.push(null);
            }
            else {
                let value = indexFilterValues[eventInput.name];
                if (BigNumber.isBigNumber(value)) {
                    value = ethUtil.fromSigned(value.toString(10));
                }
                const buffer = ethUtil.toBuffer(value);
                const paddedBuffer = ethUtil.setLengthLeft(buffer, TOPIC_LENGTH);
                const topic = ethUtil.bufferToHex(paddedBuffer);
                topics.push(topic);
            }
        }
        return topics;
    },
    matchesFilter(log, filter) {
        if (filter.address !== undefined && log.address !== filter.address) {
            return false;
        }
        if (filter.topics !== undefined) {
            return filterUtils.doesMatchTopics(log.topics, filter.topics);
        }
        return true;
    },
    doesMatchTopics(logTopics, filterTopics) {
        const matchesTopic = logTopics.map((logTopic, i) => filterUtils.matchesTopic(logTopic, filterTopics[i]));
        const doesMatchTopics = matchesTopic.every(m => m);
        return doesMatchTopics;
    },
    matchesTopic(logTopic, filterTopic) {
        if (Array.isArray(filterTopic)) {
            return filterTopic.includes(logTopic);
        }
        if (typeof filterTopic === 'string') {
            return filterTopic === logTopic;
        }
        return true;
    },
};
