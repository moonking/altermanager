import request from '@/utils/request'
import { baserUrl } from '../../config'
import qs from 'qs'
// Aibms模块
export function baseurl () {
  return baserUrl
}

// 短信查看接口
export function smsDetail () {
  return request({
    url: baserUrl + 'api/smsDetail',
    method: 'get'
  })
}

// 短信第一次保存
export function FirstSmsSave (data) {
  return request({
    url: baserUrl + 'api/smsSave',
    method: 'post',
    data: data
  })
}

// 短信保存
export function smsSave (data) {
  return request({
    url: baserUrl + 'api/smsSave',
    method: 'put',
    data: data
  })
}

// 短信测试接口
export function testSms (data) {
  return request({
    url: baserUrl + 'api/dingDingSend',
    method: 'post',
    data: data
  })
}

// 邮箱详情
export function emailConfig (data) {
  return request({
    url: baserUrl + 'api/emailConfig',
    method: 'get'
  })
}

// 邮箱保存
export function saveEmailConfig (data) {
  return request({
    url: baserUrl + 'api/saveEmailConfig',
    method: 'post',
    data: data
  })
}

// 测试邮箱
export function testEmailConfig (data) {
  return request({
    url: baserUrl + 'api/testEmailConfig',
    method: 'post',
    data: data
  })
}

// 获取监控来源列表
export function getMonitorList (params) {
  return request({
    url: baserUrl + 'aia/alert/source/list',
    method: 'post',
    data: params
  })
}
// 删除监控来源
export function deleteMonitor (id) {
  return request({
    url: baserUrl + 'aia/alert/source/' + id,
    method: 'DELETE'
  })
}
// 查询监控来源详情
export function getMonitorDetail (id) {
  return request({
    url: baserUrl + 'aia/alert/source/' + id,
    method: 'GET'
  })
}
// 新增监控来源
export function addMonitor (params) {
  return request({
    url: baserUrl + 'aia/alert/source/',
    method: 'post',
    data: params
  })
}
// 编辑监控来源
export function editMonitor (params) {
  return request({
    url: baserUrl + 'aia/alert/source/',
    method: 'put',
    data: params
  })
}
// 获取接口信息详情
export function checkInterFace (params) {
  return request({
    url: baserUrl + 'aia/alert/source/test',
    method: 'POST',
    data: params
  })
}
// 交易列表查询
export function traceList (params) {
  return request({
    url: baserUrl + 'api/traceList',
    method: 'POST',
    data: params
  })
}
//  获取联想输入信息
export function geAlarmNameList () {
  return request({
    url: baserUrl + 'aia/alert/category/nameList',
    method: 'GET'
  })
}
//  获取告警分类列表
export function getAlarmList (params) {
  return request({
    url: baserUrl + 'aia/alert/category/list',
    method: 'POST',
    data: params
  })
}
// 交易详情
export function traceDetails (id) {
  return request({
    url: baserUrl + 'api/traceDetail/' + id,
    method: 'get'
  })
}
// 告警规则列表
export function alarmRuleList (params) {
  return request({
    url: baserUrl + 'aia/alert/rule/list',
    method: 'POST',
    data: params
  })
}
// 新增告警分类
export function addAlarm (params) {
  return request({
    url: baserUrl + 'aia/alert/category/save',
    method: 'POST',
    data: params
  })
}
// 告警规则开启/关闭规则
export function alarmRuleEnabled (params) {
  return request({
    url: baserUrl + 'aia/alert/rule/enabled?ID=' + params.ID + '&enabledState=' + params.enabledState,
    method: 'put',
    data: params
  })
}
// 新增告警规则
export function alarmRuleSave (params) {
  return request({
    url: baserUrl + 'aia/alert/rule/save',
    method: 'POST',
    data: params
  })
}
// 删除告警规则
export function alarmRuleDelete (id) {
  return request({
    url: baserUrl + 'aia/alert/rule/delete/' + id,
    method: 'DELETE'
  })
}
// 编辑告警规则
export function alarmRuleUpdate (params) {
  return request({
    url: baserUrl + 'aia/alert/rule/update',
    method: 'put',
    data: params
  })
}
// 告警规则详情
export function alarmRuleDetails (id) {
  return request({
    url: baserUrl + 'aia/alert/rule/detail/' + id,
    method: 'get'
  })
}
// 删除告警分类
export function deleteAlarm (id) {
  return request({
    url: baserUrl + 'aia/alert/category/delete/' + id,
    method: 'DELETE'
  })
}
// 编辑告警分类
export function editAlarm (params) {
  return request({
    url: baserUrl + 'aia/alert/category/update',
    method: 'put',
    data: params
  })
}
// 查询告警分类详情
export function getAlarmDetail (id) {
  return request({
    url: baserUrl + 'aia/alert/category/detail/' + id,
    method: 'GET'
  })
}
// 获取告警通知列表
export function getNoticeList (params) {
  return request({
    url: baserUrl + 'api/alarmInform/list',
    method: 'POST',
    data: params
  })
}
// 查询告警通知详情
export function getNoticeDetail (code) {
  return request({
    url: baserUrl + 'api/alarmInform/detail/' + code,
    method: 'GET'
  })
}
// 修改通知状态
export function editNoticeStatus (params) {
  return request({
    url: baserUrl + 'api/alarmInform/updateStatus',
    method: 'put',
    type: 'change',
    data: qs.stringify(params)
  })
}
// 告警通知业务下拉框数据
export function getsystemList () {
  return request({
    url: baserUrl + 'api/alarmInform/systems',
    method: 'GET'
  })
}
export function getTopologyList () {
  return request({
    url: baserUrl + 'api/alarmInform/topologys',
    method: 'GET'
  })
}
export function getlabelList () {
  return request({
    url: baserUrl + 'api/alarmInform/labels',
    method: 'GET'
  })
}
// 交易追踪列表页下拉框数据
export function getTraceSystemList () {
  return request({
    url: baserUrl + 'api/trace/systems',
    method: 'GET'
  })
}
export function getTraceTypeList () {
  return request({
    url: baserUrl + 'api/trace/types',
    method: 'GET'
  })
}
//  获取告警升级列表
export function getUpgradeList (params) {
  return request({
    url: baserUrl + 'aia/alert/upgrade/list',
    method: 'post',
    data: params
  })
}
// 获取告警升级详情
export function getUpgradeDetail (id) {
  return request({
    url: baserUrl + 'aia/alert/upgrade/details/' + id,
    method: 'get'
  })
}
// 删除告警升级
export function deleteUpgrade (id) {
  return request({
    url: baserUrl + 'aia/alert/upgrade/delete/' + id,
    method: 'DELETE'
  })
}
// 新增告警升级
export function addUpgrade (params) {
  return request({
    url: baserUrl + 'aia/alert/upgrade/add',
    method: 'POST',
    data: params
  })
}
// 编辑告警升级
export function editUpgrade (params) {
  return request({
    url: baserUrl + 'aia/alert/upgrade/update',
    method: 'put',
    data: params
  })
}
// 新增告警升级状态下告警分类列表
export function getAddUpgradeSort (params) {
  return request({
    url: baserUrl + 'aia/alert/category/list',
    method: 'post',
    data: params
  })
}

// 编辑告警升级状态下告警分类列表
export function getUpgradeSort (params) {
  return request({
    url: baserUrl + 'aia/alert/upgrade/sort/list',
    method: 'post',
    data: params
  })
}
// 获取维护窗口列表
export function getMaintenanceList (params) {
  return request({
    url: baserUrl + 'aia/alert/ops/list',
    method: 'post',
    data: params
  })
}
// 开启/关闭维护窗口
export function editMaintenance (params) {
  return request({
    url: baserUrl + 'aia/alert/ops/updateStatus',
    method: 'put',
    type: 'change',
    data: qs.stringify(params)
  })
}
// 新增维护窗口
export function addMaintenance (params) {
  return request({
    url: baserUrl + 'aia/alert/ops/add',
    method: 'POST',
    data: params
  })
}
// 编辑维护窗口
export function updateMaintenance (params) {
  return request({
    url: baserUrl + 'aia/alert/ops/update',
    method: 'POST',
    data: params
  })
}
// 删除维护窗口
export function deleteMaintenance (id) {
  return request({
    url: baserUrl + 'aia/alert/ops/delete/' + id,
    method: 'DELETE'
  })
}
// 获取维护窗口详情
export function getMaintenanceDetail (id) {
  return request({
    url: baserUrl + 'aia/alert/ops/details/' + id,
    method: 'get'
  })
}

// 获取定时任务列表
export function getTimingList (params) {
  return request({
    url: baserUrl + 'quartzJob/list',
    method: 'POST',
    data: params
  })
}

// 新增定时任务
export function addTimingTask (params) {
  return request({
    url: baserUrl + 'quartzJob/save',
    method: 'POST',
    data: params
  })
}

// 新增定时任务
export function updateTimingTask (params) {
  return request({
    url: baserUrl + 'quartzJob/update',
    method: 'PUT',
    data: params
  })
}

// 删除定时任务
export function deleteTimingTask (id) {
  return request({
    url: baserUrl + 'quartzJob/delete/' + id,
    method: 'DELETE'
  })
}

// 获取定时任务详情
export function getTimingTaskDetail (id) {
  return request({
    url: baserUrl + 'quartzJob/detail/' + id,
    method: 'GET'
  })
}
