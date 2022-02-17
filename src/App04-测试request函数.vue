<template>
  <div class="container">
    App <button @click="sendReq">测试request工具函数</button>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  name: 'App',
  setup () {
    const sendReq = () => {
      request('/member/profile', 'get', { a: 888 })
    }
    return { sendReq }
  }
}
</script>
