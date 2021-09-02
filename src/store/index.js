import Vue from 'vue'
import Vuex from 'vuex'

// 引入我们自己封装的本地存储模块
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

// 定义一个常量，用来表示我们存储数据的名称，避免之后产生混乱
const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    // 从本地存储中获取我们的token值
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser (state, data) {
      // 将我们获取的data保存进我们的state
      state.user = data
      // 为了防止数据丢失，我们将数据放入到本地存储之中，进进为了保持持久化
      // window.localStorage.setItem('user',JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
