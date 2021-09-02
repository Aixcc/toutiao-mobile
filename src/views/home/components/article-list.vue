<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article = "article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

import { getArticles } from '@/api/article'
import { Toast } from 'vant'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [], // 数据列表
      loading: false,
      finished: false,
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false
    //   refreshSuccessText: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      //   console.log("onLoad");
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳，timestamp 相当于页码，请求最新数据使用当前最新时间戳，下一页数据使用上一次返回的数据中的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })

      // 2. 把数据放到 list 数组中
      const { results } = data.data
      this.articles.push(...results)

      // 3. 设置本次加载状态结束，它才可以判断是否需要加载下一次，否则就会永远的停在这里
      this.loading = false
      // 4. 数据全部加载完成
      if (results.length) {
        // 如果还有数据更新
        this.timestamp = data.data.pre_timestamp
      } else {
        //   没有数据了，加载状态结束
        this.finished = true
      }
    },
    async onRefresh () {
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 2. 把数据放到数据列表中（往顶部追加）
      const { results } = data.data
      this.articles.unshift(...results)
      // 3. 关闭刷新的状态 loading
      this.isRefreshLoading = false
      Toast({
        message: `更新了${results.length}条数据`,
        position: 'top'
      })
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
