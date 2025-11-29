import axios from 'axios'
import { Message } from 'element-plus'
import { useAuthStore } from '@/store/auth'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 根据后端 API 结构调整
    const { data, code, message } = response.data

    // 如果后端有统一的成功代码
    if (code === 200) {
      return data
    } else {
      Message.error(message || '操作失败')
      return Promise.reject(new Error(message || '操作失败'))
    }
  },
  (error) => {
    const { status, data } = error.response || {}

    switch (status) {
      case 401:
        Message.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        // 使用路由跳转而不是直接修改 location
        if (window.location.pathname !== '/users/login') {
          window.location.href = '/users/login'
        }
        break
      case 403:
        Message.error('没有权限访问该资源')
        break
      case 500:
        Message.error('服务器内部错误')
        break
      default:
        Message.error(data?.message || '网络错误，请稍后重试')
    }

    return Promise.reject(error)
  }
)

export default request
