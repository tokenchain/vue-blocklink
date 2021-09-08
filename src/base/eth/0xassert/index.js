import { SchemaValidator } from '../schemas';
import { addressUtils, B, logUtils } from '../utils';
import * as _ from 'lodash';
import * as validUrl from 'valid-url';
const HEX_REGEX = /^0x[0-9A-F]*$/i;
const schemaValidator = new SchemaValidator();
export const assert = {
    isBigNumber(variableName, value) {
        const isBigNumber = B.BigNumber.isBigNumber(value);
        assert.assert(isBigNumber, assert.typeAssertionMessage(variableName, 'BigNumber', value));
    },
    isNumberLike(variableName, value) {
        const isBigNumber = B.BigNumber.isBigNumber(value);
        const isNumber = typeof value === 'number';
        assert.assert(isBigNumber || isNumber, assert.typeAssertionMessage(variableName, 'BigNumber | number', value));
    },
    isValidBaseUnitAmount(variableName, value) {
        assert.isBigNumber(variableName, value);
        const isNegative = value.isLessThan(0);
        assert.assert(!isNegative, `${variableName} cannot be a negative number, found value: ${value.toNumber()}`);
        const hasDecimals = value.decimalPlaces() !== 0;
        assert.assert(!hasDecimals, `${variableName} should be in baseUnits (no decimals), found value: ${value.toNumber()}`);
    },
    isString(variableName, value) {
        assert.assert(_.isString(value), assert.typeAssertionMessage(variableName, 'string', value));
    },
    isFunction(variableName, value) {
        assert.assert(_.isFunction(value), assert.typeAssertionMessage(variableName, 'function', value));
    },
    isHexString(variableName, value) {
        assert.assert(_.isString(value) && HEX_REGEX.test(value), assert.typeAssertionMessage(variableName, 'HexString', value));
    },
    isETHAddressHex(variableName, value) {
        assert.assert(_.isString(value), assert.typeAssertionMessage(variableName, 'string', value));
        assert.assert(addressUtils.isAddress(value), assert.typeAssertionMessage(variableName, 'ETHAddressHex', value));
    },
    doesBelongToStringEnum(variableName, value, stringEnum) {
        const enumValues = _.values(stringEnum);
        const doesBelongToStringEnum = _.includes(enumValues, value);
        const enumValuesAsStrings = _.map(enumValues, enumValue => `'${enumValue}'`);
        const enumValuesAsString = enumValuesAsStrings.join(', ');
        assert.assert(doesBelongToStringEnum, `Expected ${variableName} to be one of: ${enumValuesAsString}, encountered: ${value}`);
    },
    hasAtMostOneUniqueValue(value, errMsg) {
        assert.assert(_.uniq(value).length <= 1, errMsg);
    },
    isNumber(variableName, value) {
        assert.assert(_.isFinite(value), assert.typeAssertionMessage(variableName, 'number', value));
    },
    isNumberOrBigNumber(variableName, value) {
        if (_.isFinite(value)) {
            return;
        }
        else {
            assert.assert(B.BigNumber.isBigNumber(value), assert.typeAssertionMessage(variableName, 'number or BigNumber', value));
        }
    },
    isBoolean(variableName, value) {
        assert.assert(_.isBoolean(value), assert.typeAssertionMessage(variableName, 'boolean', value));
    },
    isWeb3Provider(variableName, value) {
        logUtils.warn('DEPRECATED: Please use providerUtils.standardizeOrThrow() instead');
        const isWeb3Provider = _.isFunction(value.send) || _.isFunction(value.sendAsync);
        assert.assert(isWeb3Provider, assert.typeAssertionMessage(variableName, 'Provider', value));
    },
    doesConformToSchema(variableName, value, schema, subSchemas) {
        if (value === undefined) {
            throw new Error(`${variableName} can't be undefined`);
        }
        if (subSchemas !== undefined) {
            schemaValidator.addSchema(subSchemas);
        }
        const validationResult = schemaValidator.validate(value, schema);
        const hasValidationErrors = validationResult.errors && validationResult.errors.length > 0;
        const msg = hasValidationErrors
            ? `Expected ${variableName} to conform to schema ${schema.id}
Encountered: ${JSON.stringify(value, null, '\t')}
Validation errors: ${validationResult.errors.join(', ')}`
            : '';
        assert.assert(!hasValidationErrors, msg);
    },
    doesMatchRegex(variableName, value, regex) {
        assert.assert(regex.test(value), assert.typeAssertionMessage(variableName, String(regex), value));
    },
    isWebUri(variableName, value) {
        const isValidUrl = validUrl.isWebUri(value) !== undefined;
        assert.assert(isValidUrl, assert.typeAssertionMessage(variableName, 'web uri', value));
    },
    isUri(variableName, value) {
        const isValidUri = validUrl.isUri(value) !== undefined;
        assert.assert(isValidUri, assert.typeAssertionMessage(variableName, 'uri', value));
    },
    isBlockParam(variableName, value) {
        if (Number.isInteger(value) && value >= 0) {
            return;
        }
        if (value === 'earliest' || value === 'latest' || value === 'pending') {
            return;
        }
        throw new Error(assert.typeAssertionMessage(variableName, 'BlockParam', value));
    },
    isArray(variableName, value) {
        if (!Array.isArray(value)) {
            throw new Error(assert.typeAssertionMessage(variableName, 'Array', value));
        }
    },
    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    },
    typeAssertionMessage(variableName, type, value) {
        return `Expected ${variableName} to be of type ${type}, encountered: ${value}`;
    },
};
