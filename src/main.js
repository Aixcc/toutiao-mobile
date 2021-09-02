import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 配制 vant组件库
import Vant from 'vant'
// 引入组件库样式
import 'vant/lib/index.css'
// 引入全局样式
import './styles/index.less'
// 引入REM适配工具：lib-flexible
import 'amfe-flexible'
//  加载day.js
import './utils/dayjs'
//  使用组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
