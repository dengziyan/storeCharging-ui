import Cookies from 'js-cookie'
const Base64 = require('js-base64').Base64

const ID_KEY = 'vue_user_record_id'
const TOKEN_KEY = 'vue_token_record_'
const ACCOUNT_KEY = 'vue_user_record_account'

/* 获取token*/
export function getToken() {
  if (getID_KEY() === undefined) { return undefined }
  const token = Cookies.get(TOKEN_KEY + getID_KEY())
  if (token === undefined) { return undefined }
  return Base64.decode(token)
}

/* 设置token,id,account*/
export function setCookies(token, id, account) {
  const date = new Date()
  date.setTime(date.getTime() + (30 * 60 * 1000))

  /* 将token转码base64*/
  Cookies.set(TOKEN_KEY + id, Base64.encode(token), { expires: date })

  /* 将id转码base64*/
  Cookies.set(ID_KEY, Base64.encode(id), { expires: date })

  /* 将account转码base64*/
  Cookies.set(ACCOUNT_KEY, Base64.encode(account), { expires: date })
}

export function getID_KEY() {
  if (Cookies.get(ID_KEY) === undefined) { return undefined }
  return Base64.decode(Cookies.get(ID_KEY))
}

export function removeCookies() {
  /* 移除token*/
  Cookies.remove(TOKEN_KEY + getID_KEY())
  /* 移除id*/
  Cookies.remove(ID_KEY)
  /* 移除账号*/
  Cookies.remove(ACCOUNT_KEY)
}

export function setToken(token) {
  const date = new Date()
  date.setTime(date.getTime() + (30 * 60 * 1000))

  /* 将token转码base64*/
  Cookies.set(TOKEN_KEY + getID_KEY(), Base64.encode(token), { expires: date })

  /* 将id转码base64*/
  Cookies.set(ID_KEY, Cookies.get(ID_KEY), { expires: date })

  /* 将account转码base64*/
  Cookies.set(ACCOUNT_KEY, Cookies.get(ACCOUNT_KEY), { expires: date })
}

export function getBaseUrl() {
  return sessionStorage.getItem('baseUrl')
}

export function getAvatar() {
  return sessionStorage.getItem('avatar')
}

export function getAccount() {
  if (Cookies.get(ACCOUNT_KEY) === undefined) { return undefined }
  return Base64.decode(Cookies.get(ACCOUNT_KEY))
}

export function setBaseUrl(val) {
  sessionStorage.setItem('baseUrl', val)
}

export function setAvatar(val) {
  sessionStorage.setItem('avatar', val)
}

export function setRole(val) {
  sessionStorage.setItem('role', val)
}
export function getRole() {
  return sessionStorage.getItem('role')
}
