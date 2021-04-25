<template>
  <div class="app-container">
    <!-- 搜索框-->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="菜单名称" prop="menuName" class="myItem">
        <el-select
          v-model="queryParams.menuName"
          filterable
          clearable
          size="small"
          style="width: 160px"
          placeholder="请选择菜单名称"
          @clear="clearParams('menuName')"
        >
          <el-option
            v-for="item in selectMenuList"
            v-show="item.value!==0"
            :key="item.value"
            :label="item.label"
            :value="item.label"
            :disabled="item.value===0"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示" prop="isEnable" class="myItem">
        <el-select
          v-model="queryParams.isEnable"
          placeholder="菜单状态"
          clearable
          size="small"
          style="width: 110px"
          @clear="clearParams('enabled')"
        >
          <el-option
            v-for="dict in selectOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="myItem">
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--   添加按钮-->

    <!-- 各个操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleTopUpdate">修改
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
    </el-row>

    <!--  表格    -->
    <el-table
      ref="menuTable"
      class="myTable"
      v-loading="listLoading"
      style="width: 100%"
      :data="list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="菜单名称" align="center">
        <template slot-scope="scope">{{ scope.row.menuName }}</template>
      </el-table-column>
      <el-table-column label="前端名称" align="center">
        <template slot-scope="scope">{{ scope.row.webName }}</template>
      </el-table-column>
      <el-table-column label="前端图标" align="center">
        <template slot-scope="scope"><i :class="'el-icon-'+scope.row.webIcon" /></template>
      </el-table-column>
      <el-table-column label="是否显示" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnable"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleHiddenChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <el-tag
            :key="scope.row.type"
            :type="scope.row.type===1? '':'success'"
            effect="dark"
          >
            {{ getStatusVal(scope.row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单配置对话框 -->
    <el-dialog :title="isEdit?'编辑菜单':'添加菜单'" v-if="dialogVisible" :visible.sync="dialogVisible" width="60%">
      <el-form ref="www" :model="menu" label-width="150px" :rules="rules" size="small">
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input v-model="menu.menuName" />
        </el-form-item>
        <el-form-item label="上级菜单：" prop="parentId">
          <el-select v-model="menu.parentId" placeholder="请选择菜单">
            <el-option
              v-for="item in selectMenuList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.value===menu.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="前端名称：" prop="webName">
          <el-input v-model="menu.webName" />
        </el-form-item>
        <el-form-item label="前端图标：" prop="webIcon">
          <el-input v-model="menu.webIcon" style="width: 80%" />
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-switch
            v-model="menu.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="隐藏"
          />
        </el-form-item>

        <el-form-item label="排序：">
          <el-input v-model="menu.sort" />
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
import { fetchList, fetchLists, deleteMenu, updateMenu, updateEnable, createMenu, getMenu } from '@/api/authoraty/menu'

import { getDictVal } from '@/api/system/logininfor'
import { exportMenu } from '@/api/authoraty/menu'
import moment from 'moment'
import fileDownload from 'js-file-download'
// 用于复制给user
const defaultMenu = {
  isEnable: 1,
  parentId: 0,
  sort: 0,
  menuName: '',
  webIcon: '',
  webName: ''
}
export default {
  name: 'MenuList',
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      menu: undefined,
      list: [],
      listLoading: true,
      queryParams: {
        isEnable: undefined,
        menuName: undefined,
        parentId: undefined
      },
      updateData: {},
      total: 0,
      multiple: true, // 非多个禁用
      single: true, // 非单个禁用
      ids: [],
      statusOptions: [],
      selectOptions: [],
      parentId: 0,
      selectMenuList: [],
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        webName: [
          { required: true, message: '请输入前端名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        webIcon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    newEnable() {
      return this.queryParams.isEnable
    },
    newMenuName() {
      return this.queryParams.menuName
    }
  },
  watch: {
    newEnable() {
      this.getList()
    },
    newMenuName() {
      this.getList()
    }
  },
  created() {
    this.resetParentId()
    this.getList()
    this.getMenuList()
    this.getStatusDict()
    this.getSelectStatusDict()
    if (this.isEdit) {
      getMenu(this.$route.query.id).then(response => {
        this.menu = response.data
      })
    } else {
      this.menu = Object.assign({}, defaultMenu)
    }
  },
  methods: {

    // 获取回显字典
    getStatusDict() {
      getDictVal('tb_menu_info', 'type').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    getSelectStatusDict() {
      getDictVal('tb_menu_info', 'is_enable').then(res => {
        this.selectOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.updateData = selection.length === 1 ? selection : {}
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    getMenuList() {
      fetchLists().then(res => {
        const menu = res.data.rows || []
        const list = menu.map(function(val) {
          return { label: val.menuName, value: val.id }
        })
        list.push({ label: '根目录', value: 0 })
        this.selectMenuList = list.sort(function(a, b) {
          return a.value - b.value
        })
      })
      console.log('已经再次刷新左边目录了')
    },
    // 置空参数
    clearParams(val) {
      if (val === 'enabled') {
        this.queryParams.isEnable = undefined
      }
      if (val === 'menuName') {
        this.queryParams.menuName = undefined
      }
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.restPage()
      this.getList()
    },
    restPage() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.getList()
    },
    resetParentId() {
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId
      } else {
        this.parentId = 0
      }
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.menu = Object.assign({}, defaultMenu) // 默认值为空
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleTopUpdate() {
      this.handleUpdate(this.updateData[0])
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleUpdate(row) {
      // console.log('row' + row)
      this.dialogVisible = true
      this.isEdit = true
      this.menu = Object.assign({}, row)
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      this.$refs['www'].validate((valid) => {
        if (valid) {
          if (this.isEdit) { // 更新资源数据（即编辑修改）
            updateMenu(this.menu).then(response => {
              this.$message({
                message: response.message,
                type: response.code === 2000 ? 'success' : 'error'
              })
              this.dialogVisible = false
              this.getList()
              location.reload()
            })
          } else { // 插入一条资源数据（即添加）
            createMenu(this.menu).then(response => {
              this.$message({
                message: response.message,
                type: response.code === 2000 ? 'success' : 'error'
              })
              this.dialogVisible = false
              this.getList()
              location.reload()
            })
          }
        }
      })
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      fetchList(this.queryParams).then(response => {
        this.listLoading = false
        this.list = response.data || []
      })
    },
    handleHiddenChange(row) {
      updateEnable(row.id, row.isEnable).then(response => {
        if (response.code === 2000) {
          this.$message({
            message: response.message,
            type: response.code === 2000 ? 'success' : 'error',
            duration: 1000
          })
          this.getList()
          location.reload()
          // this.getMenuList()
        }
      })
    },
    handleShowNextLevel(index, row) {
      this.queryParams.parentId = row.id
      fetchList(this.queryParams).then(response => {
        this.listLoading = false
        this.list = response.data
      })
    },
    handleDelete(row) {
      const menu = row.id || this.ids
      this.$confirm('是否要删除该菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(menu).then(response => {
          this.$message({
            message: response.message,
            type: response.code === 2000 ? 'success' : 'error',
            duration: 1000
          })
          this.getList()
          location.reload()
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = {}
      queryParams.data = this.queryParams
      queryParams.export = 'all'
      this.$confirm('是否确认导出资源数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          exportMenu(queryParams).then(res => {
            // console.log(res)
            const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
            // console.log(sysDate)
            fileDownload(res, sysDate + '菜单列表.xlsx')
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
.el-card {
  border: 0px;
}
.myItem{
  margin-bottom: 10px;
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
