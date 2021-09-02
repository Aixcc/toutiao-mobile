
import request from '@/utils/request'

// 获取联想数据
export const getSuggestion = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      //  获取联想关键词
      q
    }
  })
}

// 获取搜索结果
export const getResults = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}

// 获取搜索结果
// export const getHistories = () => {
//     return request({
//       method: "GET",
//       url: "/app/v1_0/search/history",
//     })
//   }
