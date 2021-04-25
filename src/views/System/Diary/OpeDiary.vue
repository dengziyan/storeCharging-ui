<template>
  <div class="app-container">
    <!-- 搜索框   -->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="系统模块" prop="model_method">
        <el-select
          v-model="queryParams.data.modelName"
          filterable
          clearable
          size="small"
          style="width: 200px"
          placeholder="请选择模块"
          :loading="loadingSelect"
          @clear="clearParams('title')"
        >
          <el-option
            v-for="item in systemOptions"
            :key="item.id"
            :label="item.name"
            :value="item.name"
            @click.native="selectExitSelectConfig(item.id)"
          />
        </el-select>
        <el-select
          v-model="queryParams.data.methodName"
          filterable
          clearable
          size="small"
          style="width: 180px"
          placeholder="请选择操作类型"
          @clear="clearParams('method')"
        >
          <el-option
            v-for="item in systemChildrenOptions"
            :key="item.id"
            :label="item.resourceName"
            :value="item.resourceName"
          />
        </el-select>

      </el-form-item>

      <el-form-item label="操作人员" prop="operator">
        <el-input
          v-model="queryParams.data.operator"
          placeholder="请输入操作人员"
          clearable
          style="width: 150px;"
          size="small"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('operName')"
        />
      </el-form-item>

      <el-form-item label="操作状态" prop="status">
        <el-select
          v-model="queryParams.data.operationStatus"
          placeholder="操作状态"
          clearable
          size="small"
          style="width: 110px"
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
      <el-form-item label="操作时间">
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
    <!-- 各个操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!multiple" @click="handleClean">清空
      </el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>
    <!--表格-->
    <el-table
      v-loading="loading"
      :data="list"
      :default-sort="{prop: 'operationTime', order: 'descending'}"
    >
      <el-table-column label="日志编号" align="center" prop="id" />
      <el-table-column label="系统模块" align="center" prop="modelName" :show-overflow-tooltip="true" />
      <el-table-column label="操作类型" align="center" prop="methodName" :show-overflow-tooltip="true" />
      <el-table-column label="请求方式" align="center" prop="requestMethod" :show-overflow-tooltip="true" />
      <el-table-column label="操作人员" align="center" prop="operator" :show-overflow-tooltip="true" />
      <el-table-column label="主机" align="center" prop="ip" width="130" :show-overflow-tooltip="true" />
<!--      <el-table-column label="操作地点" align="center" prop="operationLocation" :show-overflow-tooltip="true" />-->
      <el-table-column prop="status" label="操作状态" width="100">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.operationStatus === 1 ? 'success': 'danger'"
            effect="dark"
            disable-transitions
          >{{ getStatusVal(scope.row.operationStatus) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作日期" align="center" prop="operationTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operationTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row,scope.index)">详细
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

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.modelName }}</el-form-item>
            <el-form-item label="操作人员：">{{ form.operator }}</el-form-item>
<!--            <el-form-item label="操作地点：">{{ form.operLocation }}</el-form-item>-->
            <el-form-item label="操作状态：">
              <el-tag
                size="medium"
                :type="form.operationStatus === 1 ? 'success': 'danger'"
                effect="dark"
                disable-transitions
              >{{ getStatusVal(form.operationStatus) }}
              </el-tag>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="操作类型：">{{ form.methodName }}</el-form-item>
            <el-form-item label="主机：">{{ form.ip }}</el-form-item>
            <el-form-item label="请求地址：">{{ form.requestPath }}</el-form-item>
            <el-form-item label="操作时间：">{{ parseTime(form.operationTime) }}</el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="方法名称：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.requestParameter || [] }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="响应参数：">{{ form.responseParameter || [] }}</el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item v-if="form.operationStatus === 0" label="异常信息：">{{ form.operationMsg }}</el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, cleanOperlog, exportOperlog, getResourceSelect } from '@/api/system/operlog'

import fileDownload from 'js-file-download'
import moment from 'moment'
import { getDictVal } from '@/api/system/logininfor'

export default {
  name: 'OpeDiary',
  data() {
    return {
      loading: true, // 遮罩层
      loadingSelect: true,
      ids: [], // 选中数组
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      list: [], // 表格数据
      open: false, // 是否显示弹出层
      checkAll: false,
      typeOptions: [], // 类型数据字典
      statusOptions: [], // 类型数据字典
      systemOptions: [], // 联动字典
      childrenOptions: [],
      systemChildrenOptions: [], // 子级
      dateRange: [], // 日期范围
      form: {}, // 表单参数
      queryParams: { // 查询参数
        data: {
          modelName: undefined,
          operator: undefined,
          methodName: undefined,
          operationStatus: undefined
        },
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    newTitle() {
      return this.queryParams.data.modelName
    },
    newMethod() {
      return this.queryParams.data.methodName
    },
    newStatus() {
      return this.queryParams.data.operationStatus
    }
  },
  watch: {
    newTitle() {
      this.getList()
    },
    newStatus() {
      this.getList()
    }, newMethod() {
      this.getList()
    }
  },

  created() {
    this.getOperationStatusDict()
    this.getSystemModelSelectDict()
    this.getList()
  },
  methods: {

    // 模块选择联动
    selectExitSelectConfig(value) {
      const that = this
      this.childrenOptions.forEach(function(val) {
        if (val.id === value) {
          that.systemChildrenOptions = val.children
        }
      })
    },
    getSystemModelSelectDict() {
      getResourceSelect().then(res => {
        const options = res.data || []
        this.childrenOptions = options
        this.systemOptions = options.map(function(val) {
          return { id: val.id, name: val.name }
        })

        this.loadingSelect = false
      })
    },

    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_operation_log', 'operation_status').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },

    // 查询登录日志
    getList() {
      this.loading = true
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.list = response.data.rows || []
        this.total = response.data.total || 0
        this.loading = false
      }
      )
    },
    // 置空参数
    clearParams(val) {
      if (val === 'operName') {
        this.queryParams.data.operator = undefined
      }
      if (val === 'title') {
        this.queryParams.data.modelName = undefined
      }
      if (val === 'status') {
        this.queryParams.data.operationStatus = undefined
      }
      if (val === 'method') {
        this.queryParams.data.methodName = undefined
      }
      this.getList()
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      // 重置表单
      this.systemChildrenOptions = []
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.handleQuery()
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },

    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有操作日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return cleanOperlog()
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
      this.$confirm('是否确认导出所有操作日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportOperlog(queryParams).then(response => {
          console.log(response)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          console.log(sysDate)
          fileDownload(response, sysDate + '用户操作日志.xlsx')
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

