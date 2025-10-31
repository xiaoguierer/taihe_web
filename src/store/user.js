import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: ''
  }),

  getters: {
    isLogin: (state) => !!state.token
  },

  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },

    setToken(token) {
      this.token = token
    },

    clearUser() {
      this.userInfo = null
      this.token = ''
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage,
      }
    ]
  }
})
