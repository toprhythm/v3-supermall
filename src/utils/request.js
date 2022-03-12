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

// res => res.data 取出data数据，将来调⽤接⼝的时候直接拿到的就是后台的数据
instance.interceptors.response.use(res => res.data, err => {
  // 401 状态码，进⼊该函数
  if (err.response && err.response.status === 401) {
    store.commit('user/setUser', {})
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
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
