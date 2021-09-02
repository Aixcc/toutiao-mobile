/**
 * 用户相关的请求模块
 */
import request from '@/utils/request'

// 在非组件模块中获取store
// import store from '@/store/'

/**
 * 用户登录
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}

/**
 * 请求发送短信
 */
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 获取登录用户信息
 */
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // 发送请求头数据
    // headers: {
    // 注意：该接口需要授权才能访问
    // token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    // Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

/**
 * 获取频道数据
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
