import request from '@/utils/request'
import da from 'element-ui/src/locale/lang/da'

// 查询列表
export function listCountDetail(query) {
  return request({
    url: 'chargeBatch/getChargeBatchs',
    method: 'post',
    params: query
  })
}
// 导出结算明细列表
export function exportCountResult(data) {
  return request({
    url: '/paymentTurnover/export/2',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
