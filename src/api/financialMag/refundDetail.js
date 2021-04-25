// 退款明细
import request from '@/utils/request'
// 查询退款明细列表
export function listRefundDetail(query) {
  return request({
    url: '/refundDetails/getRefundDetails',
    method: 'post',
    params: query
  })
}
// 审核按钮
export function refundDetailToReview(userId, status, id) {
  return request({
    url: '/refundDetails/toReview',
    method: 'post',
    params: {
      userId: userId,
      status: status,
      id: id
    }
  })
}
