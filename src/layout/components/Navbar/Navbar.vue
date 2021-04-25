<template>
  <div class="navbar">
    <header>
      <img src="../../../assets/myLogo.png" alt="" style="width: 300px;">
      <div class="l-content">
        <!--面包屑        -->
<!--        <breadcrumb class="breadcrumb-container" />-->
      </div>
      <div class="r-content">
        <!--         个人中心和退出-->
        <el-dropdown trigger="click" size="mini">
          <span class="el-dropdown-link">
            <img src="../../../assets/2.jpg" alt="" class="user">
            <!--            <img :src="baseUrl+avatar" class="user" alt="">-->
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="my">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/index'
import Hamburger from '@/components/Hamburger/index'

export default {
  // components: {
  //   Breadcrumb
  // },
  // components: {
  //   Breadcrumb,
  //   Hamburger
  // },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'baseUrl'
    ])
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    my() {
      this.$router.push({ path: '/personal' })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  overflow: hidden;
  position: fixed;
  background: blue;
  z-index: 1000;
  width: 100%;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

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

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

  }
}
.navbar{
  background-color: #3C5BAE;
}
header {
  color: white;
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: space-between;
}

.el-button {
  padding: 6px 12px;
}

//左边
.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

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

.el-button {
  display: block;
}

//右边
.r-content {
  float: right;
  margin-right: 10px;
}

.r-content {
  .user {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}

//右边下拉（个人中心）
.el-dropdown-link {
  cursor: pointer;
  color: white;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-dropdown-menu--mini{
  padding: 10px 0;
  top: 48px !important;
}
.el-dropdown-menu--mini .el-dropdown-menu__item {
  font-size: 16px;
}

</style>
