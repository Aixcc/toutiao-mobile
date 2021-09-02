<template>
  <div class="history">
    <van-cell title="搜索历史">
      <div v-if="isDeteleShow">
        <span @click="$emit('updata-histories',[])">全部删除</span> &nbsp;&nbsp;
        <span @click="isDeteleShow = false">完成</span>
      </div>
      <!-- 绑定交互事件 -->
      <van-icon v-else name="delete" @click="isDeteleShow = true" />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in histories"
      :key="index"
      @click="onDetele(history, index)"
    >
      <van-icon name="close" v-show="isDeteleShow" />
    </van-cell>
  </div>
</template>

<script>
// import { setItem } from "@/utils/storage";

export default {
  name: 'history',
  components: {},
  props: {
    histories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeteleShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onDetele (history, index) {
      if (this.isDeteleShow) {
        this.histories.splice(index, 1)
        // setItem('histroy',history)
        return
      }
      this.$emit('search', history)
    }
  }
}
</script>

<style scoped lang="less">
</style>
