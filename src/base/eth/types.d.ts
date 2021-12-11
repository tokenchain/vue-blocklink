import { BigNumber } from "./utils";
import { Ori20Contract } from "../../abi/ori20";
export declare type JSONRPCErrorCallback = (err: Error | null, result?: JSONRPCResponsePayload) => void;
export interface Balancer {
    [holderAddress: string]: number;
}
export interface Spending {
    [holderAddress: string]: Balancer;
}
export interface Unlimited {
    [holderAddress: string]: boolean;
}
export interface WebLinkTokenMap {
    [contractAddress: string]: Web3ERC20Token;
}
export interface ContractTokenMap {
    [contractAddress: string]: Ori20Contract;
}
export interface Web3ERC20Token {
    tokenSymbol: string;
    tokenName: string;
    address: string;
    decimal: number;
    holder: Balancer;
    spender: Spending;
    unlimited: Unlimited;
}
export interface WatchAssetParams {
    type: string;
    options: {
        address: string;
        "symbol": string;
        decimals: number;
        image: string;
    };
}
export interface SwitchEthereumChainParameter {
    chainId: string;
}
export interface AddEthereumChainParameter extends SwitchEthereumChainParameter {
    blockExplorerUrls?: string[];
    chainName?: string;
    iconUrls?: string[];
    nativeCurrency?: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls?: string[];
}
export declare class PromiseWithTransactionHash<T> implements Promise<T> {
    readonly txHashPromise: Promise<string>;
    private readonly _promise;
    constructor(txHashPromise: Promise<string>, promise: Promise<T>);
    then<TResult>(onFulfilled?: (v: T) => TResult | Promise<TResult>, onRejected?: (reason: any) => Promise<never>): Promise<TResult>;
    catch<TResult>(onRejected?: (reason: any) => Promise<TResult>): Promise<TResult | T>;
    finally(onFinally?: (() => void) | null): Promise<T>;
    get [Symbol.toStringTag](): string;
}
export declare type LogEvent = LogEntryEvent;
export interface ContractEvent<ContractEventArgs> {
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
    type: string;
    event: string;
    args: ContractEventArgs;
}
export declare enum SubscriptionErrors {
    SubscriptionNotFound = "SUBSCRIPTION_NOT_FOUND",
    SubscriptionAlreadyPresent = "SUBSCRIPTION_ALREADY_PRESENT"
}
export interface SendTransactionOpts {
    shouldValidate?: boolean;
}
export interface AwaitTransactionSuccessOpts extends SendTransactionOpts {
    pollingIntervalMs?: number;
    timeoutMs?: number;
}
export interface ContractFunctionObj<T> {
    callAsync(callData?: Partial<CallData>, defaultBlock?: BlockParam): Promise<T>;
    getABIEncodedTransactionData(): string;
}
export interface ContractTxFunctionObj<T> extends ContractFunctionObj<T> {
    sendTransactionAsync(txData?: Partial<TxData>, opts?: SendTransactionOpts): Promise<string>;
    awaitTransactionSuccessAsync(txData?: Partial<TxData>, opts?: AwaitTransactionSuccessOpts): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>;
    estimateGasAsync(txData?: Partial<TxData>): Promise<number>;
    createAccessListAsync(txData?: Partial<TxData>, defaultBlock?: BlockParam, shouldOptimize?: boolean): Promise<TxAccessListWithGas>;
}
export declare type SupportedProvider = Web3JsProvider | GanacheProvider | EIP1193Provider | ZeroExProvider;
export declare type Web3JsProvider = Web3JsV1Provider | Web3JsV2Provider | Web3JsV3Provider;
export interface GanacheProvider {
    sendAsync(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
}
export interface Provider {
    sendAsync(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
}
export interface ZeroExProvider {
    isZeroExProvider?: boolean;
    isMetaMask?: boolean;
    isParity?: boolean;
    stop?(): void;
    enable?(): Promise<void>;
    sendAsync(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
}
export interface Web3JsV1Provider {
    sendAsync(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
    send(payload: JSONRPCRequestPayload): JSONRPCResponsePayload;
}
export interface Web3JsV2Provider {
    send(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
}
export interface Web3JsV3Provider {
    send(method: string, params?: any[]): Promise<any>;
}
export declare type EIP1193Event = "accountsChanged" | "networkChanged" | "close" | "connect" | "notification";
export interface EIP1193Provider {
    isEIP1193: boolean;
    send(method: string, params?: any[]): Promise<any>;
    on(event: EIP1193Event, listener: (result: any) => void): this;
}
export declare type ContractAbi = AbiDefinition[];
export declare type AbiDefinition = FunctionAbi | EventAbi | RevertErrorAbi;
export declare type FunctionAbi = MethodAbi | ConstructorAbi | FallbackAbi;
export declare type ConstructorStateMutability = "nonpayable" | "payable";
export declare type StateMutability = "pure" | "view" | ConstructorStateMutability;
export interface MethodAbi {
    type: string;
    name: string;
    inputs: DataItem[];
    outputs: DataItem[];
    constant?: boolean;
    stateMutability: StateMutability;
    payable?: boolean;
}
export interface ConstructorAbi {
    type: string;
    inputs: DataItem[];
    payable?: boolean;
    stateMutability: ConstructorStateMutability;
}
export interface FallbackAbi {
    type: string;
    payable: boolean;
}
export interface EventParameter extends DataItem {
    indexed: boolean;
}
export interface RevertErrorAbi {
    type: "error";
    name: string;
    arguments?: DataItem[];
}
export interface EventAbi {
    type: string;
    name: string;
    inputs: EventParameter[];
    anonymous: boolean;
}
export interface DataItem {
    name: string;
    type: string;
    internalType?: string;
    components?: DataItem[];
}
export interface TupleDataItem extends DataItem {
    components: DataItem[];
}
export declare enum OpCode {
    Stop = "STOP",
    Add = "ADD",
    Mul = "MUL",
    Sub = "SUB",
    Div = "DIV",
    SDiv = "SDIV",
    Mod = "MOD",
    SMod = "SMOD",
    AddMod = "ADDMOD",
    MulMod = "MULMOD",
    Exp = "EXP",
    SignExtend = "SIGNEXTEND",
    Lt = "LT",
    Gt = "GT",
    SLt = "SLT",
    SGt = "SGT",
    Eq = "EQ",
    IsZero = "ISZERO",
    And = "AND",
    Or = "OR",
    Xor = "XOR",
    Not = "NOT",
    Byte = "BYTE",
    Sha3 = "SHA3",
    Address = "ADDRESS",
    Balance = "BALANCE",
    Origin = "ORIGIN",
    Caller = "CALLER",
    CallValue = "CALLVALUE",
    CallDataLoad = "CALLDATALOAD",
    CallDataSize = "CALLDATASIZE",
    CallDataCopy = "CALLDATACOPY",
    CodeSize = "CODESIZE",
    CodeCopy = "CODECOPY",
    GasPrice = "GASPRICE",
    ExtCodeSize = "EXTCODESIZE",
    ExtCodeCopy = "EXTCODECOPY",
    ReturnDataSize = "RETURNDATASIZE",
    ReturnDataCopy = "RETURNDATACOPY",
    BlockHash = "BLOCKHASH",
    Coinbase = "COINBASE",
    TimeStamp = "TimeStamp",
    Number = "NUMBER",
    Difficulty = "DIFFICULTY",
    Gaslimit = "GASLIMIT",
    Pop = "POP",
    MLoad = "MLOAD",
    MStore = "MSTORE",
    MStore8 = "MSTORE8",
    SLoad = "SLOAD",
    SStore = "SSTORE",
    Jump = "JUMP",
    Jumpi = "JUMPI",
    Pc = "PC",
    MSize = "MSIZE",
    Gas = "GAS",
    JumpDest = "JUMPDEST",
    Push1 = "PUSH1",
    Push2 = "PUSH2",
    Push3 = "PUSH3",
    Push4 = "PUSH4",
    Push5 = "PUSH5",
    Push6 = "PUSH6",
    Push7 = "PUSH7",
    Push8 = "PUSH8",
    Push9 = "PUSH9",
    Push10 = "PUSH10",
    Push11 = "PUSH11",
    Push12 = "PUSH12",
    Push13 = "PUSH13",
    Push14 = "PUSH14",
    Push15 = "PUSH15",
    Push16 = "PUSH16",
    Push17 = "PUSH17",
    Push18 = "PUSH18",
    Push19 = "PUSH19",
    Push20 = "PUSH20",
    Push21 = "PUSH21",
    Push22 = "PUSH22",
    Push23 = "PUSH23",
    Push24 = "PUSH24",
    Push25 = "PUSH25",
    Push26 = "PUSH26",
    Push27 = "PUSH27",
    Push28 = "PUSH28",
    Push29 = "PUSH29",
    Push30 = "PUSH30",
    Push31 = "PUSH31",
    Push32 = "PUSH32",
    Dup1 = "DUP1",
    Dup2 = "DUP2",
    Dup3 = "DUP3",
    Dup4 = "DUP4",
    Dup5 = "DUP5",
    Dup6 = "DUP6",
    Dup7 = "DUP7",
    Dup8 = "DUP8",
    Dup9 = "DUP9",
    Dup10 = "DUP10",
    Dup11 = "DUP11",
    Dup12 = "DUP12",
    Dup13 = "DUP13",
    Dup14 = "DUP14",
    Dup15 = "DUP15",
    Dup16 = "DUP16",
    Swap1 = "SWAP1",
    Swap2 = "SWAP2",
    Swap3 = "SWAP3",
    Swap4 = "SWAP4",
    Swap5 = "SWAP5",
    Swap6 = "SWAP6",
    Swap7 = "SWAP7",
    Swap8 = "SWAP8",
    Swap9 = "SWAP9",
    Swap10 = "SWAP10",
    Swap11 = "SWAP11",
    Swap12 = "SWAP12",
    Swap13 = "SWAP13",
    Swap14 = "SWAP14",
    Swap15 = "SWAP15",
    Swap16 = "SWAP16",
    Log1 = "LOG1",
    Log2 = "LOG2",
    Log3 = "LOG3",
    Log4 = "LOG4",
    Create = "CREATE",
    Call = "CALL",
    CallCode = "CALLCODE",
    Return = "RETURN",
    DelegateCall = "DELEGATECALL",
    StaticCall = "STATICCALL",
    Revert = "REVERT",
    Invalid = "INVALID",
    SelfDestruct = "SELFDESTRUCT"
}
export interface StructLog {
    depth: number;
    error: string;
    gas: number;
    gasCost: number;
    memory: string[];
    op: OpCode;
    pc: number;
    stack: string[];
    storage: {
        [location: string]: string;
    };
}
export interface TransactionTrace {
    gas: number;
    returnValue: any;
    structLogs: StructLog[];
}
export declare type Unit = "kwei" | "ada" | "mwei" | "babbage" | "gwei" | "shannon" | "szabo" | "finney" | "ether" | "kether" | "grand" | "einstein" | "mether" | "gether" | "tether";
export interface JSONRPCRequestPayload {
    params: any[];
    method: string;
    id: number;
    jsonrpc: string;
}
export interface JSONRPCResponseError {
    message: string;
    code: number;
}
export interface JSONRPCResponsePayload {
    result: any;
    id: number;
    jsonrpc: string;
    error?: JSONRPCResponseError;
}
export interface AbstractBlock {
    number: number | null;
    hash: string | null;
    parentHash: string;
    nonce: string | null;
    sha3Uncles: string;
    logsBloom: string | null;
    transactionsRoot: string;
    stateRoot: string;
    miner: string;
    difficulty: BigNumber;
    totalDifficulty: BigNumber;
    extraData: string;
    size: number;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
    uncles: string[];
}
export interface BlockWithoutTransactionData extends AbstractBlock {
    transactions: string[];
}
export interface BlockWithTransactionData extends AbstractBlock {
    transactions: Transaction[];
}
export interface Transaction {
    hash: string;
    nonce: number;
    blockHash: string | null;
    blockNumber: number | null;
    transactionIndex: number | null;
    from: string;
    to: string | null;
    value: BigNumber;
    gasPrice: BigNumber;
    gas: number;
    input: string;
}
export interface CallTxDataBase {
    to?: string;
    value?: number | string | BigNumber;
    gas?: number | string | BigNumber;
    gasPrice?: number | string | BigNumber;
    data?: string;
    nonce?: number;
    accessList?: TxAccessList;
}
export interface TxData extends CallTxDataBase {
    from: string;
}
export interface TxAccessList {
    [address: string]: string[];
}
export interface TxAccessListWithGas {
    accessList: TxAccessList;
    gasUsed: number;
}
export interface GethCallOverrides {
    [address: string]: {
        code?: string;
        nonce?: number;
        balance?: number | string | BigNumber;
    };
}
export interface CallData extends CallTxDataBase {
    from?: string;
    overrides?: GethCallOverrides;
}
export interface FilterObject {
    fromBlock?: number | string;
    toBlock?: number | string;
    blockHash?: string;
    address?: string;
    topics?: LogTopic[];
}
export declare type LogTopic = null | string | string[];
export interface DecodedLogEntry<A> extends LogEntry {
    event: string;
    args: A;
}
export interface DecodedLogEntryEvent<A> extends DecodedLogEntry<A> {
    removed: boolean;
}
export interface LogEntryEvent extends LogEntry {
    removed: boolean;
}
export interface LogEntry {
    logIndex: number | null;
    transactionIndex: number | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: number | null;
    address: string;
    data: string;
    topics: string[];
}
export declare type DecodedLogs = LogWithDecodedArgs<DecodedLogArgs>[];
export interface TxDataPayable extends TxData {
    value?: BigNumber;
}
export declare type TransactionReceiptStatus = null | string | 0 | 1;
export interface TransactionReceipt {
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    status: TransactionReceiptStatus;
    cumulativeGasUsed: number;
    gasUsed: number;
    contractAddress: string | null;
    logs: LogEntry[];
}
export declare enum AbiType {
    Function = "function",
    Constructor = "constructor",
    Event = "event",
    Fallback = "fallback"
}
export declare type ContractEventArg = any;
export interface DecodedLogArgs {
    [argName: string]: ContractEventArg;
}
export interface LogWithDecodedArgs<ArgsType extends DecodedLogArgs> extends DecodedLogEntry<ArgsType> {
}
export declare type RawLog = LogEntry;
export declare enum BlockParamLiteral {
    Earliest = "earliest",
    Latest = "latest",
    Pending = "pending"
}
export declare type BlockParam = BlockParamLiteral | number;
export interface RawLogEntry {
    logIndex: string | null;
    transactionIndex: string | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: string | null;
    address: string;
    data: string;
    topics: string[];
}
export declare enum SolidityTypes {
    Address = "address",
    Bool = "bool",
    Bytes = "bytes",
    Int = "int",
    String = "string",
    Tuple = "tuple",
    Uint256 = "uint256",
    Uint8 = "uint8",
    Uint = "uint"
}
export interface TransactionReceiptWithDecodedLogs extends TransactionReceipt {
    logs: (LogWithDecodedArgs<DecodedLogArgs> | LogEntry)[];
}
export interface TraceParams {
    disableMemory?: boolean;
    disableStack?: boolean;
    disableStorage?: boolean;
    tracer?: string;
    timeout?: string;
}
export declare type OutputField = "*" | "ast" | "legacyAST" | "abi" | "devdoc" | "userdoc" | "metadata" | "ir" | "evm.assembly" | "evm.legacyAssembly" | "evm.bytecode.object" | "evm.bytecode.opcodes" | "evm.bytecode.sourceMap" | "evm.bytecode.linkReferences" | "evm.deployedBytecode.object" | "evm.deployedBytecode.opcodes" | "evm.deployedBytecode.sourceMap" | "evm.deployedBytecode.linkReferences" | "evm.methodIdentifiers" | "evm.gasEstimates" | "ewasm.wast" | "ewasm.wasm";
export interface ContractChains {
    [chainId: number]: ContractChainData;
}
export interface ContractChainData {
    address: string;
    links: {
        [linkName: string]: string;
    };
    constructorArgs: string;
}
export declare type ParamDescription = string;
export interface StandardContractOutput {
    abi: ContractAbi;
    evm: EvmOutput;
    devdoc?: DevdocOutput;
}
export interface StandardOutput {
    errors: SolcError[];
    sources: {
        [fileName: string]: {
            id: number;
            ast?: object;
            legacyAST?: object;
        };
    };
    contracts: {
        [fileName: string]: {
            [contractName: string]: StandardContractOutput;
        };
    };
}
export declare type ErrorType = "JSONError" | "IOError" | "ParserError" | "DocstringParsingError" | "SyntaxError" | "DeclarationError" | "TypeError" | "UnimplementedFeatureError" | "InternalCompilerError" | "Exception" | "CompilerError" | "FatalError" | "Warning";
export declare type ErrorSeverity = "error" | "warning";
export interface SolcError {
    sourceLocation?: SourceLocation;
    type: ErrorType;
    component: "general" | "ewasm";
    severity: ErrorSeverity;
    message: string;
    formattedMessage?: string;
}
export interface SourceLocation {
    file: string;
    start: number;
    end: number;
}
export interface EvmOutput {
    bytecode: EvmBytecodeOutput;
    deployedBytecode: EvmBytecodeOutput;
}
export interface EvmBytecodeOutput {
    linkReferences: EvmBytecodeOutputLinkReferences;
    object: string;
    sourceMap: string;
}
export interface EvmBytecodeOutputLinkReferences {
    [sourceFile: string]: {
        [libraryName: string]: {
            start: number;
            length: number;
        }[];
    };
}
export interface DevdocOutput {
    title?: string;
    author?: string;
    methods: {
        [signature: string]: {
            details?: string;
            params?: {
                [name: string]: ParamDescription;
            };
            return?: string;
        };
    };
}
export interface ContractVersionData {
    compiler: CompilerOpts;
    sources: {
        [sourceName: string]: {
            id: number;
        };
    };
    sourceCodes: {
        [sourceName: string]: string;
    };
    sourceTreeHashHex: string;
    compilerOutput: StandardContractOutput;
}
export interface CompilerOpts {
    name: "solc";
    version: string;
    settings: CompilerSettings;
}
export interface ContractArtifact extends ContractVersionData {
    schemaVersion: string;
    contractName: string;
    chains: ContractChains;
}
export interface GeneratedCompilerOptions {
    name: "solc";
    version: string;
    settings: CompilerSettings;
}
export interface CompilerSettings {
    remappings?: string[];
    optimizer?: OptimizerSettings;
    evmVersion?: "homestead" | "tangerineWhistle" | "spuriousDragon" | "byzantium" | "constantinople";
    metadata?: CompilerSettingsMetadata;
    libraries?: {
        [fileName: string]: {
            [libName: string]: string;
        };
    };
    outputSelection: {
        [fileName: string]: {
            [contractName: string]: OutputField[];
        };
    };
}
export interface CompilerSettingsMetadata {
    useLiteralContent: true;
}
export interface OptimizerSettings {
    enabled: boolean;
    runs?: number;
}
export interface Source {
    id: number;
}
export interface CompilerOptions {
    contractsDir?: string;
    artifactsDir?: string;
    compilerSettings?: CompilerSettings;
    contracts?: string[] | "*";
    useDockerisedSolc?: boolean;
    isOfflineMode?: boolean;
    solcVersion?: string;
    shouldSaveStandardInput?: boolean;
    shouldCompileIndependently?: boolean;
}
export interface BlockRange {
    fromBlock: BlockParam;
    toBlock: BlockParam;
}
//# sourceMappingURL=types.d.ts.map