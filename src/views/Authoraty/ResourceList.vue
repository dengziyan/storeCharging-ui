<template>
  <div class="app-container">
    <!-- 搜索框-->
    <el-form :inline="true" :model="listQuery" size="small" label-width="80px">
      <el-form-item label="资源名称">
        <el-select
          v-model="listQuery.category"
          filterable
          clearable
          size="small"
          style="width: 200px"
          placeholder="请选择资源分类"
          @clear="clearParams('category')"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @click.native="selectExitSelectConfig(item)"
          />
        </el-select>
        <el-select
          v-model="listQuery.data.resourceName"
          filterable
          clearable
          size="small"
          style="width: 180px"
          placeholder="请选择资源"
          @clear="clearParams('resource')"
        >
          <el-option
            v-for="item in resourceOptions"
            :key="item.id"
            :label="item.resourceName"
            :value="item.resourceName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资源路径">
        <el-input
          v-model="listQuery.data.path"
          class="input-width"
          placeholder="资源路径"
          clearable
          @keyup.enter.native="handleSearchList"
          @clear="clearParams('path')"
        />
      </el-form-item>
      <el-form-item label="资源状态" prop="enabled">
        <el-select v-model="listQuery.data.isEnable" placeholder="状态" clearable size="small" style="width: 120px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleSearchList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="handleResetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 各个操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleTopUpdate">修改
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <router-link to="/resourceCategory">
        <el-button size="mini" type="info" icon="el-icon-document" @click="handleShowCategory()">资源分类列表</el-button>
      </router-link>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>

    <!--    表格-->
    <el-table
      class="myTable"
      ref="resourceTable"
      v-loading="listLoading"
      :data="list"
      style="width: 100%;"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="编号" align="center" min-width="30">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="资源名称" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.resourceName }}</template>
      </el-table-column>
      <el-table-column label="资源路径" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>
      <el-table-column label="资源标识" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.tag }}</template>
      </el-table-column>
      <el-table-column label="权限标志" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.permissionTag }}</template>
      </el-table-column>
      <el-table-column label="是否启用" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" sortable>
        <template slot-scope="scope"><span>{{ parseTime(scope.row.createTime) }}</span></template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope" align="center">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      :page-sizes="[10,25,50]"
      @pagination="getList"
    />
    <!-- 添加资源或编辑资源弹出的对话框   -->
    <el-dialog :title="isEdit?'编辑资源':'添加资源'" v-if="dialogVisible" :visible.sync="dialogVisible" width="40%">
      <el-form ref="resourceForm" v-loading="loadingResource" :model="resource" label-width="150px" size="small">
        <el-row>

          <el-col :span="12">
            <el-form-item label="资源名称：">
              <el-input v-model="resource.resourceName" />
            </el-form-item>
            <el-form-item label="资源路径：">
              <el-input v-model="resource.path" />
            </el-form-item>
            <el-form-item label="权限标志：">
              <el-input v-model="resource.permissionTag" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源分类：">
              <el-select v-model="resource.categoryId" placeholder="请选择资源分类" clearable class="input-width">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="资源状态：">
              <el-switch
                v-model="resource.isEnable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
            <el-form-item label="资源标识：">
              <el-input v-model="resource.tag" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  createResource,
  updateResource,
  deleteResource,
  exportResource,
  changeResourceStatus
} from '@/api/authoraty/resource'
import { listAllCate, getResourceCategory } from '@/api/authoraty/resourceCategory'
import { getDictVal } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'

// 用于复制给resource
const defaultResource = {
  categoryId: undefined,
  id: undefined,
  resourceName: undefined,
  path: undefined,
  isEnable: 1,
  permissionTag: undefined
}
export default {
  name: 'ResourceList',
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        category: undefined,
        data: {
          isEnable: undefined,
          resourceName: undefined,
          path: undefined
        }
      },
      list: [],
      updateData: {},
      checkAll: false,
      total: 0,
      multiple: true, // 非多个禁用
      single: true, // 非单个禁用
      listLoading: false,
      dialogVisible: false,
      statusOptions: [], // 状态数据字典
      resource: Object.assign({}, defaultResource), // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
      isEdit: false,
      ids: [],
      categoryOptions: [],
      resourceOptions: [],
      loadingResource: false
    }
  },
  computed: {
    newResource() {
      return this.listQuery.data.resourceName
    },
    newEnable() {
      return this.listQuery.data.isEnable
    },
    newCategory() {
      return this.listQuery.category
    }
  },
  watch: {
    newEnable(val) {
      this.listQuery.data.isEnable = val === '' ? undefined : val
      this.handleSearchList()
    },
    newResource() {
      this.handleSearchList()
    },
    newCategory() {
      this.handleSearchList()
    }
  },
  created() {
    this.getList()
    this.getCateList()
    this.getOperationStatusDict()
  },
  methods: {
    // 模块选择联动
    selectExitSelectConfig(value) {
      this.resourceOptions = value.children
    },
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_common_field', 'is_enable').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    handleSearchList() {
      this.restPage()
      this.getList()
    },
    // 置空参数
    clearParams(val) {
      if (val === 'category') {
        this.listQuery.category = undefined
      }
      if (val === 'resource') {
        this.listQuery.data.resourceName = undefined
      }
      if (val === 'path') {
        this.listQuery.data.path = undefined
      }
      this.getList()
    },
    /** 重置按钮操作 */
    handleResetSearch() {
      Object.assign(this.$data.listQuery, this.$options.data().listQuery)
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.updateData = selection.length === 1 ? selection : {}
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.resource = Object.assign({}, defaultResource)
    },
    restPage() {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
    },
    handleDelete(row) {
      const resourceIds = row.id || this.ids
      this.$confirm('是否要删除所选资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource(resourceIds).then(res => {
          if (res.code === 2000) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.getList()
          }
        })
      })
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleTopUpdate() {
      this.handleUpdate(this.updateData[0])
    },
    handleUpdate(row) {
      this.loadingResource = true
      this.dialogVisible = true
      this.isEdit = true
      this.getCategoryId(row)
    },
    getCategoryId(row) {
      getResourceCategory(row.id).then(res => {
        row.categoryId = res.data[0] || []
        this.resource = Object.assign({}, row)
        this.loadingResource = false
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        updateResource(this.resource.categoryId, this.resource).then(res => {
          if (res.code === 2000) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      } else { // 插入一条资源数据（即添加）
        createResource(this.resource.categoryId, this.resource).then(res => {
          if (res.code === 2000) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      }
    },
    handleShowCategory() {
      this.$router.push({ path: '/resourceCategory' })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.rows || []
        this.total = response.data.total || 0
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      changeResourceStatus(row.id, row.isEnable).then(res => {
        if (res.code === 2000) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getList()
        }
      }).catch(function(res) {
        // console.log(res)
        row.isEnable = row.isEnable === 0 ? 1 : 0
      })
    },
    getCateList() {
      listAllCate().then(response => {
        const cateList = response.data || []
        for (let i = 0; i < cateList.length; i++) {
          this.categoryOptions.push({ label: cateList[i].name, value: cateList[i].id, children: cateList[i].children || [], disable: cateList[i].enable })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.listQuery
      if (this.checkAll) {
        queryParams.pageNum = undefined
        queryParams.pageSize = undefined
        queryParams.export = 'all'
      }
      this.$confirm('是否确认导出资源数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          exportResource(queryParams).then(res => {
            // console.log(res)
            const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
            // console.log(sysDate)
            fileDownload(res, sysDate + '资源数据列表.xlsx')
            queryParams.export = undefined
          })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(function() {
        })
    }
  }
}
</script>
<style scoped>
.el-button--mini {
  margin-left: 10px;
}

.el-card {
  border: 0px;
}

.el-main {
  padding: 0px;
}
.dialog-footer{
  display: flex;
  justify-content: center;
  /*height: 30px;*/
}
.myTable{
  margin-top: 10px;
}
</style>

