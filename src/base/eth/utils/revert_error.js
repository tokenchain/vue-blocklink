import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { inspect } from 'util';
import * as AbiEncoder from './abi_encoder';
import { BigNumber } from './configured_bignumber';
export function registerRevertErrorType(revertClass, force = false) {
    RevertError.registerType(revertClass, force);
}
export function decodeBytesAsRevertError(bytes, coerce = false) {
    return RevertError.decode(bytes, coerce);
}
export function decodeThrownErrorAsRevertError(error, coerce = false) {
    if (error instanceof RevertError) {
        return error;
    }
    return RevertError.decode(getThrownErrorRevertErrorBytes(error), coerce);
}
export function coerceThrownErrorAsRevertError(error) {
    if (error instanceof RevertError) {
        return error;
    }
    try {
        return decodeThrownErrorAsRevertError(error, true);
    }
    catch (err) {
        if (isGanacheTransactionRevertError(error)) {
            throw err;
        }
        if (isGethTransactionRevertError(error)) {
            return new AnyRevertError();
        }
        return new StringRevertError(error.message);
    }
}
export class RevertError extends Error {
    constructor(name, declaration, values, raw) {
        super(createErrorMessage(name, values));
        this.values = {};
        if (declaration !== undefined) {
            this.abi = declarationToAbi(declaration);
            if (values !== undefined) {
                _.assign(this.values, _.cloneDeep(values));
            }
        }
        this._raw = raw;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static decode(bytes, coerce = false) {
        if (bytes instanceof RevertError) {
            return bytes;
        }
        const _bytes = bytes instanceof Buffer ? ethUtil.bufferToHex(bytes) : ethUtil.addHexPrefix(bytes);
        const selector = _bytes.slice(2, 10);
        if (!(selector in RevertError._typeRegistry)) {
            if (coerce) {
                return new RawRevertError(bytes);
            }
            throw new Error(`Unknown selector: ${selector}`);
        }
        const { type, decoder } = RevertError._typeRegistry[selector];
        const instance = new type();
        try {
            Object.assign(instance, { values: decoder(_bytes) });
            instance.message = instance.toString();
            return instance;
        }
        catch (err) {
            throw new Error(`Bytes ${_bytes} cannot be decoded as a revert error of type ${instance.signature}: ${err.message}`);
        }
    }
    static registerType(revertClass, force = false) {
        const instance = new revertClass();
        if (!force && instance.selector in RevertError._typeRegistry) {
            throw new Error(`RevertError type with signature "${instance.signature}" is already registered`);
        }
        if (_.isNil(instance.abi)) {
            throw new Error(`Attempting to register a RevertError class with no ABI`);
        }
        RevertError._typeRegistry[instance.selector] = {
            type: revertClass,
            decoder: createDecoder(instance.abi),
        };
    }
    get name() {
        if (!_.isNil(this.abi)) {
            return this.abi.name;
        }
        return `<${this.typeName}>`;
    }
    get typeName() {
        return this.constructor.name;
    }
    get selector() {
        if (!_.isNil(this.abi)) {
            return toSelector(this.abi);
        }
        if (this._isRawType) {
            return this._raw.slice(2, 10);
        }
        return '';
    }
    get signature() {
        if (!_.isNil(this.abi)) {
            return toSignature(this.abi);
        }
        return '';
    }
    get arguments() {
        if (!_.isNil(this.abi)) {
            return this.abi.arguments || [];
        }
        return [];
    }
    get [Symbol.toStringTag]() {
        return this.toString();
    }
    equals(other) {
        let _other = other;
        if (_other instanceof Buffer) {
            _other = ethUtil.bufferToHex(_other);
        }
        if (typeof _other === 'string') {
            _other = RevertError.decode(_other);
        }
        if (!(_other instanceof RevertError)) {
            return false;
        }
        if (this._isAnyType || _other._isAnyType) {
            return true;
        }
        if (this._isRawType || _other._isRawType) {
            return this._raw === _other._raw;
        }
        if (this.constructor !== _other.constructor) {
            return false;
        }
        for (const name of Object.keys(this.values)) {
            const a = this.values[name];
            const b = _other.values[name];
            if (a === b) {
                continue;
            }
            if (!_.isNil(a) && !_.isNil(b)) {
                const { type } = this._getArgumentByName(name);
                if (!checkArgEquality(type, a, b)) {
                    return false;
                }
            }
        }
        return true;
    }
    encode() {
        if (this._raw !== undefined) {
            return this._raw;
        }
        if (!this._hasAllArgumentValues) {
            throw new Error(`Instance of ${this.typeName} does not have all its parameter values set.`);
        }
        const encoder = createEncoder(this.abi);
        return encoder(this.values);
    }
    toString() {
        if (this._isRawType) {
            return `${this.constructor.name}(${this._raw})`;
        }
        const values = _.omitBy(this.values, (v) => _.isNil(v));
        for (const k in values) {
            const { type: argType } = this._getArgumentByName(k);
            if (argType === 'bytes') {
                try {
                    values[k] = RevertError.decode(values[k]);
                }
                catch (err) {
                }
            }
        }
        const inner = _.isEmpty(values) ? '' : inspect(values);
        return `${this.constructor.name}(${inner})`;
    }
    _getArgumentByName(name) {
        const arg = _.find(this.arguments, (a) => a.name === name);
        if (_.isNil(arg)) {
            throw new Error(`RevertError ${this.signature} has no argument named ${name}`);
        }
        return arg;
    }
    get _isAnyType() {
        return _.isNil(this.abi) && _.isNil(this._raw);
    }
    get _isRawType() {
        return !_.isNil(this._raw);
    }
    get _hasAllArgumentValues() {
        if (_.isNil(this.abi) || _.isNil(this.abi.arguments)) {
            return false;
        }
        for (const arg of this.abi.arguments) {
            if (_.isNil(this.values[arg.name])) {
                return false;
            }
        }
        return true;
    }
}
RevertError._typeRegistry = {};
const PARITY_TRANSACTION_REVERT_ERROR_MESSAGE = /^VM execution error/;
const GANACHE_TRANSACTION_REVERT_ERROR_MESSAGE = /^VM Exception while processing transaction: revert/;
const GETH_TRANSACTION_REVERT_ERROR_MESSAGE = /always failing transaction$/;
export function getThrownErrorRevertErrorBytes(error) {
    if (isGanacheTransactionRevertError(error)) {
        const result = error.results[error.hashes[0]];
        if (result.reason !== undefined) {
            return new StringRevertError(result.reason).encode();
        }
        if (result.return !== undefined && result.return !== '0x') {
            return result.return;
        }
    }
    else if (isParityTransactionRevertError(error)) {
        const { data } = error;
        const hexDataIndex = data.indexOf('0x');
        if (hexDataIndex !== -1) {
            return data.slice(hexDataIndex);
        }
    }
    else {
        if (isGethTransactionRevertError(error)) {
        }
    }
    throw new Error(`Cannot decode thrown Error "${error.message}" as a RevertError`);
}
function isParityTransactionRevertError(error) {
    if (PARITY_TRANSACTION_REVERT_ERROR_MESSAGE.test(error.message) && 'code' in error && 'data' in error) {
        return true;
    }
    return false;
}
function isGanacheTransactionRevertError(error) {
    if (GANACHE_TRANSACTION_REVERT_ERROR_MESSAGE.test(error.message) && 'hashes' in error && 'results' in error) {
        return true;
    }
    return false;
}
function isGethTransactionRevertError(error) {
    return GETH_TRANSACTION_REVERT_ERROR_MESSAGE.test(error.message);
}
export class StringRevertError extends RevertError {
    constructor(message) {
        super('StringRevertError', 'Error(string message)', { message });
    }
}
export class AnyRevertError extends RevertError {
    constructor() {
        super('AnyRevertError');
    }
}
export class RawRevertError extends RevertError {
    constructor(encoded) {
        super('RawRevertError', undefined, undefined, typeof encoded === 'string' ? encoded : ethUtil.bufferToHex(encoded));
    }
}
function createErrorMessage(name, values) {
    if (values === undefined) {
        return `${name}()`;
    }
    const _values = _.omitBy(values, (v) => _.isNil(v));
    const inner = _.isEmpty(_values) ? '' : inspect(_values);
    return `${name}(${inner})`;
}
function declarationToAbi(declaration) {
    let m = /^\s*([_a-z][a-z0-9_]*)\((.*)\)\s*$/i.exec(declaration);
    if (!m) {
        throw new Error(`Invalid Revert Error signature: "${declaration}"`);
    }
    const [name, args] = m.slice(1);
    const argList = _.filter(args.split(','));
    const argData = _.map(argList, (a) => {
        m = /^\s*(([_a-z][a-z0-9_]*)(\[\d*\])*)\s+([_a-z][a-z0-9_]*)\s*$/i.exec(a);
        if (!m) {
            throw new Error(`Invalid Revert Error signature: "${declaration}"`);
        }
        return {
            name: m[4],
            type: m[1],
        };
    });
    const r = {
        type: 'error',
        name,
        arguments: _.isEmpty(argData) ? [] : argData,
    };
    return r;
}
function checkArgEquality(type, lhs, rhs) {
    try {
        return RevertError.decode(lhs).equals(RevertError.decode(rhs));
    }
    catch (err) {
    }
    if (type === 'address') {
        return normalizeAddress(lhs) === normalizeAddress(rhs);
    }
    else if (type === 'bytes' || /^bytes(\d+)$/.test(type)) {
        return normalizeBytes(lhs) === normalizeBytes(rhs);
    }
    else if (type === 'string') {
        return lhs === rhs;
    }
    else if (/\[\d*\]$/.test(type)) {
        if (lhs.length !== rhs.length) {
            return false;
        }
        const m = /^(.+)\[(\d*)\]$/.exec(type);
        const baseType = m[1];
        const isFixedLength = m[2].length !== 0;
        if (isFixedLength) {
            const length = parseInt(m[2], 10);
            if (lhs.length !== length) {
                return false;
            }
        }
        for (const [slhs, srhs] of _.zip(lhs, rhs)) {
            if (!checkArgEquality(baseType, slhs, srhs)) {
                return false;
            }
        }
        return true;
    }
    return new BigNumber(lhs || 0).eq(rhs);
}
function normalizeAddress(addr) {
    const ADDRESS_SIZE = 20;
    return ethUtil.bufferToHex(ethUtil.setLengthLeft(ethUtil.toBuffer(ethUtil.addHexPrefix(addr)), ADDRESS_SIZE));
}
function normalizeBytes(bytes) {
    return ethUtil.addHexPrefix(bytes).toLowerCase();
}
function createEncoder(abi) {
    const encoder = AbiEncoder.createMethod(abi.name, abi.arguments || []);
    return (values) => {
        const valuesArray = _.map(abi.arguments, (arg) => values[arg.name]);
        return encoder.encode(valuesArray);
    };
}
function createDecoder(abi) {
    const encoder = AbiEncoder.createMethod(abi.name, abi.arguments || []);
    return (hex) => {
        return encoder.decode(hex);
    };
}
function toSignature(abi) {
    const argTypes = _.map(abi.arguments, (a) => a.type);
    const args = argTypes.join(',');
    return `${abi.name}(${args})`;
}
function toSelector(abi) {
    return (ethUtil
        .keccak256(Buffer.from(toSignature(abi)))
        .slice(0, 4)
        .toString('hex'));
}
RevertError.registerType(StringRevertError);
