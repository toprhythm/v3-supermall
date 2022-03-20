// hooks 封装逻辑，提供响应式数据。
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
// 数据懒加载函数
export const useLazyData = (apiFn) => {
  // 需要
  // 1. 被观察的对象
  // 2. 不同的API函数
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target, // 监听的目标元素
    ([{ isIntersecting }], observerElement) => { // 是否进入可视区
      if (isIntersecting) {
        // console.log('进入可视区')
        stop()
        // 调用API获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    { // 我们发现，我们向下滚动到home-product,必须要滚动进区域内百分之30以上才会请求到数据，造成了0.x秒的盒子空白，很丑陋，所以配置选项, 相交的的比例大于0(假设0.1)就触发懒加载请求
      threshold: 0
    }
  )
  // 返回--->数据（dom,后台数据）
  return { target, result }
}

/**
 * 支付倒计时函数
 * @param {Integer} countdown - 倒计时秒数
 */
export const usePayTime = () => {
  // 倒计时函数
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    console.log('time.value=', time.value)
    if (time.value <= 0) pause()
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
