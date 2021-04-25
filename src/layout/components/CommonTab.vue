<template>
  <div class="tags">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <el-tag
      v-for="tag in tags"
      :key="''+tag.name"
      size="small"
      :closable="tag.name !== 'dashboard'"
      :disable-transitions="false"
      :type="tag.type"
      :effect="tag.effect"
      @close="handleClose(tag)"
      @click="changeMenu(tag)"
    >
      {{ tag.title }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Hamburger from '@/components/Hamburger/index'
export default {
  data() {
    return {
    }
  },
  components: {
    Hamburger
  },
  computed: {
    ...mapState({
      tags: state => state.tab.tabsList
    }),
    sidebar() {
      return this.$store.state.app.sidebar
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    ...mapMutations({
      close: 'closeTab'
    }),
    handleClose(tag) {
      console.log(tag)
      if (tag.effect === 'plain') {
        this.close(tag)
        return
      }
      const index = this.tags.findIndex(item => item.effect === 'dark')
      this.close(tag)
      const lastTag = index === 0 ? this.tags[0] : this.tags[this.tags.length - 1]
      this.changeMenu(lastTag)
    },
    changeMenu(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.tags{
  padding: 5px;
  padding-top: 70px;
  padding-left: 20px;
  /*background-color: rgba(1,1,1,0.03);*/
  .el-tag{
    margin-right: 15px;
  }
}
.hamburger-container {
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background .3s;
  -webkit-tap-highlight-color:transparent;

  &:hover {
    background: rgba(0, 0, 0, .025)
  }
}
</style>
