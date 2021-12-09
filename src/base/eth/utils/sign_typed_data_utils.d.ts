import { EIP712Object, EIP712ObjectValue, EIP712TypedData, EIP712Types } from '../0xtypes';
export declare const signTypedDataUtils: {
    generateTypedDataHash(typedData: EIP712TypedData): any;
    generateTypedDataHashWithoutDomain(typedData: EIP712TypedData): any;
    generateDomainHash(domain: EIP712Object): any;
    _findDependencies(primaryType: string, types: EIP712Types, found?: string[]): string[];
    _encodeType(primaryType: string, types: EIP712Types): string;
    _encodeData(primaryType: string, data: EIP712Object, types: EIP712Types): string;
    _normalizeValue(type: string, value: any): EIP712ObjectValue;
    _typeHash(primaryType: string, types: EIP712Types): any;
    _structHash(primaryType: string, data: EIP712Object, types: EIP712Types): any;
};
//# sourceMappingURL=sign_typed_data_utils.d.ts.map