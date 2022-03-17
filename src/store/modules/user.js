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
      },
      // 登录后回调路径
      rurl: '/'
    }
  },
  mutations: {
    // 修改⽤户信息，payload就是⽤户信息对象
    setUser (state, payload) {
      state.profile = payload
    },
    // 修改回调地址
    setRedirectUrl (state, payload) {
      // console.log('do:user/setRedirectUrl:payload=' + payload)
      // 存储前
      state.rurl = payload
      // 存储后
      console.log('state.rurl=' + state.rurl)
    }
  }
}
