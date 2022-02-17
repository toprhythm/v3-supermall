<template>
    <AppTopnav></AppTopnav>
    <AppHeader></AppHeader>
    <!-- 吸顶组件 -->
    <AppHeaderSticky />
    <main>
      <!-- 二级路由视图出口 -->
      <router-view></router-view>
    </main>
    <AppFooter></AppFooter>
</template>

<script>
import AppTopnav from '@/components/app-topnav'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'xtx-layout',
  components: { AppTopnav, AppHeader, AppFooter, AppHeaderSticky },
  // 获取下分类数据
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less"></style>
