<template>
  <span class="tree-expand">
    <span v-show="DATA.treeIsEdit" class="tree-label">
      <el-input
        :ref="'treeInput'+DATA.id"
        v-model="DATA.name"
        class="edit"
        size="mini"
        autofocus
        @click.stop.native="nodeEditFocus"
        @blur.stop="nodeEditPass(STORE,DATA,NODE)"
        @keyup.enter.stop.native="nodeEditPass(STORE,DATA,NODE)"
      />
    </span>
    <span v-show="!DATA.treeIsEdit" :class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
      <span>{{ DATA.name }}</span>
    </span>
    <span v-show="!DATA.treeIsEdit" class="tree-btn">
      <i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)" />
      <i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)" />
      <i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)" />
    </span>
  </span>
</template>

<script>
export default {
  props: ['NODE', 'DATA', 'STORE', 'maxexpandId'],
  methods: {
    nodeAdd(s, d, n) { // 新增
      this.$emit('nodeAdd', s, d, n)
    },
    nodeEdit(s, d, n) { // 编辑
      d.treeIsEdit = true
      this.$nextTick(() => {
        this.$refs['treeInput' + d.id].$refs.input.focus()
      })
      this.$emit('nodeEdit', s, d, n)
    },
    nodeDel(s, d, n) { // 删除
      this.$emit('nodeDel', s, d, n)
    },
    nodeEditPass(s, d, n) { // 编辑完成
      d.treeIsEdit = false
    },
    nodeEditFocus() {
      // 阻止点击节点的事件冒泡
    }
  }
}
</script>

<style>
  .tree-expand{
    overflow:hidden;
  }
  .tree-expand .tree-label.tree-new{
    font-weight:600;
  }
  .tree-expand .tree-label{
    font-size:0.9em;
  }
  .tree-expand .tree-label .edit{
    width:80%;
  }
  /*操作按钮*/
  .tree-expand .tree-btn{
    display:none;
    float:right;
    margin-right: 0px;
    padding-left: 7px;
  }
  .tree-expand .tree-btn i{
    color:#8492a6;
    font-size:0.9em;
    margin-right:3px;
  }
  .el-tree-node__content{
    height: auto;
  }
</style>
