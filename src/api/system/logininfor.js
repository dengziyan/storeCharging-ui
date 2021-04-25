import request from '@/utils/request'

// 查询用户登录日志
export function loginLoglist(query) {
  return request({
    url: '/sys/log/login-log',
    method: 'get',
    params: query
  })
}
// 导出登录日志
export function exportLogininfo(query) {
  return request({
    url: '/sys/log/login-export',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

// 删除登录日志
export function delLogininfo(infoIds) {
  return request({
    url: '/sys/log/login-log',
    method: 'delete',
    params: {
      ids: infoIds + ''
    }
  })
}

// 清空登录日志
export function cleanLogininfo() {
  return request({
    url: '/sys/log/login-clean',
    method: 'delete'
  })
}

// 清空登录日志
export function getDictVal(table, field) {
  return request({
    url: '/sys/sql/table-field',
    method: 'get',
    params: {
      table,
      field
    }
  })
}

