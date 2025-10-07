import { getToken, setToken, removeToken } from '@/utils/auth'
import { getData, postData } from '@/utils/request'

export default {
  namespaced: true,
  state: () => {
    return {
      token: getToken() || null,
      userInfo: {},
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },

  },
  actions: {
    login(context, payload) {
      console.log('payload', payload)
      const params = { mobile: payload.username, password: payload.password }
      return postData('/sys/login', { data: params })
        .then(r => {
          context.commit('setToken', r)

        })
    },
    getUserInfo(context) {
      return getData('/sys/profile').then(r => {
        context.commit('setUserInfo', r)
      })
    },
    logout(context) {
      context.commit('removeToken')
      context.commit('setUserInfo', {})
    }
  }
}



