<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue
      ref="form"
      v-loading="loadingBranch"
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
import { updateBranch, addBranch } from '@/api/BranchMag/branch'
import { getDictVal } from '@/api/system/logininfor'
import { listUserLink } from '@/api/authoraty/user'
export default {
  name: 'NewDialog1',
  components: { FormVue },
  props: {
    requireId: { type: Number, required: true },
    visible: { type: Boolean, required: true },
    editInfo: { type: Object, required: true },
    treeIsEdit: { type: Boolean, required: true },
    refreshProperty: { type: Function, default: null }
  },
  data() {
    return {
      treeDialogVisible: this.visible,
      loadingBranch: false,
      form: {
        userId: undefined,
        mallId: this.requireId,
        branchName: undefined,
        category: undefined,
        admin: undefined,
        mobilePhone: undefined,
        location: undefined
      },
      isEdit: this.treeIsEdit,
      branch: this.editInfo,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '商场名称', prop: 'mall', size: 'small', isDisabled: true, required: true },
          { type: 'text', label: '分店名称', prop: 'branchName', size: 'small', isDisabled: false },
          { type: 'text', label: '联系电话', prop: 'mobilePhone', size: 'small', isDisabled: false, required: true },
          { type: 'select', label: '楼层类别', prop: 'category', size: 'small', tip: '', value: '', isDisabled: false, multiple: false, options: [] },
          { type: 'text', label: '位置信息', prop: 'location', size: 'small', isDisabled: false, required: true },
          { type: 'select', label: '联系人', prop: 'admin', size: 'small', tip: '', value: '', isDisabled: false, multiple: false, options: [] }

        ],
        rules: {
          branchName: [{ required: true, message: '请输入商场分店名称', trigger: 'blur' }],
          category: [{ required: true, message: '请选择楼层类别', trigger: 'blur' }],
          admin: [{ required: true, message: '请输入联系人编号', trigger: 'blur' }, { pattern: /\d/, message: '必须为数字值' }],
          mobilePhone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }, { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确格式' }]
        }
      }
    }
  },
  computed: {
  },
  watch: {
    floorWatch: function(val) { this.floor = val },
    isEditWatch: function(val) { this.isEdit = val },
    visibleWatch: function(val) { this.treeDialogVisible = val },
    propertyWatch: function() { this.refreshProperty() }
  },
  created() {
    this.getOptionStatusDict()
  },
  methods: {
    async refresh() {
      this.loadingBranch = true
      const branch = this.branch.branch
      console.log(branch)
      await listUserLink(this.$store.getters.id, branch.admin || undefined).then(res => {
        const option = res.data || []
        console.log(option)
        this.formData.formItem[5].options = option.map(function(val) {
          return { value: val.id, label: val.userAccount }
        })
      })
      if (this.treeIsEdit) {
        const property = this.branch
        this.form.mall = property.mall
        this.form.mallId = property.property.mallId
        this.form.mobilePhone = property.phone
        console.log(this.form)
      } else {
        this.form.mall = branch.mall
        this.form.mallId = branch.property.mallId
      }
      this.form.id = branch.id
      this.form.category = '' + (branch.category || 3)
      this.form.branchName = branch.branchName
      this.form.location = branch.location
      this.form.admin = branch.admin || ''
      this.loadingBranch = false
    },
    propertyRefresh() {
      if (this.refreshProperty) {
        this.refreshProperty()
      }
    },
    // 获取回显字典
    getOptionStatusDict() {
      this.loadingBranch = true
      getDictVal('tb_branch_info', 'category').then(res => {
        console.log(res.data)
        this.formData.formItem[3].options = this.selectDictLabels(res.data)
        console.log(this.formData.formItem[3].options)
        this.refresh()
        this.loadingBranch = false
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateBranch(this.$store.getters.id, this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.cancel()
            this.propertyRefresh()
          }
        })
      } else { // 插入一条资源数据（即添加）
        this.form.userId = this.$store.getters.id
        // this.form.mallId = this.requireId
        console.log(this.form)
        addBranch(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.cancel()
            this.propertyRefresh()
          }
        })
      }
    },
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.formMain {
  height: 180px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  /*height: 30px;*/
}
</style>
