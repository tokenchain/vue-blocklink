<template>
  <div id="app">
    <button @click="connect_metamask" :disabled="signedInConnection">CONNECT</button>
    <button @click="add_network" :disabled="!signedInConnection">ADD NET</button>
    <p>{{ status_connection }}</p>
    <p>BlockAcon Metamask is installed [{{ metamaskInstalled }}], Detection: [{{ detected_x }}]</p>
    <p>version 0.2.101</p>
    <p>{{ error_message }}</p>
    <p>
      <button @click="add_token(tokens.ysl)">ADD TOKEN [{{ tokens.ysl.symbol }}]</button>
      <button @click="add_token(tokens.ysl2)">ADD TOKEN [{{ tokens.ysl2.symbol }}]</button>
      <button @click="add_token(tokens.usdf)">ADD TOKEN [{{ tokens.usdf.symbol }}]</button>
    </p>
    <p>
      <button @click="event_x">GET ACCOUNTS</button>
    </p>
    <p>Network ID -> {{ netID }}</p>
    <p>My address -> {{ my_address }}</p>
    <p> ===================</p>
    <p> {{ tokens.ysl2.symbol }} Coin: {{ coin_bal_ysl }} {{ tokens.ysl2.symbol }}, dec {{ coin_decimal }}</p>
    <button @click="send_token_trig">SEND TOKEN</button>
    <p> {{ tokens.ysl2.address }}</p>

    <p>{{ tokens.ysl2.symbol }} Coin Approval: {{ coin_approv_bal1 }} {{ tokens.ysl2.symbol }}, dec {{
        coin_decimal
      }}</p>
    <button @click="approve_coin">Approve TOKEN</button>

    <p> {{ tokens.usdf.symbol }} Coin: {{ coin_bal_usd }} {{ tokens.usdf.symbol }}, dec {{ coin_decimal }}</p>
    <p>{{ tokens.usdf.symbol }} Coin Unlimited Approval: {{ coin_approv_bal2 }} {{ tokens.usdf.symbol }}, dec
      {{ coin_decimal }}</p>

    <button @click="approve_coin_2">Approve TOKEN Unlimited</button>
    <p> {{ tokens.usdf.address }}</p>
    <p> ===================</p>
    <p>Native-Coin: {{ eth_bal }}</p>
    <button @click="send_coin_trig">♞ SEND COIN</button>

    <p> ===================</p>
    <p>Signature:</p>
    <p>Message: {{ signing.message }}</p>
    <button @click="sign_data">✍︎ Signature Sign</button>
    <p> ===================</p>
    <p>Refresh data</p>
    <button @click="initData">Refresh</button>
    <p> ===================</p>
  </div>
</template>
<script>
import metamask from "./mixins/vue-metamask"
import {GetMetaNetConfig} from "./utils/ethereumnetworks"

export default {
  name: "app",
  comments: {},
  mixins: [metamask],
  data() {
    return {
      detected_x: 0,
      my_address: "",
      status_connection: "",
      error_message: "",
      coin_bal_ysl: 0,
      coin_bal_usd: 0,
      eth_bal: 0,
      coin_decimal: 0,
      coin_approv_bal1: 0,
      coin_approv_bal2: 0,
      metamask_debug: true,
      metamaskInstalled: false,
      tokens: {
        ysl: {
          address: '0x945bD413ee130Bbe5f30bB7dEFc11C82d2bB5d93', // The address that the token is at.
          symbol: 'YSL', // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: 'https://iili.io/0wqS9I.png', // A string url of the token logo
        },
        ysl2: {
          address: '0x1Ff8477Dd18d45d0BA1af6B25DC6470b50A6762D', // The address that the token is at.
          symbol: 'YSL', // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: 'https://iili.io/0wqgwX.md.jpg', // A string url of the token logo
        },
        usdf: {
          address: '0xAd08d31579dd599801e8839db70Bd9C84D2B98e9', // The address that the token is at.
          symbol: 'USDF', // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: 'https://iili.io/0wqD9S.md.webp', // A string url of the token logo
        }
      },
      agent_contract: "0x6a18b9A2fb67B6D0301f71327d2055BaC3ec055E",
      networkConf: {
        chainId: "1023",
        chainName: "RSC Mainnet",
        // iconUrls?: string[];
        nativeCurrency: {
          name: "Rae Stone Coin",
          symbol: "RSC",
          decimals: 18
        },
        blockExplorerUrls: ["https://www.raisc.io"],
        rpcUrls: ["https://rpc-mainnet.raisc.io"]
      },
      signing: {
        message: "this is me and LET ME IN. ..3982829..3424.31.2.1.212221"
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.status_connection = "init..."
      this.$on("notify_block_not_install", () => {
        this.metamaskInstalled = false
        this.status_connection = "Detect done - NOT INSTALL 🔔️"
        console.log(this.status_connection)
      })
      this.$on("notify_block_installed", async () => {
        this.metamaskInstalled = true
        this.status_connection = "Detect done INSTALLED 🔔️"
        console.log(this.status_connection)
        //check network
        await this.connect_wallet()
        this.status_connection = "Connected to Chain ID: " + this.netID
        await this.initData()
      })
      this.$on("notify_account_changed", () => {
        console.log("detect done rns account changed 🔔️")
      })
    })
  },
  methods: {
    handleErrors(msg) {
      this.error_message = msg
    },
    async connect_wallet() {
      if (this.netID === parseInt("1023")) {
        setTimeout(async () => {
          await this.initData()
        }, 3000)
      } else {
        // only from hardcode
        // await this.blockLink.metamask_detect_chain_process_flow(this.networkConf)
        // await this.checkWeb3MetaMask()
        // this.sign_in()
        console.log("add new network or switching request")
        await this.blockLink.metamask_detect_chain_process_flow(
            GetMetaNetConfig("1023")
        )
      }
    },
    async initData() {
      if (!this.blockLink) return
      //gas limit / gas price
      // this.blockLink.setDebug(true)
      this.blockLink.setResource(1000000, 29000000000)
      this.eth_bal = await this.blockLink.getCoinPlatform()
      this.my_address = this.blockLink.getAccountAddress()
      const usd = this.tokens.usdf.address
      const ysl = this.tokens.ysl2.address

      const c_ysl = await this.blockLink.getMyCoinDetail(ysl)
      const cd_ysl = await this.blockLink.getContractToken(ysl)

      const c_usd = await this.blockLink.getMyCoinDetail(usd)
      const cd_usd = await this.blockLink.getContractToken(usd)

      this.coin_bal_ysl = c_ysl.balance(this.my_address)
      await c_ysl.runAllowanceAmount(cd_ysl, this.my_address, this.agent_contract)
      const kf2 = c_ysl.approvalStatus(this.my_address, this.agent_contract)

      this.coin_bal_usd = c_usd.balance(this.my_address)
      await c_usd.runAllowanceAmount(cd_usd, this.my_address, this.agent_contract)
      const kf1 = c_usd.approvalStatus(this.my_address, this.agent_contract)

      // console.log(kf2, kf1)
      // console.log(cd_usd, c_usd, c_ysl, cd_ysl)
      this.coin_approv_bal1 = kf2.approvedAmount
      this.coin_approv_bal2 = kf1.isUnlimited
      this.coin_decimal = c_ysl.decimal
    },
    event_x() {

    },
    async approve_coin_2() {
      if (!this.blockLink) return

      const tuaddress = this.tokens.usdf.address
      await this.blockLink.approveTokenUnlimited(tuaddress, this.agent_contract)
    },
    async approve_coin() {
      if (!this.blockLink) return

      const tuaddress = this.tokens.ysl2.address
      // const user = this.blockLink.getAccountAddress()
      // onst coinde = await this.blockLink.initCoinDetail(user, this.my_address)
      // const cc = this.blockLink.getContractToken(user)
      //  await coinde.runApproveToken(cc, ccfarm, 10000000)
      const take = "1000000000000000000000000000000000000"
      await this.blockLink.approveToken(tuaddress, this.agent_contract, take)

    },
    async send_coin_trig() {
      if (!this.blockLink) return
      // less 0000
      const amount = 1000
      const to = "0x25bf0C8d7909a581549Dc2d075Ba12364D5ec0CA"
      await this.blockLink.sendCoin(amount, to)
    },
    async send_token_trig() {
      const amount = 1000
      const to = "0x25bf0C8d7909a581549Dc2d075Ba12364D5ec0CA"
      const t_ysl_address = this.tokens.ysl2.address
      await (this.blockLink && this.blockLink.sendToken(amount, to, t_ysl_address))
    },
    async add_network() {
      if (!!this.blockLink) {
        await this.blockLink.metamask_detect_chain_process_flow(
            GetMetaNetConfig("1023")
        )
      }
    },
    async sign_data() {
      if (!!this.blockLink) {
        await this.blockLink.metamask_message_personal_sign(
            this.signing.message,
            (address, res) => {
              console.log(address, res)
            }
        )
      }
    },
    connect_metamask() {
      if (this.signedInConnection) {
        console.log("You have already signed in")
      } else {
        if (!this.isMetamaskInterfaced) {
          this.registerOnBoard()
          this.detected_x++;
        } else {
          if (this.matchChainId(1023)) {
            this.checkWeb3MetaMask()
            this.error_message = "metamask is already installed, now request sign in..."
          } else {
            this.error_message = "Please change to chain ID 256"
          }
        }
      }
    },
    async add_token(token_data) {
      /**
       address: tokenAddress, // The address that the token is at.
       symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
       decimals: tokenDecimals, // The number of decimals in the token
       image: tokenImage, // A string url of the token logo
       */
      await this.blockLink.metamask_add_token({
            type: 'ERC20',
            options: token_data
          }
      )
    }
  }
}
</script>
<style lang="css">

* {
  box-sizing: border-box;
}

html,
body {
  margin: 40px;
  padding: 0;
  width: 100%;
  height: 100%;
  text-size-adjust: none;
}

body {
  background: #e0e0e0;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
