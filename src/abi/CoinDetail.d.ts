import { Balancer, Spending, Web3ERC20Token, Unlimited } from "../base/eth/types";
import { Ori20Contract } from "./ori20";
export default class CoinDetail implements Web3ERC20Token {
    address: string;
    decimal: number;
    tokenName: string;
    tokenSymbol: string;
    holder: Balancer;
    spender: Spending;
    unlimited: Unlimited;
    constructor(address: string, dec: any, sym: string, name: string);
    setHolder(address: string, bal: any): void;
    runAllowanceAmount(contract: Ori20Contract, owner_address: string, spender: string): Promise<void>;
    setSpenderExtreme(coin_owner: string, spender: string, isAll: boolean): boolean;
    setSpenderNormal(coin_owner: string, spender: string, allowance: number): boolean;
    name(): string;
    symbol(): string;
    amountCode(address: string): number;
    balance(address: string): number;
    byFloat(address: string): number;
    showAllowance(coin_owner: string, spender: string): number;
    showAllowed(coin_owner: string, spender: string): boolean;
    approvalStatus(coin_owner: string, spender: string): any;
    private _setDeep;
}
//# sourceMappingURL=CoinDetail.d.ts.map