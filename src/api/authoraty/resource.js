import request from '@/utils/request'
import Qs from 'qs'
// 查询资源列表
export function fetchList(params) {
  return request({
    url: '/sys/resource',
    method: 'get',
    params: params
  })
}
// 删除一条资源数据
export function deleteResource(ids) {
  return request({
    url: '/sys/resource',
    method: 'delete',
    params: { ids: ids + '' }
  })
}
// 更新资源数据
export function updateResource(category, data) {
  return request({
    url: '/sys/resource',
    method: 'put',
    params:{category: category},
    data: data
  })
}
// 资源状态修改
export function changeResourceStatus(id, type) {
  const data = {
    id,
    type
  }
  return request({
    url: '/sys/resource/status',
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
// 插入一条资源数据
export function createResource(category, data) {
  return request({
    url: '/sys/resource',
    method: 'post',
    params: { category: category },
    data: data
  })
}

export function fetchAllResourceList() {
  return request({
    url: '/sysResources/resourceList',
    method: 'get'
  })
}

// 导出资源
export function exportResource(query) {
  return request({
    url: '/sys/resource/export-resource',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}
