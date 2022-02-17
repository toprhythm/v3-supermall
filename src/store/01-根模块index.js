import { createStore } from 'vuex'

// vue2.0 创建仓库 new Vuex.Store({})
// vue3.0 创建仓库 createStore({})
export default createStore({
  state: { // 组件间共享变量
    username: '李寒衣'
  },
  // 补上一个缺失的getters
  getters: { // 组件间共享计算属性
    reverseUsername (state) {
      return state.username.split('').reverse().join('') + '!!!'
    }
  },
  mutations: { // 同步组件间共享方法
    updateName (state) {
      state.username = '雷无桀'
    }
  },
  actions: { // 异步(模拟网络请求数据包)组件间调用方法
    asyncUpdateName (ctx) {
      setTimeout(() => {
        ctx.commit('updateName')
      }, 3000)
    }
  },
  modules: {
  }
})
