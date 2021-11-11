/// <reference types="node" />
import { BigNumber } from '../../configured_bignumber';
export declare function encodeNumericValue(value_: BigNumber | string | number): Buffer;
export declare function safeEncodeNumericValue(value: BigNumber | string | number, minValue: BigNumber, maxValue: BigNumber): Buffer;
export declare function decodeNumericValue(encodedValue: Buffer, minValue: BigNumber): BigNumber;
export declare function safeDecodeNumericValue(encodedValue: Buffer, minValue: BigNumber, maxValue: BigNumber): BigNumber;
//# sourceMappingURL=math.d.ts.map