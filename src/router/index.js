import { createRouter, createWebHashHistory } from 'vue-router'
import TopCategory from '@/views/category'
import SubCategory from '@/views/category/sub'
import store from '@/store'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const LoginCallBack = () => import('@/views/login/callback')
const Cart = () => import('@/views/cart/index')
const PayCheckout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index')
const PayResult = () => import('@/views/member/pay/result')

// 路由规则
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: PayCheckout },
      { path: '/member/pay', component: PayIndex },
      { path: '/pay/callback', component: PayResult }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallBack
  }
]

// vue2.0 new VueRouter({}) 创建路由实例
// vue3.0 createRouter({})  创建路由实例
const router = createRouter({
  // 使用hash的路由模式("localhost:8080/#/")
  history: createWebHashHistory(),
  routes,
  // 永远切换路由的时候页面都回到顶部
  scrollBehavior () {
    return { left: 0, top: 0 } // vue2 { x: 0, y: 0 }， vue3 {left:0, top:0}
  }
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const { token } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})

export default router
