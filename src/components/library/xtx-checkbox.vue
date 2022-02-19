<template>
  <div class="xtx-checkbox" @click="change">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span> <!--写一句文字，类似协议,单选全选, $slots.default:如果插槽中没有内容那么这个span就不创建-->
  </div>
</template>
<script>
import { ref, watch } from 'vue'
// v-model ====> :modelValue + @update:modelValue
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const checked = ref(false) // 控制两个复选框的显示与隐藏

    const change = () => { // 改变复选框的状态
      checked.value = !checked.value
      // 使用emit通知父组件数据的改变
      emit('update:modelValue', checked.value)
    }

    watch(() => props.modelValue, () => { // 使用侦听器，得到父组件传递数据，给checked数据
      checked.value = props.modelValue
    }, { immediate: true })

    return { checked, change }
  }
}
</script>
<style scoped lang="less">
  .xtx-checkbox {
    display: inline-block;
    margin-right: 2px;
    .icon-checked {
      color: @xtxColor;
      ~ span {
        color: @xtxColor;
      }
    }
    i {
      position: relative;
      top: 1px;
    }
    span {
      margin-left: 2px;
    }
  }
</style>
