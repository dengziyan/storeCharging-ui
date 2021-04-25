<template>
  <el-card v-loading="loadingResource" class="form-container" shadow="never">
    <el-button type="danger" size="mini" @click="selectAllResource">全选</el-button>
    <el-button type="warning" size="mini" @click="clearResourceMenu">清空</el-button>
    <el-button type="primary" size="mini" @click="restResourceMenu">还原</el-button>
    <el-button type="success" size="mini" @click="handleSave">保存</el-button>
    <el-button type="info" size="mini" @click="backRoleList">返回角色列表</el-button>
    <div v-for="category in allResourceCate" :key="'cate'+category.id" class="top-line">
      <el-row class="table-layout" style="background: #F2F6FC;">
        <el-checkbox
          v-model="category.checked"
          :indeterminate="category.isIndeterminate"
          :disabled="category.enable===0"
          @change="handleCheckAllChange($event,category)"
        >
          {{ category.name }}
        </el-checkbox>
      </el-row>
      <el-row class="table-layout">
        <el-checkbox-group v-model="roleResource">
          <el-checkbox
            v-for="resource in category.children"
            :key="resource.id"
            v-model="resource.checked"
            :label="resource.id"
            :disabled="resource.isEnable===0"
            @change="handleCheckedCitiesChange($event,resource.id,category)"
          >
            {{ resource.resourceName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-row>
    </div>
    <div v-show="!loadingResource" style="margin-top: 20px; display: flex;justify-content: center;" align="center">
      <el-button type="success" @click="handleSave()">保存</el-button>
      <el-button type="primary"  @click="restResourceMenu">还原</el-button>
      <el-button @click="clearResourceMenu">清空</el-button>
    </div>

  </el-card>
</template>

<script>
import { allocResources, listRoleResources } from '@/api/authoraty/role'

import { listAllCate } from '@/api/authoraty/resourceCategory'

export default {
  name: 'AllocResource',
  data() {
    return {
      loadingResource: false,
      roleId: this.$route.query.roleId,
      allResource: [],
      roleResource: [],
      restResource: [],
      allResourceCate: []
    }
  },
  created() {
    this.getAllResourceCateList()
  },
  mounted() {
    // 第一种方法
    if (window.name === '') {
      window.name = 'isReload' // 在首次进入页面时我们可以给window.name设置一个固定值
    } else if (window.name === 'isReload') {
      this.$router.replace('/roleList')
    }
  },
  destroyed() {
    window.name = ''
    console.log('销毁')
  },
  methods: {
    // 全选资源
    selectAllResource() {
      const allResource = this.allResourceCate
      const that = this
      allResource.map(function(params) {
        that.setCheck(true, params)
        that.setRoleCheck(true, params)
      })
    },
    // 清空选择
    clearResourceMenu() {
      const allResource = this.allResourceCate
      const that = this
      allResource.map(function(params) {
        that.setCheck(false, params)
        that.setRoleCheck(false, params)
      })
    },
    // 还原
    restResourceMenu() {
      this.getResourceByRole(this.roleId)
    },
    handleCheckAllChange(event, val) {
      this.setCheck(event, val)
      this.setRoleCheck(event, val)
    },
    setRoleCheck(event, val) {
      const children = val.children || []
      const that = this
      children.map(function(params) {
        let result
        if (event) {
          result = that.roleResource.findIndex(item => item === params.id)
          result === -1 ? that.roleResource.push(params.id) : ''
        } else {
          // console.log(that.roleResource)
          result = that.roleResource.findIndex(item => item === params.id)
          // console.log(result)
          that.roleResource.splice(result, 1)
          // console.log(that.roleResource)
        }
      })

      // console.log(this.roleResource)
      // console.log(val)
    },
    handleCheckedCitiesChange(event, id, category) {
      // console.log(id,category)
      this.setCheck(event, category, id)
    },

    setCheck(event, category, id) {
      const children = category.children || []
      const count = []
      // console.log(id)
      category.children = children.map(function(params) {
        // console.log(params)
        if (params.id === id) {
          params.checked = event
        }
        if (id === undefined) {
          params.checked = event
        }
        if (params.checked) {
          count.push(1)
        }
        return params
      })
      // console.log(count)
      category.checked = count.length === children.length && event
      category.isIndeterminate = count.length !== children.length && count.length > 0
    },
    async getAllResourceCateList() {
      this.loadingResource = true
      await listAllCate().then(response => {
        const resource = response.data || []
        const resources = resource.map(function(val) {
          return { id: val.id, name: val.name, children: val.children, checked: false, isIndeterminate: false, enable: val.enable }
        })
        this.allResource = resources
        this.allResourceCate = resources
        this.loadingResource = false
      })
      this.getResourceByRole(this.roleId)
    },
    getResourceByRole(roleId) {
      listRoleResources(roleId).then(response => {
        this.roleResource = response.data || []
        this.setResourceCheck(response.data || [])
      })
    },
    // 分配角色核心
    setResourceCheck(data) {
      // console.log(data)
      let resources = this.allResourceCate
      // console.log(resources)

      // console.log(data[i])
      resources = resources.map(function(params) {
        // console.log(params)
        const children = params.children || []
        const count = []
        params.children = children.map(function(val) {
          val.checked = false
          for (let i = 0; i < data.length; i++) {
            // console.log(val.id, data[i])
            if (val.id === data[i]) {
              val.checked = true
            }
          }
          if (val.checked) {
            count.push(1)
          }
          return val
        })
        params.checked = count.length === children.length && children.length !== 0
        params.isIndeterminate = count.length !== children.length && count.length > 0
        return params
      })

      // console.log(resources)
      this.restResource = resources
      this.allResourceCate = resources
    },
    handleSave() {
      this.$confirm('是否分配资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        allocResources(this.roleResource, this.roleId).then(res => {
          if (res.code === 2000) {
            this.$message({
              message: res.message,
              type: res.code === 2000 ? 'success' : 'error'
            })
            this.$router.back()
          }
        })
      })
    },
    backRoleList() {
      this.$router.push({ path: '/roleList' })
    }
  }
}
</script>

<style scoped>
.table-layout {
  padding: 20px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
}

.top-line {
  border-top: 1px solid #DCDFE6;
}
</style>
