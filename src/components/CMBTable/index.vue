<template>
  <div class="cmb-table">
    <el-table
      ref="table"
      v-loading="syncLoading"
      :data="tableData"
      v-bind="$attrs"
      style="width: 100%"
      v-on="$listeners"
    >
      <template v-for="(column, index) in columns">
        <el-table-column :key="index" v-bind="column.props" v-on="column.listeners">
          <template v-if="column.render" #default="scope">
            <slot :name="column.render" :scope="scope" />
          </template>
        </el-table-column>
<!--        <el-table-column type="expand">-->
<!--          <template slot-scope="props">-->
<!--            <el-form label-position="left" inline class="demo-table-expand">-->
<!--              <el-form-item :label='column.label'>-->
<!--                <span>{{ props.row.name }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="所属店铺">-->
<!--                <span>{{ props.row.shop }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="商品 ID">-->
<!--                <span>{{ props.row.id }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="店铺 ID">-->
<!--                <span>{{ props.row.shopId }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="商品分类">-->
<!--                <span>{{ props.row.category }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="店铺地址">-->
<!--                <span>{{ props.row.address }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="商品描述">-->
<!--                <span>{{ props.row.desc }}</span>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="商品 ID"-->
<!--          prop="id">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="商品名称"-->
<!--          prop="name">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="描述"-->
<!--          prop="desc">-->
<!--        </el-table-column>-->
      </template>
    </el-table>
    <el-pagination
      v-if="page"
      class="cmb-page"
      :page-size.sync="syncPageSize"
      :page-sizes="pageSizes"
      :current-page.sync="syncPageNum"
      :total="syncTotal"
      v-bind="page.props"
      @size-change="onPageChange($event, 'size-change')"
      @current-change="onPageChange($event, 'current-change')"
      @prev-click="onPageChange($event, 'prev-click')"
      @next-click="onPageChange($event, 'next-click')"
    />
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'CmbTable',
  props: {
    columns: {
      type: Array,
      required: true
    },
    page: {
      type: [Object, Boolean],
      default: () => {
        return {
          props: {
            background: true,
            layout: 'total, sizes, prev, pager, next, jumper'
          }
        }
      }
    },
    pageNum: {
      type: Number,
      default: () => {
        return null
      }
    },
    pageSize: {
      type: Number,
      default: () => {
        return null
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [5, 10, 15, 20]
      }
    },
    total: {
      type: Number,
      default: () => {
        return 0
      }
    },
    data: {
      type: [String, Array],
      default: () => {
        return []
      }
    },
    request: {
      type: Object,
      default: () => {
        return {
          method: 'GET',
          reName: { pageNum: 'pageNum', pageSize: 'pageSize', userId: undefined },
          allInBody: false,
          lazyLoad: false
        }
      }
    },
    response: {
      type: Object,
      default: () => {
        return {
          reName: { total: 'total', rows: 'rows' }
        }
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      reqReName: { pageNum: 'pageNum', pageSize: 'pageSize', userId: 'userId' },
      resReName: { total: 'total', rows: 'rows' },
      queryResult: [],
      queryTotal: 0,
      queryPageSize: 5,
      queryPageNum: 1,
      tableLoading: false
    }
  },
  computed: {
    tableData() {
      return typeof this.data === 'string' ? this.queryResult : this.data
    },
    syncPageSize: {
      get() {
        return this.pageSize !== null ? this.pageSize : this.queryPageSize
      },
      set(val) {
        this.queryPageSize = val
        this.$emit('update:pageSize', val)
      }
    },
    syncPageNum: {
      get() {
        return this.pageNum !== null ? this.pageNum : this.queryPageNum
      },
      set(val) {
        this.queryPageNum = val
        this.$emit('update:pageNum', val)
      }
    },
    syncTotal() {
      return typeof this.data === 'string' ? this.queryTotal : this.total
    },
    syncLoading: {
      get() {
        return this.loading !== null ? this.loading : this.tableLoading
      },
      set(val) {
        this.tableLoading = val
      }
    }
  },
  created() {
    if (!this.request.lazyLoad) {
      this.queryTableData()
    }
  },
  mounted() {

  },
  methods: {
    queryTableData(callback) {
      this.dataIsString(() => {
        this.syncLoading = true
        const { method, allInBody, reName = this.reqReName, params = {}, body = {}} = this.request
        if (method.toUpperCase() === 'POST' && allInBody) {
          body[reName.pageNum] = this.syncPageNum
          body[reName.pageSize] = this.syncPageSize
          body[reName.userId] = this.$store.getters.id
        } else {
          params[reName.pageNum] = this.syncPageNum
          params[reName.pageSize] = this.syncPageSize
          params[reName.userId] = this.$store.getters.id
        }
        request({
          url: this.data,
          method,
          params,
          data: body
        }).then(res => {
          console.log(res)
          const response = res.data || res
          console.log(this.resReName)
          const { reName = this.resReName } = this.response
          console.log(response)
          this.queryResult = response[reName.rows] || []
          this.queryTotal = response[reName.total]
          this.syncLoading = false
          if (typeof callback === 'function') {
            callback(response[reName.rows])
          }
        })
      })
    },
    dataIsString(callback) {
      if (typeof this.data === 'string' && typeof callback === 'function') {
        callback()
      }
    },
    reload(callback) {
      this.syncPageNum = 1
      this.queryTableData(callback)
    },
    getRef() {
      return this.$refs.table
    },
    onPageChange(e, eventName) {
      if (typeof this.data === 'string') {
        this.queryTableData((result) => {
          this.$emit(eventName, e, result)
          // console.log(result)
        })
      } else {
        this.$emit(eventName, e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .cmb-table {
    margin-top: 10px;
    .cmb-page{
      margin-top: 10px;
      text-align: right;
    }
  }

</style>
