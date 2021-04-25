<template>
  <div id="bottomRight" style="height: 300px; width: 100%">
    <div class="bg-color-black" style="height: 300px">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
<!--          <icon name="chart-bar"></icon>-->
        </span>
        <div class="d-flex chart-title">
          <span class="fs-xl text mx-2">各商场分店收入概况</span>
        </div>
      </div>
      <div>
        <BottomRightChart />
      </div>
    </div>
  </div>
</template>

<script>
import BottomRightChart from '@/components/echart/bottom/bottomRightChart/index'
export default {
  components: {
    BottomRightChart
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
#bottomRight {
  padding: 0.3rem 0.2rem;
  height: 6.5rem;
  min-width: 3.75rem;
  border-radius: 0.0625rem;
  .bg-color-black {
    height: 6.0625rem;
    border-radius: 0.125rem;
  }
  .text {
    color: #c3cbde;
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
