import request from '@/utils/request'
import { CiBaseUrl } from '../../config'

// CMDB模块
export function ciBaseUrl () {
  return CiBaseUrl
}

// CMDB首页-统计
export function getTopResult () {
  return request({
    url: CiBaseUrl + 'api/topResult',
    method: 'get'
  })
}

// CMDB首页-操作记录
export function getOperationLogList () {
  return request({
    url: CiBaseUrl + 'api/operationLogList',
    method: 'get'
  })
}

// CMDB首页-ci录入统计
export function getCiGroupBydata () {
  return request({
    url: CiBaseUrl + 'api/ciGroupBydatas',
    method: 'get'
  })
}

// CMDB首页-分系统的主机显示
export function getciGroupBySysdata () {
  return request({
    url: CiBaseUrl + 'api/ciGroupBySys',
    method: 'get'
  })
}

// CMDB首页-CI类型配置的CI项
export function getciGroupByCitype () {
  return request({
    url: CiBaseUrl + 'api/ciGroupByCitype',
    method: 'get'
  })
}

// CMDB ci列表-列表数据
export function getCiDataList (JobDto) {
  return request({
    url: CiBaseUrl + 'api/ciitem/page',
    method: 'POST',
    data: JobDto
  })
}

// CMDB ci列表-搜索框的ci类型-一级菜单
export function getCiTypeListFirst (name, templateId) {
  return request({
    url: CiBaseUrl + 'api/cigroup/tablist?name=' + name + '&templateId=' + templateId,
    method: 'GET'
  })
}

// CMDB ci列表-搜索框的ci类型-二级菜单
export function getCiTypeListSend (name, cigroupId) {
  return request({
    url: CiBaseUrl + 'api/citype/list?name=' + name + '&cigroupId=' + cigroupId,
    method: 'GET'
  })
}

// CMDB ci列表-列表数据-查看详情
export function CiDataDetail (ciitemId) {
  return request({
    url: CiBaseUrl + 'api/ciitem/' + ciitemId,
    method: 'GET'
  })
}

// CMDB ci项-查看详情-编辑
export function CiDataEdit (ciitemId, data) {
  return request({
    url: CiBaseUrl + 'api/ciitem/' + ciitemId,
    method: 'PUT',
    data: data
  })
}

// CMDB ci列表-列表数据-删除
export function CiDataDelete (ciitemId) {
  return request({
    url: CiBaseUrl + 'api/ciitem/' + ciitemId,
    method: 'DELETE'
  })
}

// CMDB 删除CI项之前验证是否影响其他数据
export function checkdelCiDelete (ciitemIds) {
  let url = CiBaseUrl + 'api/ciitem/checkdel'
  if (ciitemIds !== null) {
    url = url + `?ciitemIds=` + ciitemIds
  }
  return request({
    url: url,
    method: 'get'
  })
}

// CMDB ci列表-列表数据-批量删除
export function allCiDataDelete (ciitemIds) {
  let url = CiBaseUrl + 'api/ciitem/batchdel'
  if (ciitemIds !== null) {
    url = url + `?ciitemIds=` + ciitemIds
  }
  return request({
    url: url,
    method: 'delete'
  })
}

// 获取CI类型列表
export function getCIList (name, templateId) {
  return request({
    url: CiBaseUrl + 'api/cigroup/tablist?name=' + name + '&templateId=' + templateId,
    method: 'get'
  })
}

// ci类型详情
export function ciTypeDetail (citypeId) {
  return request({
    url: CiBaseUrl + 'api/citype/' + citypeId,
    method: 'get'
  })
}

// ci类型关系的修改
export function editCItypeRelation (data) {
  return request({
    url: CiBaseUrl + 'api/citype/relation',
    method: 'put',
    data: data
  })
}

// 自定义ci类型属性
export function putCItypeDetail (data) {
  return request({
    url: CiBaseUrl + 'api/citype/attribute',
    method: 'put',
    data: data
  })
}

// 新增分类
export function CreateNewType (data) {
  return request({
    url: CiBaseUrl + 'api/cigroup/add',
    method: 'post',
    data: data
  })
}

// 获取ci分类列表
export function getCiTypeList (name, templateId) {
  return request({
    url:
        CiBaseUrl + 'api/cigroup/list?name=' + name + '&templateId=' + templateId,
    method: 'GET'
  })
}

// 获取ci类型列表或者根据ci名称查询ci类型
export function getCiItemList (cigroupId, name, templateId) {
  return request({
    url: CiBaseUrl + 'api/citype/list?name=' + name + '&cigroupId=' + cigroupId + '&templateId=' + templateId,
    method: 'GET',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

// 新增CI类型：
export function createNewCiItem (data) {
  return request({
    url: CiBaseUrl + 'api/citype/add',
    method: 'POST',
    data: data
  })
}

// 获取ci类型详情：
export function viewCiTypeDetail (citypeId) {
  return request({
    url: CiBaseUrl + 'api/citype/' + citypeId,
    method: 'GET'
  })
}

// 修改ci类型详情：
export function updateCiTypeDetail (data, citypeId) {
  return request({
    url: CiBaseUrl + 'api/citype/' + citypeId,
    method: 'PUT',
    data: data
  })
}

// 删除ci类型：
export function deleteCiType (citypeId) {
  return request({
    url: CiBaseUrl + 'api/citype/' + citypeId,
    method: 'DELETE'
  })
}

// ci分类名称检测
export function checkCiName (data) {
  return request({
    url: CiBaseUrl + 'api/cigroup/check?name=' + data,
    method: 'GET'
  })
}

// ci类型名称检测
export function checkCiTyPeName (data) {
  return request({
    url: CiBaseUrl + 'api/citype/check?name=' + data,
    method: 'GET'
  })
}

// ci分类编辑
export function editCi (cigroupId, data) {
  return request({
    url: CiBaseUrl + 'api/cigroup/' + cigroupId,
    method: 'PUT',
    data: data
  })
}

// ci分类删除
export function deleteCi (cigroupId) {
  return request({
    url: CiBaseUrl + 'api/cigroup/' + cigroupId,
    method: 'DELETE'
  })
}

// 查看ci分类详情
export function ciDetail (cigroupId) {
  return request({
    url: CiBaseUrl + 'api/cigroup/' + cigroupId,
    method: 'GET'
  })
}

// 获取ci项
export function getcitype (citypeId) {
  return request({
    url: CiBaseUrl + 'api/citype/' + citypeId,
    method: 'GET'
  })
}

// 创建ci项左边侧拉栏
export function getcigrouptablist (data) {
  return request({
    url: CiBaseUrl + 'api/cigroup/tablist?name=' + data.name + '&templateId=' + data.templateId,
    method: 'GET'
  })
}

// 创建CI -业务组下拉框
export function getcigroupSystablist (name) {
  return request({
    url: CiBaseUrl + 'api/system/tablist?name=' + name,
    method: 'post'
  })
}

// 新增ci项
export function addcitype (data) {
  return request({
    url: CiBaseUrl + 'api/ciitem/add',
    method: 'post',
    data: data
  })
}

// 获取任务列表 - 分页
export function getTaskList (data) {
  return request({
    url: CiBaseUrl + 'api/citask/page',
    method: 'post',
    data: data
  })
}

// 添加任务
export function addTask (data) {
  return request({
    url: CiBaseUrl + 'api/citask/add',
    method: 'post',
    data: data
  })
}

// 修改任务状态
export function changeStatus (citaskId, openStatus) {
  return request({
    url: CiBaseUrl + 'api/citask/status?citaskId=' + citaskId + '&openStatus=' + openStatus,
    method: 'get'
  })
}

// 修改任务
export function editTask (citaskId, data) {
  return request({
    url: CiBaseUrl + 'api/citask/' + citaskId,
    method: 'put',
    data: data
  })
}

// 查看任务详情
export function getTaskDetail (citaskId) {
  return request({
    url: CiBaseUrl + 'api/citask/' + citaskId,
    method: 'get'
  })
}

// 删除任务
export function deleteTask (citaskId) {
  return request({
    url: CiBaseUrl + 'api/citask/' + citaskId,
    method: 'delete'
  })
}

// 应用系统栏环境列表
export function getEnvList (JobDto) {
  return request({
    url: CiBaseUrl + 'api/env/list',
    method: 'post',
    data: JobDto
  })
}

// 应用系统栏环境列表-新增
export function createNewEnv (data) {
  return request({
    url: CiBaseUrl + 'api/env/add',
    method: 'POST',
    data: data
  })
}

// 环境列表-修改
export function envDataEdit (data, environmentId) {
  return request({
    url: CiBaseUrl + 'api/env/update/' + environmentId,
    method: 'put',
    data: data
  })
}

// 应用系统栏环境列表-删除
export function envDataDelete (environmentId) {
  return request({
    url: CiBaseUrl + 'api/env/del/' + environmentId,
    method: 'DELETE'
  })
}

// 应用系统栏环境列表-批量删除
export function allEnvDataDelete (environmentIds) {
  let url = CiBaseUrl + 'api/env/batchdel'
  if (environmentIds !== null) {
    url = url + `?environmentId=` + environmentIds
  }
  return request({
    url: url,
    method: 'delete'
  })
}

// 应用系统栏环境列表详情
export function getenvDataIm (environmentId) {
  return request({
    url: CiBaseUrl + 'api/env/' + environmentId,
    method: 'get'
  })
}

// 新增业务系统
export function getAddSystemList (data) {
  return request({
    url: CiBaseUrl + 'api/system/add',
    method: 'post',
    data: data
  })
}

// 业务系统批量删除
export function allSysDataDelete (systemIDs) {
  let url = CiBaseUrl + 'api/system/batchdel'
  if (systemIDs !== null) {
    url = url + `?systemIDs=` + systemIDs
  }
  return request({
    url: url,
    method: 'delete'
  })
}

// 修改业务系统
export function getEditSystemList (data, systemId) {
  return request({
    url: CiBaseUrl + 'api/system/' + systemId,
    method: 'put',
    data: data
  })
}

// 模板管理-新建分类
export function PostClassify (data) {
  return request({
    url: CiBaseUrl + 'api/tepgroup/add',
    method: 'POST',
    data: data
  })
}

// 模板管理-分类列表
export function GetClassify (name) {
  return request({
    url: CiBaseUrl + 'api/tepgroup/tablist?name=' + name,
    method: 'GET'
  })
}

// 模板管理-修改分类
export function EditClassify (tepgroupId, tepgroup) {
  return request({
    url: CiBaseUrl + 'api/tepgroup/' + tepgroupId,
    method: 'PUT',
    data: tepgroup
  })
}

// 模板管理-删除分类
export function DeleteClassify (tepgroupId) {
  return request({
    url: CiBaseUrl + 'api/tepgroup/' + tepgroupId,
    method: 'DELETE'
  })
}

// 模板管理-新增模板
export function PostTemplate (data) {
  return request({
    url: CiBaseUrl + 'api/template/add',
    method: 'POST',
    data: data
  })
}

// 模板管理-修改模板
export function EditTemplate (templateId, citemplate) {
  return request({
    url: CiBaseUrl + 'api/template/' + templateId,
    method: 'PUT',
    data: citemplate
  })
}

// 模板管理-模板详情
export function templateDetail (templateId) {
  return request({
    url: CiBaseUrl + 'api/template/' + templateId,
    method: 'GET'
  })
}

// 模板管理-模板编辑
export function putTemplateDetail (data) {
  return request({
    url: CiBaseUrl + 'api/template/attribute',
    method: 'put',
    data: data
  })
}

// 凭证-下拉框
export function getVoucherList (name, voucherType) {
  return request({
    url: CiBaseUrl + 'api/voucher/tablist?name=' + name + '&voucherType=' + voucherType,
    method: 'get'
  })
}

// 业务系统列表
export function getSystemList (data) {
  return request({
    url: CiBaseUrl + 'api/system/page',
    method: 'post',
    data: data
  })
}

// 业务系统详情
export function getSystemDetail (systemId) {
  return request({
    url: CiBaseUrl + 'api/system/' + systemId,
    method: 'get'
  })
}

// 删除业务系统
export function getSystemCancle (systemId) {
  return request({
    url: CiBaseUrl + 'api/system/' + systemId,
    method: 'DELETE'
  })
}

// 模板管理-批量删除
export function SaveDeleteMore (templateId) {
  return request({
    url: CiBaseUrl + 'api/template/delBatch?templateIds=' + templateId,
    method: 'DELETE'
  })
}

// 模板管理-删除模板
export function DeleteTemplate (templateId) {
  return request({
    url: CiBaseUrl + 'api/template/' + templateId,
    method: 'DELETE'
  })
}

// 模板管理-模板列表
export function GetTemplateList (name, tepgroupId) {
  return request({
    url: CiBaseUrl + 'api/template/list?name=' + name + '&tepgroupId=' + tepgroupId,
    method: 'GET'
  })
}

// 增加凭证
export function addVoucher (cmdbVoucher) {
  return request({
    url: CiBaseUrl + 'api/voucher/add',
    method: 'post',
    data: cmdbVoucher
  })
}

// 修改凭证
export function updateVoucher (cmdbVoucher, voucherId) {
  return request({
    url: CiBaseUrl + 'api/voucher/' + voucherId,
    method: 'put',
    data: cmdbVoucher
  })
}

// 通过id查询凭证
export function seeVoucher (voucherId) {
  return request({
    url: CiBaseUrl + 'api/voucher/' + voucherId,
    method: 'get'
  })
}

// 删除凭证
export function deleteVoucher (VoucherId) {
  return request({
    url: CiBaseUrl + 'api/voucher/' + VoucherId,
    method: 'DELETE'
  })
}

// 批量删除
export function deleteVoucherlist (voucherId) {
  return request({
    url: CiBaseUrl + 'api/voucher/batchdel/?voucherId=' + voucherId,
    method: 'DELETE'
  })
}

// 凭证列表
export function voucherList (data) {
  return request({
    url: CiBaseUrl + 'api/voucher/page',
    method: 'post',
    data: data
  })
}

// 获取关系列表
export function getrelationlist (data) {
  return request({
    url: CiBaseUrl + 'api/relation/list',
    method: 'post',
    data: data
  })
}

// 获取全部关系图
export function getAllRelation (data) {
  return request({
    url: CiBaseUrl + 'api/ciitem/relations',
    method: 'post',
    data: data
  })
}

// 新增CI关系
export function addrelation (cirelation) {
  return request({
    url: CiBaseUrl + 'api/relation/add',
    method: 'post',
    data: cirelation
  })
}

// 获取ci类型列表
export function getCiTList (data) {
  return request({
    url: CiBaseUrl + 'api/citype/list?name=' + data.name + '&templateId=' + data.templateId + '&cigroupId=' + data.cigroupId,
    method: 'GET'
  })
}

// 删除CI关系
export function deletRelation (cirelationId) {
  return request({
    url: CiBaseUrl + 'api/relation/' + cirelationId,
    method: 'DELETE'
  })
}

// 查看CI详情
export function viewRelation (cirelationId) {
  return request({
    url: CiBaseUrl + 'api/relation/' + cirelationId,
    method: 'get'
  })
}

// 批量删除
export function dellistRelation (delvoucheridlist) {
  return request({
    url: CiBaseUrl + 'api/relation/batchdel/?relationIds=' + delvoucheridlist,
    method: 'DELETE'
  })
}

// 修改CI关系
export function setlistRelation (data, relationId) {
  return request({
    url: CiBaseUrl + 'api/relation/' + relationId,
    method: 'put',
    data: data
  })
}

// 获取环境下拉列表
export function envtablist (data) {
  return request({
    url: CiBaseUrl + 'api/env/tablist',
    method: 'post',
    data: data
  })
}

// 下载Excel模板
export function getexcelmodel (citypeId) {
  return request({
    url: CiBaseUrl + 'file/ciitem/excelmodel?citypeId=' + citypeId,
    method: 'get'
  })
}

// 获取上下层CI列表
export function getciListArr (citypeId, tag) {
  return request({
    url: CiBaseUrl + 'api/ciitem/getCiitem?citypeId=' + citypeId + '&tag=' + tag,
    method: 'get'
  })
}

// 删除验证接口,验证将影响
export function delCIRelation (relationIdsList) {
  return request({
    url: CiBaseUrl + 'api/relation/checkdel?relationIds=' + relationIdsList,
    method: 'DELETE'
  })
}

// 根据CI类型查询CI项
export function queryCitypeToCiitem (data) {
  return request({
    url: CiBaseUrl + 'api/ciitem/list',
    method: 'post',
    data: data
  })
}

// 大图CI的位置修改
export function changeLocation (ciitemId, data) {
  return request({
    url: CiBaseUrl + 'api/ciitem/' + ciitemId + '/top',
    method: 'put',
    data: data
  })
}

// 获取系统列表
export function getCiSystemList (params) {
  return request({
    url: CiBaseUrl + 'api/ciitem/host',
    method: 'post',
    data: params
  })
}

// 根据业务系统id获取链路拓扑数据
export function getTopologyInfoBySystemId (id) {
  return request({
    url: CiBaseUrl + 'api/topology?systemId=' + id,
    method: 'get'
  })
}

// 业务系统拓扑图获取业务系统
export function getTopologySystems () {
  return request({
    url: CiBaseUrl + 'api/system/topology',
    method: 'post'
  })
}

// 新增修改黑名单
export function updateBlackList (data) {
  return request({
    url: CiBaseUrl + 'api/system/blackList',
    method: 'put',
    data
  })
}

// 获取CI项黑名单列表
export function getCIBlackList (citypeId) {
  return request({
    url: CiBaseUrl + 'api/blankCiitemList?citypeId=' + citypeId,
    method: 'get'
  })
}
