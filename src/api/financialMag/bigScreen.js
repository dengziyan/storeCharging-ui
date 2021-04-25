import request from '@/utils/request'

// 查询近三十天的数据
export function listDataByDate(query) {
  return request({
    url: '/paymentTurnover/dataMap',
    method: 'get',
    params: query
  })
}
