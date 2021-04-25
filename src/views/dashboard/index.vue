<template>
  <div>
    <el-container style="display: flex">
      <el-aside width="40%">
        <el-card style="margin: 20px">
          <div slot="header">
            <span>个人信息</span>
          </div>
          <div style="display: flex">
            <div class="text-center">
              <img src="../../assets/2.jpg" alt="" style="width: 100px;">
              <!--              <userAvatar :user="user" />-->
            </div>
            <ul class="list-group" style="margin-left: 20px;">
              <li class="list-group-item">
                <i class="el-icon-user-solid" />用户账号<span class="pull-right">{{ user.account }}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-phone" />手机号码<span class="pull-right">{{ user.mobilePhone }}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-comment" />用户邮箱<span class="pull-right">{{ user.email }}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-custom" />用户性别<span class="pull-right">{{ user.sex === 'M' ? '男' : '女' }}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-claim" />上次登录<span class="pull-right">{{ user.lastLoginTime }}</span>
              </li>
            </ul>
          </div>
        </el-card>
        <el-card style="margin: 20px" class="rightAside">
          <span class="time">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span>
          <div slot="header">
            <span>历史数据</span>
          </div>
          <p><span /><span>营收金额</span><span>营收笔数</span></p>
          <p><span>总订</span><span>{{ allSum }}</span><span>{{ totals }}</span></p>
          <p><span>今日</span><span>{{ sum }}</span><span>{{ total }}</span></p>
          <p><span>近7日</span><span>{{ sumWeek }}</span><span>{{ countWeek }}</span></p>
          <p><span>近30日</span><span>{{ sumMonth }}</span><span>{{ countMonth }}</span></p>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane class="tab1" label="支付笔数" name="first">
              <dv-scroll-ranking-board :config="config" style="width:500px;color: black" />
            </el-tab-pane>
            <el-tab-pane class="tab1" label="支付金额" name="second">
              <dv-scroll-ranking-board :config="config2" style="width:500px;color: black" />
            </el-tab-pane>
            <el-tab-pane class="tab1" label="支付占比排名" name="third">
              <dv-scroll-ranking-board :config="config3" style="width:500px;color: black" />
            </el-tab-pane>
          </el-tabs>
        </el-card>

      </el-aside>
      <el-main>
        <el-card style="margin: 20px">
<!--          <div class="mallData">-->
<!--            <span>今日营业收入￥{{ sum }}</span>-->
<!--            <span>今日营收笔数{{ total }}笔</span>-->
<!--            <span>下辖商场分店数{{ commareaies }}</span>-->
<!--          </div>-->
          <div id="myChart" :style="{width: '90%', height: '360px'}" />
        </el-card>
        <el-card style="margin: 20px">
          <el-header class="title">
            <dv-decoration-10 class="title-border1" />
            <dv-decoration-8 class="title-border2" />
            <div style="width:20%;height:5px;text-align: center;">
              <span style="font-size: 20px">数据大览</span>
              <dv-decoration-6 style="height:30px;" />
            </div>
            <dv-decoration-8 :reverse="true" class="title-border2" />
            <dv-decoration-10 class="title-border1" />
          </el-header>
          <div class="charts">
            <div class="bototm-box">
              <dv-border-box-13 style="height: 500px; width: 45%;background-color: #2F45BB;margin: 10px">
                <bottomLeft />
              </dv-border-box-13>
              <dv-border-box-12 style="height: 500px; width: 45%;background-color: #2F45BB;margin: 10px">
                <bottomRight />
              </dv-border-box-12>
            </div>
          </div>
        </el-card>
        <div />
      </el-main>
    </el-container>
  </div>
</template>
<script>

import bottomLeft from '@/views/bigScreen/bottomLeft'
import bottomRight from '@/views/bigScreen/bottomRight'
import { listIncomeStatic } from '@/api/financialMag/incomeStatic'
import { formatTime } from '@/utils'
import { listDataByDate } from '@/api/financialMag/bigScreen'
import { getUserProfile } from '@/api/authoraty/user'
export default {
  name: 'Dashboard',
  components: { bottomLeft, bottomRight },
  data() {
    return {
      user: {
        account: undefined,
        userName: undefined
      },
      lastMonth: [],
      mallName: undefined,
      mallAdmin: undefined,
      mallId: undefined,
      sum: undefined,
      commareaies: undefined,
      totals: undefined,
      allSum: undefined,
      total: undefined,
      countWeek: undefined,
      sumWeek: undefined,
      countMonth: 0,
      sumMonth: 0,
      config: {
        data: [
          { name: '广州萝岗店', value: 15 },
          { name: '深圳宝安店', value: 3 },
          { name: '茂名电白店', value: 3 }
        ]
      },
      config2: {
        data: []
      },
      config3: {
        data: []
      },
      isLoadingTree: false,
      queryParams: { userId: undefined },
      activeName: 'first',
      loading: true, dateDay: null, dateYear: null, dateWeek: null, weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      treeList: [], input1: undefined,
      defaultProps: { children: 'children', label: 'name', id: 'name' },
      searchData: { // 查询参数
        pageNum: 1, pageSize: 5, userId: undefined, floorId: undefined, branchId: undefined,
        mallId: undefined, storeNo: undefined, areaId: undefined,
        data: { mobilePhone: undefined, residentName: undefined }
      }
    }
  },
  mounted() {
    this.drawLine()
  },
  created() {
    this.getUser()
    this.timeFn()
    this.listIncomeStatic()
  },
  methods: {
    drawLine() {
      for (var i = 0; i < 7; i++) {
        this.lastMonth.unshift(new Date(new Date()
          .setDate(new Date().getDate() - i))
          .toLocaleDateString())
      }
      console.log(this.lastMonth)
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高', '最低']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.lastMonth
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '最高',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '最低',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [
                { name: '周最低', value: 2, xAxis: 1, yAxis: 1.5 }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' },
                [{
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max'
                }, {
                  symbol: 'circle',
                  label: {
                    normal: {
                      position: 'start',
                      formatter: '最大值'
                    }
                  },
                  type: 'max',
                  name: '最高点'
                }]
              ]
            }
          }
        ]
      })
    },
    getUser() {
      getUserProfile(this.$store.getters.id).then(res => {
        this.user.account = this.$store.getters.name
        this.user.userName = res.data.userInfo.userName
        this.user.realName = res.data.userInfo.realName
        this.user.mobilePhone = res.data.userInfo.mobilePhone
        this.user.email = res.data.userInfo.email
        this.user.sex = res.data.userInfo.sex
        this.user.lastLoginTime = res.data.userInfo.lastLoginTime
        console.log(res.data.userInfo)
      })
    },
    // 总计金额
    listIncomeStatic() {
      this.searchData.userId = this.$store.getters.id
      listDataByDate(this.searchData).then(
        res => {
          const listData = res.data.listData || []
          console.log('1213')
          console.log(res.data)
          this.mallName = res.data.mallName
          this.mallAdmin = res.data.mallAdmin
          this.mallId = res.data.mallId
          this.sum = res.data.sum
          this.commareaies = res.data.commareaies
          this.total = res.data.total
          this.countWeek = res.data.countWeek
          this.sumWeek = res.data.sumWeek
          for (let i = 0; i < listData.length; i++) {
            this.sumMonth += listData[i].incomeSum - 0
            this.countMonth += listData[i].incomeCount - 0
          }
        }
      )
      listIncomeStatic(this.searchData).then(
        res => {
          this.allSum = res.data.sum
          this.totals = res.data.total
          this.config.data = res.data.maps.map(function(val) {
            return { name: val.branchName, value: val.incomeCount }
          })
          console.log(this.config)
        })
    },
    timeFn() {
      setInterval(() => {
        this.dateDay = formatTime(new Date(), 'HH: mm: ss')
        this.dateYear = formatTime(new Date(), 'yyyy-MM-dd')
        this.dateWeek = this.weekday[new Date().getDay()]
      }, 1000)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="scss" scoped>
  .box-card{
    padding: 20px;
  }
  ul{
    list-style: none;
    padding: 0px;
    width: 1000px;
  }
  /*.list-group-item{*/
  /*  margin-top: 20px;*/
  /*}*/
  .pull-right{
    padding-left: 10px;
  }
  .leftAside{
    width: 70%;
  }
  .rightAside{
    span{
      display: inline-block;
      width: 25%;
      margin-right: 20px;
    }
    .time{
      width: 75%;
    }
  }
  .bototm-box{
    display: flex;
  }
  .mallData{
    display: flex;
  }
  .title{
    width: 100%;
    display: flex;
  }
  .title-border1{
    width:20%;
    height:5px;
  }
  .title-border2{
    width:20%;
    height:50px;
  }
  .tab1{
    height: 200px;
  }
</style>
