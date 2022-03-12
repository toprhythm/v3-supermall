<!--城市组件-->
<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle()" :class="{active:visible}">
      <span v-if="!fullLocation" class="placeholder">请选择配送地址</span>
      <span v-else class="value">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span class="ellipsis" @click="changeItem(item)" v-for="item in currList" :key="item.code">{{ item.name }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 点一下显示，再点一下隐藏，点其他区域也隐藏
    const visible = ref(false) // 显示隐藏数据

    // 所有的省市区数据
    const allCityData = ref([])
    // 加载中动画显示与隐藏
    const loading = ref(false)

    // 定义打开和关闭函数
    const open = () => {
      visible.value = true
      // 刚开始请求的时候，把加载中动画打开
      loading.value = true
      // 当打开城市组件的时候，请求到城市数据，不论远程还是本地
      getCityData().then(res => {
        // console.log(res.data)
        allCityData.value = res.data

        // 获取到数据的时候，把加载中的动画关闭
        loading.value = false
      })
      // 清空之前的选择的省市区地址数据
      for (const key in changeResult) {
        // console.log(key)
        changeResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    // 提供一个切换函数给select使用
    const toggle = () => {
      // 你是关闭状态我就打开，你是打开状态我就关闭
      visible.value ? close() : open()
    }
    // 实现点击组件外部元素进行关闭操作
    const target = ref(null)
    //  参数1：监听那个ref元素，参数2是点击外部元素触发的回调函数
    onClickOutside(target, (event) => {
      // console.log('点击外部: ', event)
      // 在这里直接调用close就完事了
      close()
    })

    // 实现计算属性，获取当前显示的地区列表（省一级列表，市一级列表，县区一级列表）
    const currList = computed(() => {
      // 默认显示省一级列表,省一级就是allCityData
      let list = allCityData.value
      // 可能：市一级
      if (changeResult.provinceCode && changeResult.provinceName) { // 证明你点了省
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 可能：县区一级
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      // 最后把列表返回出去
      return list
    })

    // 定义选择的 省市区 数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 当你点击 按钮 的时候记录
    const changeItem = (item) => {
      if (item.level === 0) { // 省一级
        // 记录省
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) { // 市一级
        // 记录市
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) { // 县区一级
        // 记录县区
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 这是最后一级，选完了，关闭对话框，把changeResult数据发射给父组件
        // 完整的省市区订单地址
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        close()
        emit('change', changeResult)
      }
    }

    return {
      visible,
      toggle,
      target,
      currList,
      loading,
      changeItem
    }
  }
}
// 获取省市区数据函数
const getCityData = () => {
  // https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 1. 当本地没有缓存，发请求获取全国数据
  // 2. 当本地有缓存，从本地获取全国数据
  // 返回一个Promise，将来在then中获取，因为一有可能请求数据(异步操作)，二有可能获取本地数据（同步操作）
  return new Promise((resolve, reject) => {
    // 约定数据存储在window上的cityData字段
    if (window.cityData) { // 有值，返回这个值
      resolve(window.cityData)
    } else {
      // 请求
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(value => {
        // 缓存全国数据挂载到window.cityData
        window.cityData = value
        resolve(value)// 返回请求到的全国数据
      })
    }
  })
}
</script>

<style lang="less" scoped>
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    // 加载中全国数据的样式
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
