<template>
  <div id="bottomLeft" style="height: 500px; width: 600px">
    <div class="bg-color-black" style="height: 500px">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
<!--          <icon name="chart-bar"></icon>-->
        </span>
        <div class="d-flex chart-title">
          <span class="fs-xl text mx-2">近30天支付趋势</span>
        </div>
      </div>
      <div>
        <BottomLeftChart />
      </div>
    </div>
  </div>
</template>

<script>
import BottomLeftChart from '@/components/echart/bottom/bottomLeftChart/index'
export default {
  components: {
    BottomLeftChart
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
#bottomLeft {
  padding: 0.3rem 0.2rem;
  height: 6.5rem;
  min-width: 3.75rem;
  border-radius: 0.0625rem;
  .bg-color-black {
    height: 6.0625rem;
    border-radius: 0.125rem;
  }
  .text {
    color: #00C2FF;
  }
  .chart-box {
    margin-top: 0.2rem;
    width: 2.125rem;
    height: 2.125rem;
    .active-ring-name {
      padding-top: 0.125rem;
    }
  }
  .chart-title{
    margin-top: 0.6rem;
    margin-left: 0.4rem;
  }
}
</style>
