import request from '@/utils/request'

// 查询商户信息列表
export function listMerchants(query) {
  return request({
    url: '/sys/merchants',
    method: 'get',
    params: query
  })
}
// 查询物业
export function listPropertyInfo(query) {
  return request({
    url: '/sys/property/info',
    method: 'get',
    params: query
  })
}
// 查询物业菜单
export function listProperty(query) {
  return request({
    url: '/sys/property/menu',
    method: 'get',
    params: query
  })
}
// 查询物业菜单
export function listUserProperty(id) {
  return request({
    url: '/sys/property/multi-menu',
    method: 'get',
    params: {
      userId: id
    }
  })
}
// 新增商户
export function addMall(data) {
  return request({
    url: '/sys/mall',
    method: 'post',
    data: data
  })
}
// 修改商户
export function updateMall(id, data) {
  return request({
    url: '/sys/mall' + id,
    method: 'post',
    data: data
  })
}
// 新增商场分店
export function addBranch(data) {
  return request({
    url: '/sys/branch',
    method: 'post',
    params: {
      user: data.userId,
      mallId: data.mallId
    },
    data: data
  })
}
// 新增楼层
export function addFloor(data) {
  return request({
    url: '/sys/branch/floor',
    method: 'post',
    params: {
      user: data.userId,
      branchId: data.branchId
    },
    data: data
  })
}
// 新增业态区域
export function addArea(data) {
  return request({
    url: '/sys/branch/area',
    method: 'post',
    params: {
      user: data.userId,
      floorId: data.floorId
    },
    data: data
  })
}
// 修改商场分店
export function updateBranch(id, data) {
  return request({
    url: '/sys/branch',
    method: 'put',
    params: {
      user: id,
      mall: data.mallId
    },
    data: data
  })
}

// 修改楼层
export function updateFloor(id, data) {
  return request({
    url: '/sys/branch/floor',
    method: 'put',
    params: {
      user: id,
      branch: data.branchId
    },
    data: data
  })
}
// 修改业态区域
export function updateArea(id, data) {
  return request({
    url: '/sys/branch/area',
    method: 'put',
    params: {
      user: id,
      floor: data.floorId
    },
    data: data
  })
}
// 删除物业
export function delProperty(data) {
  return request({
    url: '/sys/property/info',
    method: 'delete',
    params: data
  })
}
// 修改住户信息
export function updateMerchants(data) {
  return request({
    url: '/sys/merchants',
    method: 'put',
    data: data
  })
}
// 添加住户信息
export function addMerchants(data) {
  return request({
    url: '/sys/merchants',
    method: 'post',
    data: data
  })
}
// 删除住户信息
export function delMerchants(data) {
  return request({
    url: '/sys/merchants',
    method: 'delete',
    params: {
      merchantsId: data.merchantsId
    },
    data: data
  })
}
// 下载商场信息导入模板
export function importBranchTemplates() {
  return request({
    url: '/sys/branch/template-import',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
// 下载住户信息导入模板
export function importMerchantsTemplates() {
  return request({
    url: '/sys/merchants/template-import',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
// 导入商场分店信息
export function batchAddBranch(id, mallId, data) {
  return request({
    url: '/sys/branch/import',
    method: 'post',
    params: {
      id: id,
      mallId: mallId
    },
    data: data
  })
}
// 导入住户信息
export function batchAddMerchants(id, data) {
  return request({
    url: '/sys/merchants/import',
    method: 'post',
    params: id,
    data: data
  })
}
// 导出住户信息
export function exportMerchants(query) {
  return request({
    url: '/sys/merchants/export',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}
// 导入商铺信息
export function addStore(data) {
  return request({
    url: '/sys/branch/store',
    method: 'post',
    params: {
      user: data.userId,
      areaId: data.areaId
    },
    data: data
  })
}
