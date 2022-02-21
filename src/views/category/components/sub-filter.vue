<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="changeBrand(item.id)" :class="{active:item.id===filterData.brands.selectedBrand}" href="javascript:;" v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
      </div><!--filterData.brands.selectedBrand=item.id-->
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{item.name}}</div>
      <div class="body">
        <a @click="changeProp(item, prop.id)" :class="{active:prop.id===item.selectedProp}" href="javascript:;" v-for="prop in item.properties" :key="prop.id">{{prop.name}}</a>
      </div><!--item.selectedProp=prop.id-->
    </div>
  </div>
  <!--骨架屏-->
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '../../../api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 监听二级类目的变化获取筛选数据
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      // 变化后的Id有值且处于二级类目路由下
      if (newVal && `/category/sub/${newVal}` === route.path) {
        // 发请求获取数据
        filterLoading.value = true
        findSubCategoryFilter(route.params.id).then(data => {
          // console.log(data.result)
          // 每一组可选的筛选条件缺失 "全部" 条件,处理下数据加上全部
          // 特定的url:http://localhost:8080/#/category/sub/1008017 首页〉居家>收纳
          // 给每一组数据加上一个选中的id
          // 1. 品牌 : data.result.brands
          data.result.brands.selectedBrand = null // 当前所选中的品牌
          data.result.brands.unshift({ id: null, name: '全部' })
          // 2. 属性：data.result.saleProperty
          data.result.saleProperties.forEach(item => {
            item.selectedProp = null // 当前所选中的属性
            item.properties.unshift({ id: null, name: '全部' })
          })
          // 3. 设置给filterData
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    // 获取筛选参数的函数
    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] }
      // 品牌
      obj.brandId = filterData.value.brands.selectedBrand
      // 销售属性
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      // 参考数据 {brandId: '', attrs:[{groupName:'color', propertyName: 'blue'}]}
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }

    // 1. 记录当前选择的品牌
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return // 当你点击的产品等于已经是激活的产品，就阻止
      filterData.value.brands.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }

    // 2. 已选择的销售属性
    const changeProp = (item, propId) => { // 当你点击的规格等于已经是激活的规格，就阻止
      if (item.selectedProp === propId) return
      item.selectedProp = propId
      emit('filter-change', getFilterParams())
    }

    return {
      filterData,
      filterLoading,
      changeBrand,
      changeProp,
      getFilterParams
    }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
    .xtx-skeleton {
      padding: 10px 0;
    }
  }
</style>
