import Vue from 'vue'
import App from './App'
import Base64 from 'js-base64'

Vue.config.productionTip = false
if(process.env.NODE_ENV === 'development'){
    console.log('开发环境')
}else{
    console.log('生产环境')
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
