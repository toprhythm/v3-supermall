// 定义首页需要的接口函数
import request from '@/utils/request'

/**
 * 获取品牌
 * @param {Integer} limit - 品牌个数
 * @returns Promise
 */
export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取广告图
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

export const findNew = () => {
  return request('home/new', 'get')
}

export const findHot = () => {
  return request('home/hot', 'get')
}
