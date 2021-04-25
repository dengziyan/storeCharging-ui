<template>
  <!--收费批次管理表格及操作组件  -->
  <div class="main">
    <cmb-form ref="query" :form-props="conditions" :form="params" operation-type="query" @on-change="onChange" />
    <!--引入搜索条件子组件        -->
    <!--    <div class="search">-->
    <!--      <search-form-->
    <!--        :model="searchData"-->
    <!--        size="mini"-->
    <!--        label-width="80px"-->
    <!--        :search-data="searchData"-->
    <!--        :search-form="searchForm"-->
    <!--        :search-handle="searchHandle"-->
    <!--      />-->
    <!--    </div>-->
    <!-- 各个操作按钮 -->
    <div class="anyButton-right">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
    </div>
    <el-tabs v-model="activeName" class="tab" type="card" @tab-click="handleClick">
      <!-- 运行任务-区域 -->
      <el-tab-pane label="未审核" name="未审核">
        <!-- 表格区域 -->
        <cmb-table
          ref="uncheckTable"
          data="chargeBatch/getChargeBatchs"
          :columns="uncheckColumns"
          :request="{ method: 'POST', body: params, params: params }"
        >
          <template #handle2="{ scope: { row } }">
            <el-button type="text" @click="handleCheck(row)">{{ row.billName }}</el-button>
          </template>
          <template #opertions="{scope: { row, $index }}">
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-circle-check" @click="handleCheck(row, $index)">审核</el-button>
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-edit" @click="handleEdit(row, $index)">编辑</el-button>
<!--            <el-tooltip effect="dark" content="审核" placement="top">-->
<!--              <el-button size="mini" icon="el-icon-circle-check" circle @click="handleCheck(scope.row)" />-->
<!--            </el-tooltip>-->
<!--            <el-tooltip effect="dark" content="编辑" placement="top">-->
<!--              <el-button size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />-->
<!--            </el-tooltip>-->
<!--            <el-tooltip effect="dark" content="删除" placement="top">-->
<!--              <el-button size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />-->
<!--            </el-tooltip>-->
          </template>
        </cmb-table>
      </el-tab-pane>
      <!-- 历史任务-区域 -->
      <el-tab-pane label="已审核" name="已审核">
        <!-- 表格区域 -->
        <cmb-table
          ref="checkedTable"
          :total="total"
          data="chargeBatch/getChargeBatchs"
          :columns="checkedColumns"
          :request="{ method: 'POST', body: params, params: params }"
        >
          <template #handle2="{ scope: { row } }">
            <el-button type="text" @click="handleCheck(row)">{{ row.billName }}</el-button>
          </template>
          <template #opertions="{scope: { row, $index }}">
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-circle-check" @click="handleCheck(row, $index)">审核</el-button>
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-edit" @click="handleEdit(row, $index)">编辑</el-button>
<!--            <el-tooltip effect="dark" content="审核" placement="top">-->
<!--              <el-button size="mini" icon="el-icon-circle-check" circle @click="handleCheck(scope.row)" />-->
<!--            </el-tooltip>-->
<!--            <el-tooltip effect="dark" content="编辑" placement="top">-->
<!--              <el-button size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />-->
<!--            </el-tooltip>-->
<!--            <el-tooltip effect="dark" content="删除" placement="top">-->
<!--              <el-button size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />-->
<!--            </el-tooltip>-->
          </template>
        </cmb-table>
      </el-tab-pane>
      <el-tab-pane label="缴费中" name="缴费中">
        <!-- 表格区域 -->
        <cmb-table
          ref="checkingTable"
          :total="total"
          data="chargeBatch/getChargeBatchs"
          :columns="checkingColumns"
          :request="{ method: 'POST', body: params, params: params }"
        >
          <template #handle2="{ scope: { row } }">
            <el-button type="text" @click="handleCheck(row)">{{ row.billName }}</el-button>
          </template>
          <template #opertions="{scope: { row, $index }}">
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-circle-check" @click="handleCheck(row, $index)">审核</el-button>
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
            <el-button :disabled="row.billStatus === 1" size="mini" type="text" icon="el-icon-edit" @click="handleEdit(row, $index)">编辑</el-button>
            <!--            <el-tooltip effect="dark" content="审核" placement="top" class="topBtn">-->
            <!--              <el-button size="mini" icon="el-icon-circle-check" circle @click="handleCheck(scope.row)" />-->
            <!--            </el-tooltip>-->
            <!--            <el-tooltip effect="dark" content="编辑" placement="top" class="topBtn">-->
            <!--              <el-button size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />-->
            <!--            </el-tooltip>-->
            <!--            <el-tooltip effect="dark" content="删除" placement="top" class="topBtn">-->
            <!--              <el-button size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />-->
            <!--            </el-tooltip>-->
          </template>
        </cmb-table>
      </el-tab-pane>
    </el-tabs>
    <!--    <div class="anyButton">-->
    <!--      <el-radio-group v-model="params.billStatus" class="anyButton-left" @change="getList">-->
    <!--        <el-radio-button v-for="dict in statusOptions" :key="dict.value" :value="dict.value" :label="dict.label" />-->
    <!--      </el-radio-group>-->
    <!--      <el-button class="anyButton-right" type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>-->
    <!--    </div>-->
    <!--    <cmb-table-->
    <!--      ref="table"-->
    <!--      v-loading="loading"-->
    <!--      :total="total"-->
    <!--      data="chargeBatch/getChargeBatchs"-->
    <!--      :columns="columns"-->
    <!--      :request="{ method: 'POST', body: params, params: params }"-->
    <!--    >-->
    <!--      <template #handle2="{ scope: { row } }">-->
    <!--        <el-button type="text" @click="handleCheck(row)">{{ row.billName }}</el-button>-->
    <!--      </template>-->
    <!--      <template #opertions="{scope}">-->
    <!--        <el-tooltip effect="dark" content="审核" placement="top">-->
    <!--          <el-button size="mini" icon="el-icon-circle-check" circle @click="handleCheck(scope.row)" />-->
    <!--        </el-tooltip>-->
    <!--        <el-tooltip effect="dark" content="编辑" placement="top">-->
    <!--          <el-button size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />-->
    <!--        </el-tooltip>-->
    <!--        <el-tooltip effect="dark" content="删除" placement="top">-->
    <!--          <el-button size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />-->
    <!--        </el-tooltip>-->
    <!--      </template>-->
    <!--    </cmb-table>-->
    <!--引入表格组件        -->
    <!--    <div class="table">-->
    <!--      <TableVue-->
    <!--        v-loading="loading"-->
    <!--        :columns="columns"-->
    <!--        :data="list"-->
    <!--        empty-text="暂无数据"-->
    <!--      >-->
    <!--        &lt;!&ndash;  文字按钮    &ndash;&gt;-->
    <!--        <template #handle2="{ scope: { row } }">-->
    <!--          <el-button type="text" @click="handleCheck(row)">{{ row.billName }}</el-button>-->
    <!--        </template>-->
    <!--        &lt;!&ndash; 操作按钮 。#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 &ndash;&gt;-->
    <!--        <template #handle="{ scope: { row, $index } }">-->
    <!--          <el-button-->
    <!--            size="mini"-->
    <!--            type="text"-->
    <!--            icon="el-icon-circle-check"-->
    <!--            @click="handleCheck(row, $index)"-->
    <!--          >审核</el-button>-->
    <!--          <el-button-->
    <!--            size="mini"-->
    <!--            type="text"-->
    <!--            icon="el-icon-delete"-->
    <!--            @click="handleDelete(row)"-->
    <!--          >删除</el-button>-->
    <!--          <el-button-->
    <!--            size="mini"-->
    <!--            type="text"-->
    <!--            icon="el-icon-edit"-->
    <!--            @click="handleEdit(row, $index)"-->
    <!--          >编辑</el-button>-->
    <!--        </template>-->
    <!--      </TableVue>-->
    <!--      &lt;!&ndash;  分页  &ndash;&gt;-->
    <!--      <pagination-->
    <!--        v-show="total > 0"-->
    <!--        :total="total"-->
    <!--        :page.sync="params.pageNum"-->
    <!--        :limit.sync="params.pageSize"-->
    <!--        :page-sizes="[5, 25, 50]"-->
    <!--        @pagination="getList"-->
    <!--      />-->
    <!--    </div>-->
    <!--点击新增后出现的弹框    -->
    <new-dialog v-if="newVisible" :visible.sync="newVisible" @onChange="onChange" />
    <!--点击编辑后出现的弹框    -->
    <!--    <el-dialog-->
    <!--      v-if="editVisible"-->
    <!--      title="编辑账单批次"-->
    <!--      :visible.sync="editVisible"-->
    <!--      width="650px"-->
    <!--    >-->
    <!--      <edit-dialog-->
    <!--        v-if="editVisible"-->
    <!--        :visible.sync="editVisible"-->
    <!--        :edit-data="editData"-->
    <!--      />-->
    <!--    </el-dialog>-->
    <edit-dialog v-if="editVisible" :visible.sync="editVisible" :edit-data="editData" @onChange="onChange" />
  </div>
</template>

<script>
import newDialog from './newDialog'
import editDialog from './editDialog'
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listPayBills, delBatch, listBranchOptions, listBranch, updatePayBills } from '@/api/financialMag/payBills'
import { listChargeProject } from '@/api/financialMag/chargeProject'
import { getDictVal } from '@/api/system/logininfor'
import { getUserName, listUser } from '@/api/authoraty/user'
export default {
  name: 'PayBillsTable',
  components: { newDialog, editDialog, TableVue, SearchForm },
  data() {
    return {
      editData: {},
      // 操作按钮
      single: true, multiple: true, checkAll: false, newVisible: false, editVisible: false, // single:非多个禁用 multiple:非单个禁用
      statusOptions: [], // 状态数据字典
      // 查询表单
      params: {},
      // uncheckParams: {
      //   pageNum: 1, pageSize: 5, startTime: undefined, endTime: undefined, chargeBeginTime: undefined, branchId: undefined,
      //   billName: undefined, billStatus: 0, userId: undefined
      // },
      // checkedParams: {
      //   pageNum: 1, pageSize: 5, startTime: undefined, endTime: undefined, chargeBeginTime: undefined, branchId: undefined,
      //   billName: undefined, billStatus: 1, userId: undefined
      // },
      // checkingParams: {
      //   pageNum: 1, pageSize: 5, startTime: undefined, endTime: undefined, chargeBeginTime: undefined, branchId: undefined,
      //   billName: undefined, billStatus: 2, userId: undefined
      // }, // 查询参数
      conditions: {
        contents: [
          { label: '商场分店', name: 'branchId', type: 'select', span: 8, options: this.branchOptions },
          { label: '账单名称', name: 'billName', type: 'input', span: 8 },
          { label: '账单开始日期', name: 'chargeBeginTime', type: 'datePicker', span: 18,
            listeners: { change: this.splitTime },
            props: { span: 10, type: 'datetimerange', 'range-separator': '至', 'start-placeholder': '开始日期', 'end-placeholder': '结束日期' }
          }
        ]
      },
      // searchForm: [
      //   { type: 'datetimerange', label: '账单开始日期', prop: 'chargeBeginTime', width: '1000px', change: this.getList },
      //   { type: 'Select', label: '商场分店', prop: 'branchId', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
      //   { type: 'Input', label: '账单名称', prop: 'billName', width: '100px', placeholder: '请输入账单名称...' }
      // ],
      // searchHandle: [
      //   { label: '查询', type: 'primary', handle: this.getListData },
      //   { label: '重置', type: 'primary', handle: this.resetForm }
      // ],
      // table表格数据
      activeName: '未审核',
      list: [],
      branchOptions: [],
      branchChange: {},
      chargeName: {},
      account: {},
      total: 0, // 总条数
      statusMap: { '0': '未审核', '1': '已审核', '2': '缴费中' },
      // columns: [
      //   { props: { prop: 'billStatus', label: '账单状态', width: '100', 'show-overflow-tooltip': true, formatter: row => this.statusMap[row.billStatus] }},
      //   { props: { prop: 'branchId', label: '商场分店', width: '100', 'show-overflow-tooltip': true, formatter: row => this.branchChange[row.branchId] }},
      //   { render: 'handle2', props: { prop: 'handle2', label: '账单名称', align: 'left', type: 'button' }},
      //   // { slot: 'handle2', attrs: { type: 'button', prop: 'billName', width: '100', 'show-overflow-tooltip': true }},
      //   { props: { prop: 'chargeProjectId', label: '收费项目', width: '100', 'show-overflow-tooltip': true, formatter: row => this.chargeName[row.chargeProjectId] }},
      //   { props: { prop: 'chargeBeginTime', label: '收费开始日期', 'show-overflow-tooltip': true }},
      //   { props: { prop: 'amountPayable', label: '应缴金额', width: '100', 'show-overflow-tooltip': true }},
      //   { props: { prop: 'amountActuallyPaid', label: '实缴金额', width: '100', 'show-overflow-tooltip': true }},
      //   { props: { prop: 'reviewer', label: '审核人', width: '100', 'show-overflow-tooltip': true }},
      //   { props: { prop: 'reviewTime', label: '审核时间' }},
      //   { render: 'opertions', props: { prop: 'opertions', width: '150', label: '操作' }}
      //   // { slot: 'handle', attrs: { label: '操作', 'class-name': 'small-padding fixed-width', align: 'center' }}
      // ],
      uncheckColumns: [
        { props: { prop: 'billStatus', label: '账单状态', width: '100', 'show-overflow-tooltip': true, formatter: row => this.statusMap[row.billStatus] }},
        { props: { prop: 'branchId', label: '商场分店', width: '100', 'show-overflow-tooltip': true, formatter: row => this.branchChange[row.branchId] }},
        { render: 'handle2', props: { prop: 'handle2', label: '账单名称', align: 'left', type: 'button' }},
        // { slot: 'handle2', attrs: { type: 'button', prop: 'billName', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'chargeProjectId', label: '收费项目', width: '200', 'show-overflow-tooltip': true, formatter: row => this.chargeName[row.chargeProjectId] }},
        { props: { prop: 'chargeBeginTime', label: '收费开始日期', 'show-overflow-tooltip': true }},
        { props: { prop: 'amountPayable', label: '应缴金额', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'amountActuallyPaid', label: '实缴金额', width: '100', 'show-overflow-tooltip': true }},
        // { props: { prop: 'reviewer', label: '审核人', width: '100', 'show-overflow-tooltip': true, formatter: row => this.account[row.reviewer] }},
        // { props: { prop: 'reviewTime', label: '审核时间' }},
        { render: 'opertions', props: { prop: 'opertions', width: '200', label: '操作' }}
        // { slot: 'handle', attrs: { label: '操作', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ],
      checkedColumns: [
        { props: { prop: 'billStatus', label: '账单状态', width: '100', 'show-overflow-tooltip': true, formatter: row => this.statusMap[row.billStatus] }},
        { props: { prop: 'branchId', label: '商场分店', width: '100', 'show-overflow-tooltip': true, formatter: row => this.branchChange[row.branchId] }},
        { render: 'handle2', props: { prop: 'handle2', label: '账单名称', align: 'left', type: 'button' }},
        // { slot: 'handle2', attrs: { type: 'button', prop: 'billName', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'chargeProjectId', label: '收费项目', width: '100', 'show-overflow-tooltip': true, formatter: row => this.chargeName[row.chargeProjectId] }},
        { props: { prop: 'chargeBeginTime', label: '收费开始日期', 'show-overflow-tooltip': true }},
        { props: { prop: 'amountPayable', label: '应缴金额', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'amountActuallyPaid', label: '实缴金额', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'reviewer', label: '审核人', width: '100', 'show-overflow-tooltip': true, formatter: row => this.account[row.reviewer] }},
        { props: { prop: 'reviewTime', label: '审核时间' }},
        { render: 'opertions', props: { prop: 'opertions', width: '200', label: '操作' }}
        // { slot: 'handle', attrs: { label: '操作', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ],
      checkingColumns: [
        { props: { prop: 'billStatus', label: '账单状态', width: '100', 'show-overflow-tooltip': true, formatter: row => this.statusMap[row.billStatus] }},
        { props: { prop: 'branchId', label: '商场分店', width: '100', 'show-overflow-tooltip': true, formatter: row => this.branchChange[row.branchId] }},
        { render: 'handle2', props: { prop: 'handle2', label: '账单名称', align: 'left', type: 'button' }},
        // { slot: 'handle2', attrs: { type: 'button', prop: 'billName', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'chargeProjectId', label: '收费项目', width: '100', 'show-overflow-tooltip': true, formatter: row => this.chargeName[row.chargeProjectId] }},
        { props: { prop: 'chargeBeginTime', label: '收费开始日期', 'show-overflow-tooltip': true }},
        { props: { prop: 'amountPayable', label: '应缴金额', width: '100', 'show-overflow-tooltip': true }},
        { props: { prop: 'amountActuallyPaid', label: '实缴金额', width: '100', 'show-overflow-tooltip': true }},
        { render: 'opertions', props: { prop: 'opertions', width: '200', label: '操作' }}
        // { slot: 'handle', attrs: { label: '操作', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ]
    }
  },
  created() {
    this.getAccount()
    this.getBranch()
    this.getOperationStatusDict()
    this.getChargeName()

    // this.listBranch()
  },
  methods: {
    handleClick(tab) {
      this.params.billStatus = tab.index
      this.$refs.uncheckTable.reload()
      this.$refs.checkedTable.reload()
      this.$refs.checkingTable.reload()
    },
    splitTime() {
      this.params = this.addDateRange(this.params, this.params.chargeBeginTime)
    },
    getAccount() {
      const account = {}
      listUser({ userId: this.$store.getters.id }).then(res => {
        console.log(res.data.rows)
        res.data.rows.map(function(val) {
          account[val.id] = val.userAccount
          account[1] = 'g1950'
          account[2] = 'finance_01'
        })
      })
      this.account = account
      console.log(this.account)

      // await listPayBills(this.addDateRange(this.params, this.params.chargeBeginTime)).then(async res => {
      //   console.log(res.data.rows)
      //   const listData = res.data.rows || []
      //   const account = {}
      //   for (let i = 0; i < listData.length; i++) {
      //     // 根据 审核者ID查询 审核者账号
      //     getUserName(this.$store.getters.id, listData[i].reviewer).then(res => {
      //       console.log(listData[i].reviewer)
      //       account[listData[i].reviewer] = res.data[0].userAccount
      //       account[undefined] = ''
      //       // listData[i].reviewer = res.data[0].userAccount
      //     })
      //     console.log(account)
      //     this.account = account
      //   }
      // })
    },
    onChange() {
      // 根据审核状态查询
      // if (this.params.billStatus === '未审核') {
      //   this.params.billStatus = 0
      // } else if (this.params.billStatus === '已审核') {
      //   this.params.billStatus = 1
      // } else if (this.params.billStatus === '缴费中') {
      //   this.params.billStatus = 2
      // }
      this.$refs.uncheckTable.reload()
      this.$refs.checkedTable.reload()
      this.$refs.checkingTable.reload()
      console.log('新增、编辑')
      // this.getList()
    },
    // listBranch() {
    //   listBranch(listData[i].branchId).then(response => {
    //     listData[i].branchId = response.data.branchName
    //   })
    // },
    // 根据id获取账单名称
    getChargeName() {
      const chargeName = {}
      listChargeProject(this.$store.getters.id).then((res) => {
        res.data.rows.map(function(val) {
          chargeName[val.id] = val.chargeProjectName
        })
      })
      this.chargeName = chargeName
    },
    // 选项：商场分店
    async getBranch() {
      this.loading = true
      listBranchOptions(this.$store.getters.id).then(response => {
        // console.log(response.data)
        const branchChange = {}
        this.branchOptions = response.data.map(function(val) {
          branchChange[val.id] = val.branchName
          return { label: val.branchName, value: val.id }
        })
        this.branchChange = branchChange
        // console.log(this.branchOptions)
        // console.log(this.branchChange)
        this.conditions.contents[0].options = this.branchOptions
      })
      // this.getList()
    },
    // 表格重置
    resetForm() {
      Object.assign(this.$data.params, this.$options.data().params)
    },
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_charge_batch', 'bill_status').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 审核按钮、详情按钮
    handleCheck(row) {
      this.$router.push({
        path: 'payDetail',
        query: {
          id: row.id,
          billName: row.billName,
          chargeProjectId: row.chargeProjectId
        }
      })
    },
    // 按新增按钮，弹出对话框
    handleAdd() {
      this.newVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.editVisible = true
      this.editData = Object.assign({}, row)
    },
    // 删除
    handleDelete(row) {
      const batchIds = row.id || this.ids
      this.$confirm('是否确认删除账单批次名称为 "' + row.billName + '" 的数据项?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        return delBatch(batchIds)
      }).then(() => {
        // this.getList()
        this.$refs.uncheckTable.reload()
        this.$refs.checkedTable.reload()
        this.$refs.checkingTable.reload()
        this.$message.success('删除成功')
      }).catch(function() {
      })
    },
    // 查询批次列表
    async getList() {
      // 根据审核状态查询
      // if (this.params.billStatus === '未审核') {
      //   this.params.billStatus = 0
      // } else if (this.params.billStatus === '已审核') {
      //   this.params.billStatus = 1
      // } else if (this.params.billStatus === '缴费中') {
      //   this.params.billStatus = 2
      // }
      // 调用查询方法
      const params = Object.assign({}, this.params)
      params.chargeBeginTime = undefined
      await listPayBills(this.addDateRange(params, this.params.chargeBeginTime)).then(
        async(response) => {
          const listData = response.data.rows || []
          this.total = response.data.total
          for (let i = 0; i < listData.length; i++) {
            const query = {
              userId: this.$store.getters.id,
              chargeProjectId: listData[i].chargeProjectId
            }
            // 根据收费项目ID 获取收费项目名称
            await listChargeProject(query).then(response => {
              const project = response.data.rows || []
              if (project.length !== 0) {
                listData[i].chargeProjectId = [0].chargeProjectName
              }
            })
            // 根据商场分店id查询商场分店名称
            // await listBranch(listData[i].branchId).then(response => {
            //   listData[i].branchId = response.data.branchName
            // })
            // 根据 审核者ID查询 审核者账号
            // console.log(listData[i].reviewer)
            await getUserName(this.$store.getters.id, listData[i].reviewer).then(
              response => {
              // console.log(response.data)
                listData[i].reviewer = response.data[0].userAccount
              }
            )
          //   // 显示账单状态
          //   this.statusOptions.filter(
          //     item => item.value - 0 === listData[i].billStatus
          //   ).map(function(val) {
          //     listData[i].billStatus = val.label
          //   })
          }
          this.list = listData
          this.loading = false
          console.log('222222222222222')
        }
      )
    },
    knowledgeChange(editData) {
      // this.form = editData
      // this.form.billStatus = undefined
      // updatePayBills(this.form).then(response => {
      //   if (response.code === 2000) {
      //     this.$message({
      //       message: '修改成功！',
      //       type: 'success'
      //     })
      //     this.editVisible = false
      //     this.treeIsEdit = false
      //     this.$parent.getProperty()
      //   }
      // })
      // this.editData = editData
      // this.isKnowledgeVisible = false
    }
  }
}
</script>

<style scoped>
.main {
  margin: 20px;
}
/*.topBtn{*/
/*  float: left;*/
/*}*/
.search {
  height: 100px;
}
.anyButton {
  /*display: flex;*/
  /*justify-content:space-around;*/
  /*margin-left: -30px;*/
}
.anyButton-left {
  float: left;
}
.anyButton-right {
  width: 100%;
  height: 40px;
}
/*.el-row{*/
/*  margin-left: 10px !important;*/
/*}*/
.el-table {
  width: 100% !important;
  border-right: none !important;
}
/*搜索条件*/
.ces-search {
  height: 50px;
  margin-top: 10px;
}
.el-form-item__label {
  width: 100px !important;
}
.el-form-item__label {
  width: auto !important;
}
.el-table .cell{
  display: flex;
}
</style>

<style>
.el-form-item__label {
  width: auto !important;
}
</style>
