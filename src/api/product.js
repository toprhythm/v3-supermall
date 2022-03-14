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
