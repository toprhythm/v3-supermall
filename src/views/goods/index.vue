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
          <!-- 测试skuId 1369155862131642369 -->
          <!-- v1.0 是写死的，其他商品都看不了了 -->
          <!-- <GoodsSku :goods="goods" skuId="1369155862131642369" @change="changeSku" /> -->
          <!-- v2.0 取skus里的第一个元素的skuid -->
          <GoodsSku :goods="goods" :skuId="goods.skus[0].id" @change="changeSku" />
          <!-- 数量选择组件 -->
          <XtxNumbox v-model="num" :max="goods.inventory" label="数量" />
          <!-- 按钮组件 -->
          <XtxButton @click="insertCart()" type="primary" size="large" style="margin-top: 20px;">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :type="0" />
          <GoodsHot :type="1" />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import { ref, watch, nextTick, provide } from 'vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import GoodsImage from './components/goods-image'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
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

        // ???
        currSku.value = sku
      }
    }

    // 提供goods数据给后代（孙级孙孙级）组件使用
    provide('goods', goods)
    // console.log('goods', goods)

    // 选择的数量
    const num = ref(1)

    // 加入购物车方法
    const store = useStore()
    const currSku = ref(null)
    const insertCart = () => {
    // 约定加入购物车字段必须和后端保持一致
    // 他们是：id skuId name picture price nowPrice count attrsText selected stock isEffective
    // 真正在vuex里完成 store/cart.js
    // sku选择完整才可以加购
    // 这里怎么测试，先打开f12应用：点击 鞋子 蓝色 37码加购，看storage，点击黑色40码加购，再点击回蓝色37码加购，查看同款sku商品是否能够做到仅数量叠加，不增加item
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        console.log('mainPictures=', mainPictures)
        store.dispatch('cart/insertCart', {
          // name picture price nowPrice count attrsText selected stock isEffective
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          count: num.value,
          isEffective: true
        }).then(() => {
          Message({ type: 'success', text: '加入购物车成功' })
        })
      } else {
        Message({ type: 'error', text: '请选择完整规格' })
      }
    }

    return { goods, changeSku, num, insertCart }
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
