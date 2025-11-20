/**
 * 车型 Store 模块
 */
import { defineStore } from 'pinia'

export const useCarStore = defineStore('car', {
  state: () => ({
    codes: {
      manual_id: '',
    },
  }),
  
  actions: {
    setCodes(codes) {
      this.codes = codes
    },
  },
})

