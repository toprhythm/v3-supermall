// 定义首页需要的接口函数
import request from '@/utils/request'

/**
 * 获取首页头部分类数据
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取顶级类目信息（children属性就是各个子分类）
 * @param {String} id : 顶级类目id
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}
