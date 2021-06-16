<template>
  <a :href="getURL()" v-bind="$attrs">
    <slot></slot>
  </a>
</template>

<script>
import FULL_NAMES from "../utils/const";


export default {
  name: "TronAnchor",
  props: {
    network: {
      type: String,
      default: FULL_NAMES.SHASTA
    },
    type: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
  },
  methods: {
    getURL() {
      let baseUrl = "https://"
      switch (this.network) {
        case FULL_NAMES.MAINNET:
          baseUrl += "tronscan.org/#"
          break
        case FULL_NAMES.SHASTA:
          baseUrl += "shasta.tronscan.org/#"
          break
        case FULL_NAMES.TRONEX:
          baseUrl += "shasta.tronscan.org/#"
          break
        case FULL_NAMES.NILE:
          baseUrl += "shasta.tronscan.org/#"
          break
      }

      return [baseUrl, this.type, this.value].join("/")
    }
  }
}
</script>
