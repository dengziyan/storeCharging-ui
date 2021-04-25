/**
 * 注册成全局组件
 */
import CmbForm from '@/components/CMBForm'
import CmbTable from '@/components/CMBTable'

const COMPONENTS = [
  CmbForm,
  CmbTable
]

COMPONENTS.forEach(component => {
  window.Vue.component(component.name, component)
})
