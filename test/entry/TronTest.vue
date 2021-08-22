<template>
  <section id="indexbox" class="container indexcolor">
    <button @click="goto_main">CONNECT</button>
    <p>BlockAcon is installed {{ tronlinkinstalled }} {{ detected_x }}</p>
    <p>version {{ node_version }}</p>
    <button @click="event_x">GET EVENTS</button>
    <p>BlockAcon - my address {{ my_address }}</p>
    <button @click="send_coin">SEND DP</button>
    <p>my Coin {{ my_coin }}: {{ coin_bal }}</p>
    <p>D-Coin: {{ eth_bal }}</p>
  </section>
</template>
<script>
import metamask from "../../src/mixins/vue-metamask"

export default {
  name: "blockBar",
  comments: {},
  mixins: [metamask],
  data() {
    return {
      detected_x: 0,
      my_address: "",
      my_coin: "0x8a45b720cf7251921b114E5D49812f634742f85C",
      coin_bal: 0,
      eth_bal: 0,
      tronlinkinstalled: false
    }
  },
  mounted() {

    this.$nextTick(() => {
      this.$on("notify_tron_not_install", () => {
        this.tronlinkinstalled = false
        console.log("Detect done nil 🔔️")
      })

      this.$on("notify_tron_installed", () => {
        this.tronlinkinstalled = true
        console.log("Detect done ok 🔔️")
      })

      this.$on("notify_tron_initialization", () => {
        console.log("detect done notify_tron_initialization 🔔️️")
      })

      this.$on("notify_tron_account_logout", () => {
        console.log("Tronlink is not being login 🔔️️")
      })

      this.$on("notify_tron_account_set", () => {
        console.log("detect done notify_tron_account_set 🔔️")
      })

      this.$on("notify_tron_node_change", () => {
        console.log("detect done notify_tron_node_change 🔔️️")


      })


    })
  },
  methods: {
    event_x() {
      if (this.blockAccon) {

          this.my_address = this.blockAccon.getAccountAddress()

      }
    },
    async send_coin() {
      if (this.blockAccon) {

          this.eth_bal = await this.blockAccon.getCoinPlatform()
          const bal = await this.blockAccon.getCoin("TWpN4r9C6Y5wBoJzXYEkVhZcRbY4T83FG8")
          this.coin_bal = bal
          //  const list = this.blockAccon.getListedCoins()
          //  console.log(list)

      }
    },
    goto_main() {
      if (!this.isMetamaskInterfaced) {
        this.registerOnBoard()
        this.checkWeb3MetaMask()
        console.log("test passed")
        this.detected_x++;
      } else {
        console.log("tronweb is installed")
      }
    }
  }
}
</script>
