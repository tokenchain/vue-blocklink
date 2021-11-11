import { ContractAbi, DataItem, MethodAbi } from '../types';
declare type ParamName = null | string | NestedParamName;
interface NestedParamName {
    name: string | null;
    names: ParamName[];
}
declare function parseEthersParams(params: DataItem[]): {
    names: ParamName[];
    types: string[];
};
declare function isAbiDataEqual(name_p: ParamName, type: string, x: any, y: any): boolean;
declare function splitTupleTypes(type: string): string[];
declare function formatABIDataItem(abi: DataItem, value: any, formatter: (type: string, value: any) => any): any;
export declare const abiUtils: {
    parseEthersParams: typeof parseEthersParams;
    isAbiDataEqual: typeof isAbiDataEqual;
    splitTupleTypes: typeof splitTupleTypes;
    formatABIDataItem: typeof formatABIDataItem;
    parseFunctionParam(param: DataItem): string;
    getFunctionSignature(methodAbi: MethodAbi): string;
    renameOverloadedMethods(inputContractAbi: ContractAbi): ContractAbi;
};
export {};
//# sourceMappingURL=abi_utils.d.ts.map