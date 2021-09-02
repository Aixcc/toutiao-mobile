<template>
  <div class="login-container">
    <van-nav-bar
      title="登录/注册"
      class="app-nav-bar"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 登录表单 -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        placeholder="手机号"
        center
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        type="number"
        name="code"
        label="验证码"
        placeholder="验证码"
        center
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down :time="60 * 1000" format="ss s"  v-if="isCountDownShow" @finish="isCountDownShow = false"/>
          <van-button size="small" round @click.prevent="onSendSms"
            :loading="isSendSmsLoading"
            v-else
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
// 引入用户请求api
import { login, sendSms } from '@/api/user/'
import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      // 保存手机号和验证码
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 制定表单验证规则
      formRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      // 控制按钮的 loading 状态
      isSendSmsLoading: false,
      // 判断验证码是否进行倒数
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLogin () {
      // toasd轻提示
      Toast.loading({
        duration: 0, // 持续展示 toast
        message: '加载中...',
        forbidClick: true // 是否禁止背景点击
      })

      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const { data } = await login(this.user)
        // 4.处理响应结果 弹框提示
        Toast.success('登陆成功')
        // 将后端返回的登录状态（token值）放在vuex容器中
        this.$store.commit('setUser', data.data)
        // 登录成功之后，原路调回
        this.$router.back()
      } catch (err) {
        // console.log(err);
        // console.log("登录失败", err);
        Toast.fail('登录失败，手机或验证码错误')
      }
    },

    onFailed (error) {
      if (error.errors[0]) {
        Toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },

    async onSendSms () {
      try {
        // validate 用来验证表单，支持传入name值
        await this.$refs['login-form'].validate('mobile')
        // 请求开始展示loading状态
        this.isSendSmsLoading = true
        // 验证成功，请求发送短信
        await sendSms(this.user.mobile)
        // 成功发送短信，隐藏按钮，显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        // 处理错误信息
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信的错误提示message
          message = '发送短信太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证错误提示message
          message = err.message
        }
        // 提示用户
        Toast({
          message,
          position: 'top'
        })
      }
      // 请求结束关闭按钮的loading状态
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
}
</style>
