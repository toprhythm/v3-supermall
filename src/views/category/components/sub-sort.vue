<template>
  <div class='sub-sort'>
    <div class="sort">
      <a @click="changeSort(null)" :class="{active:sortParams.sortField===null}" href="javascript:;">默认排序</a>
      <a @click="changeSort('publishTime')" :class="{active:sortParams.sortField==='publishTime'}" href="javascript:;">最新商品</a>
      <a @click="changeSort('orderNum')" :class="{active:sortParams.sortField==='orderNum'}" href="javascript:;">最高人气</a>
      <a @click="changeSort('evaluateNum')" :class="{active:sortParams.sortField==='evaluateNum'}" href="javascript:;">评论最多</a>
      <a @click="changeSort('price')"  href="javascript:;">
        价格排序
        <i class="arrow up" :class="{active:sortParams.sortField==='price' && sortParams.sortMethod==='asc'}" />
        <i class="arrow down" :class="{active:sortParams.sortField==='price' && sortParams.sortMethod==='desc'}" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup () {
    // 实现交互 (所需的数据和后台保持一致)
    // 1. 明确交互所需要的数据
    const sortParams = reactive({
      inventory: false, // 是否有库存
      onlyDiscount: false, // 只显示特惠
      sortField: null, // 排序字段，取值范围：[publishTime,orderNum,price,evaluateNum]
      sortMethod: null // 排序规则，asc为正序，desc为倒序，默认为desc
    })

    // 2. 需要绑定按钮的点击事件修改排序字段和排序方式
    const changeSort = (sortField) => {
      if (sortField === 'price') { // 如果是价格按钮的情况下
        sortParams.sortField = sortField
        // 处理排序
        if (sortParams.sortMethod === null) { // 第一次没有点击的时候，默认降序
          sortParams.sortMethod = 'desc'
        } else { // 包括第二次以及第二次之后的点击，正序取反，降序也取反
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else { // 如果非价格按钮
        if (sortParams.sortField === sortField) return // 如果有选项，防止用户因为网速慢多次点击
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
    }

    // end. 提供给模板使用
    return {
      sortParams,
      changeSort
    }
  }
}
</script>
<style scoped lang='less'>
  .sub-sort {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .sort {
      display: flex;
      a {
        height: 30px;
        line-height: 28px;
        border: 1px solid #e4e4e4;
        padding: 0 20px;
        margin-right: 20px;
        color: #999;
        border-radius: 2px;
        position: relative;
        transition: all .3s;
        &.active {
          background: @xtxColor;
          border-color: @xtxColor;
          color: #fff;
        }
        .arrow {
          position: absolute;
          border: 5px solid transparent;
          right: 8px;
          &.up {
            top: 3px;
            border-bottom-color: #bbb;
            &.active {
              border-bottom-color: @xtxColor;
            }
          }
          &.down {
            top: 15px;
            border-top-color: #bbb;
            &.active {
              border-top-color: @xtxColor;
            }
          }
        }
      }
    }
    .check {
      .xtx-checkbox {
        margin-left: 20px;
        color: #999;
      }
    }
  }
</style>
