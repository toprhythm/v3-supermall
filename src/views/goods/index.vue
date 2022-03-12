<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem v-if="goods && goods.categories" :to="`/category/${goods.categories[1].name}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem v-if="goods" :to="`/category/sub/${goods.categories[0].name}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem v-if="goods">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
          <GoodsSku :goods="goods" skuId="1369155862131642369" @change="changeSku" />
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import GoodsImage from './components/goods-image'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku },
  setup () {
    // 1. 获取商品详情，进行渲染
    const goods = useGoods()
    const changeSku = (sku) => {
      // console.log(sku)
      // 修改商品，现价，原价，库存 信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
    }
    return { goods, changeSku }
  }
}

const useGoods = () => {
  // 出现路由地址发生变化，但是不会重新初始化组件; watch
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // console.log(data)
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, { immediate: true })

  return goods
}

</script>

<style scoped lang='less'>
  .goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;
    .media {
      width: 580px;
      height: 600px;
      padding: 30px 50px;
    }
    .spec {
      flex: 1;
      padding: 30px 30px 30px 0;
    }
  }
  .goods-footer {
    display: flex;
    margin-top: 20px;
    .goods-article {
      width: 940px;
      margin-right: 20px;
    }
    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }
  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }
  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }
</style>
