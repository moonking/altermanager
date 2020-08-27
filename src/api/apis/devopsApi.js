import request from '@/utils/request'
import { devopsUrl } from '../../config'

// 自动化运维模块
export function DevopsUrl () {
  return devopsUrl
}

// 查询所有脚本
export function devallsrcipt (data) {
  if (!data.toolname) {
    data.toolname = 'null'
  }
  if (!data.toolId) {
    data.toolId = 'null'
  }
  return request({
    url: devopsUrl + 'api/tool/find/' + data.toolname + '/' + data.toolId,
    method: 'get'
  })
}

// 删除参数
export function deleteParamsOps (paramId) {
  return request({
    url: devopsUrl + 'api/toolParam/' + paramId,
    method: 'delete'
  })
}

// 资源管理列表
export function resourceListData (data) {
  return request({
    url: devopsUrl + 'api/maResourse/list',
    method: 'post',
    data: data
  })
}

// 新增资源管理
export function addResource (data) {
  return request({
    url: devopsUrl + 'api/maResourse/add',
    method: 'post',
    data: data
  })
}

// 资源管理详情
export function getResDetail (resourcesId) {
  return request({
    url: devopsUrl + 'api/maResourse/' + resourcesId,
    method: 'get'
  })
}

// 修改资源管理信息
export function updateresource (data) {
  return request({
    url: devopsUrl + 'api/maResourse/update',
    method: 'put',
    data: data
  })
}

// 删除当条资源
export function deleteresource (resourcesId) {
  return request({
    url: devopsUrl + 'api/maResourse/' + resourcesId,
    method: 'DELETE'
  })
}

// 获取工具集列表api
export function maToolslist () {
  return request({
    url: devopsUrl + 'api/maTools/list',
    method: 'get'
  })
}

// 分页查询流水线
export function pagepipeline (data) {
  return request({
    url: devopsUrl + 'api/pipeline/getPage',
    method: 'post',
    data: data
  })
}

// 新增流水线
export function createpipeline (data) {
  return request({
    url: devopsUrl + 'api/pipeline/create',
    method: 'post',
    data: data
  })
}

// 新增流水线
export function updatepipeline (data) {
  return request({
    url: devopsUrl + 'api/pipeline/update',
    method: 'put',
    data: data
  })
}

// 流水线详情
export function detailpipeline (pipelineId) {
  return request({
    url: devopsUrl + 'api/pipeline/' + pipelineId,
    method: 'get'
  })
}

// 删除当前流水线
export function deletepipeline (pipelineId) {
  return request({
    url: devopsUrl + 'api/pipeline/' + pipelineId,
    method: 'DELETE'
  })
}

// 新增公共模板
export function createpipelineTemp (data) {
  return request({
    url: devopsUrl + 'api/pipelineTemp/create',
    method: 'post',
    data: data
  })
}

// 分页查询公共模板
export function getPagepipelineTemp (data) {
  return request({
    url: devopsUrl + 'api/pipelineTemp/getPage',
    method: 'post',
    data: data
  })
}

// 修改公共模板
export function updatepipelineTemp (data) {
  return request({
    url: devopsUrl + 'api/pipelineTemp/update',
    method: 'put',
    data: data
  })
}

// 公共模块详情
export function deatilpipelineTemp (tempId) {
  return request({
    url: devopsUrl + 'api/pipelineTemp/' + tempId,
    method: 'get'
  })
}

// 删除当前公共模板
export function deletepipelineTemp (tempId) {
  return request({
    url: devopsUrl + 'api/pipelineTemp/' + tempId,
    method: 'DELETE'
  })
}

// 添加运维工单
export function addWorkOrder (data) {
  return request({
    url: devopsUrl + 'api/devopsJob/create',
    method: 'post',
    data: data
  })
}

// 获取运维工单
export function getWorkOrder (id) {
  return request({
    url: devopsUrl + 'api/devopsJob/' + id,
    method: 'get'
  })
}

// 获取运维工单
export function updateWorkOrder (data) {
  return request({
    url: devopsUrl + 'api/devopsJob/update',
    method: 'put',
    data: data
  })
}

// 删除运维工单
export function deleteWorkOrder (id) {
  return request({
    url: devopsUrl + 'api/devopsJob/' + id,
    method: 'delete'
  })
}

// 获取运维工单列表
export function getWorkOrderList (data) {
  return request({
    url: devopsUrl + 'api/devopsJob/getPage',
    method: 'post',
    data: data
  })
}

// devops--添加功能分类
export function OpsAddNewType (data) {
  return request({
    url: devopsUrl + 'api/greouptag/createFuction',
    method: 'post',
    data: data
  })
}

// devops--查询所有功能分类
export function OpsAllType () {
  return request({
    url: devopsUrl + 'api/tools/findFunction',
    method: 'get'
  })
}

// devops--修改功能分类或者标签
export function OpsEditTypeOrTag (data) {
  return request({
    url: devopsUrl + 'api/grouptag/update',
    method: 'put',
    data: data
  })
}

// 查询脚本
export function OpsScriptListById (data) {
  return request({
    url: devopsUrl + 'api/grouptagFind',
    method: 'post',
    data: data
  })
}

// devops--删除脚本
export function OpsDeleteTools (toolId) {
  return request({
    url: devopsUrl + 'api/tool/' + toolId,
    method: 'delete'
  })
}

// 修改记录
export function opsEditLogs (logId) {
  return request({
    url: devopsUrl + 'api/toolUpdateLog/' + logId,
    method: 'get'
  })
}

// devops--查询标签
export function OpsTagsList () {
  return request({
    url: devopsUrl + 'api/tools/findLabel',
    method: 'get'
  })
}

// devops--脚本审批
export function OpsScriptApprove (data) {
  return request({
    url: devopsUrl + 'api/tool/approve',
    method: 'post',
    data: data
  })
}

// devops--查询条件查询
export function OpsFindByCondition (data) {
  return request({
    url: devopsUrl + 'api/tool/list',
    method: 'post',
    data: data
  })
}

// devops--获取脚本总数和可执行数
export function OpsGetAllNumForTool () {
  return request({
    url: devopsUrl + 'api/toolCount',
    method: 'get'
  })
}

// devops--删除分类
export function OpsDeleteType (grouptagId) {
  return request({
    url: devopsUrl + 'api/grouptag/' + grouptagId,
    method: 'delete'
  })
}

// devops--脚本详情
export function OpsToolDetail (fileId) {
  return request({
    url: devopsUrl + 'api/tool/' + fileId,
    method: 'get'
  })
}

// 获取审批日志
export function opsGetToolLog (toolId) {
  return request({
    url: devopsUrl + 'api/updateLogToolId/' + toolId,
    method: 'get'
  })
}

// devops--修改记录
export function OpsEditLogs (logId) {
  return request({
    url: devopsUrl + 'api/toolUpdateLog/' + logId,
    method: 'get'
  })
}

// devops--查询测试节点
export function OpsTestNode () {
  return request({
    url: devopsUrl + 'api/maResourse/dropBox',
    method: 'get'
  })
}

// devops--添加脚本
export function OpsAddNewScript (data) {
  return request({
    url: devopsUrl + 'api/tool/createTool',
    method: 'post',
    data: data
  })
}

// devops--新增标签
export function OpsScriptTag (data) {
  return request({
    url: devopsUrl + 'api/greouptag/createThelabel',
    method: 'post',
    data: data
  })
}

// devops--删除标签
export function OpsDeleteTag (grouptagId, state) {
  return request({
    url: devopsUrl + 'api/grouptag/' + grouptagId + '/' + state,
    method: 'delete'
  })
}

// devops--修改标签
export function OpsEditTag (data) {
  return request({
    url: devopsUrl + 'api/grouptag/update',
    method: 'put',
    data: data
  })
}

// devops--修改脚本及脚本参数
export function OpsUpdateParams (data) {
  return request({
    url: devopsUrl + 'api/tool/update',
    method: 'put',
    data: data
  })
}

// devops--工具集列表
export function OpsToolkitList () {
  return request({
    url: devopsUrl + 'api/maTools/list',
    method: 'get'
  })
}

// devops--保存工具集配置
export function SaveToolkitConfig (data) {
  return request({
    url: devopsUrl + 'api/maTools/add',
    method: 'post',
    data: data
  })
}

// devops--工具集内列表查询
export function ToolkitDetail (data) {
  return request({
    url: devopsUrl + 'api/maTools/MaToolsDetial',
    method: 'post',
    data: data
  })
}

// 工具集内的状态判断
export function ToolkitStatus (data) {
  return request({
    url: devopsUrl + 'api/maTools/check',
    method: 'post',
    data: data
  })
}

// devops--发起审批
export function OpsAuditLogaAdd (data) {
  return request({
    url: devopsUrl + 'api/auditLog/add',
    method: 'post',
    data: data
  })
}

// 查看业务审批情况
export function opsGetAuditLogDetail (data) {
  return request({
    url: devopsUrl + 'api/auditLog/detial',
    method: 'post',
    data: data
  })
}

// 更新审批状态
export function opsGetAuditLogUpdate (data) {
  return request({
    url: devopsUrl + 'api/auditLog/update',
    method: 'post',
    data: data
  })
}

// 获取我的审批列表
export function devAuditLogList (data) {
  return request({
    url: devopsUrl + 'api/auditLog/list',
    method: 'post',
    data: data
  })
}

// 审批撤回
export function devRecallAuditLog (data) {
  return request({
    url: devopsUrl + 'api/auditLog/cancel',
    method: 'post',
    data: data
  })
}

// 查看业务审批情况
export function devAuditLogDetail (data) {
  return request({
    url: devopsUrl + 'api/auditLog/detial',
    method: 'post',
    data: data
  })
}

// 更新审批状态
export function devAuditLogUpdate (data) {
  return request({
    url: devopsUrl + 'api/auditLog/update',
    method: 'post',
    data: data
  })
}

//  查询待执行工单
export function waitForExecute (data) {
  return request({
    url: devopsUrl + 'api/workPage/workJops',
    method: 'post',
    data: data
  })
}

// 资源统计
export function sourceTotal () {
  return request({
    url: devopsUrl + 'api/workPage/maResourseCount',
    method: 'get'
  })
}

// 工作量统计
export function workTotal (data) {
  return request({
    url: devopsUrl + 'api/workPage/myWorkCount/?days=' + data.days,
    method: 'post',
    data: data
  })
}

// 我的工作台健康检查统计
export function healthyTotal (data) {
  return request({
    url: devopsUrl + 'api/workPage/healthCheck/' + data,
    method: 'get'
  })
}

// 脚本详情
export function devopstoolDetail (fileId) {
  return request({
    url: devopsUrl + 'api/tool/' + fileId,
    method: 'get'
  })
}

// 操作流水线执行日志
export function getpipelineLogList (data) {
  return request({
    url: devopsUrl + 'api/pipelineLog/getPage',
    method: 'post',
    data: data
  })
}
// 操作流水线执行日志详情
export function getpipelineLogDetail (logId, type) {
  return request({
    url: devopsUrl + 'api/pipelineLog/' + logId + '/' + type,
    method: 'get'
  })
}

// 工单执行日志列表
export function getLogList (data) {
  return request({
    url: devopsUrl + 'api/devopsJobLog/getPage',
    method: 'post',
    data: data
  })
}

// 工单执行日志的详情
export function getLogDetail (logId) {
  return request({
    url: devopsUrl + 'api/devopsJobLog/' + logId,
    method: 'get'
  })
}

// 工单执行日志的详情
export function processupdate (data) {
  return request({
    url: devopsUrl + 'api/process/update',
    method: 'put',
    data: data
  })
}

// 执行流水线
export function executeWorkflow (data) {
  return request({
    url: devopsUrl + 'api/process/start',
    method: 'post',
    data: data
  })
}

// 终止执行流水线
export function stopExecuteWorkflow (procInsId) {
  return request({
    url: devopsUrl + 'api/process/stop?procInsId=' + procInsId,
    method: 'get'
  })
}

// 流程图中选择脚本后的版本记录
export function scriptVersionLog (data) {
  return request({
    url: devopsUrl + '/api/toolVersionLog',
    method: 'put',
    data: data
  })
}

// 执行流水线
export function getCanTools (data) {
  return request({
    url: devopsUrl + 'api/maResourse/getCanTools',
    method: 'post',
    data: data
  })
}

// 健康管理-新增规则
export function healthyRule (data) {
  return request({
    url: devopsUrl + 'api/healthCheck/add',
    method: 'post',
    data: data
  })
}

// 健康管理-查看规则
export function getHealthyRule (data) {
  return request({
    url: devopsUrl + `api/healthCheck/${data}`,
    method: 'get',
    data: data
  })
}

// 健康管理-查看资源统计
export function healthySourceTotal () {
  return request({
    url: devopsUrl + 'api/healthCheck/countHealth',
    method: 'get'
  })
}

// 健康管理-健康检查报告
export function healthyReport (data) {
  return request({
    url: devopsUrl + 'api/healthCheck/getHealthDetail',
    method: 'post',
    data: data
  })
}

// 健康管理-立即检查
export function checkImmediately (data) {
  return request({
    url: devopsUrl + 'api/healthCheck/runCheck/' + data,
    method: 'get'
  })
}

// 健康管理-是否开启
export function healthyIsUp (data) {
  return request({
    url: devopsUrl + 'api/healthCheck/onOff',
    method: 'post',
    data: data
  })
}

// 终止任务执行
export function stopExecuting (procInsId) {
  return request({
    url: devopsUrl + '/flow/process/stop?procInsId=' + procInsId,
    method: 'get'
  })
}

// 流水线执行日志查看
export function downloadLogInfo (data) {
  return request({
    url: devopsUrl + 'api/downloadLogInfo?businessId=' + data.businessId + '&businessType=' + data.businessType,
    method: 'get'
  })
}
