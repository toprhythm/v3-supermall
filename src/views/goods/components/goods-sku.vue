<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img :class="{selected:val.selected, disabled:val.disabled}" @click="changeSku(item, val)" v-if="val.picture" :src="val.picture" :title="val.name">
          <span :class="{selected:val.selected, disabled:val.disabled}" @click="changeSku(item, val)" v-else>{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import PowerSet from '@/vonder/power-set'
// 统一定义分隔符
const spliter = '☆'

// 得到一个路径字典
const getPathMap = (skus) => {
  // 1. 得到所有的sku集合 props.goods.skus
  // 2. 从所有的sku中筛选出有效的sku
  // 3. 根据有效的sku使用power-set算法得到子集
  // 4. 根据子集从路径字典对象中存储 key-value
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) { // 有效的sku inventory:库存
      // 计算当前有库存的sku的子集
      // 例如：[1,2,3] ===> [[1],[2],[3],[1,2],[2,3],[1,3],[1,2,3]]
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // console.log('valueArr', valueArr)
      // 可选值数组 子集
      const valueArrPowerSet = PowerSet(valueArr)
      // console.log(valueArrPowerSet) // [[], [蓝色][蓝色，中国][蓝色，中国，20cm]...]
      // 遍历子集，往路径字典插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key，约定key是：[蓝色，美国] ===> 蓝色spliter美国
        const key = arr.join(spliter)
        // console.log(key)
        // 字典pathMap里加东西
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else { // "": (11) ['1369155862131642369', '1369155863389933570', '....
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 选中的按钮对象
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}

// 更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 1. 约定每一个按钮的状态由本身的disable数据来控制
  specs.forEach((item, index) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // v2.0
      // I. 判断当前是否选中,是选中不用判断
      if (val.selected) return
      // II. 拿当前的值按照顺序套入选中的值
      selectedValues[index] = val.name
      // III. 剔除undefined,按照分隔符拼接key
      const key = selectedValues.filter(v => v).join(spliter) // 当v有值时
      // IIII. 拿着key去路径字典当中查找,有就可以点击，没有就禁用（true）
      val.disabled = !pathMap[key]

      // v1.0
      // 去路径字典中查找是否有数据，有可以点击，没有就禁用(true)
      // val.disabled = !pathMap[val.name]
      // val.disabled = pathMap[val.name] // 反向验证法
    })
  })
}

// 默认选中的规格们
const initDefaultSelected = (goods, skuId) => {
  // 1. 找出sku信息
  // 2. 遍历每一个按钮，按钮的值和sku记录值相同，就选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)

    // 根据skuId初始化选中按钮默认
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }

    // console.log(pathMap) // 测试：黑锅 日本 20cm的锅是没有的是被禁用的
    // ☆组件初始化，更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)

    // 1. 选中与取消选中，约定在每一个按钮都拥有自己的选中状态数据: selected
    // 1.1 点击的是已选中的规格，只需要取消当前选中
    // 1.2 点击的是未选中，把同一个规格改成未选中，当前点击的改成选中
    const changeSku = (item, val) => {
      if (val.disabled) return // 当按钮是禁用的阻止程序运行
      // 取反
      if (val.selected) { // 当你点的按钮为真，点击后就让他为假
        val.selected = false
      } else {
        // PINK排他思想，干掉所有人，留下我自己
        item.values.forEach(valItem => {
          valItem.selected = false // 干掉所有人
        })
        val.selected = true // 留下我自己
      }
      // ☆点击按钮时，更新按钮禁用状态 // 测试：黑锅，日本，20cm的锅是没有的是被禁用的
      updateDisabledStatus(props.goods.specs, pathMap)
      // console.log(getSelectedValues(props.goods.specs))// ['黑色', '20cm', undefined]

      // 将你选择的sku信息通知父组件 {skuId,price,oldPrice,inventory,specsText}
      // 1. 选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
      // 2. 不是完整sku组合按钮，提交空对象给父组件
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        // console.log('sku组合完整')
        // 完整
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1。。。这样的字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, '').trim()
        })
        // console.log(sku.specs.reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, '').trim())
      } else {
        // 不完整
        // console.log('sku不完整')
        // 父组件判断规格是否完整，不完整不能加入购物车
        emit('change', {})
      }
    }
    return {
      changeSku
    }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
