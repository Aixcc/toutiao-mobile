<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      ></van-grid-item>
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommentChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      ></van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    ...mapState(['user']),
    //   推荐频道列表
    recommentChannels () {
      // 所有 - 我的 = 剩余
      //   使用filter数组方法，可以筛选出来
      return this.allChannels.filter((channel) => {
        //   使用find可以找到匹配的数据
        return !this.userChannels.find((userChannel) => {
          //   找到满足条件的元素
          return userChannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    //   获取全部列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 添加功能
    async onAdd (channel) {
      this.userChannels.push(channel)
      // 持久化
      if (this.user) {
        // 登录了，数据存储到线上
        await addUserChannel({
          channels: [{ id: channel.id, seq: this.userchannels.length }]
        })
      } else {
        // 没有登录，数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 点击编辑按钮事件
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    // 删除
    async deleteChannel (channel, index) {
      if (index <= this.active) {
        this.$emit('updata-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)

      // 数据持久化
      if (this.user) {
        await deleteUserChannel(channel.id)
      } else {
        // 没有登录，存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 切换
    switchChannel (index) {
      // 切换频道
      this.$emit('updata-active', index)
      // 关闭弹出层
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54px;

  .channel-title {
    font-size: 16px;
    color: #333;
  }

  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -10px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }

  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
