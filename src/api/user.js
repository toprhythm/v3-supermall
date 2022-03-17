// 用户相关的接口

import request from '@/utils/request'

/**
 * 账号密码登录
 * @param {String} account - 账号
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
 * 获取手机号码的短信验证码
 * @param {*} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

/**
 * 手机号登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userMobileLogin = (mobile, code) => {
  // 老是报json错误，自己模拟个把
  // return request('/login/code', 'post', { mobile, code })

  // Monitor
  console.log('monitor:userMobileLogin' + mobile + code)
  return new Promise((resolve, reject) => {
    resolve(/* data */{
      /* data.result */
      result: {
        id: '1345917162132344834',
        account: 'zhousg--验证码登录Monitor',
        avatar: 'http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/avatar/2021-04-09/78228e0d-a77f-4fc6-8c42-11d4a223d672.jpg',
        mobile: '13241051259',
        nickname: '周氏爆肚馆验证码登录',
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuYW1lXCI6XCLlkajmsI_niIbogprppoZcIixcImlkXCI6XCIxMzQ1OTE3MTYyMTMyMzQ0ODM0XCIsXCJ1c2VybmFtZVwiOlwiemhvdXNnXCJ9IiwiaWF0IjoxNjQ3NDg1NTM3LCJleHAiOjE2NDc3NDQ3Mzd9.QQSAcCa9-g-XYQZLB1MygCptxYfAf3KDXT1fod8gbJg'
      }
    })
  })
}

/**
 *
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} source - 客户端类型 1 PC；
 * @returns
 */
export const userQQLogin = (unionId, source = 1) => {
  // API无法使用，我们自己的qq号没办法没法做unionId后端绑定
  // return request('/login/social', 'post', { unionId, source })
  console.log('userQQLogin', 'unionId=' + unionId, 'source=' + source)
  return new Promise((resolve, reject) => {
    // ##### 来一个flag，如果是true就是绑定了，false就是没绑定，去绑定
    const flag = true

    if (flag === false) {
      reject(new Error('未绑定'))
    } else {
      resolve(/* data */{
        /* data.result */
        result: {
          id: '1345917162132344834',
          account: 'zhousg--QQMonitor',
          avatar: 'http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/avatar/2021-04-09/78228e0d-a77f-4fc6-8c42-11d4a223d672.jpg',
          mobile: '13241051259',
          nickname: '周氏爆肚馆QQMonitor',
          token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuYW1lXCI6XCLlkajmsI_niIbogprppoZcIixcImlkXCI6XCIxMzQ1OTE3MTYyMTMyMzQ0ODM0XCIsXCJ1c2VybmFtZVwiOlwiemhvdXNnXCJ9IiwiaWF0IjoxNjQ3NDg1NTM3LCJleHAiOjE2NDc3NDQ3Mzd9.QQSAcCa9-g-XYQZLB1MygCptxYfAf3KDXT1fod8gbJg'
        }
      })
    }
  })
}

/**
 * 获取QQ绑定的时候短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * 校验帐号是否存在
 * @param {String} account - 帐号
 * @returns Promise
 */
export const userCheckAccount = (account) => {
  return request('/register/check', 'get', { account })
}

/**
 * QQ登录-完善信息未登录未注册
 * @param {String} mobile - 手机号
 * @returns
 */
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ登录-完善信息
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} account - 账号
 * @param {String} password - 密码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password })
}
