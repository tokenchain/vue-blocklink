import * as _ from 'lodash';
import { Queue } from '../utils/queue';
import { BlobCalldataBlock } from './blocks/blob';
import { PointerCalldataBlock } from './blocks/pointer';
import { SetCalldataBlock } from './blocks/set';
class BaseIterator {
    constructor(root) {
        this._root = root;
        this._queue = BaseIterator._createQueue(root);
    }
    static _createQueue(block) {
        const queue = new Queue();
        if (!(block instanceof SetCalldataBlock)) {
            queue.pushBack(block);
            return queue;
        }
        const set = block;
        _.eachRight(set.getMembers(), (member) => {
            queue.mergeFront(BaseIterator._createQueue(member));
        });
        _.each(set.getMembers(), (member) => {
            if (member instanceof PointerCalldataBlock && member.getAlias() === undefined) {
                const dependency = member.getDependency();
                queue.mergeBack(BaseIterator._createQueue(dependency));
            }
        });
        queue.pushFront(set);
        return queue;
    }
    [Symbol.iterator]() {
        return {
            next: () => {
                const nextBlock = this.nextBlock();
                if (nextBlock !== undefined) {
                    return {
                        value: nextBlock,
                        done: false,
                    };
                }
                return {
                    done: true,
                    value: new BlobCalldataBlock('', '', '', Buffer.from('')),
                };
            },
        };
    }
}
export class CalldataIterator extends BaseIterator {
    constructor(root) {
        super(root);
    }
    nextBlock() {
        return this._queue.popFront();
    }
}
export class ReverseCalldataIterator extends BaseIterator {
    constructor(root) {
        super(root);
    }
    nextBlock() {
        return this._queue.popBack();
    }
}
//# sourceMappingURL=iterator.js.map