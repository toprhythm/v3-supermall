<template>
  <div class='xtx-bread'>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'XtxBread'
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
