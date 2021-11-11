import { EncodingRules } from '../utils/rules';
import { CalldataBlock } from './calldata_block';
export declare class Calldata {
    private readonly _rules;
    private _selector;
    private _root;
    constructor(rules: EncodingRules);
    setRoot(block: CalldataBlock): void;
    setSelector(selector: string): void;
    toString(): string;
    private _optimize;
    private _toEvmCompatibeCallDataHex;
    private _toHumanReadableCallData;
}
//# sourceMappingURL=calldata.d.ts.map