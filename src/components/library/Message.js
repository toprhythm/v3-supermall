// 提供一个能够显示Xtx-message组件的函数
// 这个函数将来，导入直接使用，也可以挂载在vue实例使用
// import message from './Message.js' Message({ type: 'success', text: '提示文字' })
// this.$message({ type: 'error', text: '提示文字' })

import XtxMessage from './xtx-message.vue'
import { createVNode, render } from 'vue'

// 这就是我们的dom容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
// 追加到body
document.body.appendChild(div)

// 定义定时器
let timer = null

// 默认导出一个方法
export default ({ type, text }) => {
  // 渲染组件
  // 1. 准备消息提示组件
  // 2. 将消息提示组件编译为虚拟节点 虚拟dom{sel, children...}
  // 两个参数：1：组件，2：往组件传参(其实就是props)
  const vnode = createVNode(XtxMessage, { type, text })
  // 3. 准备一个装载消息提示组件的容器
  // 4. 将虚拟节点渲染在容器中
  // render(虚拟节点，DOM容器)
  render(vnode, div)
  // 5. 3s后销毁实例
  clearTimeout(timer)
  timer = setTimeout(() => {
    // 这就是销毁
    render(null, div)
  }, 3000)
}
