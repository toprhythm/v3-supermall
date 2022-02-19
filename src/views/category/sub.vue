<template>
  <div>
    <div class="container">
      <SubBread />        <!--面包屑-->
      <SubFilter />       <!--筛选区-->
      <XtxCheckbox v-model="isAllChecked">全选</XtxCheckbox>     <!--{{isAllChecked}}测试复选框-->
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
import XtxCheckbox from '../../components/library/xtx-checkbox'
export default {
  name: 'SubCategory',
  components: { XtxCheckbox, SubBread, SubFilter },
  setup () {
    const isAllChecked = ref(true) // 是否全选
    return { isAllChecked }
  }
}
</script>
<style scoped lang="less"></style>
