// 1. 创建⼀个新的axios实例
// 2. 请求拦截器，如果有token进⾏头部携带
// 3. 响应拦截器：1. 剥离⽆效数据 2. 处理token失效
// 4. 导出⼀个函数，调⽤当前的axsio实例发请求，返回值promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'

export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(config => {
  const { profile } = store.state.user
  console.log('profile.token: ', profile.token || undefined)
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// res => res.data  取出data数据，将来调用接口的时候直接拿到的就是后台的数据
instance.interceptors.response.use(res => res.data, err => {
  // 401 状态码，进入该函数
  if (err.response && err.response.status === 401) {
    // 1. 清空无效用户信息
    // 2. 跳转到登录页
    // 3. 跳转需要传参（当前路由地址）给登录页码
    store.commit('user/setUser', {})
    // 当前路由地址
    // 组件里头：`/user?a=10` $route.path === /user  $route.fullPath === /user?a=10
    // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    console.log('full=' + fullPath)
    // encodeURIComponent 转换uri编码，防止解析地址出问题
    router.replace('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 请求⼯具函数
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
