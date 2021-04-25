import request from '@/utils/request'
import Qs from 'qs'
// 查询所有后台资源树
export function listAllCate() {
  return request({
    url: '/sys/resource-category/tree-resource',
    method: 'get'
  })
}

// 查询所有后台资源分类
export function listResourceCategory(params) {
  return request({
    url: '/sys/resource-category',
    method: 'get',
    params: params
  })
}
// 添加后台资源分类
export function createResourceCategory(data) {
  return request({
    url: '/sys/resource-category',
    method: 'post',
    data: data
  })
}
// 修改后台资源分类
export function updateResourceCategory(data) {
  return request({
    url: '/sys/resource-category',
    method: 'put',
    data: data
  })
}
// 根据ID删除后台资源
export function deleteResourceCategory(ids) {
  return request({
    url: '/sys/resource-category',
    method: 'delete',
    params: { ids: ids + '' }

  })
}

// 根据ID删除后台资源
export function getResourceCategory(id) {
  return request({
    url: '/sys/resource-category/resource/' + id,
    method: 'get'
  })
}

// 资源状态修改
export function changecategoryStatus(id, type) {
  const data = {
    id,
    type
  }
  return request({
    url: '/sys/resource-category/status',
    method: 'put',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest: [function(data) { // 在请求之前对data传参进行格式转换
      data = Qs.stringify(data)
      return data
    }],
    data
  })
}

// 导出资源
export function exportResourceCategory(query) {
  return request({
    url: '/sys/resource-category/export',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}
