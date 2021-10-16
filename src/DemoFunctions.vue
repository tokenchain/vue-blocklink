<template>
  <div id="app">
    <button @click="connect_matamask" :disabled="signedInConnection">CONNECT</button>
    <p>BlockAcon Metamask is installed {{ metamaskInstalled }} {{ detected_x }}</p>
    <p>version 0.2.101</p>
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

    <p>Native-Coin: {{ eth_bal }}</p>
    <button @click="send_coin_trig">SEND COIN</button>

    <p>Refresh data</p>
    <button @click="initData">Refresh</button>
    <p> ===================</p>
  </div>
</template>
<script>
import metamask from "./mixins/vue-metamask"

export default {
  name: "app",
  comments: {},
  mixins: [metamask],
  data() {
    return {
      detected_x: 0,
      my_address: "",
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
          image: 'http://placekitten.com/200/300', // A string url of the token logo
        },
        ysl2: {
          address: '0x1Ff8477Dd18d45d0BA1af6B25DC6470b50A6762D', // The address that the token is at.
          symbol: 'YSL', // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: 'http://placekitten.com/200/300', // A string url of the token logo
        },
        usdf: {
          address: '0xAd08d31579dd599801e8839db70Bd9C84D2B98e9', // The address that the token is at.
          symbol: 'USDF', // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: 'http://placekitten.com/200/300', // A string url of the token logo
        }
      },
      agent_contract: "0x6a18b9A2fb67B6D0301f71327d2055BaC3ec055E"
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on("notify_block_not_install", () => {
        this.metamaskInstalled = false
        console.log("Detect done - NOT INSTALL 🔔️")
      })
      this.$on("notify_block_installed", () => {
        this.metamaskInstalled = true
        console.log("Detect done INSTALLED 🔔️")
        setInterval(() => {
          this.initData()
        }, 3500)
      })

      this.$on("notify_account_changed", () => {
        console.log("detect done rns account changed 🔔️")
      })

    })
  },
  methods: {
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
    connect_matamask() {
      if (this.signedInConnection) {
        console.log("you have already signed in")
      } else {
        if (!this.isMetamaskInterfaced) {
          this.registerOnBoard()
          this.detected_x++;
        } else {
          if (this.matchChainId(256)) {
            console.log("metamask is already installed, now request sign in...")
            this.checkWeb3MetaMask()
          } else {
            console.log("Please change to chain ID 256")
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
