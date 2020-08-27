let defaultUserPhoto = 'static/img/Fruit-1.png'
try {
  if (localStorage.userPhoto) {
    defaultUserPhoto = localStorage.userPhoto
  }
} catch (e) {
  if (e) {
    console.log(e)
  }
}

export default{
  menuIds: '', // 所选菜单的id(全部)
  typeIds: [],
  datas: [], // 角色所属系统下面勾选的菜单
  menuName: '',
  userPhoto: defaultUserPhoto,
  sides: {}, // breadcrumb,tags,sidebar的联动数据
  checkValue: false,
  mId: '',
  tags: [],
  nodata: [], // 角色所属系统下面未勾选的菜单
  view: '',
  isAuthorized: false,
  tempDeployCheckTaskList: [],
  tempBuildCheckTaskList: []
}
