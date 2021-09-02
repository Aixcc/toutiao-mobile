<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- 用form嵌套，并且active属性值不为空时，手机端就会显示输入框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <result v-if="isResultShow" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <history v-else :histories="histories" @search="onSearch" @updata-histories="histories = $event"/>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import suggestion from './components/suggestion'
import history from './components/history'
import result from './components/result'
import { setItem, getItem } from '@/utils/storage'
import { mapState } from 'vuex'

export default {
  name: 'searchIndex',
  components: {
    suggestion,
    history,
    result
  },
  props: {},
  data () {
    return {
      // 获取输入框的内容
      searchText: '',
      isResultShow: false,
      //   存放历史记录
      histories: getItem('history') || []
    }
  },
  computed: { ...mapState(['user']) },
  watch: {
    histories () {
      setItem('history', this.histories)
    }
  },
  created () {},
  mounted () {},
  methods: {

    onSearch (searchText) {
      // 输入框设置成你点击的联想文本
      this.searchText = searchText
      //   设置历史记录
      // 首先，先检查有无重复元素
      const index = this.histories.indexOf(searchText)
      if (index !== -1) {
        // 去除重复元素
        this.histories.splice(index, 1)
      }
      // 将我们搜索的文本放入到histories数组之中
      this.histories.unshift(searchText)
      // 数据持久化
      // setItem("history", this.histories);
      // 按下回车，让搜索结果出现
      this.isResultShow = true
    }

  }
}
</script>

<style scoped lang="less">
</style>
