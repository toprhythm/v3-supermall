<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // 1. template标签去除，单文件组件
    // 2. render返回值就是组件内容
    // 3. vue2.0 的h函数传参进来的，但是vue3.0的 h 函数是需要导入进来的
    // 4. h的第一个参数，标签名，第二个参数，标签的属性对象，第三个参数：子节点
    // 需求
    // 1. 创建xtx-bread父容器
    // 2. 获取默认插槽内容
    // 3. 去除xtx-bread-item组件的i标签,应该由render函数来组织
    // 4. 遍历插槽中的item, 得到一个动态创建的节点, 最后一个item不加i标签
    // 5. 把动态创建的节点渲染在xtx-bread标签中
    const items = this.$slots.default()// 拿到所有xtx-bread-item
    // console.log(items)
    const dymanicItems = []
    items.forEach((item, i) => {
      dymanicItems.push(item)
      if (i < (items.length - 1)) {
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    // return h('div', { class: 'xtx-bread' }, '子节点')
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  }
}
</script>

<style lang='less'>
  /*去除scoped属性，目的是让样式作用到xtx-bread-item组件*/
  .xtx-bread{
    display: flex;
    padding: 25px 10px;
    // ul li:last-child {}...先找到父元素,找到所有的子元素,找到最后一个元素，判断是不是li，是就是选中，不是就是无效选中
    // ul li:last-of-type {} , 找到所有类型为li的元素，选中最后一个
    &-item {
      a {
        color: #666;
        transition: all .4s;
        &:hover {
          color: @xtxColor;
        }
      }
    }
    i {
      font-size: 12px;
      margin-left: 5px;
      margin-right: 5px;
      line-height: 22px;
      /* 用css的形式让面包屑最后一个元素不加 > */
      /*&:last-child {*/
      /*  display: none;*/
      /*}*/
    }
  }
</style>
