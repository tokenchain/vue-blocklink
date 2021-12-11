import BlockWrap from "../abi/BlockWrap"
import MetaMaskOnboarding from "@metamask/onboarding";
import Web3 from "web3";
import DetectionFunc from "@metamask/detect-provider"
import {ExplainNetworkById, GetMetaNetConfig} from "../utils/ethereumnetworks";
import {WebSocketProvider, Web3Provider} from '@ethersproject/providers';
import {WalletSupport} from "../base/wallet";

export default {
    data() {
        return {
            ethereum: false,
            wsProvider: false,
            blockLink: false,
            signedInConnection: false,
            netID: 1,         // user metamask id
            networkId: -1,
            Web3Interval: 0,
            AccountInterval: 0,
            NetworkInterval: 0,
            stateLog: null,
            isMetamaskInterfaced: false,
            onboarding: false,
            w3: false,
            MetamaskMsg: {
                LOAD_METAMASK_WALLET_ERROR: "Loading metamask error, please try later",
                EMPTY_METAMASK_ACCOUNT: "Please log in to your metamask to continue with this app.",
                NETWORK_ERROR: "The connection is abnormal, please try again",
                METAMASK_NOT_INSTALL_OR_DISCONNECTED: "Please install metamask for this application",
                METAMASK_TEST_NET: "Currently not in the main network.",
                METAMASK_MAIN_NET: "Currently Main network",
                METAMASK_SWITCH_NET: "Please switch this net to",
                USER_DENIED_ACCOUNT_AUTHORIZATION: "User denied account authorization",
                REJECTED_BY_USER: "The request is rejected by the user.",
                PARAMETERS_WERE_INVALID: "the parameter were invalid",
                INTERNAL_ERROR: "internal error",
                USER_DENIED: "user denied",
                DISCONNECTED: "disconnected"
            },
            metamask_debug: false,
            walletSupports: {
                imtoken: false,
                metamask: false
            }
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
        matchChainId(requiredId) {
            return parseInt(this.netID) === parseInt(requiredId)
        },
        async checkFinalStep() {
            if (!this.ethereum) {
                this.checkError("METAMASK_NOT_INSTALL_OR_DISCONNECTED")
            } else {

                if (this.ethereum.isConnected()) {
                    //console.log("monitor.")
                    this.monitor()
                    //console.log("init blockwrap now.")
                    this.init_blockwrap()
                    //console.log("signing in now.")
                    this.sign_in()
                    //console.log("check socket in now.")
                    await this.connect_ws();
                } else {
                    console.log("ethereum is not connected yet.")
                    window.addEventListener("ethereum#initialized", this.checkWeb3MetaMask, {
                        once: true,
                    });
                    setTimeout(this.checkWeb3MetaMask, 3000); // 3 seconds
                }
            }
            clearInterval(this.Web3Interval)
        },
        async checkWeb3MetaMask() {
            let chainId, installed = false;
            if (window) {
                try {
                    if (!this.ethereum) {
                        //detection for metamask
                        const provider = await DetectionFunc()
                        if (provider) {
                            chainId = await provider.request({
                                method: "eth_chainId"
                            })
                            this.ethereum = window.ethereum
                            const w3tokenc = new Web3(window.ethereum);
                            this.w3 = w3tokenc
                            window.web3 = w3tokenc
                            this.netID = chainId
                            installed = true
                        }
                    }
                } catch (e) {
                }

                try {
                    if (!this.ethereum && window.hasOwnProperty("ethereum")) {
                        //detection for imtoken
                        await window.ethereum.enable()
                        this.ethereum = window.ethereum
                        const w3imtoken = new Web3(this.ethereum)
                        this.w3 = w3imtoken
                        window.web3 = w3imtoken
                        const provider = new Web3Provider(window.ethereum)
                        chainId = await provider.request({
                            method: "eth_chainId"
                        })
                        this.netID = chainId
                        installed = true
                    }
                } catch (e) {
                }

                if (!installed) {
                    this.checkError("METAMASK_NOT_INSTALL_OR_DISCONNECTED")
                    this.$emit("notify_metamask_not_install")
                } else {
                    await this.checkFinalStep()
                }

            }
        },
        init_blockwrap() {
            if (!this.blockLink) {
                // console.log(this.w3, this.ethereum)
                this.blockLink = new BlockWrap(this.w3, this.ethereum)
                this.isMetamaskInterfaced = true
                this.blockLink.setDebug(this.metamask_debug)
                this.blockLink.setHandlers(
                    this.handleConfirm,
                    this.handleBroadcast,
                    this.handleErrors
                )
                this.blockLink.setWallet(WalletSupport.UNKNOWN)
                if (this.ethereum.hasOwnProperty("isImToken")) {
                    console.log("imtoken detected.")
                    this.walletSupports.imtoken = true
                    this.blockLink.setWallet(WalletSupport.IMTOKEN)
                }
                if (this.ethereum.hasOwnProperty("isMetaMask")) {
                    console.log("metamask detected.")
                    this.walletSupports.metamask = true
                    this.blockLink.setWallet(WalletSupport.METAMASK)
                }
            }
        },
        monitor() {
            this.ethereum.on("accountsChanged", (accounts) => {
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
            this.ethereum.on("chainChanged", (chainId) => {
                // Handle the new chain.
                // Correctly handling chain changes can be complicated.
                // We recommend reloading the page unless you have good reason not to.
                this.netID = chainId
                this.$emit("notify_node_change")
                window.location.reload();
            });
            this.ethereum.on("connect", (connectInfo) => {
                console.log(connectInfo)
                console.log("on connect")
                //this.notify_block_installed()
            });
            this.ethereum.on("disconnect", (error) => {
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
            this.ethereum.on("message", (message) => {
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
                .request({method: "eth_requestAccounts"})
                .then(this.handleAccountsChanged)
                .catch(this.handleErrors);
        },
        handleAccountsChanged(acc) {
            if (this.blockLink) {
                if (acc.length > 0) {
                    this.signedInConnection = true
                    this.notify_block_installed()
                    this.blockLink.setAccounts(acc)
                } else {
                    this.checkError("DISCONNECTED")
                }
            }
        },
        handleErrors(error) {
            if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                // console.log("Please connect to MetaMask.");
                this.checkError("USER_DENIED")
            } else if (error.code === -32002) {
                console.log("Please connection to sign in confirmation.");
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
                console.log("success confirmed")
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
        async connect_ws() {
            const network_id = await this.w3.eth.net.getId()
            this.netID = network_id
            const {name, network} = ExplainNetworkById(network_id)
            if (this.blockLink) {
                console.log(`Now it is connected to ${name} ${network}`)
            }
            if (this.walletSupports.imtoken) {
                return
            }
            const {rpcUrls} = GetMetaNetConfig(network_id)
            try {
                rpcUrls.forEach((url, i) => {
                    if (url.substring(0, 2) === "ws") {
                        this.wsProvider = new WebSocketProvider(url)
                        return false
                    }
                    if (url.substring(0, 3) === "wss") {
                        this.wsProvider = new WebSocketProvider(url)
                        return false
                    }
                })
            } catch (e) {
                console.log("failed in socket connection")
            }

            if (this.wsProvider !== false) {
                this.wsHandler(this.wsProvider)
            }
        },
        wsHandler(ws_provider) {
            ws_provider.on("block", blocknumber => {
                this.$emit("notify_block_generation", blocknumber)
            })
        },
        checkRequiredNetwork(network_Id) {
            if (network_Id === parseInt(this.netID)) {
                return true;
            } else {
                this.checkError("METAMASK_SWITCH_NET")
                return false;
            }
        },
        registerOnBoard() {
            if (MetaMaskOnboarding.isMetaMaskInstalled()) {
                this.onboarding.stopOnboarding();
                console.log("stop on board")
                this.$emit("notify_metamask_stop_on_board")
            } else {
                this.onboarding.startOnboarding();
                console.log("start on board")
                this.$emit("notify_metamask_start_on_board")
            }
        },
    }
    ,
    mounted() {
        this.$nextTick(async () => {
            this.onboarding = new MetaMaskOnboarding();
            await this.checkWeb3MetaMask()
        })
    }
}
;
