<template>
  <div style="height: 500px">
    <Chart style="height: 500px" :cdata="cdata" />
  </div>
</template>

<script>
import Chart from './chart.vue'
import { listCountResult } from '@/api/financialMag/countResult'
export default {
  components: {
    Chart
  },
  data() {
    return {
      cdata: {
        category: [],
        lineData: [],
        barData: [],
        rateData: []
      }
    }
  },
  mounted() {
    this.setData()
    this.getList()
  },
  methods: {
    getList() {

    },
    // 根据自己的业务情况修改
    async setData() {
      // for (let i = 0; i < this.cdata.barData.length - 5; i++) {
      //   let rate = this.cdata.barData[i] / this.cdata.lineData[i]
      //   this.cdata.rateData.push(i)
      // }
      this.cdata.rateData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      this.cdata.category = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      console.log(this.cdata.rateData)
      const query = {
        userId: this.$store.getters.id
      }
      await listCountResult(query).then(
        res => {
          const dataMap = res.data.settlementDetails || []
          console.log(dataMap)
          // y 轴坐标 右边数据
          this.cdata.rateData = dataMap.map(function(val) {
            return val.incomeCount
          })
          // x 轴坐标 数据
          this.cdata.category = dataMap.map(function(val) {
            return val.branchName
          })
          // y 轴坐标 左边数据
          this.cdata.barData = dataMap.map(function(val) {
            return val.incomeSum
          })
          console.log(this.cdata)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
