import request from '@/utils/request'
// 查询收费详情列表
export function listPayDetail(query) {
  return request({
    url: '/chargeBill/listBill',
    method: 'get',
    params: query
  })
}
// 查询周期详情
export function getPaymentCycle(query) {
  return request({
    url: '/paymentCycle/getPaymentCycle/' + query,
    method: 'get'
  })
}
// 现金支付
export function updateByAmountPaid(userId, AmountPaid, id) {
  return request({
    url: '/paymentCycle/updateByAmountPaid',
    method: 'post',
    params: {
      userId: userId,
      AmountPaid: AmountPaid,
      id: id
    }
  })
}
// 现金支付
export function updateByIds(userId, ids) {
  return request({
    url: '/paymentCycle/batchPay',
    method: 'post',
    params: {
      userId: userId,
      ids: ids + ''
    }
  })
}

// 导出收费详情列表
export function exportCountDetail(data) {
  return request({
    url: '/chargeBill/export',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
// 删除收费详情
export function deleteById(billId) {
  return request({
    url: '/chargeBill/' + billId,
    method: 'delete'
  })
}
// 新增收费详情
export function addPayDetail(data) {
  return request({
    url: '/chargeBill/insert',
    method: 'post',
    data: data
  })
}
// 编辑收费详情
export function updatePayDetail(data) {
  return request({
    url: '/chargeBill/',
    method: 'put',
    data: data
  })
}
