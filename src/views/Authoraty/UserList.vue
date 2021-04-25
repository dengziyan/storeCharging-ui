<template>
  <div class="app-container">
    <!-- 搜索框-->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="用户账号" prop="account" class="myItem">
        <el-input
          v-model="queryParams.data.userAccount"
          placeholder="请输入用户账号"
          clearable
          size="small"
          style="width: 180px"
          @change="handleQuery"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('account')"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="realName" class="myItem">
        <el-input
          v-model="queryParams.data.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 180px"
          @change="handleQuery"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('realName')"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobilePhone" class="myItem">
        <el-input
          v-model="queryParams.data.mobilePhone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          style="width: 240px"
          @change="handleQuery"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('mobilePhone')"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabled" class="myItem">
        <el-select
          v-model="queryParams.data.isEnable"
          placeholder="用户状态"
          clearable
          size="small"
          style="width: 110px"
          @clear="clearParams('enabled')"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" class="myItem">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          size="small"
          style="width: 240px"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleQuery"
        />
      </el-form-item>
      <el-form-item class="myItem">
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 各个操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleTopUpdate">修改
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImport">导入
      </el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>
    <!-- 表格-->
    <el-table
      v-loading="loading"
      style="margin-top: 10px;"
      :data="userList"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="账号" align="center" prop="userAccount" :show-overflow-tooltip="true" />
      <el-table-column label="姓名" align="center" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          {{ getSelectVal(scope.row.sex) }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
      <el-table-column label="手机号码" align="center" prop="mobilePhone" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" sortable :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="80">
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
      <el-table-column label="最后登录" align="center" prop="lastLoginTime" sortable :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastLoginTime) }}</span>
        </template>
      </el-table-column>
      <!--  每行的操作按钮-->
      <el-table-column label="操作" align="center" width="170" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="alloc(scope.row)">分配角色</el-button>
          <el-button
            v-if="scope.row.id !== id"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)">重置
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[5,10,15]"
      @pagination="getList"
    />
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
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
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:#ff0000">提示：仅允许导入“xls”或“xlsx”格式文件！
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="handleFileCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户或编辑用户弹出的对话框   -->
    <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="60%">
      <el-form ref="www" :model="user" label-width="150px" :rules="rules" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="userAccount">
              <el-input v-model="user.userAccount" placeholder="请输入用户账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobilePhone">
              <el-input v-model="user.mobilePhone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="user.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号状态:">
              <el-switch
                v-model="user.isEnable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="user.userName" placeholder="请输入用户姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="user.id === undefined" label="默认密码:" prop="password">
              <el-input value="a123456" placeholder="a123456" :disabled="true" type="text" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="user.sex" placeholder="请选择">
                <el-option
                  v-for="dict in selectOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
    <!--    分配角色的对话框-->
    <el-dialog title="分配角色" :visible.sync="openAlloc" width="20%">
      <el-form ref="www" v-loading="loadingRole" :model="user" :rules="roleRules" label-width="100px" size="small">
        <el-form-item label="角色">
          <el-select v-model="user.role" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.native="selectExitSelectConfig(item,user.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="floor||branch||mall" :label="'商场'">
          <el-select v-model="user.mall" placeholder="请选择商场">
            <el-option
              v-for="item in mallOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.native="mallSelectConfig(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="floor||branch" :label="'商场分店'">
          <el-select v-model="user.branch" placeholder="请选择商场分店">
            <el-option
              v-for="item in branchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.native="branchSelectConfig(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="floor" :label="'楼层'">
          <el-select v-model="user.floor" placeholder="请选择楼层">
            <el-option
              v-for="item in floorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="openAlloc = false">取 消</el-button>
        <el-button type="primary" size="small" @click="assignRole()">确 定</el-button>
        <el-button type="success" size="small" @click="restRole()">重置</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  addUser,
  batchAddUser,
  changeUserStatus,
  delUser,
  exportUser,
  importTemplates,
  listUser,
  listUserRole,
  resetUserPwd,
  updateUser,
  updateUserRole
} from '@/api/authoraty/user'
import { getToken } from '@/utils/auth'
import fileDownload from 'js-file-download'
import moment from 'moment'
import { listRoleById } from '@/api/authoraty/role'
import store from '../../store'
import { getDictVal } from '@/api/system/logininfor'
import { listProperty } from '@/api/BranchMag/branch'
// 用于复制给user
const defaultUser = {
  userAccount: '',
  mobilePhone: '',
  email: '',
  userName: undefined,
  sex: '',
  password: '',
  isEnable: 0,
  property: undefined, // 所属管理编号
  role: undefined,
  id: undefined,
  mall: undefined,
  branch: undefined,
  floor: undefined

}

export default {
  name: 'User',

  data() {
    return {
      dialogVisible: false,
      openAlloc: false,
      isEdit: false,
      user: Object.assign({}, defaultUser), // user为对话框中:model
      defaultRoleId: null,
      loading: true, // 遮罩层
      loadingRole: true,
      ids: [], // 多选时选中数组
      updateData: {},
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      checkAll: false,
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      id: store.getters.id,
      userList: [], // 用户表格数据
      open: false, // 是否显示弹出层
      initPassword: undefined, // 默认密码
      dateRange: [], // 日期范围
      statusOptions: [], // 状态数据字典
      selectOptions: [], // 性别状态字典
      roleOptions: [], // 角色选项
      mallOptions: [],
      branchOptions: [],
      floorOptions: [],
      mall: false,
      branch: false,
      floor: false,
      property: [], // 物业信息列表
      form: {}, // 表单参数
      // 用户导入参数
      upload: {
        open: false, // 是否显示弹出层（用户导入）
        title: '', // 弹出层标题（用户导入）
        isUploading: false, // 是否禁用上传
        headers: { Authorization: getToken() }, // 设置上传的请求头部
        url: process.env.VUE_APP_BASE_API + '/sys/user/import' // 上传的地址
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {
          userAccount: undefined,
          userName: undefined,
          mobilePhone: undefined,
          isEnable: undefined
        }
      },
      // 表单校验
      rules: {
        userAccount: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '\'请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobilePhone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      roleRules: {
        role: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        mall: [
          { required: true, message: '此处不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    newEnable() {
      return this.queryParams.data.isEnable
    }
  },
  watch: {
    newEnable() {
      this.handleQuery()
    }
  },
  created() {
    this.getList()
    this.getProperty()
    this.getRoleList() // 获取角色
    this.getOperationStatusDict()
    this.getSexOptionStatusDict()
  },
  methods: {
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_common_field', 'is_enable').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 获取回显字典
    getSexOptionStatusDict() {
      getDictVal('tb_user_info', 'sex').then(res => {
        this.selectOptions = this.selectDictLabels(res.data || [])
      })
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.data.rows || []
          this.total = response.data.total || 0
          this.loading = false
        }
      )
    },
    // 获取到角色
    getRoleList() {
      listRoleById(this.id).then(response => {
        const res = response.data || []
        if (response.code !== 2000) {
          this.roleOptions = []
          return true
        }
        const roleList = res
        for (let i = 0; i < roleList.length; i++) {
          const role = roleList[i]
          this.roleOptions.push({ label: role.roleName, value: role.id, disable: role.isEnable })
        }
      })
    },
    // 置空参数
    clearParams(val) {
      if (val === 'enabled') {
        this.queryParams.data.isEnable = undefined
      }
      if (val === 'phone') {
        this.queryParams.data.mobilePhone = undefined
      }
      if (val === 'account') {
        this.queryParams.data.userAccount = undefined
      }
      this.handleQuery()
    },

    // 用户状态修改
    handleStatusChange(row) {
      changeUserStatus(row.userAccount, row.isEnable).then(() => {
        this.getList()
      }).catch(function() {
        row.isEnable = row.isEnable === 0 ? 1 : 0
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.restPage()
      this.getList()
    },
    restPage() {
      this.queryParams.pageSize = 10
      this.queryParams.pageNum = 1
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.handleQuery()
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
      this.user = Object.assign({}, defaultUser) // 默认值为空
      this.$nextTick(() => {
        this.$refs.www.clearValidate()
      })
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleTopUpdate() {
      this.handleUpdate(this.updateData[0])
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleUpdate(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.user = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.www.clearValidate()
      })
    },
    alloc(row) {
      this.loadingRole = true
      this.setStatus()
      this.user.role = undefined
      listUserRole(row.id).then(res => {
        if (res.code === 2000) {
          this.setRole(res.data)
        }
        this.loadingRole = false
      })
      this.openAlloc = true
      this.user.id = row.id
    },
    setStatus() {
      this.mall = false
      this.branch = false
      this.floor = false
    },
    restRole() {
      this.alloc(this.user)
    },
    assignRole() {
      this.setProperty(this.user.role)
      updateUserRole(this.id, this.user).then(res => {
        if (res.code === 2000) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.openAlloc = false
          this.getList()
        }
      })
    },
    setProperty(role) {
      if (role === 1) { this.user.property = 0 }
      if (role === 2) { this.user.property = this.user.mall }
      if (role === 3) { this.user.property = this.user.branch }
      if (role === 4) { this.user.property = this.user.floor }
      if (role === 5) { this.user.property = -1 }
    },
    setRole(data) {
      if (data.role.id === 2) {
        this.mall = true
        this.user.mall = data.mall
      }
      this.branchOptions = this.propertyOptions(this.mallOptions, data.mall)
      if (data.role.id === 3) {
        this.branch = true
        this.user.mall = data.mall
        this.user.branch = data.branch || undefined
      }
      this.floorOptions = this.propertyOptions(this.branchOptions, data.branch)
      // console.log(this.floorOptions)
      if (data.role.id === 4) {
        this.floor = true
        this.user.mall = data.mall
        this.user.branch = data.branch
        this.user.floor = data.floor || undefined
      }
      this.user.role = data.role.id
    },
    propertyOptions(data, id) {
      const tree = []
      const list = data.filter(function(val) {
        return val.value === id || id === undefined
      }).map(function(val) {
        return val.children
      })

      list.forEach(function(val) {
        val.forEach(function(params) {
          tree.push({ label: params.name, value: params.id, children: params.children || [], disable: params.admin })
        })
      })
      // console.log(tree)
      return tree
    },

    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      this.$refs.www.validate((valid) => {
        if (valid) {
          if (this.isEdit) { // 更新资源数据（即编辑修改）
            updateUser(this.user).then(res => {
              this.$message({
                message: res.message,
                type: res.code === 2000 ? 'success' : 'error'
              })
              this.dialogVisible = false
              this.getList()
            })
          } else { // 插入一条资源数据（即添加）
            addUser(this.user).then(res => {
              this.$message({
                message: res.message,
                type: res.code === 2000 ? 'success' : 'error'
              })
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 重置密码按钮操作
    handleResetPwd(row) {
      this.$confirm('向"' + row.email + '"邮箱发邮件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        resetUserPwd(row.userAccount, row.email).then((res) => {
          this.$message({
            message: res.message,
            type: res.code === 2000 ? 'success' : 'error'
          })
        })
      }).catch(() => {
      })
    },
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateUser(this.form).then((res) => {
              this.$message({
                message: res.message,
                type: res.code === 2000 ? 'success' : 'error'
              })
              this.open = false
              this.getList()
            })
          } else {
            addUser(this.form).then((res) => {
              this.$message({
                message: res.message,
                type: res.code === 2000 ? 'success' : 'error'
              })
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 删除按钮操作
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delUser(userIds)
        })
        .then((res) => {
          this.getList()
          this.$message({
            message: res.message,
            type: res.code === 2000 ? 'success' : 'error'
          })
        })
        .catch(function() {
        })
    },
    // 导出按钮操作
    handleExport() {
      const queryParams = this.queryParams
      if (this.checkAll) {
        queryParams.pageNum = undefined
        queryParams.pageSize = undefined
        queryParams.export = 'all'
      }
      this.$confirm('是否确认导出用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          exportUser(queryParams).then(res => {
            // console.log(res)
            const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
            // console.log(sysDate)
            fileDownload(res, sysDate + '用户信息表.xlsx')
            queryParams.export = undefined
          })
            .catch(err => {
              // console.log(err)
            })
        })
        .catch(function() {
        })
    },
    handleFileCancel() {
      this.$refs.upload.clearFiles()
      this.upload.open = false
      this.upload.isUploading = false
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplates().then(res => {
        fileDownload(res, '批量用户导入模板.xlsx')
      }).catch(err => {
        // console.log(err)
      })
    },
    handleFileUpload(val) {
      const formData = new FormData()
      formData.append('file', val.file)
      // console.log(val)
      batchAddUser(formData).then(res => {
        val.onSuccess()
      }).catch(res => {
        val.onError(res)
      })
    },
    // 文件上传成功处理
    handleFileSuccess() {
      this.$refs.upload.clearFiles()
      this.upload.open = false
      this.upload.isUploading = false
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },

    // 获取物业菜单
    getProperty() {
      this.queryParams.userId = this.$store.getters.id
      listProperty(this.queryParams).then((response) => {
        const tree = response.data || []
        this.property = tree
        this.mallOptions = tree.map(function(val) {
          return { label: val.name, value: val.id, children: val.children, disable: val.admin }
        })
      })
    },

    // 选择
    selectExitSelectConfig(role, id) {
      if (role.disable !== 1) { return }

      this.user = Object.assign({}, defaultUser)// user为对话框中:model
      this.user.role = role.value
      this.user.id = id
      if (role.label === '财务管理员') {
        this.mall = true
        this.branch = false
        this.floor = false
      }
      if (role.label === '商场分店管理员') {
        this.branch = true
        this.floor = false
        this.branchOptions = []
      }
      if (role.label === '楼层管理员') {
        this.floor = true
        this.floorOptions = []
      }
      if (role.label === '普通用户' || role.label === '超级管理员') {
        this.setStatus()
      }
    },
    mallSelectConfig(item) {
      console.log(item)
      this.branchOptions = []
      this.user.branch = undefined
      this.branchOptions = this.propertyOptions([item])
      console.log(this.branchOptions)
    },
    branchSelectConfig(item) {
      this.floorOptions = []
      this.user.floor = undefined
      this.floorOptions = this.propertyOptions([item])
      // console.log(this.floorOptions)
    }
  }
}
</script>

<style scoped>
  .myItem{
    margin-bottom: 0px;
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
</style>
