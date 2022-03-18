import { getNewCartGoods } from '@/api/cart'

// 购物⻋状态
export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  getters: { // 等价于 computed
    // 有效商品列表
    validList (state) {
      // 有效商品： 1.库存大于0，2.商品有效标识为true
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // js浮点计算不精确： 1.1 * 3 === 3.300000 怎么办？
      // 成100倍变整数，做整数/
      return getters.validList.reduce((p, c) => p + parseInt((c.nowPrice * 100)) * c.count / 100, 0)
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload对象
      // 他们是：id skuId name picture price nowPrice count attrsText selected stock isEffective
      // 1. 插入数据的规则：先找下是否有相同的商品
      // 2. 如果有相同的商品，查询它的数量，添加到payload上，在保存最新位置
      // 3. 如果没有相同商品，保存在最新位置即可
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) { // 是相同的商品
        const count = state.list[sameIndex].count
        // 加商品数量
        payload.count += count
        // 删除原来的商品
        state.list.splice(sameIndex, 1)
        // 追加新的商品
        state.list.unshift(payload)
      } else {
        // 追加新的
        state.list.unshift(payload)
      }
    },
    // 更新购物车商品
    updateCart (state, payload) {
      // goods 就是 商品信息：nowPrice，stock，isEffective
      // goods 商品对象的字段不固定, 对象中有哪些字段就改哪些字段, 字段的值合理才改
      // goods 商品对象必须有SKUID
      const updateGoods = state.list.find(item => item.skuId === payload.skuId)
      for (const key in payload) {
        // 给的值别是 undefined null ‘’
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
          updateGoods[key] = payload[key]
        }
      }
    }
  },
  actions: {
    // 加入购物车
    insertCart (store, payload) {
      //
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // TODO 1. 已登录

        } else {
          // 2. 未登录
          store.commit('insertCart', payload)
          resolve() // 传空代表成功即可
        }
      })
    },
    // 获取商品列表
    findCart (store, payload) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // TODO已登录
        } else {
          // 未登录
          // 同时发送请求，有几件商品，发几个请求，等所有请求成功，一并修改本地数据
          // promise.all(promises数组).then(valueList=>clog(valueList)), 同时发请求，所有请求成功，得到成功结果
          // promise.resolve promise.reject new Promise
          // Promise.race(promises数组).then(clog('拿到最快的那个请求的结果')) race:赛跑, 假设有两台后端服务器都提供天气api，你不知道那一台response更快，就用这个api
          const promisesArr = store.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          // valueList成功结果的集合，数据顺序和promisesArr一致，它又是根据state.list得来
          Promise.all(promisesArr).then(valueList => {
            // console.log('valueList=', valueList)
            // 更新本地购物车
            valueList.forEach((val, index) => {
              store.commit('updateCart', { skuId: store.state.list[index].skuId, ...val.result })
            })
            // 调用resolve代表操作成功
            resolve()
          })
        }
      })
    }
  }
}
