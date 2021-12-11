import BN from 'bn.js';
import { DecodedLogArgs } from "..";
import { BaseContract } from "..";
import { provider } from 'web3-core';
import { AbiItem } from 'web3-utils';
import Web3 from "web3";
export interface ContractInterface {
    addMinter(account: string): Promise<void>;
    allowance(owner: string, spender: string): Promise<BN>;
    approve(spender: string, amount: BN): Promise<void>;
    balanceOf(account: string): Promise<BN>;
    burn(amount: BN): Promise<void>;
    burnFrom(account: string, amount: BN): Promise<void>;
    cap(): Promise<BN>;
    decimals(): Promise<BN>;
    decreaseAllowance(spender: string, subtractedValue: BN): Promise<boolean>;
    getDecimals(): Promise<BN>;
    gov(): Promise<string>;
    increaseAllowance(spender: string, addedValue: BN): Promise<boolean>;
    isMinter(account: string): Promise<boolean>;
    mint(account: string, amount: BN): Promise<boolean>;
    name(): Promise<string>;
    removeMinter(account: string): Promise<void>;
    renounceMinter(): Promise<void>;
    symbol(): Promise<string>;
    tokenName(): Promise<string>;
    tokenSymbol(): Promise<string>;
    totalSupply(): Promise<BN>;
    transfer(recipient: string, amount: BN): Promise<boolean>;
    transferFrom(sender: string, recipient: string, amount: BN): Promise<boolean>;
}
export declare enum Ori20Events {
    Approval = "Approval",
    MinterAdded = "MinterAdded",
    MinterRemoved = "MinterRemoved",
    Transfer = "Transfer"
}
export interface Ori20ApprovalEventArgs extends DecodedLogArgs {
    owner: string;
    spender: string;
    value: BN;
}
export interface Ori20MinterAddedEventArgs extends DecodedLogArgs {
    account: string;
}
export interface Ori20MinterRemovedEventArgs extends DecodedLogArgs {
    account: string;
}
export interface Ori20TransferEventArgs extends DecodedLogArgs {
    from: string;
    to: string;
    value: BN;
}
export declare type Ori20EventArgs = Ori20ApprovalEventArgs | Ori20MinterAddedEventArgs | Ori20MinterRemovedEventArgs | Ori20TransferEventArgs;
export declare class Ori20Contract extends BaseContract implements ContractInterface {
    static deployedBytecode: string | undefined;
    static readonly contractName = "Ori20";
    private readonly _methodABIIndex;
    static Instance(): (Ori20Contract | any | boolean);
    static init(contract_address: string, supportedProvider: provider, ww3: Web3): Promise<Ori20Contract>;
    static ABI(): AbiItem[];
    addMinter(account: string): Promise<void>;
    addMinterGas(account: string): Promise<number>;
    allowance(owner: string, spender: string): Promise<BN>;
    allowanceGas(owner: string, spender: string): Promise<number>;
    approve(spender: string, amount: any): Promise<void>;
    approveGas(spender: string, amount: BN): Promise<number>;
    balanceOf(account: string): Promise<BN>;
    balanceOfGas(account: string): Promise<number>;
    burn(amount: BN): Promise<void>;
    burnGas(amount: BN): Promise<number>;
    burnFrom(account: string, amount: BN): Promise<void>;
    burnFromGas(account: string, amount: BN): Promise<number>;
    cap(): Promise<BN>;
    capGas(): Promise<number>;
    decimals(): Promise<BN>;
    decimalsGas(): Promise<number>;
    decreaseAllowance(spender: string, subtractedValue: BN): Promise<boolean>;
    decreaseAllowanceGas(spender: string, subtractedValue: BN): Promise<number>;
    getDecimals(): Promise<BN>;
    getDecimalsGas(): Promise<number>;
    gov(): Promise<string>;
    govGas(): Promise<number>;
    increaseAllowance(spender: string, addedValue: BN): Promise<boolean>;
    increaseAllowanceGas(spender: string, addedValue: BN): Promise<number>;
    isMinter(account: string): Promise<boolean>;
    isMinterGas(account: string): Promise<number>;
    mint(account: string, amount: BN): Promise<boolean>;
    mintGas(account: string, amount: BN): Promise<number>;
    name(): Promise<string>;
    nameGas(): Promise<number>;
    removeMinter(account: string): Promise<void>;
    removeMinterGas(account: string): Promise<number>;
    renounceMinter(): Promise<void>;
    renounceMinterGas(): Promise<number>;
    symbol(): Promise<string>;
    symbolGas(): Promise<number>;
    tokenName(): Promise<string>;
    tokenNameGas(): Promise<number>;
    tokenSymbol(): Promise<string>;
    tokenSymbolGas(): Promise<number>;
    totalSupply(): Promise<BN>;
    totalSupplyGas(): Promise<number>;
    transfer(recipient: string, amount: BN): Promise<boolean>;
    transferGas(recipient: string, amount: BN): Promise<number>;
    transferFrom(sender: string, recipient: string, amount: BN): Promise<boolean>;
    transferFromGas(sender: string, recipient: string, amount: BN): Promise<number>;
    constructor(address: string, supportedProvider: provider, ww3: Web3);
}
//# sourceMappingURL=ori20.d.ts.map