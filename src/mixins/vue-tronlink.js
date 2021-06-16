import TronLink from "../abi/TronLink"
import NODES from "../utils/const";

/**
 * events:
 * notify_tron_not_install
 * notify_tron_installed
 * notify_tron_node_change
 * notify_tron_account_set
 * notify_tron_initialization
 */
export default {
    data() {
        return {
            tronLink: false,
            tronWeb: false,
            // object json
            tronLinkInitialData: false,
            // node name NILE, MAINNET
            connectedNode: false,
            // wallet account name
            account_name: false,
            // --
            authorized_address: false,
            //module debug on core tronlink only
            _debug_tronlink: false,
            node_version: "",
        }
    },
    methods: {
        checkTronLink() {
            if (window && window.hasOwnProperty("tronWeb")) {
                if (!this.tronWeb) {
                    this.tronWeb = window.tronWeb
                }
                if (!this.tronLink) {
                    this.tronLink = new TronLink(this.tronWeb)
                }
                this.notify_tron_installed()
                return true
            }
            this.notify_tron_not_install()
            return false
        },
        notify_tron_not_install() {
            console.log("TronLink is not installed")
            this.$emit("notify_tron_not_install", this.tronLinkInitialData, this.connectedNode)
        },
        announce_node_name(data_full_node = "") {
            if (data_full_node === NODES.CONF_NILE.full_node) {
                this.connectedNode = NODES.FULL_NAMES.NILE
            } else if (data_full_node === NODES.CONF_MAINNET.full_node) {
                this.connectedNode = NODES.FULL_NAMES.MAINNET
            } else if (data_full_node === NODES.CONF_SHASTA.full_node) {
                this.connectedNode = NODES.FULL_NAMES.SHASTA
            } else if (data_full_node === NODES.DEFAULT_NODES.full_node) {
                this.connectedNode = NODES.FULL_NAMES.MAINNET
            } else if (data_full_node === NODES.CONF_TRONEX.full_node) {
                this.connectedNode = NODES.FULL_NAMES.TRONEX
            } else if (data_full_node === NODES.CONF_NILE_CLASSIC.full_node) {
                this.connectedNode = NODES.FULL_NAMES.NILE
            } else {
                this.connectedNode = ""
            }
        },
        /**
         *
         *
         *
         window.addEventListener('message', function (e) {
            try{
              if (e.data.message && e.data.message.action == "tabReply") {
                console.log("tabReply event", e.data.message)
                if (e.data.message.data.data.node.chain == '_'){
                    console.log("tronLink currently selects the main chain")
                }else{
                    console.log("tronLink currently selects the side chain")
                }
              }

              if (e.data.message && e.data.message.action == "setAccount") {

                var loginName = e.data.message.data.name;
                var getName = localStorage.getItem('qas4567d');
                var encodedString = window.btoa( loginName );
                var decodedString = window.atob( getName );

                if(getName && getName !=null){
                  if(decodedString !=loginName){
                    console.log('wallet connectionn')
                    setTimeout(function() {
                      toastAlert('success',"Wallet connected successfully",'tronwallet');
                      localStorage.removeItem("qas4567d");
                      localStorage.setItem('qas4567d', encodedString);
                    },1000);
                  }
                }else{
                 localStorage.setItem('qas4567d', encodedString);
                }
              }
              if (e.data.message && e.data.message.action == "setNode") {
                  console.log("setNode event", e.data.message)
                  if (e.data.message.data.node.chain == '_'){
                      console.log("tronLink currently selects the main chain")
                  }else{
                      console.log("tronLink currently selects the side chain")
                  }

              }
            }catch(e){
              console.log('wallet error',e)
            }
          });
         * @returns {Promise<void>}
         */
        async notify_tron_installed() {
            const vue_level = this
            window.addEventListener("message", e => {
                const d = JSON.stringify(e.data)
                const hard = JSON.parse(d)
                if (!(hard && hard.hasOwnProperty("message") && hard.message.hasOwnProperty("action"))) {
                    return;
                }
                const msg = e.data
                if (msg.hasOwnProperty("isTronLink")) {
                    if (msg.isTronLink) {
                        vue_level.tronLink.eventListener(msg.message, vue_level.tronLinkInitialData, vue_level)
                        vue_level.tronLink.__debugMessage(msg)
                    }
                }
            })
            await this.updateNodeVersion()
            // ts-ignore
            let provider = this.tronLink.tronWeb.currentProvider()
            console.log("TronLink is OK! ✅ ")
            if (this._debug_tronlink) {
                console.log(provider.fullNode.host)
                console.log("tronweb object", this.tronWeb)
            }
            this.announce_node_name(provider.fullNode.host)
            this.$emit("notify_tron_installed")
        },
        async updateNodeVersion() {
            this.node_version = await this.tronWeb.getFullnodeVersion()
        },
        debugTronLink(bool) {
            this._debug_tronlink = bool
        },
        isInstalled() {
            return this.tronLink && this.tronWeb
        },
        isNile() {
            return this.connectedNode === NODES.FULL_NAMES.NILE
        },
        isMainnet() {
            return this.connectedNode === NODES.FULL_NAMES.MAINNET
        },
        isShasta() {
            return this.connectedNode === NODES.FULL_NAMES.SHASTA
        },
        isTronex() {
            return this.connectedNode === NODES.FULL_NAMES.TRONEX
        },
        confirmDappChainID(chain_id_network) {
            if (chain_id_network.toLowerCase() === "nile" && this.isNile()) {
                return true
            }

            if (chain_id_network.toLowerCase() === "tronex" && this.isTronex()) {
                return true
            }

            if (chain_id_network.toLowerCase() === "shasta" && this.isShasta()) {
                return true
            }

            if (chain_id_network.toLowerCase() === "default" || chain_id_network.toLowerCase() === "mainnet" && this.isMainnet()) {
                return true
            }

            return false
        }
    },
    mounted() {
        let _this = this
        setTimeout(function tick() {
            _this.checkTronLink()
            if (!this.tronWeb) {
                setTimeout(tick, 1000)
            }
        }, 0)
    },
}
