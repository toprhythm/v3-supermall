<template>
  <div>
    <div class="container">
      <SubBread />                <!--面包屑-->
      <SubFilter />               <!--筛选区-->
      <div class="goods-list">    <!--商品面板（排序+商品列表）-->
        <SubSort />
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
export default {
  name: 'SubCategory',
  components: { SubSort, SubBread, SubFilter },
  setup () {
    const isAllChecked = ref(true) // 是否全选
    return { isAllChecked }
  }
}
</script>
<style scoped lang="less">
  .goods-list {
    background: #fff;
    padding: 0 25px;
    margin-top: 25px;
  }
</style>
