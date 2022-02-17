import { createStore } from 'vuex'
const moduleA = {
// ⼦模块state建议写成函数
  state: () => {
    return {
      username: '模块A'
    }
  },
  getters: {
    changeName (state) {
      return state.username + 'AAAAAA'
    }
  }
}
const moduleB = {
// 带命名空间的模块
  namespaced: true,
  // ⼦模块state建议写成函数
  state: () => {
    return {
      username: '模块B'
    }
  },
  getters: {
    changeName (state) {
      return state.username + 'BBBBBB'
    }
  },
  mutations: {
  // 修改名字的mutation
    update (state) {
      state.username = 'BBBB' + state.username
    }
  },
  actions: {
    update ({ commit }) {
      // 假设请求
      setTimeout(() => {
        commit('update')
      }, 2000)
    }
  }
}
// 创建vuex仓库并导出
export default createStore({
  state: {
  // 数据
    person: [
      { id: 1, name: 'tom', gender: '男' },
      { id: 2, name: 'lucy', gender: '⼥' },
      { id: 3, name: 'jack', gender: '男' }
    ]
  },
  mutations: {
    // 改数据函数
  },
  actions: {
    // 请求数据函数
  },
  modules: {
    // 分模块
    a: moduleA, b: moduleB
  },
  getters: {
    // vuex的计算属性
    boys: (state) => {
      return state.person.filter(p => p.gender === '男')
    }
  }
})
