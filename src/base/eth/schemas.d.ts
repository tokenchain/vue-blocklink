import { Ajv } from 'ajv';
export declare class SchemaValidator {
    private readonly _validator;
    constructor(newSchemas?: object[]);
    addSchema(schemaObjectOrArray: object | object[]): void;
    validate(instance: any, schema: object): Ajv;
    isValid(instance: any, schema: object): boolean;
}
//# sourceMappingURL=schemas.d.ts.map