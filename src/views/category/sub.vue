<template>
  <div>
    <div class="container">
      <SubBread />                        <!--面包屑-->
      <SubFilter @filter-change="filterChange" />                       <!--筛选区-->
      <div class="goods-list">            <!--商品面板（排序+商品列表）-->
        <SubSort @sort-change="sortChange" />                       <!--商品排序-->
        <ul>                              <!-- 列表 -->
          <li v-for="goods in goodsList" :key="goods.id" >
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />            <!--无限加载组件-->
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodsItem from './components/goods-item'
import XtxInfiniteLoading from '../../components/library/xtx-infinite-loading'
import { findSubCategoryGoods } from '../../api/category'
export default {
  name: 'SubCategory',
  components: { XtxInfiniteLoading, SubSort, SubBread, SubFilter, GoodsItem },
  setup () {
    const route = useRoute()
    const loading = ref(false) // 加载中
    const finished = ref(false) // 是否加载完毕
    const goodsList = ref([]) // 商品列表数据
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => { // 获取商品列表数据
      // console.log('加载数据')

      loading.value = true // 转起来
      // 设置二级分类的id
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        // 获取数据成功
        if (result.items.length) {
          goodsList.value.push(...result.items) // 有数据就追加数据
          reqParams.page++
        } else {
          finished.value = true // 没有数据了，加载完成
        }
        loading.value = false // 方法执行完最终都是不转了
      })
    }

    // 因为vue的缓存特型，在更改完二级分类，下面的商品列表也要重新加载，而不是被复用
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        finished.value = false
        goodsList.value = [] // 导致列表是空的,加载更多组件顶上来，进入可视区，加载数据
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })

    // 1. 更改排序组件的筛选数据，重新请求
    const sortChange = (sortParams) => {
      // console.log(sortParams)
      finished.value = false // 转起来
      reqParams = { ...reqParams, ...sortParams } // 合并请求参数，保留之前的参数
      reqParams.page = 1 // 请求最新参数的第一页的数据
      goodsList.value = [] // 清空商品列表
    }
    // 2. 更改筛选组件的筛选数据，重新请求
    const filterChange = (filterParams) => {
      // console.log(filterParams)
      // 合并请求参数，重新请求
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
    }

    return { getData, loading, finished, goodsList, sortChange, filterChange }
  }
}
</script>
<style scoped lang="less">
  .goods-list {
    background: #fff;
    padding: 0 25px;
    margin-top: 25px;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 5px;
      li {
        margin-right: 20px;
        margin-bottom: 20px;
        &:nth-child(5n) {
          margin-right: 0;
        }
      }
    }
  }
</style>
