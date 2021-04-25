import request from '@/utils/request'

// 查询所有菜单
export function fetchLists() {
  return request({
    url: '/sys/menu',
    method: 'get',
    params: {
      pageNum: 0,
      pageSize: 100
    }
  })
}
// 查询所有菜单
export function fetchList(query) {
  return request({
    url: '/sys/menu/tree-list',
    method: 'get',
    params: query
  })
}

// 根据ID删除菜单
export function deleteMenu(ids) {
  return request({
    url: '/sys/menu',
    method: 'delete',
    params: {
      ids: ids + ''
    }
  })
}
// 查询所有菜单
export function treeList(userId) {
  return request({
    url: '/sys/menu/tree-list/' + userId,
    method: 'get'
  })
}
// 添加菜单信息
export function createMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'post',
    data: data
  })
}
// 更新菜单
export function updateMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'put',
    data: data
  })
}
// 修改菜单显示状态
export function updateEnable(id, enabled) {
  return request({
    url: 'sys/menu/status',
    method: 'post',
    params: {
      id: id,
      type: enabled
    }
  })
}
export function getMenu(id) {
  return request({
    url: '/sysMenu/' + id,
    method: 'get'
  })
}
// 获取树形结构的菜单
export function fetchTreeList() {
  return request({
    url: '/sys/menu/tree-list',
    method: 'get'
  })
}
// 导出资源
export function exportMenu(query) {
  return request({
    url: '/sys/menu/export-menu',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

