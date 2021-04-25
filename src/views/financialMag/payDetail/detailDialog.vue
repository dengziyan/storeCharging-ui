<template>
  <div>
    <el-table :data="list" border class="tb-edit" style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column label="缴费周期" width="180" align="center" prop="paymentCycle" />
      <el-table-column label="金额" width="180" align="center" prop="amountPayable" />
      <el-table-column prop="amountActuallyPaid" label="已缴金额">
        <template scope="scope">
          <el-input v-model="scope.row.amountActuallyPaid" size="small" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)" /> <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentStatus" label="缴费状态" align="center" />
      <el-table-column label="操作">
        <template scope="scope">
          <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
          <el-button size="small" type="danger" :disabled="scope.row.isShow" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel(false)">取 消</el-button>
      <el-button type="primary" size="small" @click="cashPay()">现金支付</el-button>
    </span>
  </div>
</template>
<script>
import TableVue from '@/components/TableVue'
import { getPaymentCycle, updateByAmountPaid, updateByIds } from '@/api/financialMag/payDetail'
export default {
  name: 'DetailDialog',
  props: ['detailId', 'visible'],
  // components: { TableVue },
  data() {
    return {
      ids: [], // 多选时选中数组
      dialogVisibled: this.visible,
      // table表格数据
      // loading: true,
      billId: this.detailId,
      list: [],
      total: 0, // 总条数
      requaryId: null,
      requaryAmountActuallyPaid: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 某行点击
    handleCurrentChange(row, event, column) {
      // console.log(row.id)
      // console.log(row.amountActuallyPaid)
      // console.log(row, event, column, event.currentTarget)
    },
    handleEdit(index, row) {
      updateByAmountPaid(this.$store.getters.id, row.amountActuallyPaid, row.id).then(response => {
        if (response.code === 2000) {
          this.$message({
            message: '支付成功！',
            type: 'success'
          })
          this.dialogVisibled = false
          this.getList()
        }
      })
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    // 按取消按钮
    cancel(val) {
      this.dialogVisibled = val
      this.$emit('update:visible', this.dialogVisibled)
    },
    // 批量 现金支付
    cashPay() {
      updateByIds(this.$store.getters.id, this.ids).then(response => {
        if (response.code === 2000) {
          this.$message({
            message: '支付成功！',
            type: 'success'
          })
          this.dialogVisibled = false
          this.getList()
        }
      })
    },
    // 多选框选中
    handleSelectionChange(selection) {
      // console.log(selection)
      this.ids = selection.map(item => item.id)
      console.log(this.ids)
    },
    getList() {
      this.loading = true
      // console.log(this.detailId)
      getPaymentCycle(this.billId).then((response) => {
        console.log(response)
        this.list = response.data || []
        this.total = response.data.total || []
        this.loading = false
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].paymentStatus === 0) {
            this.list[i].isShow = false
            this.list[i].paymentStatus = '未缴'
          } else if (this.list[i].paymentStatus === 1) {
            this.list[i].isShow = true
            this.list[i].paymentStatus = '已缴'
          } else {
            this.list[i].isShow = true
            this.list[i].paymentStatus = '缴费中'
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
<style>
  .el-dialog__body {
    padding: 38px 14px;
  }
</style>
