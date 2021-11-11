import * as ethUtil from 'ethereumjs-util';
import * as ethers from 'ethers';
import { B } from './configured_bignumber';
export const signTypedDataUtils = {
    generateTypedDataHash(typedData) {
        return ethUtil.keccak256(Buffer.concat([
            Buffer.from('1901', 'hex'),
            signTypedDataUtils._structHash('EIP712Domain', typedData.domain, typedData.types),
            signTypedDataUtils._structHash(typedData.primaryType, typedData.message, typedData.types),
        ]));
    },
    generateTypedDataHashWithoutDomain(typedData) {
        return signTypedDataUtils._structHash(typedData.primaryType, typedData.message, typedData.types);
    },
    generateDomainHash(domain) {
        return signTypedDataUtils._structHash('EIP712Domain', domain, {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
        });
    },
    _findDependencies(primaryType, types, found = []) {
        if (found.includes(primaryType) || types[primaryType] === undefined) {
            return found;
        }
        found.push(primaryType);
        for (const field of types[primaryType]) {
            for (const dep of signTypedDataUtils._findDependencies(field.type, types, found)) {
                if (!found.includes(dep)) {
                    found.push(dep);
                }
            }
        }
        return found;
    },
    _encodeType(primaryType, types) {
        let deps = signTypedDataUtils._findDependencies(primaryType, types);
        deps = deps.filter(d => d !== primaryType);
        deps = [primaryType].concat(deps.sort());
        let result = '';
        for (const dep of deps) {
            result += `${dep}(${types[dep].map(({ name, type }) => `${type} ${name}`).join(',')})`;
        }
        return result;
    },
    _encodeData(primaryType, data, types) {
        const encodedTypes = ['bytes32'];
        const encodedValues = [signTypedDataUtils._typeHash(primaryType, types)];
        for (const field of types[primaryType]) {
            const value = data[field.name];
            if (field.type === 'string') {
                const hashValue = ethUtil.keccak256(Buffer.from(value));
                encodedTypes.push('bytes32');
                encodedValues.push(hashValue);
            }
            else if (field.type === 'bytes') {
                const hashValue = ethUtil.keccak256(ethUtil.toBuffer(value));
                encodedTypes.push('bytes32');
                encodedValues.push(hashValue);
            }
            else if (types[field.type] !== undefined) {
                encodedTypes.push('bytes32');
                const hashValue = ethUtil.keccak256(ethUtil.toBuffer(signTypedDataUtils._encodeData(field.type, value, types)));
                encodedValues.push(hashValue);
            }
            else if (field.type.lastIndexOf(']') === field.type.length - 1) {
                throw new Error('Arrays currently unimplemented in encodeData');
            }
            else {
                encodedTypes.push(field.type);
                const normalizedValue = signTypedDataUtils._normalizeValue(field.type, value);
                encodedValues.push(normalizedValue);
            }
        }
        return ethers.utils.defaultAbiCoder.encode(encodedTypes, encodedValues);
    },
    _normalizeValue(type, value) {
        const STRING_BASE = 10;
        if (type === 'uint256') {
            if (B.BigNumber.isBigNumber(value)) {
                return value.toString(STRING_BASE);
            }
            return new B.BigNumber(value).toString(STRING_BASE);
        }
        return value;
    },
    _typeHash(primaryType, types) {
        return ethUtil.keccak256(Buffer.from(signTypedDataUtils._encodeType(primaryType, types)));
    },
    _structHash(primaryType, data, types) {
        return ethUtil.keccak256(ethUtil.toBuffer(signTypedDataUtils._encodeData(primaryType, data, types)));
    },
};
//# sourceMappingURL=sign_typed_data_utils.js.map