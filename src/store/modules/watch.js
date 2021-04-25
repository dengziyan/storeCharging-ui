
const state = {
  queryParamsTest: {
    chargeBeginTime: '',
    branchId: '',
    billName: '',
    pageNum: 1,
    pageSize: 10
  },
  hah: 'hah',
  // editFloor: {
  //   branchId: this.requireId,
  //   floorName: '',
  //   admin: ''
  // }
}

const mutations = {
  watchQueryParams(state, all) {
    state.queryParamsTest = all
    console.log(state.queryParamsTest)
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
