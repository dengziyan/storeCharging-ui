<template>
  <div class="app-container">
    <!-- 搜索框-->
    <el-form :inline="true" :model="listQuery" size="small" label-width="100px">
      <el-form-item label="资源分类名称">
        <el-input
          v-model="listQuery.data.categoryName"
          class="input-width"
          placeholder="请输入资源分类名称"
          clearable
          style="width: 240px"
          @change="handleSearchList"
          @keyup.enter.native="handleSearchList"
          @clear="clearParams"
        />
      </el-form-item>
      <el-form-item label="资源分类状态" prop="enabled">
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
      <el-button size="mini" type="info" icon="el-icon-document" @click="returnResources">返回资源列表</el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>

    <!--    表格-->
    <el-table
      class="myTable"
      ref="resourceCategoryTable"
      v-loading="listLoading"
      :data="list"
      style="width: 100%;"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="编号" min-width="30" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="资源分类名称" align="center">
        <template slot-scope="scope">{{ scope.row.categoryName }}</template>
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
      <el-table-column label="创建时间" align="center" sortable>
        <template slot-scope="scope"><span>{{ parseTime(scope.row.createTime) }}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate( scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      :page-sizes="[5,25,50]"
      @pagination="getList"
    />
    <!--    添加分类对话框-->
    <el-dialog title="添加分类" v-if="dialogVisible" :visible.sync="dialogVisible" width="40%">
      <el-form ref="resourceCategoryForm" :model="resourceCategory" label-width="150px" size="small">
        <el-form-item label="资源分类名称：">
          <el-input v-model="resourceCategory.categoryName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="资源分类状态：">
          <el-switch
            v-model="resourceCategory.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
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
  listResourceCategory,
  createResourceCategory,
  updateResourceCategory,
  deleteResourceCategory,
  changecategoryStatus,
  exportResourceCategory } from '@/api/authoraty/resourceCategory'
import { getDictVal } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
const defaultResourceCategory = {
  categoryName: undefined,
  isEnable: 1
}
export default {
  name: 'ResourceCategoryList',
  data() {
    return {
      list: [],
      listLoading: false,
      dialogVisible: false,
      total: 0,
      multiple: true, // 非多个禁用
      single: true, // 非单个禁用
      isEdit: false,
      updateData: [],
      statusOptions: [],
      ids: [],
      checkAll: false,
      listQuery: {
        pageSize: 5,
        pageNum: 1,
        data: {
          categoryName: undefined,
          isEnable: undefined
        }
      },
      resourceCategory: Object.assign({}, defaultResourceCategory)
    }
  },
  computed: {
    newEnable() {
      return this.listQuery.data.isEnable
    }
  },
  watch: {
    newEnable(val) {
      this.listQuery.data.isEnable = val === '' ? undefined : val
      this.handleSearchList()
    }
  },
  mounted() {
  // 第一种方法
    if (window.name === '') {
      window.name = 'isReload' // 在首次进入页面时我们可以给window.name设置一个固定值
    } else if (window.name === 'isReload') {
      this.$router.replace('/resourceList')
    }
  },
  destroyed() {
    window.name = ''
  },
  created() {
    this.getList()
    this.getOperationStatusDict()
  },
  methods: {
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_common_field', 'is_enable').then(res => {
        this.statusOptions = this.selectDictLabels(res.data)
      })
    },
    // 置空参数
    clearParams() {
      this.listQuery.data.categoryName = undefined
      this.handleSearchList()
    },
    handleSearchList() {
      this.restPage()
      this.getList()
    },
    /** 重置按钮操作 */
    handleResetSearch() {
      Object.assign(this.$data.listQuery, this.$options.data().listQuery)
      this.getList()
    },
    restPage() {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
    },
    // 返回资源列表
    returnResources() {
      this.$router.replace('/resourceList')
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.updateData = selection.length === 1 ? selection : {}
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.resourceCategory = Object.assign({}, defaultResourceCategory)
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleTopUpdate() {
      this.handleUpdate(this.updateData[0])
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.resourceCategory = Object.assign({}, row)
    },
    handleDelete(row) {
      const category = row.id || this.ids
      this.$confirm('是否要删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResourceCategory(category).then(res => {
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
    handleDialogConfirm() {
      if (this.isEdit) {
        updateResourceCategory(this.resourceCategory).then(res => {
          if (res.code === 2000) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      } else {
        createResourceCategory(this.resourceCategory).then(res => {
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
    // 资源分类状态修改
    handleStatusChange(row) {
      changecategoryStatus(row.id, row.isEnable).then(res => {
        if (res.code === 2000) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getList()
        }
      }).catch(function() {
        row.enabled = row.enabled === 0 ? 1 : 0
      })
    },
    getList() {
      this.listLoading = true
      listResourceCategory(this.listQuery).then(res => {
        if (res.code === 2000) {
          this.listLoading = false
          this.list = res.data.rows || []
          this.total = res.data.total
        }
      })
    }, /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.listQuery
      if (this.checkAll) {
        queryParams.export = 'all'
      }
      this.$confirm('是否确认导出资源数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          exportResourceCategory(queryParams).then(res => {
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
  .el-card__body>button{
    float: left;
  }
  .el-card{
    border: 0px;
  }
  .myTable{
    margin-top: 10px;
  }
</style>

