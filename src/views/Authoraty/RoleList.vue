<template>
  <div class="app-container">
    <!-- 搜索框-->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="roleName" class="myItem">
        <el-input
          v-model="queryParams.data.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="角色状态" prop="isEnable" class="myItem">
        <el-select v-model="queryParams.data.isEnable" placeholder="角色状态" clearable size="small" style="width: 120px">
          <el-option
            v-for="dict in statusOptions"
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
    <!--各个操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleTopUpdate">修改
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>
    <!--表格-->
    <el-table v-loading="loading" :data="roleList" class="myTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="id" width="120" align="center" />
      <el-table-column label="角色名称" prop="roleName" width="150" align="center" />
      <el-table-column label="角色描述" prop="roleDesc" width="300" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="是否启用" width="150" align="center">
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
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleSelectMenu(scope.row)">分配菜单
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleSelectResource(scope.$index,scope.row)"
          >分配资源
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[10,25,50]"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog v-if="dialogVisible" :title="isEdit?'编辑角色':'添加角色'" :visible.sync="dialogVisible" width="60%">
      <el-form ref="www" :model="role" label-width="150px" :rules="rules" size="small">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色状态">
          <el-switch
            v-model="role.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.roleDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配菜单对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px">
      <el-card v-loading="loadingMenu" class="form-container" shadow="never">
        <el-tree
          ref="tree"
          :data="menuTreeList"
          show-checkbox
          :default-checked-keys="menuRoleIds"
          :default-expanded-keys="menuRoleIds"
          :default-expand-all="true"
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
        <div style="margin-top: 20px" align="center">
          <el-button size="small" @click="openDataScope = false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleSave()">保存</el-button>
          <el-button type="success" size="mini" @click="handleClear()">还原</el-button>
        </div>

      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRole,
  changeRoleStatus,
  delRole,
  exportRole,
  listMenuByRole,
  listMenuRole,
  listRole,
  updateRole
} from '@/api/authoraty/role'
import { fetchTreeList } from '@/api/authoraty/menu'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { getDictVal } from '@/api/system/logininfor'
// 用于复制给user
const defaultRole = {
  roleDesc: '',
  isEnable: undefined,
  roleName: ''
}
export default {
  name: 'Role',
  data() {
    return {
      menuTreeList: [],
      roleId: null,
      dialogVisible: false,
      loadingMenu: false,
      isEdit: false,
      role: Object.assign({}, defaultRole), // user为对话框中:model
      defaultRoleId: null,
      isEnable: 0,
      loading: true, // 遮罩层
      ids: [], // 选中数组
      menuRoleIds: [], // 用户所拥有的菜单
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      checkAll: false, // 是否导出所有数据
      updataData: {},
      total: 0, // 总条数
      roleList: [], // 角色表格数据
      title: '', // 弹出层标题
      open: false, // 是否显示弹出层
      openDataScope: false, // 是否显示弹出层（数据权限）
      dateRange: [], // 日期范围
      statusOptions: [], // 状态数据字典
      menuOptions: [], // 菜单列表
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        data: {
          roleName: undefined,
          isEnable: undefined
        }
      },
      form: {}, // 表单参数
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      rules: { // 表单校验
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    newEnable() {
      return this.queryParams.data.isEnable
    },
    newRole() {
      return this.queryParams.data.roleName
    },
    newRoleMenu() {
      return this.openDataScope
    }
  },
  watch: {
    newEnable(val) {
      this.queryParams.data.isEnable = val === '' ? undefined : val
      this.getList()
    },
    newRole(val) {
      this.queryParams.data.roleName = val === '' ? undefined : val
      this.getList()
    },
    newRoleMenu(val) {
      if (val === false) {
        this.$refs.tree.setCheckedKeys([])
        this.menuRoleIds = []
      }
    }
  },
  created() {
    this.getList()
    this.getOperationStatusDict()
    this.getMenuList()
  },
  methods: {

    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_common_field', 'is_enable').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },

    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.data.rows || []
          this.total = response.data.total || 0
          this.loading = false
        }
      )
    },

    handleSelectResource(index, row) {
      this.$router.push({ path: '/allocResource', query: { roleId: row.id }})
    },

    //  保存分配的菜单
    handleSave() {
      // 勾选的key
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 暂选状态的母tab的key
      const halfCheckedNodes = this.$refs.tree.getHalfCheckedKeys()
      // 合并两个数组
      const checkedNodes = checkedKeys.concat(halfCheckedNodes)
      listMenuByRole(Array.from(checkedNodes), this.roleId).then(response => {
        if (response.code === 2000) {
          this.$message({
            message: '分配成功',
            type: 'success',
            duration: 1000
          })
          this.openDataScope = false
          this.menuRoleIds = this.menuNoChildren
        }
      })
    },

    // 清空保存的菜单
    handleClear() {
      this.$refs.tree.setCheckedKeys(this.menuRoleIds)
    },

    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },

    // 角色状态修改
    handleStatusChange(row) {
      changeRoleStatus(row.id, row.isEnable).then(res => {
        this.$message({
          message: res.message,
          type: res.code === 2000 ? 'success' : 'error'
        })
        this.getList()
      }).catch(function() {
        row.isEnable = row.isEnable === 0 ? 1 : 0
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.handleQuery()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.updataData = selection.length === 1 ? selection : {}
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.role = Object.assign({}, defaultRole) // 默认值为空
    },

    // 加载菜单
    getMenuList() {
      fetchTreeList().then(response => {
        this.menuTreeList = response.data || []
      }).then(() => {
        this.menuTreeList = this.setMenuDisable(this.menuTreeList, 'no')
      })
    },
    setMenuDisable(list, node) {
      return list.map(item => {
        // console.log(item)
        if (item.children) {
          if (item.isEnable === 0) {
            this.setMenuDisable(item.children, 'yes')
          } else {
            this.setMenuDisable(item.children, 'no')
          }
        }
        if (item.isEnable === 0 || node === 'yes') {
          item.disabled = true
        }
        return item
      })
    },

    // 获取角色菜单
    handleSelectMenu(row) {
      this.openDataScope = true
      this.loadingMenu = true
      this.roleId = row.id
      listMenuRole(row.id).then(res => {
        return res.data
      }).then((res) => {
        const data = res || []
        // console.log(res)
        const checked = []
        data.forEach((i, n) => {
          const node = this.$refs.tree.getNode(i)
          // console.log(node)
          // console.log(node.isLeaf)
          if (node.isLeaf) {
            // this.$refs.tree.setChecked(node, true)
            checked.push(i)
          }
        })
        // if (row.id === 3) {
        //   checked.splice(2,1)
        // }
        // console.log(checked)
        this.setDisabled(checked)
        this.loadingMenu = false
      }).catch(response => {
        console.log(response)
      })
    },
    setDisabled(val) {
      this.menuRoleIds = val.map(item => {
        console.log()
        if (item.enabled === 0) {
          item.disabled = true
        }
        return item
      })
    },

    // 按修改键弹出对话框（传入当前行的数据）
    handleTopUpdate() {
      this.handleUpdate(this.updataData[0])
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleUpdate(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.role = Object.assign({}, row)
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        updateRole(this.role).then(res => {
          if (res.code === 2000) {
            this.$message({
              message: res.message,
              type: res.code === 2000 ? 'success' : 'error'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      } else { // 插入一条资源数据（即添加）
        addRole(this.role).then(res => {
          if (res.code === 2000) {
            this.$message({
              message: res.message,
              type: res.code === 2000 ? 'success' : 'error'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      }
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.roleId !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            updateRole(this.form).then(res => {
              if (res.code === 2000) {
                this.$message({
                  message: res.message,
                  type: res.code === 2000 ? 'success' : 'error'
                })
              }
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then(res => {
              if (res.code === 2000) {
                this.$message({
                  message: res.message,
                  type: res.code === 2000 ? 'success' : 'error'
                })
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // console.log(row)
      const roleIds = row.id || this.ids
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds)
      }).then((res) => {
        if (res.code === 2000) {
          this.$message({
            message: res.message,
            type: res.code === 2000 ? 'success' : 'error'
          })
          this.getList()
        }
      }).catch(function(err) {
        console.log(err)
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      if (this.checkAll) {
        queryParams.pageNum = undefined
        queryParams.pageSize = undefined
        queryParams.export = 'all'
      }
      this.$confirm('是否确认导出角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportRole(queryParams).then(res => {
          // console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          // console.log(sysDate)
          fileDownload(res, sysDate + '角色数据.xlsx')
        })
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {
      })
    }
  }
}
</script>
<style scoped>
.myItem{
  margin-bottom: 10px;
}
.el-row button {
  float: left;
}

.el-checkbox {
  margin-left: 10px;
  float: left;
  margin-top: 6px;
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
