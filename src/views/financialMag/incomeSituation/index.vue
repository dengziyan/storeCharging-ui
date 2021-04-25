<template>
  <!--收费批次管理表格及操作组件  -->
  <div class="main">
    <!--引入搜索条件子组件        -->
    <div class="search">
      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    </div>
    <div class="txt">
      <div class="txt-left">
        <span>应缴金额: {{}}元<br></span>
        <span>已缴户数: {{}}户<br></span>
      </div>
     <div class="txt-right">
       <span>实缴金额: {{sum}}元<br></span>
       <span>未缴户数: {{}}户<br></span>
     </div>
    </div>
  </div>
</template>

<script>
import { addDateRange } from '@/utils/userright'
import SearchForm from '@/components/SearchForm'
import { listIncomeStatic } from '@/api/financialMag/incomeStatic'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listChargeCategoryOptions, listBranchOptions } from '@/api/financialMag/payBills'

export default {
  name: 'Index',
  components: { SearchForm },
  data() {
    return {
      sum: 0,
      chargeCategoryOptions: [],
      // 查询表单
      searchData: { pageNum: 1, pageSize: 10, startTime: undefined, endTime: undefined, paymentCycle: undefined,
        chargeCategoryName: undefined, createTime: undefined, floorId: undefined, areaId: undefined },
      searchForm: [
        { type: 'Select', label: '商场分店', prop: 'branchName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'Select', label: '层', prop: 'floorId', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'Select', label: '业态区域', prop: 'areaId', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'Select', label: '收费类型', prop: 'chargeCategoryName', isDisabled: false, multiple: false, value: '请选择收费类型', options: [], change: this.getList },
        { type: 'monthrange', label: '账单周期', prop: 'paymentCycle', width: '1000px', change: this.getList }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm }
      ]
    }
  },
  created() {
    this.getList()
    this.getChargeCategory()
    this.getBranch()
  },
  methods: {
    // 选项：商场分店
    getBranch() {
      listBranchOptions(this.$store.getters.id).then(response => {
        this.branchOptions = response.data.map(function(val) {
          return { label: val.branchName, value: val.id }
        })
        this.searchForm[0].options = this.branchOptions
      })
    },
    // 选项：收费类型
    getChargeCategory() {
      this.searchData.userId = this.$store.getters.id
      listChargeCategoryOptions(this.searchData).then(response => {
        const chargeCategoryList = response.data.rows
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ label: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        this.searchForm[3].options = this.chargeCategoryOptions
      })
    },
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 查询列表
    getList() {
      this.loading = true
      listIncomeStatic(this.addDateRange(this.searchData, this.searchData.chargeBeginTime)).then((response) => {
        this.list = response.data.rows
        this.sum = response.data.sum
        console.log(this.list)
        this.total = response.data.total
        this.loading = false
      })
      listIncomeStatic(this.addDateRange(this.searchData, this.searchData.chargeBeginTime)).then(
        (response) => {
          this.list = response.data.maps
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
      const searchData = this.searchData
      if (this.checkAll) {
        searchData.pageNum = undefined
        searchData.pageSize = undefined
        searchData.export = 'all'
      }
      this.$confirm('是否确认导出收入统计?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportLogininfo(searchData).then(res => {
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
