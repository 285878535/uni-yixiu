/**
 * 用户 Store 模块
 */
import { defineStore } from 'pinia'
import { setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: '',
  }),
  
  getters: {
    isLogin: (state) => !!state.token,
  },
  
  actions: {
    /**
     * 设置用户信息
     */
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    
    /**
     * 设置 token
     */
    setToken(token) {
      this.token = token
      setToken(token)
    },
    
    /**
     * 设置 token（兼容原方法名）
     */
    onSetToken({ token }) {
      this.setToken(token)
    },
    
    /**
     * 登录
     */
    login(userInfo) {
      this.userInfo = userInfo
    },
    
    /**
     * 登出
     */
    logout() {
      this.userInfo = null
      this.token = ''
      removeToken()
    },
  },
})

