<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem v-if="topCategory">{{topCategory.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height:500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list" v-if="topCategory && topCategory.children">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" >
              <p>{{sub.name}}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import XtxBread from '../../components/library/xtx-bread'
import { findBanner } from '../../api/home'
export default {
  name: 'TopCategory',
  components: { XtxBread },
  setup () {
    // 轮播图
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })
    // 面包屑+所有子分类 ===> vuex
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      // 当前顶级分类对象 === 根据路由上的id去vuex中category模块的list中查找
      console.log(route.params.id)
      console.log(store.state.category.list)
      return store.state.category.list.find(item => {
        return item.id === route.params.id
      })
    })
    return {
      sliders,
      topCategory
    }
  }
}
</script>
<style scoped lang="less">
  .top-category {
    h3 {
      font-size: 28px;
      color: #666;
      font-weight: normal;
      text-align: center;
      line-height: 100px;
    }
    .sub-list {
      margin-top: 20px;
      background-color: #fff;
      ul {
        display: flex;
        padding: 0 32px;
        flex-wrap: wrap;
        li {
          width: 168px;
          height: 160px;
          a {
            text-align: center;
            display: block;
            font-size: 16px;
            img {
              width: 100px;
              height: 100px;
            }
            p {
              line-height: 40px;
            }
            &:hover {
              color: @xtxColor;
            }
          }
        }
      }
    }
  }
</style>
