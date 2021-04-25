<template>
  <div style="height: 500px">
    <Chart style="height: 500px" :cdata="cdata" />
  </div>
</template>

<script>
import Chart from './chart.vue'
import { listDataByDate } from '@/api/financialMag/bigScreen'
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
      const query = {
        userId: this.$store.getters.id
      }
      await listDataByDate(query).then(
        res => {
          const dataMap = res.data.dataList || []
          // console.log(dataMap)
          this.cdata.rateData = dataMap.map(function(val) {
            return val.total
          })
          this.cdata.category = dataMap.map(function(val) {
            return val.time
          })
          this.cdata.barData = dataMap.map(function(val) {
            return val.sum
          })
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
