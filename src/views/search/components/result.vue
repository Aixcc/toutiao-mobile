<template>
  <div class="result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(article,index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getResults } from '@/api/search'

export default {
  name: 'result',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 10
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getResults({
        page: this.page,
        per_page: this.per_page,
        q: this.searchText
      })
      // 将数据放入到list中
      const { results } = data.data
      this.list.push(...results)
      // 关闭loading
      this.loading = false
      // 判断是否还有数据
      if (results.length) {
        // 如果有，继续更新
        this.page++
      } else {
        // 如果没有，将finished值设置为true
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.result {
  position: fixed;
  top: 54px;
  right: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
}
</style>
