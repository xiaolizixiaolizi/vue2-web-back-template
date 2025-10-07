import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, //具体项目具体baseUrl
  timeout: 10000 //
})

service.interceptors.request.use(
  config => {
    const token = store.state.user.token
    if (token) config.headers['Authorization'] = 'Bearer ' + token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(

  response => {
    const { data, message, success } = response.data
    if (success) return data
    //比如说账号密码错误
    Message({ message: message, type: 'error' })
    return Promise.reject(Error(message))


  },
  error => {
    if (error.response.status === 401) {
      Message({ message: 'token失效,请重新登录', type: 'error' })
      store.dispatch('user/logout').then(() => {
        router.push('/login')
        return Promise.reject(error)
      })

    }
    Message({ message: error.message, type: 'error' })
    return Promise.reject(error)
  }
)

export default service
const createRequestFn = (method) => (url, config) => service({ method, url, ...config })
export const getData = createRequestFn('get')
export const postData = createRequestFn('post')

