// 提供商品相关的api函数

import request from '@/utils/request'

/**
 * 获取商品详情Id
 * @param {String} id
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 * 获取推荐商品
 * @param {String} id - 商品ID，传入相关推荐，不传入猜你喜欢
 * @param {Integer} limit
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热销榜数据
 * @param {String} id - 商品ID
 * @param {Integer} limit - 商品数量
 * @param {Integer} type - 热销类型，0 24小时，1 周 ， 2 总
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}

/**
 * 获取商品评价
 * @param {String} id - 商品ID
 * @returns 商品评价数据
 */
export const findGoodsCommentInfo = (id) => {
  // return request(`goods/${id}/evaluate`, 'get')
  // axios遇见http，https不会加上基准地址
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

/**
 * 获取商品评价列表
 * @param {String} id - 商品ID
 * @param {Object} params - 筛选参数对象
 * @returns 商品评价列表数据
 */
export const findGoodsCommentList = (id, params) => {
  // return request(`goods/${id}/evaluate`, 'get')
  // axios遇见http，https不会加上基准地址
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}
