# vue-blocklink
[![npm](https://img.shields.io/npm/v/vue-blocklink.svg?style=plastic)](https://www.npmjs.com/package/vue-blocklink)
[![license](https://img.shields.io/npm/l/vue-blocklink?style=plastic)](https://www.npmjs.com/package/vue-blocklink)
[![language](https://img.shields.io/github/languages/top/tokenchain/vue-blocklink?style=plastic)](https://www.npmjs.com/package/vue-blocklink)
[![size](https://img.shields.io/github/languages/code-size/tokenchain/vue-blocklink?style=plastic)](https://www.npmjs.com/package/vue-blocklink)
[![issues](https://img.shields.io/github/issues/tokenchain/vue-blocklink?style=plastic)](https://www.npmjs.com/package/vue-blocklink)
[![stars](https://img.shields.io/github/stars/tokenchain/vue-blocklink?style=plastic)](https://www.npmjs.com/package/vue-blocklink)


Also see some official repos
Blockchain links on the browser based wallets
Works for vue 2.0 and not 3.0

# EVM supports
Vue support for the Metamask browser extension
This project will also support the future networks

### EVM wallet
 * Support all EVM ethereum related networks

### ERC20 or XRC20 display
 * support all ERC20 balance
 * BlockLink support TRC20 token
 * Basic coins from some custom addressses

### vue mixin Events:
 * notify_block_not_install
 * notify_account_changed
 * notify_block_installed
 * notify_node_change
 * notify_metamask_not_install
 * notify_metamask_stop_on_board
 * notify_metamask_start_on_board
 * notify_block_generation

### Feature supports
 * personal signature `personal_sign`

### mixin support imtoken wallet api events:
 * imtoken_on_detect
 * listen to: set_imtoken_style
 * listen to: set_imtoken_pop

### Support metamask operation API:
 * will work on more api supports


#### ws provider added.

#### nginx

```
server {
  server_name prajin.prakash.com;
  listen 80;
  listen [::]:80;

  location / {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
  }
  location /sockjs-node {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade websocket;
    proxy_set_header Connection upgrade;
  }
}
```
