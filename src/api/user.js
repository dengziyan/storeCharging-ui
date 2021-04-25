import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/portal/login',
    method: 'post',
    data
  })
}

export function logout(username) {
  return request({
    url: '/sys/portal/logout',
    method: 'post',
    data: {
      userAccount: username
    }
  })
}
