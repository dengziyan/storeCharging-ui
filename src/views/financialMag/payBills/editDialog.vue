<!--<template>-->
<!--  &lt;!&ndash;新增按钮的弹框  &ndash;&gt;-->
<!--  <div>-->
<!--    &lt;!&ndash;表格组件      &ndash;&gt;-->
<!--    <FormVue ref="form" :form-data="formData" :form="form" class="formMain" />-->
<!--    <span slot="footer" class="dialog-footer">-->
<!--      <el-button size="small" @click="cancel()">取 消</el-button>-->
<!--      <el-button type="primary" size="small" @click="handleDialogConfirm()">确认</el-button>-->
<!--    </span>-->
<!--  </div>-->
<!--</template>-->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" style="height:auto">
    <cmb-form
      ref="form"
      :form-props="formProps"
      :form="form"
      :operation-type="operationType"
      @on-submit="onSubmit"
      @on-cancel="dialogVisible = false"
    />
  </el-dialog>
</template>
<script>
import FormVue from '@/components/FormVue'
import { listChargeProjectOptions, updatePayBills, listBranchOptions } from '@/api/financialMag/payBills'
import { getToken } from '@/utils/auth'
import dialogMixin from '@/mixin/dialog'
export default {
  name: 'EditDialog',
  mixins: [dialogMixin],
  props: {
    visible: { type: Boolean, required: true },
    editData: { type: Object, required: true },
    title: { type: String, default: '编辑收费批次' }
  },
  data() {
    return {
      // editVisible: this.visible,
      chargeProjectOptions: [], // 收费项目名称
      branchOptions: [], // 商场分店名称
      form: {
        userId: this.$store.getters.id,
        branchId: undefined,
        billName: undefined,
        chargeProjectId: undefined,
        chargeBeginTime: undefined
      },
      operationType: 'edit',
      formProps: {
        span: 12,
        contents: [
          { type: 'select', label: '商场分店', name: 'branchId', multiple: false, options: [] },
          // { type: 'select', label: '收费项目', name: 'chargeProjectId', multiple: false, options: [] },
          { type: 'input', label: '账单名称', name: 'billName', prop: { required: true }},
          { type: 'datePicker', label: '收费开始日期', name: 'chargeBeginTime', prop: { required: true }}
        ]
      }
    }
  },
  created() {
    this.getChargeProject()
    this.getBranch()
    console.log(this.editData)
    this.form = Object.assign({}, this.editData)
  },
  methods: {
    // 选项：商场分店
    getBranch() {
      listBranchOptions(this.$store.getters.id).then(response => {
        this.branchOptions = response.data.map(function(val) {
          return { label: val.branchId, value: val.id }
        })
        this.formProps.contents[0].options = this.branchOptions
      })
    },
    // 选项：收费项目名称
    getChargeProject() {
      listChargeProjectOptions(this.form).then(response => {
        const cateList = response.data.rows
        for (let i = 0; i < cateList.length; i++) {
          const cate = cateList[i]
          this.chargeProjectOptions.push({ label: cate.chargeProjectName, value: cate.id, isDisabled: false })
        }
        console.log(this.chargeProjectOptions)
        this.formProps.contents[1].options = this.chargeProjectOptions
      })
    },
    // 对话框按确定键之后的方法
    async onSubmit() {
      this.form.billStatus = undefined
      console.log(this.form.branchId)
      await updatePayBills(this.form).then(response => {
        if (response.code === 2000) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          // this.treeIsEdit = false
          // this.$parent.getProperty()
        }
      })
      this.dialogVisible = false
      this.$emit('onChange')
    }
    // 按取消键后
    // cancel() {
    //   this.editVisible = false
    //   this.$emit('update:visible', this.editVisible)
    // }
  }
}
</script>

<style scoped>
  .formMain{
    height: 230px;
  }
  .dialog-footer{
    display: flex;
    justify-content: space-between;
    /*height: 30px;*/
  }
</style>
