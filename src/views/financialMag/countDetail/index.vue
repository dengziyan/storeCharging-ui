<template>
  <!--结算结果表格及操作组件  -->
  <div class="main">
    <cmb-form ref="query" :form-props="conditions" :form="params" operation-type="query" @on-change="onChange" />
    <cmb-table
      v-loading="loading"
      ref="table"
      :data="list"
      :columns="columns"
    />
    <!--引入搜索条件子组件        -->
<!--    <div class="search">-->
<!--&lt;!&ndash;      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />&ndash;&gt;-->
<!--    </div>-->
    <!--引入表格组件        -->
<!--    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据" />-->
    <!--  分页  -->
<!--    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />-->
  </div>
</template>

<script>
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listBranchOptions } from '@/api/financialMag/payBills'
import { exportCountResult } from '@/api/financialMag/countDetail'
import { listCountResult } from '@/api/financialMag/countResult'

export default {
  name: 'Index',
  data() {
    return {
      loading: false,
      // 查询表单
      params: { pageNum: 1, pageSize: 10, beginTime: undefined, endTime: undefined, amountActuallyPaid: undefined, BranchName: undefined, createTime: undefined, billName: undefined, liquidationDate: undefined }, // 查询参数
      conditions: {
        contents: [
          { label: '商场分店', name: 'branchName', type: 'select', options: [] },
          { label: '结算日期', name: 'liquidationDate', type: 'datePicker',
            listeners: { change: this.splitTime },
            props: { type: 'datetimerange', 'range-separator': '至', 'start-placeholder': '开始日期', 'end-placeholder': '结束日期' }
          }
        ]
      },
      // searchForm: [
      //   { type: 'Select', label: '商场分店', prop: 'branchName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
      //   { type: 'datetimerange', label: '结算日期', prop: 'amountActuallyPaid', width: '1000px', change: this.getList }
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
        { props: { prop: 'branchName', label: '商场分店', align: 'center' }},
        { props: { prop: 'liquidationDate', label: '清算日期', 'show-overflow-tooltip': true }},
        { props: { prop: 'transactionHour', label: '交易日期', 'show-overflow-tooltip': true }},
        { props: { prop: 'incomeSum', label: '交易金额', 'show-overflow-tooltip': true }},
        { props: { prop: 'checkoutAmount', label: '结账金额', 'show-overflow-tooltip': true }},
        { props: { prop: 'fee', label: '手续费', 'show-overflow-tooltip': true }},
        { props: { prop: 'fee', label: '优惠金额', 'show-overflow-tooltip': true }},
        { props: { prop: 'paymentMethod', label: '支付方式', 'show-overflow-tooltip': true }},
        { props: { prop: 'residentIdentity', label: '交易类型', 'show-overflow-tooltip': true }}
      ]
    }
  },
  created() {
    this.getBranch()
    this.getList()
  },
  methods: {
    splitTime() {
      this.params = this.addDateRange(this.params, this.params.liquidationDate)
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
    // // 表格重置
    // resetForm() {
    //   Object.assign(this.$data.searchData, this.$options.data().searchData)
    // },
    // 查询列表
    getList() {
      this.loading = true
      listCountResult(this.addDateRange(this.params, this.params.liquidationDate)).then((response) => {
        this.list = response.data.settlementDetails || []
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].fee = 0
          this.list[i].checkoutAmount = this.list[i].incomeSum - this.list[i].refundSum
        }
        this.loading = false
        console.log(this.list)
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
      this.$confirm('是否确认导出退款明细表?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportCountResult(params).then(res => {
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          fileDownload(res, sysDate + '结算明细.xlsx')
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
  .search{
    height: 100px;
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
