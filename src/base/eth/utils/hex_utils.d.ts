/// <reference types="node" />
import { Numberish } from './types';
export declare const hexUtils: {
    concat: typeof concat;
    random: typeof random;
    leftPad: typeof leftPad;
    rightPad: typeof rightPad;
    invert: typeof invert;
    slice: typeof slice;
    hash: typeof hash;
    size: typeof size;
    toHex: typeof toHex;
    isHex: typeof isHex;
};
declare function concat(...args: Array<string | number | Buffer>): string;
declare function random(_size?: number): string;
declare function leftPad(n: Numberish, _size?: number): string;
declare function rightPad(n: Numberish, _size?: number): string;
declare function invert(n: Numberish, _size?: number): string;
declare function slice(n: Numberish, start: number, end?: number): string;
declare function hash(n: Numberish): string;
declare function size(hex: string): number;
declare function toHex(n: Numberish | Buffer, _size?: number): string;
declare function isHex(s: string): boolean;
export declare function isHexPrefixed(str: any): boolean;
export declare function stripHexPrefix(str: any): any;
export {};
//# sourceMappingURL=hex_utils.d.ts.map