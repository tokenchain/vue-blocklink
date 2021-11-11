import { IndexedFilterValues } from '../0xtypes';
import { BlockRange, EventAbi, FilterObject, LogEntry } from '../types';
import { AbiItem } from "web3-utils";
export declare const filterUtils: {
    generateUUID(): string;
    getFilter<ContractEvents extends string>(address: string, eventName: ContractEvents, indexFilterValues: IndexedFilterValues, abi: AbiItem[], blockRange?: BlockRange | undefined): FilterObject;
    getEventSignatureFromAbiByName(eventAbi: EventAbi): string;
    getTopicsForIndexedArgs(abi: EventAbi, indexFilterValues: IndexedFilterValues): Array<string | null>;
    matchesFilter(log: LogEntry, filter: FilterObject): boolean;
    doesMatchTopics(logTopics: string[], filterTopics: Array<string[] | string | null>): boolean;
    matchesTopic(logTopic: string, filterTopic: string[] | string | null): boolean;
};
//# sourceMappingURL=filter_utils.d.ts.map