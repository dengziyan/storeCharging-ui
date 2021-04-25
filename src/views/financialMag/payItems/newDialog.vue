<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleDialogConfirm()"
      >确认</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { addPayItems, updatePayItems, listChargeCategoryOptions } from '@/api/financialMag/payItems'

export default {
  name: 'NewDialog',
  components: { FormVue },
  props: {
    visible: { type: Boolean, required: true },
    edit: { type: Boolean, required: true },
    editInfo: { type: Object, required: true }
  },
  data() {
    return {
      dialogVisible: this.visible,
      isEdit: this.edit,
      chargeCategoryOptions: [],
      form: {
        createBy: this.$store.state.user.name,
        chargeProjectName: undefined,
        chargeCategoryName: undefined,
        chargeStandard: undefined,
        standardAmount: undefined,
        note: undefined
      },
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '收费项目名称', prop: 'chargeProjectName', size: 'small', isDisabled: false, required: true, placeholder: 'hahah' },
          { type: 'text', label: '标准金额', prop: 'standardAmount', size: 'small', isDisabled: false, required: true },
          { type: 'select', label: '收费类型', prop: 'chargeCategoryName', size: 'small', isDisabled: this.edit, multiple: false, tip: '', value: '', options: [] },
          {
            type: 'select', label: '收费标准', prop: 'chargeStandard', size: 'small', isDisabled: this.edit, multiple: false, tip: '', value: '',
            options: [{ value: '0', label: '无' }, { value: '1', label: '按固定金额' }, { value: '2', label: '按建筑面积' }]
          },
          { type: 'text', label: '备注', prop: 'note', size: 'small', isDisabled: false, required: true }
        ]
      }
    }
  },
  created() {
    this.getChargeCategory()
    if (this.isEdit) {
      this.form = Object.assign({}, this.editInfo)
      console.log(this.form)
    }
  },
  methods: {
    // 获取收费类型
    getChargeCategory() {
      const query = {
        userId: this.$store.getters.id
      }
      listChargeCategoryOptions(query).then(response => {
        const chargeCategoryList = response.data.rows || []
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ label: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        this.formData.formItem[2].options = this.chargeCategoryOptions
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        updatePayItems(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.$emit('getList')
            this.cancel()
          }
        })
      } else { // 插入一条资源数据（即添加）
        addPayItems(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.$emit('getList')
            this.cancel()
          }
        })
      }
    },
    // 按取消键后
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.formMain {
  height: 230px;
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
  /*height: 30px;*/
}
</style>
