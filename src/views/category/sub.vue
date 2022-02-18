<template>
  <div>
    <div class="container">
      <SubBread />        <!--面包屑-->
    </div>
  </div>
</template>
<script>
import SubBread from './components/sub-bread'
export default {
  name: 'SubCategory',
  components: { SubBread }
}
</script>
<style scoped lang="less"></style>
