<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!--    <sidebar class="sidebar-container" />-->
    <!--    <div :class="{'fixed-header':fixedHeader}">-->
    <!--      <navbar />-->
    <!--    </div>-->
    <navbar />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <common-tab />
      </div>
      <!--汉堡菜单        -->
<!--      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />-->
      <sidebar class="sidebar-container" :style="{ height: treeHeight + 'px' }"/>
      <!--      <common-tab />-->
      <app-main />
    </div>
<!--    <div class="r-content" style="right: 0px;top:0px;position: absolute;">-->
<!--      &lt;!&ndash;         个人中心和退出&ndash;&gt;-->
<!--      <el-dropdown trigger="click" size="mini">-->
<!--        <span class="el-dropdown-link">-->
<!--          <img :src="baseUrl+avatar" class="user" alt="">-->
<!--        </span>-->
<!--        <el-dropdown-menu slot="dropdown">-->
<!--          <router-link to="/personal">-->
<!--            <el-dropdown-item>个人中心</el-dropdown-item>-->
<!--          </router-link>-->
<!--          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </el-dropdown>-->
<!--    </div>-->
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import commonTab from '@/layout/components/CommonTab'
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger/index'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    commonTab,
    Hamburger
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    ...mapGetters([
      'avatar',
      'baseUrl'
    ])
  },
  data() {
    return {
      treeHeight: 0
    }
  },
  mounted() {
    // 设置树的高度
    this.treeHeight = document.body.clientHeight - 60
    window.onresize = () => {
      this.treeHeight = document.body.clientHeight - 60
    }
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .r-content{
    position: absolute;
    top: 20px;
    right: 10px;
  }
  /*.main-container{*/
  /*  background-color: red;*/
  /*  height: 80%;*/
  /*}*/
  /*.sidebar-container{*/
  /*  height: 80%;*/
  /*}*/
  /*.hamburger-container {*/
  /*  height: 100%;*/
  /*  float: left;*/
  /*  cursor: pointer;*/
  /*  transition: background .3s;*/
  /*  -webkit-tap-highlight-color:transparent;*/
  /*  &:hover {*/
  /*    background: rgba(0, 0, 0, .025)*/
  /*  }*/
  /*}*/
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .el-header{
    background-color: #99a9bf;
  }
</style>
