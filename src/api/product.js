// 提供商品相关的api函数

import request from '@/utils/request'

/**
 * 获取商品详情Id
 * @param {String} id
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}
