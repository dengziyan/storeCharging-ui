import request from '@/utils/request'
import da from 'element-ui/src/locale/lang/da'

// 查询列表
export function listCountResult(query) {
  return request({
    url: '/paymentTurnover/getSettlementDetails',
    method: 'get',
    params: query
  })
}

// 导出结算结果列表
export function exportCountResult(data) {
  return request({
    url: '/paymentTurnover/export/1',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
