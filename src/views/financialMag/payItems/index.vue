<template>
  <div class="main">
    <!-- 查询条件区域 -->
    <cmb-form ref="query" :form-props="conditions" :form="params" operation-type="query" @on-change="onChange" />
    <!-- 按钮组区域 -->
    <div class="anyBtn">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
    </div>
    <!-- 表格区域 -->
    <cmb-table
      ref="table"
      data="/project/listProject"
      :columns="columns"
      :request="{ method: 'POST', body: params, params: params }"
    >
      <template #opertions="{scope}">
        <el-button size="mini" icon="el-icon-edit" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </cmb-table>
    <!-- 表单区域 -->
    <el-dialog v-if="dialogVisible" :title="dialogTiele" :visible.sync="dialogVisible" width="500px">
      <cmb-form
        ref="form"
        :form-props="formProps"
        :form="form"
        :operation-type="operationType"
        @on-submit="onSubmit"
        @on-cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>
<script>
import { updateFormFieldOptions } from '@/utils/form'
import { listChargeProject, deletePayItems } from '@/api/financialMag/chargeProject'
import { listChargeCategoryOptions } from '@/api/financialMag/payBills'
import { getDictVal } from '@/api/system/logininfor'
import { addPayItems, updatePayItems } from '@/api/financialMag/payItems'
export default {
  name: 'Index',
  data() {
    return {
      total: 0,
      statusOptions: [], // 状态数据字典
      editInfo: {}, // 编辑相关数据
      chargeCategoryOptions: [],
      // 查询表单3
      params: {
        pageNum: 1,
        pageSize: 5,
        userId: undefined,
        // userId: this.$store.getters.id,
        chargeStandard: undefined,
        chargeCategoryName: undefined
      },
      // params: {},
      conditions: {
        contents: [
          { label: '收费类型', name: 'chargeCategoryName', type: 'select', options: [] },
          { label: '收费标准', name: 'chargeStandard', type: 'select', options: [] }
        ]
      },
      // 操作按钮
      single: true, multiple: true, checkAll: false, dialogVisible: false, isEdit: false,
      // table表格数据
      loading: true,
      list: [],
      typeMap: { '0': '无', '1': '固定金额', '2': '按建筑面积' },
      columns: [
        { props: { prop: 'chargeProjectName', label: '收费项目名称', width: '200px' }},
        { props: { prop: 'chargeCategoryName', label: '收费类型' }},
        { props: { prop: 'chargeStandard', label: '收费标准', formatter: row => this.typeMap[row.chargeStandard] }},
        { props: { prop: 'standardAmount', label: '标准金额' }},
        { props: { prop: 'createBy', label: '创建人' }},
        { props: { prop: 'createTime', label: '创建时间', width: '200px' }},
        { props: { prop: 'note', label: '备注', width: '200px' }},
        // { props: { prop: 'configType', label: '系统内置', formatter: (val) => (val.configType === 'Y' ? '是' : '否') }},
        { render: 'opertions', props: { prop: 'opertions', label: '操作' }}
      ],
      /** ********************* 新增编辑表单区域 ********/
      form: {},
      formProps: {
        span: 24,
        contents: [
          { type: 'input', label: '项目名称', name: 'chargeProjectName', required: true, props: { placeholder: '请输入项目名称（xxxx年xx店xx费）' }},
          { type: 'input', label: '标准金额', name: 'standardAmount', required: true, rule: [{ pattern: /\d/, message: '必须为数字值' }] },
          { type: 'select', label: '收费类型', name: 'chargeCategoryName', options: [] },
          { type: 'select', label: '收费标准', name: 'chargeStandard', options: [] },
          { type: 'input', label: '备注', name: 'note', required: true, props: { type: 'textarea', row: 3 }}
        ]
      },
      operationType: {},
      dialogTiele: ''
    }
  },
  created() {
    // this.getList()
    this.loading = true
    this.getChargeCategory()
    this.getChargeStandard()
  },
  methods: {
    /** ********************* 查询条件区域 ********/
    onChange() {
      this.$refs.table.reload()
    },
    // 获取回显字典
    // getOperationStatusDict() {
    //   getDictVal('tb_charge_project', 'charge_standard').then(res => {
    //     this.statusOptions = this.selectDictLabels(res.data || [])
    //   })
    // },
    // 选项：获取收费类型
    getChargeCategory() {
      this.params.userId = this.$store.getters.id
      listChargeCategoryOptions(this.params).then(response => {
        const chargeCategoryList = response.data.rows
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ label: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        updateFormFieldOptions(this.conditions, 'chargeCategoryName', this.chargeCategoryOptions)
        updateFormFieldOptions(this.formProps, 'chargeCategoryName', this.chargeCategoryOptions)
      })
    },
    // 选项：获取收费标准
    getChargeStandard() {
      const options = []
      options.push({ value: 0, label: '无' })
      options.push({ value: 1, label: '按固定金额' })
      options.push({ value: 2, label: '按建筑面积' })
      updateFormFieldOptions(this.conditions, 'chargeStandard', options)
      updateFormFieldOptions(this.formProps, 'chargeStandard', options)
    },
    // 查询收费项目列表
    // getList() {
    //   this.form.userId = this.$store.getters.id
    //   listChargeProject(this.form).then((response) => {
    //     const listData = response.data.rows || []
    //     this.total = response.data.total
    //     for (let i = 0; i < this.list.length; i++) {
    //       // 显示账单状态
    //       this.statusOptions.filter(
    //         item => item.value - 0 === listData[i].chargeStandard
    //       ).map(function(val) {
    //         listData[i].chargeStandard = val.label
    //       })
    //     }
    //     this.list = listData
    //     this.loading = false
    //   })
    // },
    // 编辑
    handleUpdate(row, index) {
      this.operationType = 'edit'
      this.dialogTiele = '编辑收费项目'
      this.dialogVisible = true
      this.isEdit = true
      this.form = Object.assign({}, row)
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.operationType = 'add'
      this.dialogTiele = '新增收费项目'
      this.form = {}
      this.dialogVisible = true
      this.isEdit = false
    },
    handleDelete(row) {
      this.$confirm(`此操作删除id为${row.id}的当前项?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePayItems(row.id).then(res => {
          this.$message.success('删除成功')
          this.$refs.table.reload()
        })
      })
    },
    onSubmit() {
      if (this.operationType === 'add') {
        this.add()
      } else if (this.operationType === 'edit') {
        this.edit()
      }
      this.dialogVisible = false
    },
    add() {
      this.form.createBy = this.$store.getters.name
      addPayItems(this.form).then(res => {
        this.$message.success('新增成功')
        this.$refs.table.reload()
      })
    },
    edit() {
      updatePayItems(this.form).then(res => {
        this.$message.success('修改成功')
        this.$refs.table.reload()
      })
    }
  }
}
</script>

<style scoped>
.main {
  margin: 20px;
}
.search {
  height: 100px;
}
.anyBtn {
  margin-top: 10px;
}
/*搜索条件*/
.ces-search {
  height: 50px;
  margin-top: 10px;
}
.el-form-item__label {
  width: 100px !important;
}
.el-row {
  margin-left: 10px !important;
}
.el-table {
  width: 98% !important;
  border-right: none !important;
}
</style>

