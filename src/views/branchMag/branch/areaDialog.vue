<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">确认</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updateArea, addArea } from '@/api/BranchMag/branch'
export default {
  name: 'NewDialog3',
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
      form: {
        userId: undefined,
        floorId: this.requireId,
        areaName: undefined,
        createTime: undefined
      },
      isEdit: this.treeIsEdit,
      area: this.editInfo,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '楼层名称', prop: 'floorName', size: 'small', isDisabled: true, required: true },
          { type: 'text', label: '业态名称', prop: 'areaName', size: 'small', isDisabled: false, required: true }
        ],
        rules: {
          areaName: [{ required: true, message: '请输入业态区域名称', trigger: 'blur' }]
        }
      }
    }
  },
  computed: {
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      console.log(this.editInfo)
      const area = this.area.area
      this.form.id = area.id
      this.form.areaName = area.areaName
      this.form.floorName = this.area.floor || area.floor
    },
    propertyRefresh() {
      if (this.refreshProperty) {
        this.refreshProperty()
      }
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateArea(this.$store.getters.id, this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.cancel()
            this.propertyRefresh()
          }
        })
      } else { // 插入一条资源数据（即添加）
        this.form.userId = this.$store.getters.id
        addArea(this.form).then(response => {
          console.log(this.form)
          if (response.code === 2000) {
            this.$message({
              message: '添加成功！',
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
  .formMain{
    height: 100px;
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
    /*height: 30px;*/
  }
</style>
