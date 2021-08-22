import Vue from 'vue'
import App from './TronTest'

new Vue({
    render: h => h(App),
}).$mount('#app')

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept()
}

