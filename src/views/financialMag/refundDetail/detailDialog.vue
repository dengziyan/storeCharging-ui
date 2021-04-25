<template>
  <div>
    <el-table :data="detailData1" border class="tb-edit" style="width: 100%" highlight-current-row>
      <el-table-column label="订单号" prop="orderUmber" width="180" align="center"></el-table-column>
      <el-table-column label="支付日期" prop="payTime" width="180" align="center"></el-table-column>
      <el-table-column label="支付方式" prop="paymentMethod" align="center"></el-table-column>
      <el-table-column label="支付金额" prop="amountPaid" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'DetailDialog',
  props: {
    visible: { type: Boolean, required: true },
    detailData: { type: Object, required: true }
  },
  // components: { TableVue },
  data() {
    return {
      detailData1: [],
      dialogVisibled: this.visible
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 按取消按钮
    cancel(val) {
      this.dialogVisibled = val
      this.$emit('update:visible', this.dialogVisibled)
    },
    getList() {
      this.detailData1.push(this.detailData)
      console.log(this.detailData1)
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
