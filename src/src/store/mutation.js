export default {
  GET_ID: (state, payload) => {
    state.menuIds = payload
  },
  GET_TYPE2ID: (state, payload) => {
    state.typeIds = payload
  },
  GET_DATA: (state, payload) => {
    state.datas = payload
  },
  GET_NODATA: (state, payload) => {
    state.nodata = payload
  },
  GET_SIDE: (state, payload) => {
    state.sides = payload
  },
  VIEW: (state, payload) => {
    state.view = payload
  },
  GET_TAGSLIST: (state, payload) => {
    state.tags = payload
  },
  changeUserPic(state, userPhoto) {
    state.userPhoto = userPhoto
  },
  editMenu(state, menuName) {
    state.menuName = menuName
  },
  getCheckValue(state, checkValue) {
    state.checkValue = checkValue
  },
  mId(state, mId) {
    state.mId = mId
  },
  setDeployCheckTaskList(state, payload) {
    state.tempDeployCheckTaskList = payload
  },
  setBuildCheckTaskList(state, payload) {
    state.tempBuildCheckTaskList = payload
  },
  setIsfull(state, payload) {
    state.isfull = payload
  }
}
