<template>
  <!--结算结果表格及操作组件  -->
  <div class="main">
    <cmb-form ref="query" :form-props="conditions" :form="params" operation-type="query" @on-change="onChange" />
    <!--引入搜索条件子组件        -->
    <!--    <div class="search">-->
    <!--      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />-->
    <!--    </div>-->
    <div v-loading="loading" class="loading">
      <div class="txt">
        <div class="txt-left">
          <span>结算金额: {{ settlementAmount }}<br></span>
          <span>优惠金额: 0.0<br></span>
        </div>
        <div class="txt-center">
          <span>收入金额(元)/笔数（笔）: {{ incomeAmounts }} / {{ incomeCounts }}<br></span>
          <span>手续费（元）:0.0<br></span>
        </div>
        <div class="txt-right">
          <span>退款金额（元）/退款笔数（笔）:{{ refundAmounts }} / {{ refundCounts }}<br></span>
        </div>
      </div>
      <cmb-table ref="table" :data="list" :columns="columns" />
    </div>
    <!--  分页  -->
    <!--    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />-->
  </div>
</template>

<script>
import { listCountResult, exportCountResult } from '@/api/financialMag/countResult'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listBranchOptions } from '@/api/financialMag/payBills'
export default {
  name: 'Index',
  data() {
    return {
      // 收入金额
      incomeAmounts: 0.0,
      // 收入笔数
      incomeCounts: 0,
      // 退款金额
      refundAmounts: 0.0,
      // 退款笔数
      refundCounts: 0,
      // 结算金额
      settlementAmount: 0.0,
      // 查询表单
      params: { pageNum: 1, pageSize: 10, startTime: undefined, endTime: undefined, settlementDate: undefined, name: undefined, createTime: undefined, billName: undefined }, // 查询参数
      // searchForm: [
      //   { type: 'Select', label: '商场分店', prop: 'branchName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
      //   { type: 'datetimerange', label: '结算日期', prop: 'settlementDate', width: '1000px', change: this.getList }
      // ],
      conditions: {
        contents: [
          { label: '商场分店', name: 'branchName', type: 'select', options: [] },
          { label: '结算日期', name: 'settlementDate', type: 'datePicker',
            listeners: { change: this.splitTime },
            props: { type: 'datetimerange', 'range-separator': '至', 'start-placeholder': '开始日期', 'end-placeholder': '结束日期' }
          }
        ]
      },
      // searchHandle: [
      //   { label: '查询', type: 'primary', handle: this.getList },
      //   { label: '重置', type: 'primary', handle: this.resetForm },
      //   { label: '导出', type: 'warning', handle: this.handleExport }
      // ],
      // table表格数据
      list: [],
      loading: false,
      total: 0, // 总条数
      columns: [
        { props: { prop: 'branchName', label: '商场分店' }},
        { props: { prop: 'paymentMethod', label: '渠道', 'show-overflow-tooltip': true }},
        { props: { prop: 'settlementAmount', label: '结算金额', 'show-overflow-tooltip': true }},
        { props: { prop: 'incomeSum', label: '收入金额', 'show-overflow-tooltip': true }},
        { props: { prop: 'incomeCount', label: '收入笔数', 'show-overflow-tooltip': true }},
        { props: { prop: 'income', label: '优惠金额', 'show-overflow-tooltip': true }},
        { props: { prop: 'income', label: '手续费', 'show-overflow-tooltip': true }},
        { props: { prop: 'refundSum', label: '退款金额', 'show-overflow-tooltip': true }},
        { props: { prop: 'refundCount', label: '退款笔数', 'show-overflow-tooltip': true }}
      ]
    }
  },
  created() {
    this.getBranch()
    this.getList()
  },
  methods: {
    splitTime() {
      this.params = this.addDateRange(this.params, this.params.settlementDate)
    },
    /** ********************* 查询条件区域 ********/
    onChange() {
      this.getList()
    },
    // 选项：商场分店
    getBranch() {
      listBranchOptions(this.$store.getters.id).then(response => {
        this.branchOptions = response.data.map(function(val) {
          return { label: val.branchName, value: val.branchName }
        })
        this.conditions.contents[0].options = this.branchOptions
      })
    },
    // 查询列表
    getList() {
      this.loading = true
      const params = Object.assign({}, this.params)
      params.settlementDate = undefined
      listCountResult(this.addDateRange(params, this.params.settlementDate)).then((response) => {
        this.list = response.data.settlementDetails || []
        this.incomeAmounts = response.data.incomeAmounts
        this.incomeCounts = response.data.incomeCounts
        this.refundAmounts = response.data.refundAmounts
        this.refundCounts = response.data.refundCounts
        this.settlementAmount = this.incomeAmounts - this.refundAmounts
        // 将数据中 手续费和 优惠金额 设置为 0
        this.list.map((item, index, list) => {
          item.settlementAmount = item.incomeSum - item.refundSum
          item.income = 0
          return item
        })
        this.loading = false
      })
    },
    // 导出按钮操作
    handleExport() {
      const params = this.params
      if (this.checkAll) {
        params.pageNum = undefined
        params.pageSize = undefined
        params.export = 'all'
      }
      params.userId = this.$store.getters.id
      this.$confirm('是否确认导出结算结果表?', '警告', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(function() {
        exportCountResult(params).then(res => {
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          fileDownload(res, sysDate + '结算结果.xlsx')
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style scoped>
  .main{
    margin:20px;
  }
  .loading{
    margin-top:30px;
  }
  .search{
    height: 100px;
  }
  .txt{
    display: flex;
  }
  .txt-left,.txt-center{
    margin-right: 150px;
  }
  .el-row{
    margin-left: 10px !important;
  }
  .el-table{
    width: 98% !important;
    border-right: none !important;
  }
  /*搜索条件*/
  .ces-search{
    height: 50px;
    margin-top: 10px;
  }
  .el-form-item__label{
    width: 100px !important;
  }
  .el-form-item__label{
    width: auto !important;
  }
</style>

<style>
  .el-form-item__label{
    width: auto !important;
  }
</style>
