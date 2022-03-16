<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- autocomplete="off" 关闭掉，浏览器自动填充功能，类似百度搜索的模糊列表 -->
    <Form ref="formRef" class="form" :validation-schema="schema" autocomplete="off" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field type="text" name="account" v-model="form.account" placeholder="请输入用户名或手机号" :class="{error:errors.account}" />
          </div>
          <!-- {{errors.account}} -->
          <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field name="password" v-model="form.password" type="password" placeholder="请输入密码" :class="{error:errors.password}" />
          </div>
          <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name="mobile" v-model="form.mobile" type="text" placeholder="请输入手机号" :class="{error:errors.mobile}" />
          </div>
          <div v-if="errors.mobile" class="error"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field name="code" v-model="form.code" type="text" placeholder="请输入验证码" :class="{error:errors.code}" />
            <span class="code">发送验证码</span>
          </div>
          <div v-if="errors.code" class="error"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div v-if="errors.isAgree" class="error"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schemas'

import Message from '@/components/library/Message'

import { userAccountLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'LoginForm',
  components: {
    Form,
    Field
  },
  // created () {
  //   // 自定义消息提示弹层组件
  //   this.$message({ type: 'error', text: '用户名已存在' })
  // },
  setup () {
    // 切换短信登录
    const isMsgLogin = ref(false)
    // 表单数据对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    // Vee-validate校验基本步骤
    // 1. 导入Form Field 组件 将 form 和 input 进行替换，需要加上name用来指定将来的校验规则函数的
    // 2. Field需要进行数据绑定, 字段名称最好和后端接口字段一致
    // 3. 定义Field的name属性指定的校验规则函数：Form.validation-schema来接受定义的校验规则是对象
    // 4. 自定义组件要校验必须先支持vModel,然后Field使用as指定自定义组件名称完成校验
    const mySchema = {
      // 校验函数有自己的规则。返回true，就是校验成功;返回false，校验失败; 字符串就是错误提示
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // isMsgLogin发生变化，就该重置表单了
    const formRef = ref(null)
    watch(isMsgLogin, () => {
      // 重置表单数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果没有销毁Field组件，之前的校验结果不会销毁
      // Form组件提供了resetForm的函数，清除校验结果
      // ref加在元素上拿dom，加在vue组件上拿vue组件的实例,实例上挂了resetForm()
      formRef.value.resetForm()
    })

    // 点击登录时候，对整体表单进行校验
    const store = useStore()
    const router = useRouter()// 路由器
    const route = useRoute()// 理由信息实例
    const login = async () => {
      // Form组件提供了api，validate（）进行整体表单校验，但是返回的是一个Promise
      // 注意：setup里不建议用asyncawait，但是setup的函数里可以使用asyncawait

      // v1.0
      // formRef.value.validate().then(valid => {
      //   console.log(valid)// true|f
      // })

      // v2.0
      const validResult = await formRef.value.validate()
      console.log(validResult)
      // Message({ type: 'error', text: '用户名或密码错误' })
      // Message({ type: 'success', text: '用户名或密码错误' })

      // 账号密码登录 测试账号：zhousg ; 123456 ;
      // 1. 准备一个api做账号登录
      // 2. 调用api函数
      // 3. 成功  跳转至来源页面或者首页 + 消息提示toast
      // 4. 失败  消息提示
      if (validResult) {
        const { account, password } = form
        userAccountLogin({ account, password }).then(data => {
          // 4.1 存储用户信息以及token
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 4.2 进行跳转
          router.push(route.query.redirectUrl || '/')
          // 4.3 消息提示
          Message({ type: 'success', text: `${nickname}, 登录成功` })
        }).catch(err => {
          // 5 登录失败的提示
          // console.log('loginErr: ', err)
          // console.dir(err)
          if (err.response.data) { // 如果错误信息数据存在,弹出错误信息
            Message({ type: 'error', text: err.response.data.message || '未知错误, 系统维护中' })
          }
        })
      }

      // 拿到当前实例, 不建议这么用
      // const { proxy } = getCurrentInstance()
      // console.log('proxy', proxy)
      // proxy.$message({ text: '111' })
    }

    return { isMsgLogin, form, schema: mySchema, formRef, login }
  }
}
</script>

<style lang="less" scoped>
  // 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
