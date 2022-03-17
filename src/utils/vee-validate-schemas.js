// 给 vee-validate 提供校验规则函数

import { userCheckAccount } from '@/api/user'

export default {
  // 账号校验，用户名非空校验
  account (value) { // value:当前表单元素绑定的值
    // 你没有输入内容
    if (!value) return '请输入用户名'
    // 字母开头  6-20个字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) {
      return '字符开头且6-20个字符'
    }
    return true
  },
  // 密码校验
  password (value) {
    if (!value) return '请输入密码'
    // 密码规则：密码格式6-24个字符之间
    if (!/^\w{6,24}/.test(value)) {
      return '密码格式6-24个字符之间'
    }
    return true
  },
  // 手机号校验
  mobile (value) {
    if (!value) return '请输入手机号'
    // 规则：第一个数字 1；第二个数字：3-9之间；后9位数字：随意;
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return '手机号格式不正确'
    }
    return true
  },
  // 验证码校验
  code (value) {
    if (!value) return '请输入验证码'
    // 6位数字
    if (!/^\d{6}$/.test(value)) {
      return '验证码格式不正确'
    }
    return true
  },
  isAgree (value) {
    if (!value) return '请勾选登录协议'
    return true
  },
  async accountApi (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    // 服务端校验
    const { result } = await userCheckAccount(value)
    if (result.valid) return '用户名已存在'
    return true
  },
  rePassword (value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    // 校验密码是否一致  form表单数据对象
    if (value !== form.password) return '两次输入的密码不一致'
    return true
  }
}
