// 封装本地存储模块

// 读取
export const getItem = name => {
  // 获取user
  const data = window.localStorage.getItem(name)
  // 因为data可能不是JSON字符串，所以要放入到try...cath...中
  try {
    // 将data转为js对象
    return JSON.parse(data)
  } catch (err) {
    // 如果不为json字符串 直接返回data
    return data
  }
}

// 写入
export const setItem = (name, value) => {
  // 如果 value 是对象，就把 value 转为 JSON 格式字符串再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

// 删除
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
