<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel(false)">取 消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="submitFileForm()"
      >确认</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { addMall } from '@/api/BranchMag/branch'
export default {
  name: 'NewDialog1',
  components: {
    FormVue
  },
  props: ['visible'],
  data() {
    return {
      dialogVisibled: this.visible,
      // dialogVisible: false,
      chargeCategoryOptions: [], // 收费类型选项
      chargeProjectOptions: [], // 收费项目名称
      formData: {
        rules: {
          // userName: [
          //   { required: true, message: '请输入用户名', trigger: 'blur'}
          // ]
        },
        labelWidth: '100px',
        inline: false,
        labelPosition: 'right',
        size: 'small',
        formItem: [
          { type: 'text', label: '商场名称', size: 'small', isDisabled: false, prop: 'mallName', required: true },
          { type: 'text', label: '商场分店编码', size: 'small', isDisabled: false, prop: 'branchId', required: true },
          { type: 'text', label: '商场分店名称', size: 'small', isDisabled: false, prop: 'branchName', required: true },
          { type: 'select', isDisabled: false, multiple: false, label: '商场分店类型', tip: '', value: '', options: [] },
          { type: 'text', label: '总户数', size: 'small', isDisabled: false, prop: 'billName', required: true },
          { type: 'text', label: '联系人', size: 'small', isDisabled: false, prop: 'admin', required: true },
          { type: 'text', label: '联系电话', size: 'small', isDisabled: false, prop: 'mobilePhone', required: true },
          { type: 'text', label: '位置信息', size: 'small', isDisabled: false, prop: 'location', required: true }
        ]
      }
    }
  },
  computed: {
    listCategories() {
      return []
    }
  },
  created() {
  },
  methods: {
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）

      } else { // 插入一条资源数据（即添加）
        addMall(this.user).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      }
    },
    cancel(val) {
      this.dialogVisibled = val
      this.$emit('update:visible', this.dialogVisibled)
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.form.$refs.upload[0].submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleChange() {
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
