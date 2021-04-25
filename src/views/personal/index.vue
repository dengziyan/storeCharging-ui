<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <img src="../../assets/2.jpg" alt="" class="user">
<!--              <userAvatar :user="user" />-->
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <i class="el-icon-user-solid"></i>用户账号
                <span class="pull-right">{{ user.account }}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-phone"></i>手机号码
                <span class="pull-right">{{ user.mobilePhone }}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-comment"></i>用户邮箱
                <span class="pull-right">{{ user.email }}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-custom"></i>用户性别
                <span class="pull-right">{{ user.sex === 'M' ? '男' : '女'}}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-claim"></i>创建日期
                <span class="pull-right">{{ user.createTime }}</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { getUserProfile } from '@/api/authoraty/user'

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {
        account: undefined,
        userName: undefined
      },
      roleGroup: {},
      postGroup: {},
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserProfile(this.$store.getters.id).then(res => {
        this.user.account = this.$store.getters.name
        this.user.userName = res.data.userInfo.userName
        this.user.realName = res.data.userInfo.realName
        this.user.mobilePhone = res.data.userInfo.mobilePhone
        this.user.email = res.data.userInfo.email
        this.user.sex = res.data.userInfo.sex
        this.user.createTime = res.data.userInfo.createTime
        console.log(res.data.userInfo)
      })
      // this.user.account = this.$store.getters.name
      // this.user.realName = this.$store.getters.realName
      // this.user.mobilePhone = this.$store.getters.mobilePhone
      // this.user.email = this.$store.getters.email
      // this.user.gender = this.$store.getters.gender
      // this.user.createDate = this.$store.getters.createDate
      // console.log(this.user)
    }
  }
}
</script>
<style scoped>
  ul{
    list-style: none;
    padding: 0px;
    width: 1000px;
  }
  .list-group-item{
    margin-top: 20px;
  }
  .pull-right{
    padding-left: 10px;
  }
  .user {
    width: 150px;
    height: 150px;
  }
</style>
