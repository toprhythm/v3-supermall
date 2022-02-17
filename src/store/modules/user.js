// ⽤户模块
export default {
  namespaced: true,
  state () {
    return { // ⽤户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
    }
  },
  mutations: {
    // 修改⽤户信息，payload就是⽤户信息对象
    setUser (state, payload) {
      state.profile = payload
    }
  }
}
