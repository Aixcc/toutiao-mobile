<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="app-nav-ba">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /顶部导航栏 -->

    <!-- 文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <!-- 处理按钮遮挡问题 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <!-- 汉堡按钮 -->
      <div
        slot="nav-right"
        @click="isChannelEditShow = true"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
      <!-- /汉堡按钮 -->
    </van-tabs>
    <!-- /文章频道列表 -->

    <!-- 弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    >
      <!-- 在自定义事件中 传入的参数，可以用$event来接收 -->
      <channel-edit
        :userChannels="channels"
        @updata-active="active = $event"
        @close="isChannelEditShow = false"
        :active="active"
      />
    </van-popup>
    <!-- /弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      // 控制被激活的标签-VANT-TAB组件
      active: 0,
      // 频道列表
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
      // 已登录，请求获取线上的频道数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
      // 未登录
        const localChannels = getItem('user-channels')
        if (localChannels) {
        // 有本地频道数据，则使用
          channels = localChannels
        } else {
        // 没有本地频道数据，则请求获取默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 将数据更新到组件中
      this.channels = channels
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  // 取消组件自带的样式干扰
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #fff;
    .van-icon {
      font-size: 16;
    }
    .van-button__text {
      font-size: 14;
      color: #000;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      bottom: 20px;
      width: 15px !important;
      height: 3px;
      background: #3296fa;
    }
  }
  .wap-nav-placeholder {
    width: 33px;
    flex-shrink: 0;
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    display: flex;
    justify-content: center;
    background-color: #fff;
    align-items: center;
    opacity: 0.9;
    .van-icon {
      font-size: 24px;
    }
  }
}
</style>
