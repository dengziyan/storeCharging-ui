import request from '@/utils/request'

// 添加收费项目
export function addPayItems(data) {
  return request({
    url: '/project',
    method: 'post',
    data: data
  })
}
// 修改收费项目
export function updatePayItems(data) {
  return request({
    url: '/project',
    method: 'put',
    data: data
  })
}
// 获取收费类型列表
export function listChargeCategoryOptions(query) {
  return request({
    url: '/chargeCategory/listChargeCategory',
    method: 'post',
    params: query
  })
}
// 删除收费项目
export function deletePayItems(data) {
  return request({
    url: '/project' + data,
    method: 'delete'
  })
}
