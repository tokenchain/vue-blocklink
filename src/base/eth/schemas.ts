import * as AJV from 'ajv'; // namespace and constructor
// tslint:disable:no-duplicate-imports
import {Ajv} from 'ajv'; // interface
// @ts-ignore
import lodash from 'lodash'
const values = lodash.values
import {schemas} from './validations';

/**
 * A validator wrapping (AJV) [https://github.com/ajv-validator/ajv]
 */
export class SchemaValidator {
    private readonly _validator: Ajv;

    /**
     * Instantiates a SchemaValidator instance
     */
    constructor(newSchemas: object[] = []) {
        this._validator = new AJV({schemaId: 'auto'});
        this._validator.addSchema(values(schemas).filter(s => s !== undefined && s.id !== undefined));
        this._validator.addSchema(newSchemas.filter(s => s !== undefined));
    }

    /**
     * Add a schema to the validator. All schemas and sub-schemas must be added to
     * the validator before the `validate` and `isValid` methods can be called with
     * instances of that schema.
     * @param schema The schema to add
     */
    public addSchema(schemaObjectOrArray: object | object[]): void {
        const _schemas = Array.isArray(schemaObjectOrArray) ? schemaObjectOrArray : [schemaObjectOrArray];
        for (const s of _schemas) {
            try {
                this._validator.addSchema(s); // AJV validates upon adding
            } catch (err) {
                // Ignore duplicate errors.
                if (!err.message.endsWith('already exists')) {
                    throw err;
                }
            }
        }
    }

    // In order to validate a complex JS object using jsonschema, we must replace any complex
    // sub-types (e.g BigNumber) with a simpler string representation. Since BigNumber and other
    // complex types implement the `toString` method, we can stringify the object and
    // then parse it. The resultant object can then be checked using jsonschema.
    /**
     * Validate the JS object conforms to a specific JSON schema
     * @param instance JS object in question
     * @param schema Schema to check against
     * @returns The results of the validation
     */
    public validate(instance: any, schema: object): Ajv {
        this.isValid(instance, schema);
        return this._validator; // errors field is returned here. Will be overwritten on the next validation.
    }

    /**
     * Check whether an instance properly adheres to a JSON schema
     * @param instance JS object in question
     * @param schema Schema to check against
     * @returns Whether or not the instance adheres to the schema
     */
    public isValid(instance: any, schema: object): boolean {
        return this._validator.validate(schema, JSON.parse(JSON.stringify(instance))) as boolean;
    }
}
