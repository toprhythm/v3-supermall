import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ui from './components/library'

// 导入nomalize.css
import 'normalize.css'
// 导入common.less
import '@/assets/styles/common.less'

// 创建一个vue应用实例使用状态管理加上路由并且挂载到id为app的容器上
// createApp(App).use(store).use(router).mount('#app')

// 插件的使用，在main.js使用app.use(插件)
createApp(App).use(store).use(router).use(ui).mount('#app')
