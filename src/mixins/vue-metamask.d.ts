declare namespace _default {
    export function data(): {
        ethereum: boolean;
        wsProvider: boolean;
        blockLink: boolean;
        signedInConnection: boolean;
        netID: number;
        networkId: number;
        Web3Interval: number;
        AccountInterval: number;
        NetworkInterval: number;
        stateLog: null;
        isMetamaskInterfaced: boolean;
        onboarding: boolean;
        w3: boolean;
        MetamaskMsg: {
            LOAD_METAMASK_WALLET_ERROR: string;
            EMPTY_METAMASK_ACCOUNT: string;
            NETWORK_ERROR: string;
            METAMASK_NOT_INSTALL_OR_DISCONNECTED: string;
            METAMASK_TEST_NET: string;
            METAMASK_MAIN_NET: string;
            METAMASK_SWITCH_NET: string;
            USER_DENIED_ACCOUNT_AUTHORIZATION: string;
            REJECTED_BY_USER: string;
            PARAMETERS_WERE_INVALID: string;
            INTERNAL_ERROR: string;
            USER_DENIED: string;
            DISCONNECTED: string;
        };
        metamask_debug: boolean;
        walletSupports: {
            imtoken: boolean;
            metamask: boolean;
        };
    };
    export function data(): {
        ethereum: boolean;
        wsProvider: boolean;
        blockLink: boolean;
        signedInConnection: boolean;
        netID: number;
        networkId: number;
        Web3Interval: number;
        AccountInterval: number;
        NetworkInterval: number;
        stateLog: null;
        isMetamaskInterfaced: boolean;
        onboarding: boolean;
        w3: boolean;
        MetamaskMsg: {
            LOAD_METAMASK_WALLET_ERROR: string;
            EMPTY_METAMASK_ACCOUNT: string;
            NETWORK_ERROR: string;
            METAMASK_NOT_INSTALL_OR_DISCONNECTED: string;
            METAMASK_TEST_NET: string;
            METAMASK_MAIN_NET: string;
            METAMASK_SWITCH_NET: string;
            USER_DENIED_ACCOUNT_AUTHORIZATION: string;
            REJECTED_BY_USER: string;
            PARAMETERS_WERE_INVALID: string;
            INTERNAL_ERROR: string;
            USER_DENIED: string;
            DISCONNECTED: string;
        };
        metamask_debug: boolean;
        walletSupports: {
            imtoken: boolean;
            metamask: boolean;
        };
    };
    export namespace methods {
        export function notify_block_not_install(): void;
        export function notify_block_not_install(): void;
        export function notify_account_changed(accList: any): void;
        export function notify_account_changed(accList: any): void;
        export function notify_block_installed(): void;
        export function notify_block_installed(): void;
        export function checkError(key: any): void;
        export function checkError(key: any): void;
        export function matchChainId(requiredId: any): boolean;
        export function matchChainId(requiredId: any): boolean;
        export function checkFinalStep(): Promise<void>;
        export function checkFinalStep(): Promise<void>;
        export function checkWeb3MetaMask(): Promise<void>;
        export function checkWeb3MetaMask(): Promise<void>;
        export function init_blockwrap(): void;
        export function init_blockwrap(): void;
        export function monitor(): void;
        export function monitor(): void;
        export function sign_in(): void;
        export function sign_in(): void;
        export function handleAccountsChanged(acc: any): void;
        export function handleAccountsChanged(acc: any): void;
        export function handleErrors(error: any): void;
        export function handleErrors(error: any): void;
        export function handleHash(hash: any): void;
        export function handleHash(hash: any): void;
        export function handleBroadcast(receipt: any): void;
        export function handleBroadcast(receipt: any): void;
        export function handleConfirm(confirmation_num: any): void;
        export function handleConfirm(confirmation_num: any): void;
        export function checkAccounts(): Promise<void>;
        export function checkAccounts(): Promise<void>;
        export function connect_ws(): Promise<void>;
        export function connect_ws(): Promise<void>;
        export function wsHandler(ws_provider: any): void;
        export function wsHandler(ws_provider: any): void;
        export function checkRequiredNetwork(network_Id: any): boolean;
        export function checkRequiredNetwork(network_Id: any): boolean;
        export function registerOnBoard(): void;
        export function registerOnBoard(): void;
    }
    export function mounted(): void;
    export function mounted(): void;
}
export default _default;
//# sourceMappingURL=vue-metamask.d.ts.map