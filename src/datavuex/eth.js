// import web3Abi from "web3-eth-abi";
import Web3 from "web3"
import _ from "lodash"

const web3utils = Web3.utils
const core = Web3
// import { web3utils, core } from "../plugins/staticweb3";
// import instance from "../plugins/web3";
// documentation for web3-ss
// https://second-state.github.io/web3-ss.js/api/ss.html#web3-ss-syncing

const state = {
    user_account: "",
    founder_account: "",
    network_name: "",
    contract_address: "",
    contract_balance: 0,
    isPermissioned: false,
    isfounder: false,
    islogin: false,
    isPasteBinInit: false,
    health: false,
    install_state: 0,
    network_balance: 0,
    sync_count: 0,
    decimals: 0,
    w3instance: "",
    tokenlist: {},
    tokenFlatList: [],
    console_items: []
}

const mutations = {
    PASTE_BIN_INIT(state, payload) {
        state.isPasteBinInit = true
    },
    USER_ACCOUNT_INIT(state, payload) {
        // store web3 user account
        state.user_account = payload
        state.islogin = true
    },
    USER_BASIC(state, {founder}) {
        state.founder_account = founder
    },
    IS_FOUNDER(state, b) {
        state.isfounder = b
    },
    PERMISSION(state, b) {
        state.isPermissioned = b
    },
    ETH_BAL(state, payload) {
        // store web3 user account
        state.network_balance = payload
    },
    CLEAR_ITEM(state) {
        state.console_items = []
    },
    PUSH_ITEM(state, payload) {
        state.console_items.unshift({
            message: payload.msg,
            type: payload.whatsort,
            data: payload.dat,
            time: new Date().getTime()
        })
    },
    CONTRACT_DECIMAL(state, payload) {
        // store web3 user account
        state.decimals = payload
    },
    CONTRACT_ADDRESS(state, payload) {
        // store web3 user account
        state.contract_address = payload
    },
    CONTRACT_BALANCE(state, balance) {
        // store web3 user account
        state.contract_balance = balance
    },
    TOKEN_LIST(state, payload) {
        state.tokenFlatList = []
        state.tokenFlatList.push({
            name: "Ether",
            sym: "ETH",
            add: "0x0",
            deci: 18,
            network_balance: state.network_balance
        })
        _.forEach(payload, (val) => {
            const hj = {
                name: val.name,
                sym: val.symbol,
                add: val.contractAddress,
                network_balance: val.balance,
                deci: parseInt(val.decimals)
            }
            state.tokenlist[val.symbol] = hj
            state.tokenFlatList.push(hj)
        })
    }
}
const actions = {
    newEventTransaction({commit}, payload) {
        commit("PUSH_ITEM", payload)
    },
    clearEvents({commit}) {
        commit("CLEAR_ITEM")
    },
    syncdata({commit, state}, health) {
        state.sync_count = state.sync_count + 1
        state.health = health
    },
    basicInfo({commit}, payload) {
        // state.levels = _level;
        commit("USER_BASIC", payload)
    },
    basicInfoIsFounder({commit}, payload) {
        // state.levels = _level;
        commit("IS_FOUNDER", payload)
    },
    getContractBalance({commit}, payload) {
        commit("CONTRACT_BALANCE", payload)
    },
    storePasteBin({commit, state}, lis) {
        commit("PASTE_BIN_INIT", lis)
    },
    keepTokenList({commit, state}, list) {
        commit("TOKEN_LIST", list)
    },
    getName({commit, state}) {
        // let name = await state.contract.methods.VIPFee ().call ({ from : state.user_account });
        console.log("test now")
        // commit ("FEE", name);
    },
    setPermisssion({commit}, b) {
        commit("PERMISSION", b)
    },
    async transfer(context, params) {
        const transferMethod = MultiSender.abi.find((method) => {
            return method.name === "transfer"
        })
        return transferMethod
    },
    updateDecimal({commit}, t) {
        commit("CONTRACT_DECIMAL", parseInt(t.deci))
    },
    storeContract({commit}, t) {
        commit("CONTRACT_ADDRESS", t)
    },
    async metamaskintegration({state}) {
        if (!window.ethereum) {
            state.install_state = 1
            return false
        }
        const InstanceW3 = new core(window.ethereum)
        state.network_name = await InstanceW3.eth.net.getNetworkType()
        try {
            await window.ethereum.enable()
            state.install_state = 3
        } catch (error) {
            // User denied account access...
            console.log("Please login or have the network switched.", error)
            state.install_state = 2
            return false
        }
        return InstanceW3
    }
}

function showEthNum(th) {
    try {
        const num = web3utils.fromWei(th, "ether")
        return Number(num).toFixed(5)
    } catch (e) {
        return ""
    }
}

const getters = {
    isLoginWeb3(state) {
        return state.islogin
    },
    wallet_setup(state) {
        return state.install_state
    },
    addressContract(state) {
        return state.contract_address
    },
    user_account(state) {
        return state.user_account
    },
    QueryNowSymbol(state) {
        return "ETH"
    },
    QueryNowBalance(state) {
        return showEthNum(state.network_balance)
    },
    QueryContractBalance(state) {
        return showEthNum(state.contract_balance)
    },
    network(state) {
        return state.network_name
    },
    get_dec(state) {
        return state.decimals
    },
    isFounder(state) {
        if (state.founder_account === "") {
            return state.isfounder
        } else {
            return state.user_account === state.founder_account
        }
    },
    isPermissioned(state) {
        return state.isPermissioned
    },
    isPasteBinInit(state) {
        return state.isPasteBinInit
    },
    inSyncs(state) {
        return state.sync_count
    },
    sync_health(state) {
        return state.health
    },
    list_events(state) {
        return state.console_items
    },
    user_tokens(state) {
        /*  let lk = [];
          let hj = _.cloneDeep (state.tokenlist);
          console.log (hj);
          _.forEach (hj, function (v, k) {
            console.log (v);
            lk.push (v);
          }); */
        return state.tokenFlatList
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
