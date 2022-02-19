<template>
  <div class="xtx-checkbox" @click="change">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span> <!--写一句文字，类似协议,单选全选, $slots.default:如果插槽中没有内容那么这个span就不创建-->
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
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
    /*
    * 使用useVModel实现双向数据绑定，
    * 1. 使用props接受modelValue
    * 2. 使用useVModel来包装props中的modelValue属性数据
    * 3. 在使用checked.value的时候就是使用父组件数据
    * 4. 在使用checked.value = '数据' // 赋值，内部自动触发emit函数而且触发的是emit('update:modelValue', '数据')
    * */
    const checked = useVModel(props, 'modelValue', emit)

    const change = () => {
      const newVal = !checked.value
      checked.value = newVal // 你改值就会自动emit()
      emit('change', newVal)// 模仿element使用change事件
    }

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
