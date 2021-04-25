<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue
      ref="form"
      v-loading="loadingFloor"
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
import {
  listUserLink
} from '@/api/authoraty/user'
import FormVue from '@/components/FormVue'
import { updateFloor, addFloor } from '@/api/BranchMag/branch'
export default {
  name: 'NewDialog2',
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
      loadingFloor: false,
      form: {
        userId: undefined,
        branchId: this.requireId,
        floorName: undefined,
        admin: undefined
      },
      isEdit: this.treeIsEdit,
      floor: this.editInfo,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '商场分店名称', prop: 'branch', size: 'small', isDisabled: true, required: true },
          { type: 'text', label: '层数名称', prop: 'floorName', size: 'small', isDisabled: false, required: true },
          { type: 'select', label: '该层管理员', prop: 'admin', size: 'small', tip: '', value: '', isDisabled: false, multiple: false, options: [] }
        ],
        rules: {
          floorName: [{ required: true, message: '请输入层数名称', trigger: 'blur' }],
          admin: [{ required: true, message: '请输入该层管理员编号', trigger: 'blur' }]
        }
      }
    }
  },
  computed: {
    listCategories() {
      return []
    }
  },
  watch: {
    floorWatch: function(val) {
      this.floor = val
    },
    isEditWatch: function(val) {
      this.isEdit = val
    },
    visibleWatch: function(val) {
      this.treeDialogVisible = val
    },
    propertyWatch: function() {
      this.refreshProperty()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      this.loadingFloor = true
      const floor = this.floor.floor
      await listUserLink(this.$store.getters.id, floor.admin || undefined).then(res => {
        const option = res.data || []
        this.formData.formItem[2].options = option.map(function(val) {
          return { value: val.id, label: val.userAccount }
        })
      })
      if (this.treeIsEdit) {
        this.form.branch = this.floor.branch
      } else {
        this.form.branch = floor.branch
      }
      this.form.id = floor.id || ''
      this.form.admin = floor.admin || ''
      this.form.floorName = floor.floorName
      this.loadingFloor = false
    },
    propertyRefresh() {
      if (this.refreshProperty) {
        this.refreshProperty()
      }
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateFloor(this.$store.getters.id, this.form).then(response => {
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
        addFloor(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.cancel()
            this.propertyRefresh()
          }
        })
      }
    },
    // 按取消键后
    cancel() {
      this.$emit('update:visible', false)
      Object.assign(this.$data.form, this.$options.data().form)
    }
  }
}
</script>

<style scoped>
.formMain {
  height: 140px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  /*height: 30px;*/
}
</style>
