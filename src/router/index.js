import { createRouter, createWebHashHistory } from 'vue-router'
import TopCategory from '@/views/category'
import SubCategory from '@/views/category/sub'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')

// 路由规则
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory }
    ]
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

export default router
