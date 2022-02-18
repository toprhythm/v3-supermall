<template>
  <div>
    <div class="container">
      <SubBread />        <!--面包屑-->
      <SubFilter />       <!--筛选区-->
    </div>
  </div>
</template>
<script>
import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter }
}
</script>
<style scoped lang="less"></style>
