<template>
  <!--收费批次管理表格及操作组件  -->
  <div class="main">
    <cmb-form ref="query" :form-props="conditions" :form="params" operation-type="query" @on-change="onChange" />
    <div class="loading" v-loading="loading">
      <div class="txt">
        <span>收入金额总计: {{ sum }}元<br></span>
        <span>收入笔数: {{ total }}笔<br></span>
        <span>优惠金额金额总计: 0.0元<br></span>
      </div>
      <cmb-table ref="table" :data="list" :columns="columns"/>
    </div>
  </div>
</template>

<script>
import { listIncomeStatic } from '@/api/financialMag/incomeStatic'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listChargeCategoryOptions, listBranchOptions } from '@/api/financialMag/payBills'

export default {
  name: 'Index',
  data() {
    return {
      loading: false,
      sum: 0, chargeCategoryOptions: [],
      // 查询表单
      params: { pageNum: 1, pageSize: 5, startTime: undefined, endTime: undefined, paymentCycle: undefined, chargeCategoryName: undefined, createTime: undefined, chargeBeginTime: undefined },
      conditions: {
        span: 6,
        contents: [
          { label: '商场分店', name: 'branchName', type: 'select', options: [] },
          { label: '收费类型', name: 'chargeCategoryName', type: 'input' },
          { label: '缴费日期', name: 'chargeBeginTime', type: 'datePicker',
            listeners: { change: this.splitTime },
            props: { type: 'datetimerange', 'range-separator': '至', 'start-placeholder': '开始日期', 'end-placeholder': '结束日期' }
          }
        ]
      },
      // searchForm: [
      //   { type: 'Select', label: '商场分店', prop: 'branchName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
      //   { type: 'Select', label: '收费类型', prop: 'chargeCategoryName', isDisabled: false, multiple: false, value: '请选择收费类型', options: [], change: this.getList },
      //   { type: 'datetimerange', label: '缴费日期', prop: 'chargeBeginTime', width: '1000px', change: this.getList }
      // ],
      // searchHandle: [
      //   { label: '查询', type: 'primary', handle: this.getList },
      //   { label: '重置', type: 'primary', handle: this.resetForm },
      //   { label: '导出', type: 'warning', handle: this.handleExport }
      // ],
      // table表格数据
      list: [],
      total: 0, // 总条数
      columns: [
        { props: { prop: 'branchName', label: '商场分店' }},
        { props: { prop: 'paymentMethod', label: '渠道' }},
        { props: { prop: 'incomeSum', label: '收入金额' }},
        { props: { prop: 'incomeCount', label: '收入笔数' }},
        { props: { prop: 'income', label: '手续费金额统计' }},
        { props: { prop: 'income', label: '优惠金额总计' }}
      ]
    }
  },
  created() {
    this.getList()
    this.getChargeCategory()
    this.getBranch()
  },
  methods: {
    splitTime() {
      this.params = this.addDateRange(this.params, this.params.refundTime)
    },
    /** ********************* 查询条件区域 ********/
    onChange() {
      this.getList()
    },
    // 选项：商场分店
    getBranch() {
      listBranchOptions(this.$store.getters.id).then(response => {
        this.branchOptions = response.data.map(function(val) {
          return { label: val.BranchName, value: val.branchName }
        })
        this.conditions.contents[0].options = this.branchOptions
      })
    },
    // 选项：收费类型
    getChargeCategory() {
      this.params.userId = this.$store.getters.id
      listChargeCategoryOptions(this.params).then(response => {
        const chargeCategoryList = response.data.rows
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ label: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        this.conditions.contents[1].options = this.chargeCategoryOptions
      })
    },
    // 查询列表
    getList() {
      this.loading = true

      listIncomeStatic(this.addDateRange(this.params, this.params.chargeBeginTime)).then(
        (response) => {
          this.list = response.data.maps || []
          // 将数据中 手续费和 优惠金额 设置为 0
          this.list.map((item, index, list) => {
            item.income = 0
            return item
          })
          this.sum = response.data.sum
          console.log(this.list)
          this.total = response.data.total
          this.loading = false
        }
      )
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
    margin:20px;
  }
  .search{
    height: 100px;
  }
  .txt{
    display: flex;
    height: 20px;
  }
  .txt span{
    margin-right: 40px;
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
  .loading{
    margin-top:30px;
  }
</style>

<style>
  .el-form-item__label{
    width: auto !important;
  }
</style>
