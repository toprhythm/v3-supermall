<template>
  <!-- vue2.0需要根组件，vue3.0可以是代码片段，根组件可有可无 -->
  <div>
    根组件123
  </div>
  <!-- 组件间共享变量 -->
  <p>{{ $store.state.username }}</p>
  <!-- 组件间共享计算属性 -->
  <p>{{ $store.getters.reverseUsername }}</p>
  <p>{{ $store.getters['reverseUsername'] }}</p>
  <!-- 同步组件间共享方法 -->
  <button @click="mutationsFn">点击改名</button>
  <!-- 异步(模拟网络请求数据包)组件间调用方法 -->
  <button @click="actionsFn">（异步）点击改名</button>
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup () {
    const store = useStore()
    // 1. 使⽤根模块state的数据
    console.log(store.state.username)
    // 2. 使⽤根模块getters的数据
    console.log(store.getters.newName)
    const mutationsFn = () => {
      // 3.调用根模块mutations方法
      store.commit('updateName')
    }
    const actionsFn = () => {
      // 3.调用根模块actions方法
      store.dispatch('asyncUpdateName')
    }
    return {
      mutationsFn,
      actionsFn
    }
  }
}
</script>
