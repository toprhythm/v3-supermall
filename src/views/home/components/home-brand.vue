<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a @click="toggle(-1)" :class="{disabled: index===0}" href="javascript:;" class="iconfont icon-angle-left prev"></a>
      <a @click="toggle(1)" :class="{disabled: index===1}" href="javascript:;" class="iconfont icon-angle-right next"></a>
    </template>
    <div ref="target" class="box" >
      <Transition>
        <ul v-if="brands.length" class="list" :style="{transform: `translateX(${-index*1240}px)`}">
          <li v-for="brand in brands" :key="brand.id">
            <RouterLink to="/">
              <img :src="brand.picture" />
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px"/>
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel'
import { findBrand } from '@/api/home'
import { useLazyData } from '../../../hooks'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    /*
    * 获取数据
    * */
    // 普通方式获取brands数据
    // const brands = ref([]) // 1. 定义热门品牌数组
    // findBrand(10).then(data => {
    //   // console.log(data) // 2. 请求api拿到数据, f12侦查数据
    //   // console.log(data.result)
    //   /*
    //     desc: "连接你我" // 3. 分析数据，连看文档带猜业务
    //     id: "6"
    //     logo: "xxx.jpg"
    //     name: "CZ永在"
    //     nameEn: "yongzai"
    //     picture: "xxx.jpg"
    //     place: "中国江苏传智"
    //     type: null
    //    */
    //   brands.value = data.result // 4. 把品牌数组的value属性用请求到的品牌数组塞满
    // })

    // !!!注意：useLzyLoad需要的是API函数，如果遇到要传参的情况，自己写箭头函数在函数中调用Api就可以
    const { target, result } = useLazyData(() => findBrand(10)) // 懒加载方式获取brands数据

    /**
     * 切换效果, 前提只有 0 和 1 两页
     *
     * 1. 点击上一页
     * 2. 点击下一页
     */
    const index = ref(0) // 1. 定义一个索引，控制0和1
    const toggle = (opration) => { // 2. 定义一个切换索引的从而切换页码的方法
      const newIndex = index.value + opration // 3. 定义一个新索引，等于当前索引值(0)+操作符值（+1 | -1）
      if (newIndex < 0 || newIndex > 1) return // 4. 当新索引小于0或者大于1，那么按钮都该点不动
      index.value = newIndex // 5. 把新索引赋值给响应式索引
    }
    // return { brands, index, toggle }// 普通方式返回数据 // 5. 把品牌数组返回出去供给给模板层使用 // 6. 模板绑定数据
    return { brands: result, index, toggle, target } // 懒加载方式返回数据,懒加载测试：浏览器清空网络请求，往下滚动，逐个请求数据时就懒加载成功
  }
}
</script>

<style scoped lang='less'>
  .skeleton {
    width: 100%;
    display: flex;
    .item {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
  .home-panel {
    background:#f5f5f5
  }
  .iconfont {
    width: 20px;
    height: 20px;
    background: #ccc;
    color: #fff;
    display: inline-block;
    text-align: center;
    margin-left: 5px;
    background: @xtxColor;
    &::before {
      font-size: 12px;
      position: relative;
      top: -2px
    }
    &.disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
  .box {
    display: flex;
    width: 100%;
    height: 345px;
    overflow: hidden;
    padding-bottom: 40px;
    .list {
      width: 200%;
      display: flex;
      transition: all 1s;
      li {
        margin-right: 10px;
        width: 240px;
        &:nth-child(5n) {
          margin-right: 0;
        }
        img {
          width: 240px;
          height: 305px;
        }
      }
    }
  }
</style>
