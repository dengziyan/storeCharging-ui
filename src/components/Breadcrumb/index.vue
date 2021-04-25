<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item class="itemColor" v-if="current&&current.name!=='dashboard'" :to="current.webRoute" :replace="true">{{
      current.menuName || current.title
    }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      current: state => state.tab.currentMenu
    })

  },
  methods: {
    collapseMenu() {
      this.$store.commit('collapseMenu')
    }
  }
}
</script>

<style lang="scss" scoped>

  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: #f4f4f4;
    }

    &:last-child {
      .el-breadcrumb__inner {
        color: #fff;
      }
    }
  }
.el-breadcrumb{
  margin-left: 3px;
}
.itemColor{
  color:#000;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner{
  color: #fff;
}
.itemColor:last-child .el-breadcrumb__inner{
  color: #fff;
}
</style>
