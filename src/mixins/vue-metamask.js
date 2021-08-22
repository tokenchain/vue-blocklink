import {explainNetworkById} from "../utils/ethereumnetworks";
import BlockAcon from "../abi/BlockAcon"
import NODES from "../utils/const";
import Detection from "@metamask/detect-provider"
import ethUtil from "ethereumjs-util"
import sigUtil from "eth-sig-util"
import MetaMaskOnboarding from '@metamask/onboarding';

export default {
    data() {
        return {
            ethereum: false,
            blockAccon: false,
            MetaMaskId: "1",        // main net netID
            netID: '1',             // user metamask id
            networkId: -1,
            MetaMaskAddress: "",    // user Address
            Web3Interval: 0,
            AccountInterval: 0,
            NetworkInterval: 0,
            stateLog: null,
            isMetamaskInterfaced: false,
            onboarding: false,
            type: "INIT",
            MetamaskMsg: {
                LOAD_METAMASK_WALLET_ERROR: 'Loading metamask error, please try later',
                EMPTY_METAMASK_ACCOUNT: 'Please log in to your metamask to continue with this app.',
                NETWORK_ERROR: 'The connection is abnormal, please try again',
                METAMASK_NOT_INSTALL: 'Please install metamask for this application',
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
        notify_account_changed(acc) {
            this.$emit("notify_account_changed", acc)
        },
        notify_block_installed() {
            this.$emit("notify_block_installed")
        },
        checkError(key) {
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
                        this.netID = chainId
                        clearInterval(this.Web3Interval)
                    }
                }

                if (window.hasOwnProperty("web3")) {
                    if (!this.ethereum) {
                        this.ethereum = window.web3
                        clearInterval(this.Web3Interval)
                    }
                }

                if (!this.blockAccon) {
                    this.blockAccon = new BlockAcon(this.ethereum)
                    this.isMetamaskInterfaced = true
                    this.blockAccon.setErrorHandler(this.handleErrors)
                }

                if (!this.ethereum) {
                    this.checkError("METAMASK_NOT_INSTALL")
                } else {
                    if (this.ethereum.isConnected()) {
                        this.notify_block_installed()
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
                    this.checkError("METAMASK_NOT_INSTALL")
                } else {
                    this.notify_account_changed(accounts[0])
                }
            });
            this.ethereum.on('chainChanged', (chainId) => {
                // Handle the new chain.
                // Correctly handling chain changes can be complicated.
                // We recommend reloading the page unless you have good reason not to.
                this.netID = chainId
                window.location.reload();
            });
            this.ethereum.on('connect', (connectInfo) => {

            });
            this.ethereum.on('disconnect', (error) => {
                if (error.code === 4001) {
                    this.checkError("REJECTED_BY_USER")
                } else if (error.code === -32602) {
                    this.checkError("PARAMETERS_WERE_INVALID")
                } else if (error.code === -32603) {
                    this.checkError("INTERNAL_ERROR")
                }
            });
            this.ethereum.on('message', (message) => {
                /*    interface ProviderMessage {
                        type: string;
                        data: unknown;
                    }*/
                if (this.metamask_debug) {
                    console.log(message)
                }
                if (this.blockAccon) {
                    this.blockAccon.eventListener(message, this)
                }
            });
            //start the account registrations
            this.ethereum
                .request({method: 'eth_requestAccounts'})
                .then(this.handleAccountsChanged)
                .catch(this.handleErrors);
        },
        handleAccountsChanged(acc) {
        },
        handleErrors(error) {
            if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                console.log('Please connect to MetaMask.');
                this.checkError("USER_DENIED")
            } else {
                console.error(error);
            }
        },
        checkAccounts() {
            if (!this.ethereum) return;

            this.web3.eth.getAccounts((err, accounts) => {
                if (err != null) {
                    this.checkError("NETWORK_ERROR")
                    return;
                }
                if (accounts.length === 0) {
                    this.MetaMaskAddress = "";
                    this.checkError("EMPTY_METAMASK_ACCOUNT")
                    return;
                }
                this.MetaMaskAddress = accounts[0]; // user Address
            });
        },
        async metamask_switch_chain(chainID) {
            try {
                await this.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: '0xf00'}],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (error.code === 4902) {
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
        checkNetWork() {
            this.ethereum.version.getNetwork((err, netID) => {
                if (err != null) {
                    // return this.Log(this.MetamaskMsg.NETWORK_ERROR, "NETWORK_ERROR");
                    this.checkError("NETWORK_ERROR")
                    return;
                }
                this.netID = netID;    //User MetaMask's current status
                if (this.MetaMaskAddress !== '') {
                    const {name, network, networkId} = explainNetworkById(netID)
                    let message = ""
                    let networktype = ""
                    if (networkId === 1) {
                        message = `${this.MetamaskMsg.METAMASK_MAIN_NET} by ${name}`
                        networktype = "MAINNET"
                    } else {
                        if (network.toUpperCase() === "TESTNET") {
                            networktype = "TESTNET"
                            message = `${this.MetamaskMsg.METAMASK_TEST_NET} by ${name}`
                        } else {
                            networktype = network.toUpperCase()
                            message = `${this.MetamaskMsg.METAMASK_MAIN_NET} by ${name}`
                        }
                    }
                    return this.Log(message, networktype);
                }
            })
        },
        checkRequiredNetwork(id) {
            this.networkId = id
            if (this.networkId === parseInt(this.netID)) {
                return true;
            } else {
                this.checkError("METAMASK_SWITCH_NET")
                return false;
            }
        },
        async register_onboarding() {
            return await this.ethereumCore
                .request({
                    method: 'wallet_registerOnboarding',
                })
        },
        Log(msg, type = "") {
            const letType = type;
            if (letType === this.type) return;
            const message = this.userMessage === "null" ? msg : this.userMessage;
            this.type = type;
            this.$emit("onComplete", {
                web3: this.ethereum,
                type,
                metaMaskAddress: this.MetaMaskAddress,
                message,
                netID: this.netID,
            });
        },
        web3TimerCheck(web3) {
            this.ethereum = web3;
            this.checkAccounts();
            this.checkNetWork();
            this.Web3Interval = setInterval(async () => {
                await this.checkWeb3MetaMask()
                clearInterval(this.Web3Interval)
            }, 1000);
            this.AccountInterval = setInterval(() => {
                this.checkAccounts()
                clearInterval(this.AccountInterval)
            }, 1500);
            this.NetworkInterval = setInterval(() => {
                this.checkNetWork()
                clearInterval(this.NetworkInterval)
            }, 2000);
        },
        registerOnBoard() {
            if (MetaMaskOnboarding.isMetaMaskInstalled()) {
                this.onboarding.stopOnboarding();
            } else {
                this.onboarding.startOnboarding();
            }
        },
    },

    async mounted() {
        this.nextTick(async () => {
            this.onboarding = new MetaMaskOnboarding();
            await this.checkWeb3MetaMask()
        })
    }
};
