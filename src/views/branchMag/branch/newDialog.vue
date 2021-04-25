<template>
  <!--新增按钮的弹框  -->
  <div>
    <FormVue
      ref="form"
      v-loading="loadingAdd"
      :form-data="formData"
      :form="form"
      class="formMain"
    />
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
import { updateMerchants, addMerchants, listUserProperty } from '@/api/BranchMag/branch'
import { getDictVal } from '@/api/system/logininfor'

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
      userId: this.$store.getters.id,
      property: [],
      dialogVisible: this.visible,
      isEdit: this.edit,
      loadingAdd: false,
      statusOptions: [],
      form: {
        branch: undefined,
        floorId: undefined,
        areaId: undefined,
        storeNo: undefined,
        houseArea: undefined,
        MerchantsName: undefined,
        mobilePhone: undefined,
        certificateNo: undefined,
        MerchantsIdentity: undefined
      },
      branchOptions: [],
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'cascader', label: '店铺', prop: 'propertyName', size: 'small', isDisabled: this.edit, multiple: false, tip: '', value: '', options: [] },
          { type: 'text', label: '商户姓名', prop: 'merchantsName', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '手机号', prop: 'mobilePhone', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '证件号', prop: 'certificateNo', size: 'small', isDisabled: false, required: true },
          { type: 'select', label: '商户身份', prop: 'merchantsIdentity', size: 'small', isDisabled: false, multiple: false, tip: '', value: '', options: [], required: true }
        ]
      }
    }
  },
  created() {
    this.isEditData()
    // this.getOperationStatusDict()
  },
  methods: {
    isEditData() {
      this.getOperationStatusDict()
      this.getBranch()
      if (this.isEdit) {
        const edit = this.editInfo
        this.property.push(edit.branchId)
        this.property.push(edit.floorId)
        this.property.push(edit.areaId)
        this.property.push(edit.storeId)
        this.editInfo.propertyName = this.property
        this.editInfo.merchantsIdentity = this.editInfo.identity + ''
        this.form = Object.assign({}, this.editInfo)
      }
    },
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_merchants_info', 'merchants_identity').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 商场分店选项
    getBranch() {
      this.loadingAdd = true
      listUserProperty(this.userId).then(response => {
        const mall = response.data || []
        const that = this
        mall.map(function(val) {
          const children = val.children || []
          children.map(function(params) {
            that.branchOptions.push(params)
          })
        })
        this.formData.formItem[0].options = this.casSelect(that.branchOptions || [])
        this.formData.formItem[4].options = that.statusOptions
        console.log(this.formData.formItem[4].options)
        this.loadingAdd = false
      })
    },
    casSelect(options) {
      const that = this
      if (options.length === 0) { return [] }
      return options.map(function(params) {
        if (params.level === 5) { return { label: params.name, value: params.id, disabled: params.disable } }
        if (params.children === undefined || params.children.length === 0) { return { label: params.name, value: params.id, disabled: true } }
        return { label: params.name, value: params.id, children: that.casSelect(params.children) }
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      console.log(this.form)
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        const merchants = Object.assign({}, this.form)
        merchants.propertyName = undefined
        updateMerchants(merchants).then(response => {
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
        const merchants = Object.assign({}, this.form)
        merchants.propertyName = undefined
        const property = {
          userId: this.userId,
          branchId: this.form.propertyName[0],
          floorId: this.form.propertyName[1],
          areaId: this.form.propertyName[2],
          storeId: this.form.propertyName[3],
          data: JSON.stringify(merchants)
        }
        addMerchants(property).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.$emit('getList')
            this.cancel()
          }
        })
        this.dialogVisible = false
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
  height: 200px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  /*height: 30px;*/
}
</style>
