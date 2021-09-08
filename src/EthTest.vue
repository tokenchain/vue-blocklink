<template>
  <div id="app">
    <button @click="goto_main" :disabled="signedInConnection">CONNECT</button>
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


    <p>YSL Coin: {{ coin_bal }} YSL</p>
    <button @click="send_token_trig">SEND TOKEN</button>
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
        setTimeout(() => {
          this.initData()
        }, 500)
      })

      this.$on("notify_account_changed", () => {
        console.log("detect done rns account changed 🔔️")
      })

    })
  },
  methods: {
    async initData() {
      if (!this.blockLink) return
      this.eth_bal = await this.blockLink.getCoinPlatform()
      this.my_address = this.blockLink.getAccountAddress()
      this.coin_bal = await this.blockLink.getCoin(this.my_tokenaddress)
    },
    event_x() {

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
    goto_main() {
      if (this.signedInConnection) {
      } else {
        if (!this.isMetamaskInterfaced) {
          this.registerOnBoard()
          this.detected_x++;
        } else {
          console.log("metamask is already installed")
          this.checkWeb3MetaMask()
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
