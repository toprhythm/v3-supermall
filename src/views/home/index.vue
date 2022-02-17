<template>
  <div class="home-entry">
    <!-- container: 1240宽度，居中 -->
    <div class="container">
      <HomeCategory />        <!--左侧分类-->
      <HomeBanner />          <!--轮播图-->
      <HomeNew />             <!--新鲜好物-->
      <HomeHot />             <!--人气推荐-->
      <HomeBrand />           <!--热门品牌-->
      <HomeProduct />         <!--产品区块-->
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category'
import HomeBanner from './components/home-banner'
import HomeNew from './components/home-new'
import HomeHot from './components/home-hot'
import HomeBrand from './components/home-brand'
import HomeProduct from './components/home-product'
export default {
  name: 'PageHome',
  components: { HomeProduct, HomeCategory, HomeBanner, HomeNew, HomeHot, HomeBrand }

}
</script>

<style lang="less">
// .container {
//   .hoverShadow();
//   color: @xtxColor;
// }
//测试用的高度
// .testHeight {
//   height: 1500px;
// }
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0,0,0,0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}

</style>
