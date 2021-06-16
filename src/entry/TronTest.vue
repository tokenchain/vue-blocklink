<template>
  <section id="indexbox" class="container indexcolor">
    <button @click="goto_main">CONNECT</button>
    <p>TronLink is installed {{ tronlinkinstalled }} {{ detected_x }}</p>
    <p>version {{ node_version }}</p>
    <button @click="event_x">GET EVENTS</button>
    <p>TronLink - my address {{ my_address }}</p>
    <button @click="send_coin">SEND DP</button>
    <p>my Coin {{ my_coin }}: {{ coin_bal }}</p>
    <p>trx Coin: {{ trx_bal }}</p>
  </section>
</template>
<script>
import tronlink from "../mixins/vue-tronlink"
import TronAnchor from "../components/TronAnchor";

export default {
  name: "Tronmasonic",
  components: {TronAnchor},
  comments: {},
  mixins: [tronlink],
  data() {
    return {
      detected_x: 0,
      my_address: "",
      my_coin: "TWpN4r9C6Y5wBoJzXYEkVhZcRbY4T83FG8",
      coin_bal: 0,
      trx_bal: 0,
      tronlinkinstalled: false
    }
  },
  mounted() {
    this.debugTronLink(true)
    this.$nextTick(() => {
      this.$on("notify_tron_not_install", () => {
        this.tronlinkinstalled = false
        console.log("Detect done nil 🔔️")
      })

      this.$on("notify_tron_installed", () => {
        this.tronlinkinstalled = true
        this.debugTronLink(true)
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
        if (!this.isNile()) {
          console.log("⛔️ This is not NILE network now please go back..")
        }
      })
      this.checkTronLink()
    })
  },
  methods: {
    event_x() {
      if (this.tronlinkinstalled) {
        if (this.isNile()) {
          this.my_address = this.tronLink.getAccountAddress()
        }
      }
    },
    async send_coin() {
      if (this.tronlinkinstalled) {
        if (this.isNile()) {
          this.trx_bal = await this.tronLink.coinTRX()
          const bal = await this.tronLink.getCoin("TWpN4r9C6Y5wBoJzXYEkVhZcRbY4T83FG8")
          this.coin_bal = bal
          //  const list = this.tronLink.getListedCoins()
          //  console.log(list)
        }
      }
    },
    goto_main() {
      if (this.tronlinkinstalled) {
        if (this.isNile()) {
          console.log("test passed")
          this.detected_x++;
        } else {
          console.log("This contract requires Nile network")
        }
      } else {
        console.log("tronweb is installed")
      }
    }
  }
}
</script>
