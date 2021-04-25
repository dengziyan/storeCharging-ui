import request from '@/utils/request'

// 查询收费项目列表
export function listChargeProject(query) {
  return request({
    url: '/project/listProject',
    method: 'post',
    params: query
  })
}
// 修改
export function updatePayBills(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data: data
  })
}
// 新增
export function addPayBills(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}
// 获取收费类型列表
export function listChargeCategoryOptions() {
  return request({
    url: '/chargeCategory/listChargeCategoryName',
    method: 'get'
  })
}
// 获取收费项目名称列表
export function listChargeProjectOptions(data) {
  return request({
    url: '/project/listProject',
    method: 'post',
    data: data
  })
}
// 删除收费项目
export function deletePayItems(data) {
  return request({
    url: '/project/' + data,
    method: 'delete'
  })
}
