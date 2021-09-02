<template>
  <div class="suggestion">
    <van-cell icon="search" v-for="(str, index) in suggestions" :key="index"
        @click="$emit('search',str)"
    >
      <div slot="title" v-html="hightlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'suggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 存放获取联想列表
      suggestions: []
    }
  },
  computed: {},
  watch: {
    //   监听事件完整写法
    searchText: {
      // dabounce 防抖，避免多次请求加载联想接口
      handler: debounce(async function () {
        const { data } = await getSuggestion(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    hightlight (str) {
      //   设置html结构
      const hl = `<span style="color:#3296fa">${this.searchText}</span>`
      //   规定正则表达式
      const reg = new RegExp(this.searchText, 'gi')
      //   使用replace来说替换字符串
      return str.replace(reg, hl)
    }
  }
}
</script>

<style scoped lang="less">
</style>
