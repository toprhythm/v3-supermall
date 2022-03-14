<template>
  <div class="xtx-pagination">
    <!-- {{pager.btnArr}} -->
      <a @click="changePage(myCurrentPage-1)" v-if="myCurrentPage>1" href="javascript:;">上一页</a>
    <a  v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start>1">...</span>
    <a @click="changePage(i)" href="javascript:;" :class="{active:i===myCurrentPage}" v-for="i in pager.btnArr" :key="i">{{i}}</a>
    <span v-if="pager.end<pager.pageCount">...</span>
    <a @click="changePage(myCurrentPage+1)" v-if="myCurrentPage<pager.pageCount" href="javascript:;" >下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    // 需要数据：
    // 1. 约定按钮的个数 5个
    const btnCount = 5
    // 2. 当前显示页码（响应式）
    const myCurrentPage = ref(1)
    // 3. 总页数 = 总条数 / 每页条数 = 向上取整()
    const myTotal = ref(100)
    // 4. 每页条数
    const myPageSize = ref(10)
    // 其他数据（总页数，起始按钮，结束按钮，按钮数组）依赖上方数据得到
    // 重点：根据上述数据得到（总页数，起始页码，结束页码，按钮数组）
    const pager = computed(() => {
      // 计算总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 计算起始页码和结束页码
      // 1. 理想情况根据当前页码，和按钮个数可得到
      let start = myCurrentPage.value - Math.floor(btnCount / 2)
      let end = start + btnCount - 1
      // 2.1 如果起始页码小于1了，需要重新计算
      if (start < 1) {
        start = 1
        end = (start + btnCount - 1) > pageCount ? pageCount : (start + btnCount - 1)
      }
      // 2.2 如果结束页码大于总页数，需要重新计算
      if (end > pageCount) {
        end = pageCount
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }
      // 处理完毕start和end得到按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { pageCount, start, end, btnArr }
    })

    // 改变页码
    const changePage = (newPage) => {
      // console.log('do changePage')
      myCurrentPage.value = newPage
      // 通知父组件，我要分页了，请你切数据
      emit('current-change', myCurrentPage)
    }

    // 监听props的变化，更新组件数据
    watch(props, () => {
      // console.log('props改变了')
      // 改变三个数据
      myTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    }, { immediate: true })

    return { myCurrentPage, pager, changePage }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
