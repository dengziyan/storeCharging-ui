<template>
  <!--收费批次管理表格及操作组件  -->
  <div class="main">
    <cmb-form ref="query" :form-props="conditions" :form="params" operation-type="query" @on-change="onChange" />
    <!--引入搜索条件子组件        -->
<!--    <div class="search">-->
<!--      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />-->
<!--    </div>-->
    <div class="loading" v-loading="loading">
      <div class="txt">
        <div class="txt-left">
          <span>收入金额总计: {{ incomeAmounts }}元<br></span>
          <span>现金金额总计: {{ incomeAmounts }}元<br></span>
        </div>
        <div class="txt-right">
          <span>收入笔数: {{ incomeCounts }}笔<br></span>
          <span>现金笔数: {{ incomeCounts }}笔<br></span>
        </div>
        <div class="txt-right"><span> 缴费总户数: {{ numberOfHouseholds }} 户<br></span></div>
      </div>
      <cmb-table ref="table" :data="list" :columns="columns"/>
    </div>
    <!--引入表格组件        -->
<!--    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">-->
<!--      &lt;!&ndash; 操作按钮 。#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 &ndash;&gt;-->
<!--      <template #handle="{scope: {row, $index}}">-->
<!--        <el-button type="primary" size="mini" @click="handleBack(row, $index)">退款</el-button>-->
<!--      </template>-->
<!--    </TableVue>-->
    <!--  分页  -->
<!--    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[5,25,50]" @pagination="getList" />-->
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listIncomeDetail, toRefund } from '@/api/financialMag/incomeDetail'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listBranchOptions } from '@/api/financialMag/payBills'
import { listCountResult } from '@/api/financialMag/countResult'

export default {
  name: 'Index',
  components: { TableVue, SearchForm },
  data() {
    return {
      loading: false,
      incomeCounts: 0,
      incomeAmounts: 0.0,
      numberOfHouseholds: 0,
      billNames: [],
      // 查询表单
      params: { pageNum: 1, pageSize: 5, startTime: undefined, endTime: undefined, amountActuallyPaid: undefined,
        name: undefined, year: undefined, billName: undefined, userId: undefined, branchName: undefined }, // 查询参数
      conditions: {
        contents: [
          { label: '商场分店', name: 'branchName', type: 'select', options: [] },
          { label: '账单创建年份', name: 'year', type: 'datePicker', props: { type: 'year' }},
          { label: '账单名称', name: 'billName', type: 'select', options: [] },
          {
            label: '缴费日期', name: 'chargeBeginTime', type: 'datePicker',
            listeners: { change: this.splitTime },
            props: { type: 'datetimerange', 'range-separator': '至', 'start-placeholder': '开始日期', 'end-placeholder': '结束日期' }
          }
        ]
      },
      // searchForm: [
      //   { type: 'Select', label: '商场分店', prop: 'branchName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
      //   { type: 'year', label: '账单创建年份', prop: 'year', isDisabled: false, multiple: false, change: this.getList },
      //   { type: 'Select', label: '账单名称', prop: 'billName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
      //   { type: 'datetimerange', label: '缴费日期', prop: 'chargeBeginTime', width: '1000px', change: this.getList }
      // ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm },
        { label: '导出', type: 'warning', handle: this.handleExport }
      ],
      // table表格数据
      list: [],
      total: 0, // 总条数
      columns: [
        { props: { prop: 'branchName', label: '商场分店' }},
        { props: { prop: 'incomeSum', label: '收入金额' }},
        { props: { prop: 'incomeCount', label: '收入笔数', 'show-overflow-tooltip': true }},
        { props: { prop: 'refundSum', label: '退款金额', 'show-overflow-tooltip': true }},
        { props: { prop: 'refundCount', label: '退款笔数', 'show-overflow-tooltip': true }},
        { props: { prop: 'numberOfHousehold', label: '缴费户数', 'show-overflow-tooltip': true }}
      ]
    }
  },
  created() {
    this.getList()
    this.getBillList()
    this.getBranch()
  },
  methods: {
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
    // 选项：账单名称
    getBillList() {
      this.params.userId = this.$store.getters.id
      listIncomeDetail(this.params).then((response) => {
        const listBillName = response.data.rows
        for (let i = 0; i < listBillName.length; i++) {
          // 获取收费账单名称列表
          const billName = listBillName[i]
          this.billNames.push({ lable: billName.billName, value: billName.billName, isDisabled: false })
        }
        this.conditions.contents[2].options = this.unique(this.billNames)
      })
    },
    // 表格重置
    // resetForm() {
    //   Object.assign(this.$data.searchData, this.$options.data().searchData)
    // },
    // 查询列表
    getList() {
      this.loading = true
      listCountResult(this.addDateRange(this.params, this.params.chargeBeginTime)).then((response) => {
        console.log(response.data)
        this.list = response.data.settlementDetails || []
        this.incomeAmounts = response.data.incomeAmounts
        this.incomeCounts = response.data.incomeCounts
        this.numberOfHouseholds = response.data.numberOfHouseholds
        this.loading = false
      })
    },
    // 退款按钮的方法
    handleBack(row, index) {
      toRefund(this.$store.getters.id, row.id).then(response => {
        console.log(response)
        this.$message({
          message: response.message,
          type: response.code === 2000 ? 'success' : 'error'
        })
      })
    },
    // 对象数组去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    // 导出按钮操作
    handleExport() {
      const params = this.params
      if (this.checkAll) {
        params.pageNum = undefined
        params.pageSize = undefined
        params.export = 'all'
      }
      this.$confirm('是否确认导出收入统计?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportLogininfo(params).then(res => {
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          fileDownload(res, sysDate + '收入统计.xlsx')
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style scoped>
  .main{
    margin: 20px;
  }
  .loading{
    margin-top:30px;
  }
  .search{
    height: 150px;
  }
  .txt{
    display: flex;
    justify-content: flex-start
  }
  .txt-left{
    margin-right: 200px;
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
