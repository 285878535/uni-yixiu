/**
 * 日志 Store 模块
 */
import { defineStore } from 'pinia'

export const useLogStore = defineStore('log', {
  state: () => ({
    logData: {
      carBrand: '',
      carSeries: '',
      vehicleModelYear: '',
    },
  }),
  
  actions: {
    setLogData(data) {
      this.logData = { ...this.logData, ...data }
    },
  },
})

