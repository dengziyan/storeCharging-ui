<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="500px" style="height:auto">
    <cmb-form
      ref="form"
      :form-props="formProps"
      :form="form"
      :operation-type="operationType"
      @on-submit="onSubmit"
      @on-cancel="dialogVisible = false"
    >
      <template #upload>
        <el-button class="uploadBtn" size="small" @click="importTemplate()">下载模板</el-button>
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url"
          :http-request="handleFileUpload"
          :auto-upload="false"
        >
          <el-button class="uploadBtn" size="small">上传Excel</el-button>
        </el-upload>
      </template>
    </cmb-form>
  </el-dialog>
</template>
<!--  <div>-->
<!--    <FormVue ref="form" :form-data="formData" :form="form" class="formMain"/>-->
<!--    <span slot="footer" class="dialog-footer">-->
<!--      <el-button size="small" @click="cancel()">取 消</el-button>-->
<!--      <el-button type="primary" size="small" @click="submitFileForm()">新建</el-button>-->
<!--    </span>-->
<!--  </div>-->
<!--</template>-->

<script>
import FormVue from '@/components/FormVue'
import {
  listChargeCategoryOptions,
  listChargeProjectOptions,
  importTemplates,
  batchAddBatchBills,
  listBranchOptions
} from '@/api/financialMag/payBills'
import fileDownload from 'js-file-download'
import { getToken } from '@/utils/auth'
import dialogMixin from '@/mixin/dialog'
export default {
  name: 'NewDialog',
  mixins: [dialogMixin],
  props: ['visible'],
  data() {
    return {
      dialogVisibled: this.visible,
      title: '新增收费批次与上传账单',
      chargeCategoryOptions: [], // 收费类型选项
      chargeProjectOptions: [], // 收费项目名称
      branchOptions: [],
      form: {},
      operationType: 'add',
      formProps: {
        span: 24,
        contents: [
          { type: 'select', label: '收费类型', name: 'chargeCategoryName', required: true, options: [] },
          { type: 'select', label: '项目名称', name: 'chargeProjectName', required: true, options: [] },
          { type: 'select', label: '商场分店', name: 'branchId', required: true, options: this.branchOptions },
          { type: 'input', label: '账单名称', name: 'billName', required: true },
          { type: 'datePicker', label: '收费开始时间', name: 'chargeBeginTime', required: true },
          { type: 'radio', label: '账单模式', name: 'modle', required: true, initValue: '', options: [{ label: '按月', value: '1' }, { label: '按年', value: '0' }] },
          { type: 'slot', label: '账单上传', name: 'upload' }
        ]
      },
      upload: {
        open: false, // 是否显示弹出层（用户导入）
        title: '', // 弹出层标题（用户导入）
        isUploading: false, // 是否禁用上传
        updateSupport: 0, // 是否更新已经存在的用户数据
        // headers: { Authorization: getToken() }, // 设置上传的请求头部
        url: process.env.VUE_APP_BASE_API + '/chatgeBill/import/parkingFee' // 上传的地址
      }
    }
  },
  computed: {
    listCategories() {
      return []
    }
  },
  created() {
    this.getChargeCategory()
    this.getChargeProject()
    this.getBranch()
  },
  methods: {
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
        this.formProps.contents[2].options = this.branchOptions
      })
      // this.getList()
    },
    // 获取收费类型
    getChargeCategory() {
      const userId = {
        userId: this.$store.getters.id
      }
      listChargeCategoryOptions(userId).then(response => {
        const chargeCategoryList = response.data.rows
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ lable: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        this.formProps.contents[0].options = this.chargeCategoryOptions
      })
    },
    // 获取收费项目名称
    getChargeProject() {
      listChargeProjectOptions().then(response => {
        const cateList = response.data.rows
        for (let i = 0; i < cateList.length; i++) {
          const cate = cateList[i]
          this.chargeProjectOptions.push({ label: cate.chargeProjectName, value: cate.id, isDisabled: false })
        }
        this.formProps.contents[1].options = this.chargeProjectOptions
      })
    },
    // 下载模板
    importTemplate() {
      console.log(this.form)
      console.log(this.form.chargeCategoryName)
      importTemplates(this.form.chargeCategoryName).then(res => {
        fileDownload(res, '批量导入模板.xlsx')
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 上传
    handleFileUpload(val) {
      console.log(val.file)
      const formData = new FormData()
      const chargeBatch = {
        billName: this.form.billName,
        chargeProjectId: this.form.chargeProjectName,
        chargeBeginTime: this.form.chargeBeginTime,
        branchId: this.form.branchId
      }
      listChargeProjectOptions(chargeBatch).then(response => {
        chargeBatch.chargeProjectId = response.data.rows[0].id
        formData.append('chargeBatch', JSON.stringify(chargeBatch))
        formData.append('file', val.file)
        batchAddBatchBills(this.$store.getters.id, this.form.modle, formData).then(res => {
          val.onSuccess()
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.$emit('getList')
            this.cancel()
          }
        }).catch(res => {
          val.onError()
        })
      })
    },
    cancel() {
      this.$emit('update:visible', false)
    },
    // 对话框按确定键之后提交上传文件
    onSubmit() {
      this.$refs.upload.submit()
      this.dialogVisible = false
      this.$emit('onChange')
      // console.log(this.form)
    }
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
  .uploadBtn{
    margin-right: 10px;
    float: left;
  }
</style>
