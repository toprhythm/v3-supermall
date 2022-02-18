<template>
  <ul class="app-header-nav">
    <!-- {{$store.state.category.list}} -->
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li v-for="item in list" :key="item.id" @mousemove="show(item)" @mouseleave="hide(item)" >
      <RouterLink @click="hide(item)" v-bind:to="`/category/${item.id}`">{{ item.name }}</RouterLink>
      <div class="layer" :class="{open:item.open}">
        <ul>
          <li  v-for="sub in item.children" :key="sub.id">
            <RouterLink @click="hide(item)" v-bind:to="`/category/sub/${sub.id}`">
              <img :src="sub.picture" alt="">
              <p>{{ sub.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
    <!-- <li><a href="#">餐厨</a></li>
    <li><a href="#">艺术</a></li>
    <li><a href="#">电器</a></li>
    <li><a href="#">居家</a></li>
    <li><a href="#">洗护</a></li>
    <li><a href="#">孕婴</a></li>
    <li><a href="#">服装</a></li>
    <li><a href="#">杂货</a></li> -->
  </ul>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()
    const list = computed(() => {
      return store.state.category.list
    })

    // 跳转的时候不会关闭二级类目，通过数据来控制
    // 1.每个分类添加open的布尔变量
    // 2.提供显示和隐藏函数，修改open函数
    // 3.在组件中使用vuex中函数,使用事件来绑定提供一个雷鸣显示隐藏的类名
    const show = (item) => {
      store.commit('category/show', item)
    }
    const hide = (item) => {
      store.commit('category/hide', item)
    }
    return { list, show, hide }
  }
}
</script>

<style scoped lang='less'>
.app-header-nav {
  position: relative;
  width: 820px;
  display: flex;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // 显示二级类目
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}

.layer {
  // 当layer样式有open class 的时候，显示出来
  &.open {
            height: 132px;
        opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
