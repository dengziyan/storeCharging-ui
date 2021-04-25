import request from '@/utils/request'

// 查询收入统计
export function listIncomeStatic(query) {
  return request({
    url: '/paymentTurnover/getIncomeStatistics',
    method: 'post',
    params: query
  })
}
// 查询列表
// export function listIncomeStatic(query) {
//   return request({
//     url: 'chargeBatch/getChargeBatchs',
//     method: 'post',
//     params: query
//   })
// }
