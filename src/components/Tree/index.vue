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
    <span v-show="!DATA.treeIsEdit" :class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']" style="position: relative;padding-right: 100px;">
      <span>{{ DATA.name }}</span>
      <span style="position: absolute;right: 0px;">
        <i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)" />
        <i v-if="DATA.level !== 1" class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)" />
        <i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)" />
      </span>
    </span>
    <!--    <span v-show="!DATA.treeIsEdit" class="tree-btn">-->
    <!--      <span v-if="(this.$store.state.user.role===1)||(this.$store.state.user.role===2&&NODE.level>1)||(this.$store.state.user.role===3&&NODE.level>=2)||(this.$store.state.user.role===4&&NODE.level>=3)">-->
    <!--        <i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)" />-->
    <!--        <i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)" />-->
    <!--        <i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)" />-->
    <!--      </span>-->
    <!--    </span>-->
    <!--    <span style="float: right">-->
    <!--      <i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)" />-->
    <!--      <i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)" />-->
    <!--      <i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)" />-->
    <!--    </span>-->

  </span>
</template>

<script>
export default {
  name: 'Index',
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
    float: left;
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
