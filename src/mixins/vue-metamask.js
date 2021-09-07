import {explainNetworkById} from "../utils/ethereumnetworks";
import BlockWrap from "../abi/BlockWrap"
import Detection from "@metamask/detect-provider"
import MetaMaskOnboarding from '@metamask/onboarding';
import Web3 from "web3";

export default {
    data() {
        return {
            ethereum: false,
            blockLink: false,
            signedInConnection: false,
            MetaMaskId: "1",  // main net netID
            netID: 1,         // user metamask id
            networkId: -1,
            Web3Interval: 0,
            AccountInterval: 0,
            NetworkInterval: 0,
            stateLog: null,
            isMetamaskInterfaced: false,
            onboarding: false,
            type: "INIT",
            w3: false,
            MetamaskMsg: {
                LOAD_METAMASK_WALLET_ERROR: 'Loading metamask error, please try later',
                EMPTY_METAMASK_ACCOUNT: 'Please log in to your metamask to continue with this app.',
                NETWORK_ERROR: 'The connection is abnormal, please try again',
                METAMASK_NOT_INSTALL_OR_DISCONNECTED: 'Please install metamask for this application',
                METAMASK_TEST_NET: 'Currently not in the main network.',
                METAMASK_MAIN_NET: 'Currently Main network',
                METAMASK_SWITCH_NET: 'Please switch this net to',
                USER_DENIED_ACCOUNT_AUTHORIZATION: 'User denied account authorization',
                REJECTED_BY_USER: 'The request is rejected by the user.',
                PARAMETERS_WERE_INVALID: 'the parameter were invalid',
                INTERNAL_ERROR: 'internal error',
                USER_DENIED: 'user denied'
            },
            metamask_debug: false
        };
    },
    methods: {
        notify_block_not_install() {
            this.$emit("notify_block_not_install")
        },
        notify_account_changed(accList) {
            this.$emit("notify_account_changed", accList)
        },
        notify_block_installed() {
            this.$emit("notify_block_installed")
        },
        checkError(key) {
            console.log(key)
        },
        async checkWeb3MetaMask() {
            if (window) {
                if (!this.ethereum) {
                    const provider = await Detection()
                    if (provider) {
                        const chainId = await provider.request({
                            method: 'eth_chainId'
                        })
                        this.ethereum = window.ethereum
                        const W3epp = new Web3(window.ethereum);
                        this.w3 = W3epp
                        window.web3 = W3epp
                        this.netID = chainId
                        clearInterval(this.Web3Interval)
                    }
                }

                if (window.hasOwnProperty("web3")) {
                    if (!this.ethereum) {
                        clearInterval(this.Web3Interval)
                    }
                }

                if (!this.blockLink) {
                    this.blockLink = new BlockWrap(this.w3, this.ethereum)
                    this.isMetamaskInterfaced = true
                    this.blockLink.setHandlers(
                        this.handleConfirm,
                        this.handleBroadcast,
                        this.handleErrors
                    )
                }

                if (!this.ethereum) {
                    this.checkError("METAMASK_NOT_INSTALL_OR_DISCONNECTED")
                } else {
                    if (this.ethereum.isConnected()) {
                        this.monitor()
                        await this.checkNetWork();
                        this.sign_in()
                    } else {
                        window.addEventListener('ethereum#initialized', this.checkWeb3MetaMask, {
                            once: true,
                        });
                        setTimeout(this.checkWeb3MetaMask, 3000); // 3 seconds
                    }
                }
            }
        },
        monitor() {
            this.ethereum.on('accountsChanged', (accounts) => {
                // Handle the new accounts, or lack thereof.
                // "accounts" will always be an array, but it can be empty.
                if (accounts.length === 0) {
                    this.signedInConnection = false
                    this.checkError("METAMASK_NOT_INSTALL_OR_DISCONNECTED")
                } else {
                    this.signedInConnection = true
                    this.notify_account_changed(accounts)
                }
            });
            this.ethereum.on('chainChanged', (chainId) => {
                // Handle the new chain.
                // Correctly handling chain changes can be complicated.
                // We recommend reloading the page unless you have good reason not to.
                this.netID = chainId
                this.$emit("notify_node_change")
                window.location.reload();
            });
            this.ethereum.on('connect', (connectInfo) => {
                console.log(connectInfo)
                console.log("on connect")
                //this.notify_block_installed()
            });
            this.ethereum.on('disconnect', (error) => {
                if (error.code === 4001) {
                    this.checkError("REJECTED_BY_USER")
                } else if (error.code === -32602) {
                    this.checkError("PARAMETERS_WERE_INVALID")
                } else if (error.code === -32603) {
                    this.checkError("INTERNAL_ERROR")
                } else {
                    console.log("on disconnect")
                }
            });
            this.ethereum.on('message', (message) => {
                /*    interface ProviderMessage {
                        type: string;
                        data: unknown;
                    }*/
                if (this.metamask_debug) {
                    console.log("on message now")
                    console.log(message)
                }
                if (this.blockLink) {
                    this.blockLink.eventListener(message, this)
                }
            });
        },
        sign_in() {
            //start the account registrations
            this.ethereum
                .request({method: 'eth_requestAccounts'})
                .then(this.handleAccountsChanged)
                .catch(this.handleErrors);
        },
        handleAccountsChanged(acc) {
            if (this.blockLink) {
                if (acc.length > 0) {
                    this.signedInConnection = true
                    this.notify_block_installed()
                }
                this.blockLink.setAccounts(acc)
            }
        },
        handleErrors(error) {
            if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                this.checkError("USER_DENIED")
            } else if (error.code === -32002) {
                console.log('Please connection to sign in confirmation.');
            } else {
                console.error(error);
            }
        },
        handleHash(hash) {
            console.log(hash)
        },
        handleBroadcast(receipt) {
            console.log(receipt)
        },
        handleConfirm(confirmation_num) {
            if (confirmation_num === 3) {
                console.log(`success confirmed`)
            }
        },
        async checkAccounts() {
            if (!this.ethereum) return;
            if (!this.w3) return;
            try {
                let acct = await this.w3.eth.getAccounts();
                if (acct.length === 0) {
                    this.checkError("EMPTY_METAMASK_ACCOUNT")
                    return;
                }
                this.handleAccountsChanged(acct)
            } catch (e) {
                console.log("error from check accounts")
                this.handleErrors(e)
            }
        },
        async metamask_switch_chain(chainID) {
            try {
                await this.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: '0xf00'}],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await this.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{chainId: '0xf00', rpcUrl: 'https://...' /* ... */}],
                        });
                    } catch (addError) {
                        // handle "add" error
                    }
                }
                // handle other "switch" errors
            }
        },
        async checkNetWork() {
            const network_id = await this.w3.eth.net.getId()
            this.netID = network_id
            const {name, network, networkId} = explainNetworkById(network_id)
            if (this.blockLink) {
                console.log(`Now it is connected to ${name} ${network}`)
            }
        },
        checkRequiredNetwork(network_Id) {
            if (network_Id === parseInt(this.netID)) {
                return true;
            } else {
                this.checkError("METAMASK_SWITCH_NET")
                return false;
            }
        },
        Log(msg, type = "") {
            this.$emit("onComplete");
        },
        registerOnBoard() {
            if (MetaMaskOnboarding.isMetaMaskInstalled()) {
                this.onboarding.stopOnboarding();
                console.log("stop on board")
            } else {
                this.onboarding.startOnboarding();
                console.log("start on board")
            }
        },
    },
    mounted() {
        this.$nextTick(async () => {
            this.onboarding = new MetaMaskOnboarding();
            await this.checkWeb3MetaMask()
        })
    }
};
