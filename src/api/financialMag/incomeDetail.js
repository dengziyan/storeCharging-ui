import request from '@/utils/request'

// 查询列表
export function listIncomeDetail(query) {
  return request({
    url: '/paymentTurnover/getDetail',
    method: 'post',
    params: query
  })
}
// 申请退款
export function toRefund(userId, id) {
  return request({
    url: '/refundDetails/toRefund',
    method: 'post',
    params: {
      userId: userId,
      id: id
    }
  })
}

