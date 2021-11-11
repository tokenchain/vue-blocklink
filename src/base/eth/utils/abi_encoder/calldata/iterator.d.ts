import { Queue } from '../utils/queue';
import { CalldataBlock } from './calldata_block';
declare abstract class BaseIterator implements Iterable<CalldataBlock> {
    protected readonly _root: CalldataBlock;
    protected readonly _queue: Queue<CalldataBlock>;
    private static _createQueue;
    constructor(root: CalldataBlock);
    [Symbol.iterator](): {
        next: () => IteratorResult<CalldataBlock>;
    };
    abstract nextBlock(): CalldataBlock | undefined;
}
export declare class CalldataIterator extends BaseIterator {
    constructor(root: CalldataBlock);
    nextBlock(): CalldataBlock | undefined;
}
export declare class ReverseCalldataIterator extends BaseIterator {
    constructor(root: CalldataBlock);
    nextBlock(): CalldataBlock | undefined;
}
export {};
//# sourceMappingURL=iterator.d.ts.map