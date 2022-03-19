<template>
  <div class="login-callback">
    <LoginHeader>联合登录</LoginHeader>
    <section class="container" v-if="isBind">
      <div class="unbind">
        <div class="loading"></div>
      </div>
    </section>
    <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
 <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId"  />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
    <LoginFooter />
  </div>
</template>

<script>
import LoginFooter from './components/login-footer'
import LoginHeader from './components/login-header'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import { ref } from 'vue'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
export default {
  name: 'LoginCallBack',
  components: {
    LoginFooter,
    LoginHeader,
    CallbackBind,
    CallbackPatch
  },
  setup () {
    const hasAccount = ref(false)

    // 首先：默认认为已经注册且已经绑定
    // 通过qqapi获取openId，就是后台需要的unionId然后进行登录
    // 如果成功，登录成功
    // 如果失败，则QQ和小兔鲜未进行绑定（有账号，未绑定qq）（没账号，未绑定QQ）

    const isBind = ref(true)
    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)
    // 确保qq已经登录
    if (QC.Login.check()) {
      QC.Login.getMe((openId) => {
        unionId.value = openId
        // console.log('unionId.value=', unionId.value)
        // 情况1：有xtx账号且有QQ绑定
        // 第三方唯一标识qq唯一biaoshi
        // 请求小兔鲜后端，做qq登录
        userQQLogin(openId).then(data => {
          // data.result就是用户qq登录信息
          console.log(data.result)
          // 1. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })

          // 合并购物车成功在跳转
          store.dispatch('cart/mergeCart').then(() => {
            // 2. 跳转到来源页
            router.push(store.state.user.rurl)
            // 3. 成功提示
            Message({ type: 'success', text: 'QQ三方登录成功' })
          })
        }).catch(e => {
          // 登录失败，没有和小兔鲜绑定过
          console.log('e', e)
          // 登录失败，让isBind的值为未绑定
          isBind.value = false
          // 情况2：有xtx账号，没有QQ绑定
          console.log('qq三方登录失败，未绑定')
        })
      })
    }

    return { hasAccount, isBind, unionId }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
