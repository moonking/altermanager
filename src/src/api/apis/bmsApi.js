import request from '@/utils/request'
import { baserUrl } from '../../config'

// Bms模块
export function baseurl () {
  return baserUrl
}

// 获取DDuserid
export function getapproverlist () {
  return request({
    url: baserUrl + 'api/user/getAll',
    method: 'get'
  })
}

// 用户登录
export function userlogin (username, password, kaptcha, type) {
  return request({
    async: false,
    url: baserUrl + 'api/login?loginName=' + username + '&password=' + password + '&kaptcha=' + kaptcha + '&type=' + type,
    method: 'post',
    data: {}
  })
}

// 整个系统所有的角色
export function getSystemRole () {
  return request({
    url: baserUrl + 'api/role/select/list',
    method: 'get',
    data: {}
  })
}

// 获取当前登录人的角色
export function getNowreginRole () {
  return request({
    url: baserUrl + 'api/user/roles',
    method: 'get',
    data: {}
  })
}

// 获取个人信息
export function getImformation (id) {
  return request({
    url: baserUrl + 'api/user/' + id,
    method: 'get',
    data: {}
  })
}

// 确认修改个人资料
export function changeImformation (id, JobDto) {
  return request({
    url: baserUrl + 'api/user/' + id,
    method: 'PUT',
    data: JobDto
  })
}

// 确认修改个人资料
export function userChangeInfo (JobDto) {
  return request({
    url: baserUrl + 'api/user/changeInfo',
    method: 'PUT',
    data: JobDto
  })
}

// 退出登录
export function LogOut () {
  return request({
    url: baserUrl + 'api/loginout',
    method: 'get',
    data: {}
  })
}

// 修改密码
export function changePassword (oldPwd, newPwd, rePwd) {
  return request({
    url: baserUrl + 'api/user/changePwd',
    method: 'post',
    params: {
      oldPwd,
      newPwd,
      rePwd
    }
  })
}

// 用户管理列表
export function userList (JobDto) {
  return request({
    'Content-Type': 'application/json',
    url: baserUrl + 'api/user/list',
    method: 'post',
    data: JobDto
  })
}

// 用户管理列表 - 新增用户
export function addUserData (roleIds, JobDto) {
  let url = baserUrl + 'api/user/add'
  if (roleIds !== null) {
    url = url + `?roleIds=` + roleIds
  }
  return request({
    'Content-Type': 'application/json',
    url: url,
    method: 'post',
    data: JobDto
  })
}

// 用户管理列表 - 角色列表
export function roleListData (current, size) {
  return request({
    url: baserUrl + 'api/role/list',
    method: 'get',
    params: {
      current,
      size
    }
  })
}

// 用户管理列表 - 查看用户详情
export function userDetail (id) {
  return request({
    url: baserUrl + 'api/user/' + id,
    method: 'get',
    data: {}
  })
}

// 用户管理列表 - 删除用户
export function userDelete (id) {
  return request({
    url: baserUrl + 'api/user/' + id,
    method: 'delete',
    data: {}
  })
}

// 用户管理列表 - 修改用户
export function userChange (id, roleIds, JobDto) {
  let url = baserUrl + 'api/user/' + id
  if (roleIds !== null) {
    url = url + `?roleIds=` + roleIds
  }
  return request({
    'Content-Type': 'application/json',
    url: url,
    method: 'put',
    data: JobDto
  })
}

// 角色管理列表
export function roleList (data) {
  return request({
    'Content-Type': 'application/json',
    url: baserUrl + 'api/role/list',
    method: 'post',
    data: data
  })
}

// 获取所有用户
export function AllroleList (data) {
  return request({
    url: baserUrl + 'api/user/getAll',
    method: 'get',
    data: data
  })
}

// 角色管理-查询用户
export function getUsersInRole (data) {
  return request({
    url: baserUrl + 'api/user/getUsersInRole',
    method: 'post',
    data: data
  })
}

// 角色管理-添加用户（用户列表）
export function getUsersNotRole (data) {
  return request({
    url: baserUrl + 'api/user/getUsersNotRole',
    method: 'post',
    data: data
  })
}

// 角色管理-添加用户（提交）
export function submitAddUser (roleId, userIds) {
  return request({
    url: baserUrl + 'api/role/user/' + roleId,
    method: 'get',
    params: { userIds }
  })
}

// 删除角色
export function deleteRoleUsers (roleId, userIds) {
  return request({
    url: baserUrl + 'api/role/user/' + roleId,
    method: 'delete',
    params: { userIds }
  })
}

// 角色管理-新增角色
export function addRole (menuIds, menuId, data) {
  return request({
    url: baserUrl + 'api/role/add?' + menuIds + '&' + menuId,
    method: 'post',
    data: data
  })
}
// 角色管理-修改角色
export function editRole (roleId, JobDto) {
  return request({
    url: baserUrl + 'api/role/' + roleId,
    method: 'put',
    data: {
      JobDto
    }
  })
}

// 角色管理-删除角色
export function deleteRole (roleId) {
  let url = baserUrl + 'api/role/del?roleIds=' + roleId
  return request({
    url: url,
    method: 'DELETE',
    data: {}
  })
}

// 角色管理-角色名称-查看
export function roleDetail (roleId) {
  return request({
    url: baserUrl + 'api/role/' + roleId,
    method: 'get',
    data: {}
  })
}

// 角色管理-角色名称-修改
export function changeRoleDetail (roleId, menuIds, JobDto, systemId) {
  let url = 'api/role/' + roleId
  if (menuIds) {
    url = url + `?menuIds=` + menuIds + '&menuId=' + systemId
  } else {
    url = url + '?menuId=' + systemId
  }
  return request({
    url: baserUrl + url,
    method: 'put',
    data: JobDto
  })
}

// 权限管理 -菜单列表
export function menuList (menuId) {
  let url = ''
  if (menuId && menuId.length > 0) {
    url = 'api/menu/list?' + menuId
  } else {
    url = 'api/menu/list'
  }
  return request({
    url: baserUrl + url,
    method: 'get'
  })
}

// 权限管理-删除菜单项
export function deleteMenuItem (id) {
  return request({
    url: baserUrl + 'api/menu/' + id,
    method: 'delete',
    data: {}
  })
}

// 权限管理-修改菜单
export function updateMenuItem (id, Item) {
  return request({
    url: baserUrl + 'api/menu/' + id,
    method: 'put',
    data: Item
  })
}

// 权限管理-增加菜单
export function AddMenuItem (Item) {
  return request({
    url: baserUrl + 'api/menu/add',
    method: 'post',
    data: Item
  })
}

// 权限管理-删除菜单
export function DelMenuItem (menuIds) {
  return request({
    url: baserUrl + 'api/menu/del?menuIds=' + menuIds,
    method: 'delete'
  })
}

// 权限管理-上移下移
export function moveItem (params) {
  return request({
    url: baserUrl + 'api/menu/sort',
    method: 'post',
    data: params
  })
}

// 获取当前登录人的菜单
export function getLoginMenu (userId) {
  return request({
    url: baserUrl + 'api/user/menu/' + userId,
    method: 'get'
  })
}

// 查询系统
export function getMenuSysList () {
  return request({
    url: baserUrl + 'api/menu/sys/list',
    method: 'get'
  })
}

// 高危语句的配置
export function statementConfig (params) {
  return request({
    url: baserUrl + `risk/configHighRisk`,
    method: 'put',
    data: params
  })
}

// 获取部门列表
export function queryDeptList () {
  return request({
    url: baserUrl + 'api/dept/list',
    method: 'get'
  })
}

// 获取部门列表(树状结构)
export function queryDeptTree () {
  return request({
    url: baserUrl + 'api/dept/tree',
    method: 'get'
  })
}

// 新增部门
export function addDept (params) {
  return request({
    url: baserUrl + 'api/dept/add',
    method: 'post',
    data: params
  })
}

// 删除部门
export function deleteDept (deptId) {
  return request({
    url: baserUrl + 'api/dept/' + deptId,
    method: 'delete'
  })
}

// 修改部门信息
export function updateDept (params) {
  return request({
    url: baserUrl + 'api/dept/update',
    method: 'put',
    data: params
  })
}

// 查询部门详细信息
export function queryDept (deptId) {
  return request({
    url: baserUrl + 'api/dept/' + deptId,
    method: 'get'
  })
}

// 查看license详情
export function getLicenseDetail () {
  return request({
    url: baserUrl + 'api/license/Verify',
    method: 'get'
  })
}

// 高危语句列表的查询
export function dataBaseSearch ({ databaseType, statementType }) {
  return request({
    url: baserUrl + `risk/highRisk?databaseType=${databaseType}&statementType=${statementType}`,
    method: 'get'
  })
}
