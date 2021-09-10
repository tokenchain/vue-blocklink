<template>
  <div id="app">
    <button @click="connect_matamask" :disabled="signedInConnection">CONNECT</button>
    <p>BlockAcon Metamask is installed {{ metamaskInstalled }} {{ detected_x }}</p>
    <p>version XXXXX</p>
    <p>
      <button @click="add_token">ADD TOKEN [{{ my_tokenaddress }}]</button>
    </p>
    <p>
      <button @click="event_x">GET ACCOUNTS</button>
    </p>
    <p>Network ID -> {{ netID }}</p>
    <p>My address -> {{ my_address }}</p>


    <p>YSL Coin: {{ coin_bal }} YSL, dec {{coin_decimal}}</p>
    <button @click="send_token_trig">SEND TOKEN</button>
    <p> {{ my_tokenaddress }}</p>


    <p>YSL Coin Approval: {{ coin_approv_bal }} YSL, dec {{coin_decimal}}</p>
    <button @click="approve_coin">Approve TOKEN</button>
    <p> {{ my_tokenaddress }}</p>

    <p> ===================</p>
    <p>Native-Coin: {{ eth_bal }}</p>
    <button @click="send_coin_trig">SEND COIN</button>
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
      my_tokenaddress: "0x945bD413ee130Bbe5f30bB7dEFc11C82d2bB5d93",
      coin_bal: 0,
      eth_bal: 0,
      coin_decimal:0,
      coin_approv_bal: 0,
      metamask_debug: true,
      metamaskInstalled: false
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
      const user = this.blockLink.getAccountAddress()
      this.my_address = user
      const ccfarm = "0x6a18b9A2fb67B6D0301f71327d2055BaC3ec055E"
      const coinde = await this.blockLink.getMyCoinDetail(this.my_tokenaddress)
      const cc = await this.blockLink.getContractToken(this.my_tokenaddress)
      //console.log(cc, coinde, ccfarm)
      this.coin_bal = coinde.balance(this.my_address)
      await coinde.runAllowanceAmount(cc, this.my_address, ccfarm)
      const k = coinde.approvalStatus(this.my_address, ccfarm)
      //console.log(k.k1)
      this.coin_approv_bal = k.k1
      this.coin_decimal = coinde.decimal
    },
    event_x() {

    },
    async approve_coin() {
      if (!this.blockLink) return
      const ccfarm = "0x6a18b9A2fb67B6D0301f71327d2055BaC3ec055E"
      // const user = this.blockLink.getAccountAddress()
      // onst coinde = await this.blockLink.initCoinDetail(user, this.my_address)
      // const cc = this.blockLink.getContractToken(user)
      //  await coinde.runApproveToken(cc, ccfarm, 10000000)

      await this.blockLink.approveToken(this.my_tokenaddress, ccfarm, 1000000000000000000000000)

    },
    async send_coin_trig() {
      if (!this.blockLink) return
      // less 0000
      const amount = 100000000000000
      const to = "0x25bf0C8d7909a581549Dc2d075Ba12364D5ec0CA"
      await this.blockLink.sendCoin(amount, to)
    },
    async send_token_trig() {
      //
      const amount = 10000000000000000000
      const to = "0x25bf0C8d7909a581549Dc2d075Ba12364D5ec0CA"
      await (this.blockLink && this.blockLink.sendToken(amount, to, this.my_tokenaddress))
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
    async add_token() {

      const tokenAddress = '0x945bD413ee130Bbe5f30bB7dEFc11C82d2bB5d93';
      const tokenSymbol = 'YSL';
      const tokenDecimals = 18;
      const tokenImage = 'http://placekitten.com/200/300';

      await this.blockLink.metamask_add_token({
            type: 'ERC20',
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            }
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
