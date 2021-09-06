import Vue from 'vue'
import App from './EthTest'
/*
=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================
*/

/*

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept()
}
*/

new Vue({
    render: h => h(App),
}).$mount('#app')
