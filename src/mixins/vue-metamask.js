import {explainNetworkById} from "../utils/ethereumnetworks";

export default {
    data() {
        return {
            web3: null,
            MetaMaskId: "1",        // main net netID
            netID: '1',             // user metamask id
            MetaMaskAddress: "",    // user Address
            Web3Interval: null,
            AccountInterval: null,
            NetworkInterval: null,
            stateLog: null,
            isComplete: false,
            type: "INIT",
            MetamaskMsg: {
                LOAD_MATAMASK_WALLET_ERROR: 'Loading metamask error, please try later',
                EMPTY_METAMASK_ACCOUNT: 'Please log in to your metamask to continue with this app.',
                NETWORK_ERROR: 'The connection is abnormal, please try again',
                METAMASK_NOT_INSTALL: 'Please install metamask for this application',
                METAMASK_TEST_NET: 'Currently not in the main network.',
                METAMASK_MAIN_NET: 'Currently Main network',
                USER_DENIED_ACCOUNT_AUTHORIZATION: 'User denied account authorization',
            }
        };
    },
    methods: {
        checkWeb3MetaMask() {
            if (window && window.hasOwnProperty("web3")) {
                clearInterval(this.Web3Interval)
                this.web3 = window.web3
            } else {
                this.web3 = null;
                this.Log(this.MetamaskMsg.METAMASK_NOT_INSTALL, "NO_INSTALL_METAMASK");
            }
        },
        checkAccounts() {
            if (this.web3 === null) return;
            this.web3.eth.getAccounts((err, accounts) => {
                console.log();

                if (err != null) return this.Log(this.MetamaskMsg.NETWORK_ERROR, "NETWORK_ERROR");
                if (accounts.length === 0) {
                    this.MetaMaskAddress = "";
                    this.Log(this.MetamaskMsg.EMPTY_METAMASK_ACCOUNT, 'NO_LOGIN');
                    return;
                }
                this.MetaMaskAddress = accounts[0]; // user Address
            });
        },
        checkNetWork() {
            this.web3.version.getNetwork((err, netID) => {
                if (err != null) return this.Log(this.MetamaskMsg.NETWORK_ERROR, "NETWORK_ERROR");
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
        Log(msg, type = "") {
            const letType = type;
            if (letType === this.type) return;
            const message = this.userMessage === "null" ? msg : this.userMessage;
            this.type = type;
            this.$emit("onComplete", {
                web3: this.web3,
                type,
                metaMaskAddress: this.MetaMaskAddress,
                message,
                netID: this.netID,
            });
        },
        web3TimerCheck(web3) {
            this.web3 = web3;
            this.checkAccounts();
            this.checkNetWork();
            this.Web3Interval = setInterval(() => this.checkWeb3MetaMask(), 1000);
            this.AccountInterval = setInterval(() => this.checkAccounts(), 1000);
            this.NetworkInterval = setInterval(() => this.checkNetWork(), 1000);
        }
    },
    async mounted() {
        if (window) {
            if (window.hasOwnProperty("ethereum")) {
                const ethereum = window.ethereum
                window.web3 = new Web3(ethereum)
                try {
                    await ethereum.enable();
                    this.web3TimerCheck(window.web3);
                } catch (error) {
                    this.Log(this.MetamaskMsg.USER_DENIED_ACCOUNT_AUTHORIZATION, "USER_DENIED_ACCOUNT_AUTHORIZATION");
                }
            } else if (window.hasOwnProperty("web3")) {
                window.web3 = new Web3(web3.currentProvider);
                this.web3TimerCheck(window.web3);
            } else {
                this.web3 = null;
                this.Log(this.MetamaskMsg.METAMASK_NOT_INSTALL, "NO_INSTALL_METAMASK");
                console.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        }
    }
};
