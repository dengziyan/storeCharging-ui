import { login, logout } from '@/api/user'
import {
  getToken,
  getID_KEY,
  setCookies,
  removeCookies,
  getBaseUrl,
  getAvatar,
  getAccount,
  setBaseUrl, setAvatar,setRole,getRole
} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getAccount(),
    userName: '',
    id: getID_KEY(),
    avatar: getAvatar(),
    email: '',
    mobilePhone: '',
    createDate: '',
    gender: '',
    baseUrl: getBaseUrl(),
    role: getRole()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_REAL_NAME: (state, name) => {
    state.userName = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_MOBILE_PHONE: (state, mobilePhone) => {
    state.mobilePhone = mobilePhone
  },
  SET_CREATE_DATE: (state, createDate) => {
    state.createDate = createDate
  },
  SET_GENDER: (state, gender) => {
    state.gender = gender
  },
  SET_BASE_URL(state, url) {
    state.baseUrl = url
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), password: password }).then(response => {
        const data = response.data
        const token = data.token
        const role = data.role.id
        commit('SET_TOKEN', token) // token
        commit('SET_ID', data.user.id) // 用户编号

        const name = data.user.userAccount
        const avatar = data.user.avatarUrl
        const email = data.user.email
        const mobilePhone = data.user.mobilePhone
        const createDate = data.user.createTime
        const userName = data.user.userName
        const gender = data.user.sex
        const url = data.baseUrl

        commit('SET_ROLE', role)
        commit('SET_REAL_NAME', userName)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_EMAIL', email)
        commit('SET_MOBILE_PHONE', mobilePhone)
        commit('SET_CREATE_DATE', createDate)
        commit('SET_GENDER', gender)
        commit('SET_BASE_URL', url)

        setCookies(token, data.user.id,name)
        setBaseUrl(url)
        setAvatar(avatar)
        setRole(role)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.name).then(res => {
        if (res.code === 2000) {
          removeCookies() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeCookies() // must remove  token  first
      sessionStorage.clear()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
