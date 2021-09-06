import * as AJV from 'ajv';
import lodash from 'lodash';
const values = lodash.values;
import { schemas } from './validations';
export class SchemaValidator {
    constructor(newSchemas = []) {
        this._validator = new AJV({ schemaId: 'auto' });
        this._validator.addSchema(values(schemas).filter(s => s !== undefined && s.id !== undefined));
        this._validator.addSchema(newSchemas.filter(s => s !== undefined));
    }
    addSchema(schemaObjectOrArray) {
        const _schemas = Array.isArray(schemaObjectOrArray) ? schemaObjectOrArray : [schemaObjectOrArray];
        for (const s of _schemas) {
            try {
                this._validator.addSchema(s);
            }
            catch (err) {
                if (!err.message.endsWith('already exists')) {
                    throw err;
                }
            }
        }
    }
    validate(instance, schema) {
        this.isValid(instance, schema);
        return this._validator;
    }
    isValid(instance, schema) {
        return this._validator.validate(schema, JSON.parse(JSON.stringify(instance)));
    }
}
