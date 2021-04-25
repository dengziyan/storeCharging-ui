// eslint-disable-next-line no-unused-vars

const baseTabList = [{
  path: '/dashboard',
  name: 'dashboard',
  title: '首页',
  icon: 'dashboard',
  type: '',
  effect: 'plain'
}]

export default {
  state: {
    isCollapse: false,
    currentMenu: null,
    menu: [],
    tabsList: baseTabList
  },
  mutations: {
    selectMenu(state, val) {
      val = {
        path: val.webRoute || val.path || '',
        name: val.webName || val.name || '',
        title: val.menuName || val.title || '',
        icon: val.webIcon || val.icon || '',
        type: '',
        effect: 'plain'
      }
      // console.log(val)
      if (val.webName !== 'dashboard') {
        state.currentMenu = val
        const result = state.tabsList.findIndex(item => item.name === val.name)
        // tags动态显示，当前路由高亮
        state.tabsList.forEach(function(value, index) {
          value.effect = 'plain'
          state.tabsList.splice(index, 1, value)
        })
        val.effect = 'dark'
        result === -1 ? state.tabsList.push(val) : state.tabsList.splice(result, 1, val)
      } else {
        // tags动态显示，当前路由高亮
        val.effect = 'dark'

        state.tabsList.forEach(function(value, index) {
          if (index !== 0) {
            value.effect = 'plain'
            state.tabsList.splice(index, 1, value)
          }
        })
        state.tabsList.splice(0, 1, val)
        state.currentMenu = null
      }
    },
    closeTab(state, val) {
      // console.log(val)
      const result = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(result, 1)
      // console.log(state.tabsList)
    },
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    },
    setTabList(state, menu) {
      if (!menu || !menu.name) {
        return
      }
      // console.log(menu)
      state.currentMenu = menu.name === 'dashboard' ? null : menu
      state.tabsList.forEach(function(value, index) {
        value.effect = 'plain'
        state.tabsList.splice(index, 1, value)
      })
      const result = state.tabsList.findIndex(item => item.name === menu.name)
      result === -1 ? state.tabsList.push(menu) : state.tabsList.splice(result, 1, menu)
    }
  },
  actions: {}
}
