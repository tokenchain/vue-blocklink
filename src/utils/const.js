const DEFAULT_NODES = {
    'full_node': 'https://api.trongrid.io',
    'solidity_node': 'https://api.trongrid.io',
    'event_server': 'https://api.trongrid.io'
}

const CONF_MAINNET = {
    "full_node": "https://api.trongrid.io",
    "event_server": "https://api.trongrid.io",
}

//The long running, maintained by the tron-us community
const CONF_SHASTA = {
    "full_node": "https://api.shasta.trongrid.io",
    "event_server": "https://api.shasta.trongrid.io",
    "faucet": "https://www.trongrid.io/faucet",
}

//Maintained by the official team
const CONF_NILE = {
    "full_node": "https://httpapi.nileex.io",
    "event_server": "https://eventtest.nileex.io",
    "solidity_node": "https://httpapi.nileex.io",
    "faucet": "http://nileex.io/join/getJoinPage",
}
const CONF_NILE_CLASSIC = {
    "full_node": "https://api.nileex.io",
    "event_server": "https://event.nileex.io",
    "solidity_node": "https://api.nileex.io",
    "faucet": "http://nileex.io/join/getJoinPage",
}

//Maintained by the official team
const CONF_TRONEX = {
    "full_node": "https://testhttpapi.tronex.io",
    "event_server": "https://testapi.tronex.io",
    "faucet": "http://testnet.tronex.io/join/getJoinPage",
}
const FULL_NAMES = {
    NILE: "NILE",
    MAINNET: "MAINNET",
    SHASTA: "SHASTA",
    TRONEX: "TRONEX"
}
export default {
    FULL_NAMES,
    CONF_MAINNET,
    CONF_NILE,
    CONF_SHASTA,
    CONF_TRONEX,
    CONF_NILE_CLASSIC,
    DEFAULT_NODES
}

