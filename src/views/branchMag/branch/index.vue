<template>
  <div class="app-container" style="padding: 0">
    <div>
      <!--商场左边的树形控件组件  -->
      <div v-show="!loading" class="expand">
        <div v-loading="isLoadingTree">
          <div class="title">
            <span class="branchTitle">商场信息</span>
            <el-button class="importBtn" @click="handleAddTop">导入</el-button>
          </div>
          <el-scrollbar wrap-class="scrollbar-wrapper" :style="{ height: treeHeight + 'px' }">
            <el-tree
              ref="expandMenuList"
              class="expand-tree"
              :data="treeList"
              :render-content="renderContent"
              :props="defaultProps"
              node-key="id"
              highlight-current
              accordion
              :default-expand-all="true"
              :check-strictly="true"
              auto-expand-parent
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
          <!--点击+新增后出现的弹框    -->
          <el-dialog
            v-if="treeDialogVisible"
            :title="treeIsEdit ? myEdit : myAdd"
            :visible.sync="treeDialogVisible"
            width="650px"
            @close="cancel"
          >
            <!--弹框子组件      -->
            <branch-dialog
              v-if="newdialog === 1"
              :visible.sync="treeDialogVisible"
              :refresh-property="refreshProperty"
              :edit-info="editInfo"
              :tree-is-edit="treeIsEdit"
              :require-id="requireId"
            />
            <floor-dialog
              v-if="newdialog === 2"
              :visible.sync="treeDialogVisible"
              :refresh-property="refreshProperty"
              :edit-info="editInfo"
              :tree-is-edit="treeIsEdit"
              :require-id="requireId"
            />
            <area-dialog
              v-if="newdialog === 3"
              :visible.sync="treeDialogVisible"
              :refresh-property="refreshProperty"
              :edit-info="editInfo"
              :tree-is-edit="treeIsEdit"
              :require-id="requireId"
            />
            <store-dialog
              v-if="newdialog === 4"
              :visible.sync="treeDialogVisible"
              :refresh-property="refreshProperty"
              :edit-info="editInfo"
              :tree-is-edit="treeIsEdit"
              :require-id="requireId"
            />
            <mall-dialog
              v-if="newdialog === 0"
              :visible.sync="treeDialogVisible"
              :refresh-property="refreshProperty"
              :edit-info="editInfo"
              :tree-is-edit="treeIsEdit"
              :require-id="requireId"
            />
          </el-dialog>
          <!-- 商场信息导入对话框 -->
          <el-dialog
            :title="upload.title"
            :visible.sync="upload.open"
            width="400px"
            append-to-body
          >
            <el-upload
              ref="upload"
              :limit="1"
              accept=".xlsx, .xls"
              :headers="upload.headers"
              :action="upload.url"
              :disabled="upload.isUploading"
              :http-request="handleFileUpload"
              :on-success="handleFileSuccess"
              :auto-upload="false"
              drag
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip" style="color: #ff0000">
                提示：仅允许导入“xls”或“xlsx”格式文件！
                <el-link
                  type="info"
                  style="font-size: 12px"
                  @click="importTemplate"
                >下载模板</el-link>
              </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="submitFileForm"
              >确 定</el-button>
              <el-button @click="handleFileCancel">取 消</el-button>
            </div>
          </el-dialog>
          <!-- 商户信息导入对话框 -->
          <el-dialog
            :title="uploadMerchants.title"
            :visible.sync="uploadMerchants.open"
            width="400px"
            append-to-body
          >
            <el-upload
              ref="uploadResident"
              :limit="1"
              accept=".xlsx, .xls"
              :headers="uploadMerchants.headers"
              :action="uploadMerchants.url"
              :disabled="uploadMerchants.isUploading"
              :http-request="handleMerchantsFileUpload"
              :on-success="handleMerchantsFileSuccess"
              :auto-upload="false"
              drag
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip" style="color: #ff0000">
                提示：仅允许导入“xls”或“xlsx”格式文件！
                <el-link
                  type="info"
                  style="font-size: 12px"
                  @click="importMerchantsTemplate"
                >下载模板</el-link>
              </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="submitMerchantsFileForm"
              >确 定</el-button>
              <el-button @click="handleMerchantsFileCancel">取 消</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div v-loading="loading" class="resident">
        商户信息
        <div class="detail">
          <!--引入搜索条件子组件        -->
          <search-form
            class="searchMain"
            size="mini"
            label-width="80px"
            :search-data="searchData"
            :search-form="searchForm"
            :search-handle="searchHandle"
          />
          <el-row :gutter="10">
            <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
            <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImportMerchants">导入</el-button>
            <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出</el-button>
            <el-checkbox v-model="checkAll" class="importPut">导出所有数据</el-checkbox>
          </el-row>
          <!--商户信息表格及操作组件  -->
          <div class="table">
            <!-- 各个操作按钮 -->
            <!--引入表格组件        -->
            <TableVue
              v-loading="loadingTable"
              style="margin-left: 10px;"
              :columns="columns"
              :data="list"
              empty-text="暂无数据"
            >
              <!-- #是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
              <template #handle="{ scope: { row, $index } }">
                <el-button size="mini" :disabled="!row.merchantsName" type="text" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
                <el-button size="mini" :disabled="!row.merchantsName" type="text" icon="el-icon-delete" @click="handleDelete(row, $index)">删除</el-button>
              </template>
            </TableVue>
            <!--分页    -->
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="searchData.pageNum"
              :limit.sync="searchData.pageSize"
              :page-sizes="[5, 15, 25]"
              @pagination="getList"
            />
          </div>
          <el-dialog
            :title="isEdit ? '编辑商户信息' : '添加商户信息'"
            :visible.sync="dialogVisible"
            :edit.sync="isEdit"
            width="700px"
          >
            <new-dialog
              v-if="dialogVisible"
              :visible.sync="dialogVisible"
              :edit.sync="isEdit"
              :edit-info="editInfo"
              @getList="getList"
            />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeRender from '@/components/Tree/index'
import branchDialog from './branchDialog'
import floorDialog from './floorDialog'
import areaDialog from './areaDialog'
import storeDialog from './storeDialog'
import mallDialog from './mallDialog'
import newDialog from './newDialog'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import {
  listProperty, listMerchants, delProperty, listPropertyInfo, delMerchants, importBranchTemplates,
  batchAddBranch, exportMerchants, importMerchantsTemplates, batchAddMerchants
} from '@/api/BranchMag/branch'
import { getToken } from '@/utils/auth'
import fileDownload from 'js-file-download'
import moment from 'moment'

export default {
  components: { branchDialog, floorDialog, areaDialog, storeDialog, mallDialog, TableVue, SearchForm, newDialog },
  data() {
    return {
      treeHeight: 0,
      myEdit: '编辑',
      myAdd: '添加',
      floorId: 0,
      loadingTable: false,
      query: { mallId: undefined, branchId: undefined, floorId: undefined, areaId: undefined, merchantsId: undefined, data: {}},
      editInfo: {},
      treeList: [], maxexpandId: 95, non_maxexpandId: 95, isLoadingTree: false, requireId: 0, fullscreenLoading: false,
      defaultExpandKeys: [], treeDialogVisible: false, treeIsEdit: false, newdialog: 0,
      defaultProps: { children: 'children', label: 'name', id: 'name' },
      queryParams: { userId: undefined },
      // 商场信息导入参数
      upload: {
        open: false, title: '', isUploading: false, headers: { Authorization: getToken() },
        url: process.env.VUE_APP_BASE_API + '/sys/branch/import' // 上传的地址
      },
      uploadMerchants: {
        open: false, title: '', isUploading: false, headers: { Authorization: getToken() },
        url: process.env.VUE_APP_BASE_API + '/sys/merchants/import' // 上传的地址
      },
      open: false, // 是否显示弹出层
      // 查询表单
      searchData: { // 查询参数
        pageNum: 1, pageSize: 5, userId: undefined, floorId: undefined, branchId: undefined,
        mallId: undefined, storeNo: undefined, areaId: undefined, merchantsName: undefined, mobilePhone: undefined,
        data: { mobilePhone: undefined, merchantsName: undefined }
      },
      searchForm: [
        { type: 'Input', label: '店铺', prop: 'storeNo', width: '100px', placeholder: '请输入店铺...' },
        { type: 'Input', label: '姓名', prop: 'merchantsName', width: '100px', placeholder: '请输入姓名...' },
        { type: 'Input', label: '手机号', prop: 'mobilePhone', width: '100px', placeholder: '请输入手机号码...' }
      ],
      params: {},
      conditions: {
        contents: [
          { label: '商铺', name: 'storeNo', type: 'input' },
          { label: '姓名', name: 'merchantsName', type: 'input' },
          { label: '手机号', name: 'mobilePhone', type: 'input' }
        ]
      },
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm }
      ],
      // 操作按钮（ single:非单个禁用，multiple:非多个禁用）
      single: true, multiple: true, checkAll: false, dialogVisible: false, isEdit: false,
      // 表格（total: 总条数）
      total: 0, loading: true, list: [],
      levels: [-1, -1, -1, -1],
      misfirePolicyMap: { '1': '立即执行', '2': '执行一次', '3': '放弃执行' },
      columns: Object.freeze([
        // { attrs: { prop: 'branchName', label: '商场分店', align: 'center', 'show-overflow-tooltip': true }},
        // { attrs: { prop: 'floorName', label: '层数', width: '50', align: 'center', 'show-overflow-tooltip': true }},
        // { attrs: { prop: 'areaName', label: '业态区域', width: '90', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'storeNo', label: '铺位号', width: '90', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'houseArea', label: '店铺面积(m²)', width: '120', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'merchantsName', label: '商户姓名', width: '90', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'mobilePhone', label: '手机号', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'certificateNo', label: '证件号', align: 'center', 'show-overflow-tooltip': true, formatter: row => this.misfirePolicyMap[row.certificateNo] }},
        { attrs: { prop: 'merchantsIdentity', label: '商户身份', width: '120', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'createTime', label: '创建时间', align: 'center', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '120', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  mounted() {
    this.loadingMain()
    this.params.userId = this.$store.getters.id
    this.getList()
    // 设置树的高度
    this.treeHeight = document.body.clientHeight - 250
    window.onresize = () => {
      this.treeHeight = document.body.clientHeight - 250
    }
  },
  methods: {
    onChange() {
      this.$refs.table.reload()
    },
    // 表格重置
    resetForm() {
      // Object.assign(this.$data.searchData, this.$options.data().searchData)
      this.searchData.storeNo = ''
      this.searchData.merchantsName = ''
      this.searchData.mobilePhone = ''
    },
    loadingMain() {
      this.loading = true
      this.isLoadingTree = true
      this.getProperty()
    },
    // 获取商场菜单
    async getProperty() {
      this.queryParams.userId = this.$store.getters.id
      await listProperty(this.queryParams).then((response) => {
        this.treeList = response.data
        this.isLoadingTree = false
        this.loading = false
      })
      console.log('删除完了没')
    },
    refreshProperty() {
      this.isLoadingTree = true
      this.getProperty()
    },
    // 获取方位楼层列表、表格信息
    getList() {
      this.loadingTable = true
      this.searchData.userId = this.$store.getters.id
      this.searchData.data.mobilePhone = this.searchData.mobilePhone
      this.searchData.data.merchantsName = this.searchData.merchantsName

      listMerchants(this.searchData).then((response) => {
        const row = response.data.rows || []
        console.log(row)
        this.list = row.map(function(val) {
          val.identity = val.merchantsIdentity
          if (val.merchantsIdentity !== undefined) {
            val.merchantsIdentity = val.merchantsIdentity + 0 === 1 ? '人流贡献型租户' : '品牌引领型租户'
          }
          console.log(val.identity)
          return val
        })
        this.total = response.data.total
        this.loadingTable = false
        this.loading = false
      })
    },

    // 点击节点
    handleNodeClick(d, node, s) {
      // 置空 商场 业态区域 层数 商场分店
      this.levels = [-1, -1, -1, -1]
      // 遍历节点信息
      this.nodeCheck(node)
      d.treeIsEdit = false// 放弃编辑状态
      // 设置选中
      this.nodeSet()
      this.loadingTable = true
      // 获取商户信息
      this.getList()
    },
    nodeCheck(node) {
      // 终止条件
      if (node.key === undefined) {
        return
      }
      // 判断level
      this.levels[node.level - 1] = node.key
      this.nodeCheck(node.parent)
    },
    nodeSet() {
      const level = this.levels
      // 商场编号
      this.searchData.mallId = level[0] === -1 ? undefined : level[0]
      // 商场分店编号
      this.searchData.branchId = level[1] === -1 ? undefined : level[1]
      // 层数编号
      this.searchData.floorId = level[2] === -1 ? undefined : level[2]
      // 业态区域编号
      this.searchData.areaId = level[3] === -1 ? undefined : level[3]
    },
    renderContent(h, { node, data, store }) { // 加载节点
      const that = this
      Object.assign(this.$data.query, this.$options.data().query)
      return h(TreeRender, {
        props: { DATA: data, NODE: node, STORE: store, maxexpandId: that.non_maxexpandId },
        on: {
          nodeAdd: (s, d, n) => that.nodeAdd(s, d, n),
          nodeEdit: (s, d, n) => that.nodeEdit(s, d, n),
          nodeDel: (s, d, n) => that.nodeDelete(s, d, n)
        }
      })
    },
    // 商场信息导入
    handleAddTop() {
      this.upload.title = '商场信息导入'
      this.upload.open = true
    },
    handleImportMerchants() {
      this.uploadMerchants.title = '商户信息导入'
      this.uploadMerchants.open = true
    },
    // 下载模板操作
    importTemplate() {
      importBranchTemplates().then(res => {
        fileDownload(res, '商场信息导入模板.xlsx')
      }).catch(err => {
        console.log(err)
      })
    },
    importMerchantsTemplate() {
      importMerchantsTemplates().then(res => {
        fileDownload(res, '商户信息导入模板.xlsx')
      }).catch(err => {
        console.log(err)
      })
    },
    // http-request(请求)
    handleFileUpload(val) {
      const formData = new FormData()
      formData.append('file', val.file)
      batchAddBranch(this.$store.getters.id, 2, formData).then(res => {
        val.onSuccess()
      }).catch(res => {
        val.onError(res)
      })
    },
    handleMerchantsFileUpload(val) {
      const formData = new FormData()
      formData.append('file', val.file)
      const merchants = Object.assign({}, this.searchData)
      merchants.pageSize = undefined
      merchants.pageNum = undefined
      merchants.data = undefined
      batchAddMerchants(merchants, formData).then(res => {
        val.onSuccess()
      }).catch(res => {
        val.onError(res)
      })
    },
    // on-success（文件上传成功处理）
    handleFileSuccess() {
      this.$refs.upload.clearFiles()
      this.upload.open = false
      this.upload.isUploading = false
      this.getList()
    },
    handleMerchantsFileSuccess() {
      this.$refs.uploadMerchants.clearFiles()
      this.uploadMerchants.open = false
      this.uploadMerchants.isUploading = false
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    submitMerchantsFileForm() {
      this.$refs.uploadMerchants.submit()
    },
    // 导入弹出框取消
    handleFileCancel() {
      this.$refs.upload.clearFiles()
      this.upload.open = false
      this.upload.isUploading = false
    },
    handleMerchantsFileCancel() {
      this.$refs.uploadMerchants.clearFiles()
      this.uploadMerchants.open = false
      this.uploadMerchants.isUploading = false
    },
    // 增加节点
    nodeAdd(s, d, n) {
      this.editInfo = {}
      if (n.level === 1) {
        this.newdialog = 1
        this.myAdd = '添加分店信息'
        this.editInfo.branch = {}
        this.editInfo.branch.mall = n.label
        this.editInfo.branch.property = {}
        this.editInfo.branch.property.mallId = n.key
      } else if (n.level === 2) {
        this.newdialog = 2
        this.myAdd = '添加楼层信息'
        this.editInfo.floor = {}
        this.editInfo.floor.branch = n.label
        this.editInfo.floor.property = {}
        this.editInfo.floor.property.branchId = n.key
      } else if (n.level === 3) {
        this.editInfo.area = {}
        this.editInfo.area.floor = n.label
        this.editInfo.area.property = {}
        this.editInfo.area.property.floorId = n.key
        this.newdialog = 3
        this.myAdd = '添加业态信息'
      } else {
        this.myAdd = '添加店铺信息'
        this.newdialog = 4
        this.editInfo.store = {}
        this.editInfo.store.area = n.label
        this.editInfo.store.property = {}
        this.editInfo.store.property.area = n.key
      }
      this.requireId = n.key
      console.log(n)
      this.treeDialogVisible = true
      this.treeIsEdit = false
    },
    // 编辑节点
    async nodeEdit(s, d, n) {
      this.query.userId = this.$store.getters.id
      // 编辑商场
      if (n.level === 1) {
        this.newdialog = 0
        this.myEdit = '编辑商场信息'
        this.query.mallId = n.key
      } else if (n.level === 2) { // 编辑商场分店
        this.newdialog = 1
        this.query.mallId = n.parent.key
        this.query.branchId = n.key
        this.myEdit = '编辑分店信息'
      } else if (n.level === 3) { // 编辑层数
        this.newdialog = 2
        this.query.mallId = n.parent.parent.key
        this.query.branchId = n.parent.key
        this.query.floorId = n.key
        this.myEdit = '编辑楼层信息'
      } else { // 编辑业态区域
        this.newdialog = 3
        this.query.mallId = n.parent.parent.parent.key
        this.query.branchId = n.parent.parent.key
        this.query.floorId = n.parent.key
        this.query.areaId = n.key
        this.myEdit = '编辑业态信息'
      }
      this.requireId = n.parent.key
      await listPropertyInfo(this.query).then((response) => {
        console.log(response)
        this.editInfo = response.data || []
        this.editInfo.property = this.query
      })
      this.treeDialogVisible = true
      this.treeIsEdit = true
    },
    // 删除节点
    nodeDelete(s, d, n) {
      this.query.userId = this.$store.getters.id
      if (n.level === 1) { // 删除商场
        this.query.mallId = n.key
      } else if (n.level === 2) { // 删除商场分店
        this.query.mallId = n.parent.key
        this.query.branchId = n.key
      } else if (n.level === 3) { // 删除层数
        this.query.mallId = n.parent.parent.key
        this.query.branchId = n.parent.key
        this.query.floorId = n.key
      } else { // 删除业态区域
        this.query.mallId = n.parent.parent.parent.key
        this.query.branchId = n.parent.parent.key
        this.query.floorId = n.parent.key
        this.query.areaId = n.key
      }
      const query = this.query
      this.$confirm('是否确认删除：' + n.label + '?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        return delProperty(query)
      }).then(async(res) => {
        await this.refreshProperty()
        console.log('hahahhahahahhahahaha')
        this.$message({
          message: '删除成功',
          type: res.code === 2000 ? 'success' : 'error'
        })
      }).catch(function() {
      })
    },
    // 按编辑按钮，弹出对话框
    handleUpdate(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.editInfo = Object.assign({}, row)
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleDelete(row) {
      console.log(row)
      this.query.branchId = row.branchId
      this.query.floorId = row.floorId
      this.query.areaId = row.areaId
      this.query.merchantsId = row.id
      const query = this.query
      this.$confirm('是否确认删除"' + row.merchantsName + '"的商户信息?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        return delMerchants(query)
      }).then((res) => {
        this.getList()
        this.$message({
          message: res.message,
          type: res.code === 2000 ? 'success' : 'error'
        })
      }).catch(function() {
      })
    },

    // 导入按钮操作
    handleImport() {
      this.upload.title = '商场信息导入'
      this.upload.open = true
    },
    // 导出按钮操作
    handleExport() {
      const searchData = this.searchData
      if (this.checkAll) {
        searchData.pageNum = undefined
        searchData.pageSize = undefined
        searchData.export = 'all'
      }
      this.$confirm('是否确认导出商场信息?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        exportMerchants(searchData).then(res => {
          // console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          // console.log(sysDate)
          fileDownload(res, sysDate + '商户信息表.xlsx')
          searchData.export = undefined
        })
          .catch(err => {
            console.log(err)
          })
      }).catch(function() {
      })
    },
    cancel() {
      this.treeDialogVisible = false
      Object.assign(this.$data.editInfo, this.$options.data().editInfo)
      Object.assign(this.$data.query, this.$options.data().query)
    }
  }
}
</script>

<style lang="scss" scoped>
.expand {
  height: 80%;
  overflow: hidden;
  float: left;
  width: 20%;
}

.expand > div {
  padding: 20px;
  padding-right: 0px;
  max-width: 400px;
  overflow-y: auto;
}

.expand > div::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.expand > div::-webkit-scrollbar-thumb {
  background-color: rgba(50, 65, 87, 0.5);
  outline: 1px solid slategrey;
  border-radius: 5px;
}

.expand > div::-webkit-scrollbar {
  width: 10px;
}

.expand-tree {
  border: none;
  margin-top: 10px;
  /*margin-left: 60px;*/
}

.expand-tree .el-tree-node.is-current,
.expand-tree .el-tree-node:hover {
  overflow: hidden;
}

.expand-tree .is-current > .el-tree-node__content .tree-btn,
.expand-tree .el-tree-node__content:hover .tree-btn {
  display: inline-block;
}

.expand-tree .is-current > .el-tree-node__content .tree-label {
  font-weight: 600;
  white-space: normal;
}

.el-button {
  /*padding: 5px 10px;*/
}
.importPut {
  margin-top: 5px;
}
/* 右边的住户信息 */
.resident {
  float: left;
  width: 78%;
  padding-top: 20px;
}

.myTrees {
  width: 288px;
  background: rebeccapurple;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.title {
  display: flex;
}
.importBtn {
  margin-left: 10px;
  padding: 5px 10px;
}
/*  表格*/
.el-row {
  margin-left: 10px !important;
}

.el-table {
  width: 100% !important;
  border-right: none !important;
}

.el-checkbox:last-of-type {
  margin-right: 0;
  float: right;
}

.el-button + .el-button {
  margin-left: 10px;
  float: right;
}

.el-button + .el-button[data-v-b649ad9e] {
  /*margin-left: 10px;*/
  float: right;
}

/*搜索条件*/
.ces-search {
  height: 50px;
  margin-top: 10px;
}

.searchMain {
  height: 51px;
}
.el-button [class*="el-icon-"] + span {
  /*margin-left: 0px;*/
}
</style>
<style>
.expand-tree .is-current > .el-tree-node__content .tree-btn,
.expand-tree .el-tree-node__content:hover .tree-btn {
  display: inline-block;
}
.el-form-item__content {
  line-height: 28px;
}
</style>
