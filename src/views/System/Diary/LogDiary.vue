<template>
  <div class="app-container">
    <!--    搜索框-->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="登录ip" prop="ip">
        <el-input
          v-model="queryParams.data.ip"
          placeholder="请输入登录ip"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('ip')"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userAccount">
        <el-input
          v-model="queryParams.data.userAccount"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('account')"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.data.loginStatus"
          placeholder="操作状态"
          clearable
          size="small"
          style="width: 100px"
          @clear="clearParams('status')"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间">
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
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--    各个操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!multiple" @click="handleClean">清空
      </el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>

    <el-table v-loading="loading" :data="list" :default-sort="{prop: 'loginTime', order: 'descending'}" @selection-change="handleSelectionChange">
      <el-table-column label="访问编号" align="center" prop="id" />
      <el-table-column label="用户名称" align="center" prop="userAccount" :show-overflow-tooltip="true" />
      <el-table-column label="登录IP" align="center" prop="ip" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
      <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
      <el-table-column prop="status" label="操作状态" width="100">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.loginStatus === 1 ? 'success': 'danger'"
            effect="dark"
            disable-transitions
          >{{ getStatusVal(scope.row.loginStatus) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作信息" align="center" prop="loginMsg" :show-overflow-tooltip="true" />
      <el-table-column label="登录日期" align="center" prop="loginTime" sortable width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
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
  </div>
</template>

<script>
import { loginLoglist, delLogininfo, cleanLogininfo, exportLogininfo, getDictVal } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'

export default {
  name: 'LogDiary',
  data() {
    return {
      loading: true, // 遮罩层
      ids: [], // 选中数组
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      list: [], // 表格数据
      checkAll: false,
      statusOptions: [], // 类型数据字典
      dateRange: [], // 日期范围
      queryParams: { // 查询参数
        data: {
          userAccount: undefined,
          ip: undefined,
          loginStatus: undefined
        },
        pageNum: 1,
        pageSize: 10
      },
      flag: false,
      resources: []
    }
  },
  computed: {

    newStatus() {
      return this.queryParams.data.loginStatus
    }
  },
  watch: {
    newStatus() {
      this.getList()
    }
  },
  created() {
    this.getList()
    this.getLoginStatusDict()
  },
  methods: {

    // 获取回显字典
    getLoginStatusDict() {
      getDictVal('tb_login_log', 'login_status').then(res => {
        this.statusOptions = this.selectDictLabels(res.data||[])
      })
    },

    // 查询登录日志列表
    getList() {
      this.loading = true
      loginLoglist(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        if (response.code === 2000) {
          this.list = response.data.rows || []
          this.total = response.data.total || 0
          this.loading = false
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []

      // 重置表单
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.handleQuery()
    },

    // 置空参数
    clearParams(val) {
      if (val === 'status') {
        this.queryParams.status = undefined
      }
      if (val === 'account') {
        this.queryParams.account = undefined
      }
      if (val === 'ip') {
        this.queryParams.ipaddr = undefined
      }
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.id || this.ids
      this.$confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delLogininfo(infoIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有登录日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return cleanLogininfo()
      }).then(() => {
        this.getList()
        this.msgSuccess('清空成功')
      }).catch(function() {
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
      this.$confirm('是否确认导出登录日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportLogininfo(queryParams).then(res => {
          console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          console.log(sysDate)
          fileDownload(res, sysDate + '用户登录日志.xlsx')
        })
      }).catch(function() {
      })
    }
  }
}

</script>
<style scoped>
.el-row button {
  float: left;
}

.el-checkbox {
  margin-left: 10px;
  float: left;
  margin-top: 6px;
}

right-toolbar {
  float: left;
}
</style>

