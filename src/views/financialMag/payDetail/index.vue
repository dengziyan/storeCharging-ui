<template>
  <!--收费详情管理表格及操作组件  -->
  <div class="main">
    <cmb-form ref="query" :form-props="conditions" :form="params" operation-type="query" @on-change="onChange" />
    <!--    <search-form-->
    <!--      size="mini"-->
    <!--      label-width="80px"-->
    <!--      :search-data="searchData"-->
    <!--      :search-form="searchForm"-->
    <!--      :search-handle="searchHandle"-->
    <!--    />-->
    <!--引入操作子组件        -->
    <el-button-group>
      <el-row :gutter="10" class="mb8">
        <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新建</el-button>
        <!--        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleAnyCheck">批量审核-->
        <!--        </el-button>-->
        <!--        <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImport">导入-->
        <!--        </el-button>-->
        <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出</el-button>
        <!--        <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>-->
      </el-row>
    </el-button-group>
    <!-- 表单区域 -->
    <el-dialog v-if="newdialogVisible" :title="dialogTiele" :visible.sync="newdialogVisible" width="500px">
      <cmb-form
        ref="form"
        :form-props="formProps"
        :form="form"
        :operation-type="operationType"
        @on-submit="onSubmit"
        @on-cancel="newdialogVisible = false"
      />
    </el-dialog>
    <!--点击新增后出现的弹框    -->
    <!--    <el-dialog-->
    <!--      :title="newdialoEdit ? '编辑收费详情' : '添加收费详情'"-->
    <!--      :visible.sync="newdialogVisible"-->
    <!--      :edit.sync="newdialoEdit"-->
    <!--      width="700px"-->
    <!--    >-->
    <!--      &lt;!&ndash;弹框子组件      &ndash;&gt;-->
    <!--      <new-dialog-->
    <!--        v-if="newdialogVisible"-->
    <!--        :visible.sync="newdialogVisible"-->
    <!--        :edit.sync="newdialoEdit"-->
    <!--        :edit-info="editInfo"-->
    <!--        :new-dialog-batch-id="newDialogBatchId"-->
    <!--      />-->
    <!--    </el-dialog>-->
    <!--引入表格组件        -->
    <cmb-table
      ref="table"
      v-loading="loading"
      :total="total"
      :data="list"
      :columns="columns"
      @current-change="changePage"
      @prev-click="changePage"
      @next-click="changePage"
    >
      <template #handle2="{ scope: { row } }">
        <el-button type="text" @click="handleDetail(row)">详情</el-button>
      </template>
      <template #opertions="{ scope: { row, $index } }">
        <el-button v-if="!row.isShow" size="mini" type="text" icon="el-icon-circle-check" @click="handleReject(row, 1)">同意</el-button>
        <el-button v-if="!row.isShow" size="mini" type="text" icon="el-icon-circle-close" @click="handleReject(row, 2)">拒绝</el-button>
        <el-button size="mini" type="text" icon="el-icon-delete" :disabled="row.isShow" @click="handleDelete(row)">删除</el-button>
        <el-button size="mini" type="text" icon="el-icon-edit" :disabled="row.isShow" @click="handleEdit(row, $index)">编辑</el-button>
      </template>
    </cmb-table>
    <!--    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">-->
    <!--      &lt;!&ndash;  文字按钮    &ndash;&gt;-->
    <!--      <template #handle2="{ scope: { row } }" type="expand">-->
    <!--        <el-button type="text" @click="handleDetail(row)">详情</el-button>-->
    <!--      </template>-->
    <!--      &lt;!&ndash; 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 &ndash;&gt;-->
    <!--      <template #handle="{ scope: { row, $index } }">-->
    <!--        <el-button v-if="!row.isShow" size="mini" type="text" icon="el-icon-circle-check" @click="handleReject(row, 1)">同意</el-button>-->
    <!--        <el-button v-if="!row.isShow" size="mini" type="text" icon="el-icon-circle-close" @click="handleReject(row, 2)">拒绝</el-button>-->
    <!--        <el-button size="mini" type="text" icon="el-icon-delete" :disabled="row.isShow" @click="handleDelete(row)">删除</el-button>-->
    <!--        <el-button size="mini" type="text" icon="el-icon-edit" :disabled="row.isShow" @click="handleEdit(row, $index)">编辑</el-button>-->
    <!--      </template>-->
    <!--    </TableVue>-->
    <!--  分页  -->
    <!--    <pagination-->
    <!--      v-show="total > 0"-->
    <!--      :total="total"-->
    <!--      :page.sync="searchData.pageNum"-->
    <!--      :limit.sync="searchData.pageSize"-->
    <!--      :page-sizes="[5, 25, 50]"-->
    <!--      @pagination="getList"-->
    <!--    />-->
    <!--点击详情后出现的弹框    -->
    <el-dialog title="周期详情" :visible.sync="dialogVisible" width="800px">
      <detail-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :detail-id="detailId" />
    </el-dialog>
  </div>
</template>

<script>
import newDialog from './newDialog'
import { listPayDetail, exportChargeBill, deleteById, updatePayDetail, addPayDetail } from '@/api/financialMag/payDetail'
import DetailDialog from './detailDialog'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { getDictVal } from '@/api/system/logininfor'
import { listBranchOptions, toReview } from '@/api/financialMag/payBills'
import { listChargeProject } from '@/api/financialMag/chargeProject'
import { addPayItems, updatePayItems } from '@/api/financialMag/payItems'
import { listUserProperty } from '@/api/BranchMag/branch'
export default {
  components: { DetailDialog, newDialog },
  data() {
    return {
      statusOptions: [], // 状态数据字典
      editInfo: {}, // 编辑相关数据
      newDialogBatchId: undefined,
      loading: false,
      chargeBill: {
        branchName: undefined, billName: undefined, billStatus: undefined, beginTime: undefined,
        endTime: undefined, batchId: undefined
      },
      query: { userId: undefined, data: {}},
      // 操作按钮
      single: true, multiple: true, checkAll: false, dialogVisible: false, isEdit: false,
      newdialogVisible: false, newdialoEdit: false,
      // 查询表单
      params: {
        pageNum: 1, pageSize: 5, branchName: undefined, billName: undefined, billStatus: undefined,
        beginTime: undefined, endTime: undefined, batchId: undefined
      },
      // searchForm: [// multiple:是否开启多选
      //   { type: 'Select', isDisabled: false, multiple: false, label: '商场分店', prop: 'branchName', value: '车位停车费', options: [], change: this.getList },
      //   { type: 'Select', isDisabled: false, multiple: false, label: '账单名称', prop: 'billName', value: '车位停车费', options: [], change: this.getList },
      //   { type: 'Input', label: '房屋（栋-业态区域-商铺/车位号/车牌号）', prop: 'floorName', width: '100px', placeholder: '' },
      //   { type: 'Input', label: '审核状态', prop: 'approvalStatus', width: '100px', placeholder: '' }
      // ],
      conditions: {
        contents: [
          { label: '商场分店', name: 'branchName', type: 'select', span: 8, options: this.branchOptions },
          { label: '账单名称', name: 'billName', type: 'input', span: 8 },
          { label: '铺号位', name: 'floorName', type: 'input', span: 8 },
          { label: '审核状态', name: 'approvalStatus', type: 'input', span: 8 }
        ]
      },
      // searchHandle: [
      //   { label: '查询', type: 'primary', handle: this.getListData },
      //   { label: '重置', type: 'primary', handle: this.resetForm }
      // ],
      // table表格数据
      total: 0, list: [], detailId: 0, // 表单参数
      chargeName: {},
      columns: [
        { props: { prop: 'approvalStatus', label: '审核状态', width: '80', align: 'center' }},
        // { props: { prop: 'approvalStatus', label: '审核状态', width: '80', align: 'center', formatter: row => this.statusMap[row.billStatus] }},
        { props: { prop: 'branchName', label: '商场分店', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'billName', label: '账单名称', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'storeNo', label: '铺位号', width: '80', 'show-overflow-tooltip': true }},
        // { props: { prop: 'projectName', label: '收费项目', width: '100', 'show-overflow-tooltip': true, formatter: row => this.chargeName[row.projectName] }},
        { props: { prop: 'chargeProjectId', label: '收费项目', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'merchantsName', label: '商户名', width: '70', 'show-overflow-tooltip': true }},
        { props: { prop: 'mobilePhone', label: '手机号', 'show-overflow-tooltip': true }},
        { props: { prop: 'amount', label: '应缴金额', width: '80', 'show-overflow-tooltip': true }},
        { props: { prop: 'amountActuallyPaid', label: '实缴金额', width: '80', 'show-overflow-tooltip': true }},
        { props: { prop: 'paymentStatus', label: '缴费状态', width: '80', 'show-overflow-tooltip': true }},
        { render: 'handle2', props: { prop: 'handle2', label: '周期详情', align: 'left', type: 'button' }},
        // { slot: 'handle2', attrs: { label: '周期详情', width: '80', 'class-name': 'small-padding fixed-width', align: 'center' }},
        { props: { prop: 'note', label: '备注', width: '80', 'show-overflow-tooltip': true }},
        { props: { prop: 'createTime', label: '创建时间', 'show-overflow-tooltip': true }},
        { render: 'opertions', props: { prop: 'opertions', width: '200', label: '操作' }}
        // { slot: 'handle', attrs: { label: '操作', width: '140', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ],
      formProps: {
        span: 24,
        contents: [
          { type: 'cascader', label: '店铺', name: 'propertyName', required: true, options: [], size: 'medium' },
          { type: 'input', label: '姓名', name: 'merchantsName', required: true },
          { type: 'input', label: '手机号', name: 'mobilePhone', required: true, rule: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码' }] },
          { type: 'input', label: '应缴', name: 'amount', required: true },
          { type: 'input', label: '账单周期', name: 'paymentCycle' },
          { type: 'input', label: '备注', name: 'note', required: true, props: { type: 'textarea', row: 3 }}
        ]
      },
      dialogTiele: '添加收费详情',
      form: {},
      operationType: 'add',
      storeOptions: [],
      branchOptions: []
    }
  },
  created() {
    this.newDialogBatchId = this.$route.query.id
    this.getOperationStatusDict()
    this.getBranch()
    this.getStore()
    this.getChangeName()
    // console.log(this.newDialogBatchId)
  },
  mounted() {
    // 第一种方法
    if (window.name === 'isReload' || this.$route.query.id === undefined) {
      this.$router.replace('/payBills')
    } else if (window.name === '') {
      window.name = 'isReload' // 在首次进入页面时我们可以给window.name设置一个固定值
    }
  },
  destroyed() {
    window.name = ''
    // console.log('销毁')
  },
  methods: {
    changePage(val) {
      if (typeof (val) !== 'number') {
        val = 1
      }
      this.params.pageNum = val
      this.getList()
    },
    onChange() {
      console.log('居然触动了搜索里面的onchange')
      console.log(this.params.pageNum)
      this.getList()
      // this.$refs.table.reload()
    },
    getChangeName() {
      listChargeProject(this.$store.getters.id).then((res) => {
        console.log(res.data)
        const chargeName = this.chargeName
        res.data.rows.map(function(val) {
          chargeName[val.id] = val.chargeProjectName
        })
        // console.log(this.chargeName)
      })
    },
    // 选项：商场分店
    getBranch() {
      this.loading = true
      listBranchOptions(this.$store.getters.id).then(response => {
        this.branchOptions = response.data.map(function(val) {
          return { label: val.branchName, value: val.branchName }
        })
        this.conditions.contents[0].options = this.branchOptions
      })
      this.getList()
    },
    // 获取店铺
    async getStore() {
      this.loading = true
      listUserProperty(this.$store.getters.id).then((res) => {
        console.log(res)
        const mall = res.data || []
        const that = this
        mall.map(function(val) {
          const children = val.children || []
          children.map(function(params) {
            that.storeOptions.push(params)
          })
        })
        this.loading = false
        this.formProps.contents[0].options = this.casSelect(that.storeOptions || [])
      })
    },
    casSelect(options) {
      const that = this
      if (options.length === 0) { return [] }
      return options.map(function(params) {
        if (params.level === 5) { return { label: params.name, value: params.name, disabled: params.disable } }
        if (params.children === undefined || params.children.length === 0) { return { label: params.name, value: params.name, disabled: true } }
        return { label: params.name, value: params.name, children: that.casSelect(params.children) }
      })
    },
    // 表格重置
    // resetForm() {
    //   Object.assign(this.$data.searchData, this.$options.data().searchData)
    // },
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_charge_bill', 'payment_status').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 详情按钮
    handleDetail(row) {
      this.dialogVisible = true
      this.detailId = row.id
      // console.log(this.detailId)
    },
    handleReject(row, status) {
      // this.params.pageNum = 1
      console.log(this.params.pageNum)
      toReview(this.$store.getters.id, row.id, status).then(res => {
        if (res.code === 2000) {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    getListData() {
      this.loading = true
      this.getList()
    },
    // 查询详情列表
    async getList() {
      this.loading = true
      this.params.batchId = this.$route.query.id
      // console.log(this.params.batchId)
      await listPayDetail(this.params).then(async(res) => {
        this.list = res.data.rows || []
        for (let i = 0; i < this.list.length; i++) {
          // 判断 审核状态
          if (this.list[i].approvalStatus === 0) {
            this.list[i].isShow = false
            this.list[i].approvalStatus = '待审核'
          } else if (this.list[i].approvalStatus === 1) {
            this.list[i].isShow = true
            this.list[i].approvalStatus = '已审核'
          }
          this.list[i].billName = this.$route.query.billName
          // this.list[i].chargeProjectId = this.$route.query.chargeProjectId
          const query = {
            userId: this.$store.getters.id,
            chargeProjectId: this.$route.query.chargeProjectId
          }
          await listChargeProject(query).then(async(res) => {
            const project = res.data.rows || []
            if (project.length !== 0) {
              this.list[i].chargeProjectId = project[0].chargeProjectName
              console.log(project[0].chargeProjectName)
            }
          })
          this.list[i].amountActuallyPaid = res.data.amountActuallyPaid[i]

          // 判断 缴费状态
          // 显示账单状态
          this.list[i].paymentStatus = this.statusOptions.filter(
            item => item.value - 0 === this.list[i].paymentStatus
          ).map(function(val) {
            return val.label
          })[0]
        }
        console.log(this.list)
        this.total = res.data.total
      })
      this.loading = false
      // setTimeout(() => {
      //   this.loading = false
      // }, 10000)
    },
    // 编辑按钮
    handleEdit(row, index) {
      this.operationType = 'edit'
      this.dialogTiele = '编辑批次下收费账单'
      this.newdialogVisible = true
      // this.newdialoEdit = true
      console.log(row)
      this.form = Object.assign({}, row)
      if (this.form.paymentStatus = '未缴费') {
        this.form.paymentStatus = '0'
      } else {
        this.form.paymentStatus = '1'
      }
      if (this.form.approvalStatus = '未缴费') {
        this.form.approvalStatus = '0'
      } else if (this.form.approvalStatus = '已缴费') {
        this.form.approvalStatus = '1'
      } else {
        this.form.approvalStatus = '2'
      }
      this.form.batchId = this.$route.query.id
      // this.form.propertyName[0] = row.branchName
      //   this.form.floorName = this.form.propertyName[1]
      // this.form.areaName = this.form.propertyName[2]
      // this.form.storeNo = this.form.propertyName[3]
    },
    handleDelete(row) {
      const that = this
      this.$confirm('是否确认删除这一条账单详情?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(function() {
        deleteById(row.id).then(res => {
          if (res.code === 2000) {
            that.$message({ message: '删除成功', type: 'success' })
          }
          that.getList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(function() {})
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.operationType = 'add'
      this.dialogTiele = '新增批次下账单'
      this.form = {}
      this.newdialogVisible = true
      // this.newdialoEdit = false
    },
    onSubmit() {
      if (this.operationType === 'add') {
        this.add()
      } else if (this.operationType === 'edit') {
        this.edit()
      }
      this.newdialogVisible = false
    },
    add() {
      this.form.batchId = this.$route.query.id
      this.form.branchName = this.form.propertyName[0]
      this.form.floorName = this.form.propertyName[1]
      this.form.areaName = this.form.propertyName[2]
      this.form.storeNo = this.form.propertyName[3]
      this.form.createBy = this.$store.getters.name
      addPayDetail(this.form).then(res => {
        this.$message.success('新增成功')
        this.getList()
      })
    },
    edit() {
      updatePayDetail(this.form).then(res => {
        this.$message.success('修改成功')
        this.getList()
      })
    },
    handleAnyCheck() {

    },
    handleImport() {

    },
    handleExport() {
      this.query.userId = this.$store.getters.id
      exportChargeBill(this.query).then(res => {
        // console.log(res)
        const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
        // console.log(sysDate)
        fileDownload(res, sysDate + '账单数据.xlsx')
      })
    }
  }
}
</script>

<style scoped>
.main {
  margin: 20px;
}
.el-row {
  margin-left: 10px !important;
}
.el-table {
  width: 98% !important;
  border-right: none !important;
}
</style>
