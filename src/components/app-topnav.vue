<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <!-- template有一个好处,就是可以包裹一组元素成为一个大元素，但是又不解释成一个元素在源代码中 -->
        <template v-if="profile.token">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{profile.account || 'test周杰伦'}}</a></li>
          <li><a href="javascript:;" @click="logout()">退出登录</a></li>
        </template>
        <template v-else>
          <!-- <li><RouterLink to="/login">请先登录</RouterLink></li> -->
          <li><a @click="toLogin()">请先登录</a></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
export default {
  name: 'AppTopnav',
  setup () {
    // 根据当前的登录状态显示 用户名和退出登录
    const store = useStore()
    const profile = computed(() => {
      return store.state.user.profile
    })

    // 退出登录
    // 1. 清空本地存储用户信息以及token
    // 2. 跳转登录页
    // 3. toast
    const router = useRouter()
    const logout = () => {
      store.commit('user/setUser', {})
      // 清空
      store.commit('cart/setCart', [])
      router.push('/login')
      Message({ type: 'success', text: '退出成功' })
    }

    // 去登录页
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // 在登录页面存储回调地址给vuex
    const toLogin = () => {
      router.replace('/login?redirectUrl=' + fullPath)
    }

    return {
      profile,
      logout,
      toLogin
    }
  }
}
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
// ~ 选择器作用：选择当前选择器后的所有元素,有4个li，加个~就是选中4个li
</style>
