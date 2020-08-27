import request from '@/utils/request'
import { deliveryUrl } from '../../config'

// delivery模块
export function deliveryurl () {
  return deliveryUrl
}

// 获取我的审批列表
export function getAuditLogList (data) {
  return request({
    url: deliveryUrl + 'api/auditLog/list',
    method: 'post',
    data: data
  })
}

// 审批撤回
export function recallAuditLog (data) {
  return request({
    url: deliveryUrl + 'api/auditLog/cancel',
    method: 'post',
    data: data
  })
}

// 查看业务审批情况
export function getAuditLogDetail (data) {
  return request({
    url: deliveryUrl + 'api/auditLog/detial',
    method: 'post',
    data: data
  })
}

// 更新审批状态
export function getAuditLogUpdate (data) {
  return request({
    url: deliveryUrl + 'api/auditLog/update',
    method: 'post',
    data: data
  })
}

// 工作流API
export function getXml (xmlDetialData) {
  return request({
    url: deliveryUrl + 'api/act/getXml?xmlDetial=',
    method: 'post',
    data: { xmlDetial: xmlDetialData }
  })
}

// 脚本添加
export function addScript (data) {
  return request({
    url: deliveryUrl + 'api/ssh/file',
    method: 'post',
    data: data
  })
}

// 脚本查询
export function selectScript (data) {
  return request({
    url: `${deliveryUrl}api/ssh/likefile`,
    method: 'post',
    data: data
  })
}

// 删除脚本
export function deleteScript (fileId) {
  return request({
    url: `${deliveryUrl}api/ssh/file/${fileId}`,
    method: 'delete'
  })
}

// 查看脚本详情
export function scriptDetail (fileId) {
  return request({
    url: `${deliveryUrl}api/sshfile/${fileId}`,
    method: 'get'
  })
}

// 修改脚本
export function updateScript (data) {
  return request({
    url: `${deliveryUrl}api/ssh/file/update`,
    method: 'put',
    data: data
  })
}

// 获取测试节点列表
export function nodeListTab (name, systemId) {
  return request({
    url: deliveryUrl + 'api/sshNode/tablistdev?name' + name + '&&systemId=' + systemId,
    method: 'get'
  })
}

// 生产节点下拉框
export function nodeListprod (name, systemId) {
  return request({
    url: deliveryUrl + 'api/sshNode/tablistprod?name' + name + '&&systemId=' + systemId,
    method: 'get'
  })
}

// 查询节点
export function searchNode (data) {
  return request({
    url: deliveryUrl + 'api/sshNode/view',
    method: 'post',
    data: data
  })
}

// 删除节点
export function deleteNode (nodeId) {
  return request({
    url: deliveryUrl + 'api/sshNode/' + nodeId,
    method: 'delete'
  })
}

// 新增节点
export function addNode (data) {
  return request({
    url: deliveryUrl + 'api/sshNode/add-update',
    method: 'post',
    data: data
  })
}

// 编辑节点
export function editNode (data) {
  return request({
    url: deliveryUrl + 'api/sshNode/update',
    method: 'post',
    data: data
  })
}

// 部署方案列表
export function deployPlanList (data) {
  return request({
    url: `${deliveryUrl}api/plan/list`,
    method: 'post',
    data: data
  })
}

// 查询回退列表信息
export function backspaceList (data) {
  return request({
    url: deliveryUrl + 'api/regretPlan/list',
    method: 'post',
    data: data
  })
}

// 新增回退方案
export function addBackspace (data) {
  return request({
    url: deliveryUrl + 'api/regretPlan/add',
    method: 'post',
    data: data
  })
}

// 查看回退详情
export function seeBackspacedetail (regretId) {
  return request({
    url: deliveryUrl + 'api/regretPlan/' + regretId,
    method: 'get'
  })
}

// 修改回退方案
export function modifyBackspace (data) {
  return request({
    url: deliveryUrl + 'api/regretPlan/update',
    method: 'post',
    data: data
  })
}

// 删除回退方案
export function deleteBackspace (regretId) {
  return request({
    url: deliveryUrl + 'api/regretPlan/' + regretId,
    method: 'delete'
  })
}

// 新增部署方案
export function addDeployPlan (data) {
  return request({
    url: `${deliveryUrl}api/plan/add`,
    method: 'post',
    data: data
  })
}

// 部署方案详情
export function deployPlanDetail (planId) {
  return request({
    url: `${deliveryUrl}api/plan/${planId}`,
    method: 'get'
  })
}

// 修改部署方案
export function editDeployPlan (data) {
  return request({
    url: `${deliveryUrl}api/plan/update`,
    method: 'post',
    data: data
  })
}

// 删除部署方案
export function deleteDeployPlan (planId) {
  return request({
    url: `${deliveryUrl}api/plan/${planId}`,
    method: 'delete'
  })
}

// 备份管理——新增
export function addBackPLan (data) {
  return request({
    url: deliveryUrl + 'api/backPlan/add',
    method: 'post',
    data: data
  })
}

// 备份管理——列表-详情
export function backupDetail (backPlanId) {
  return request({
    url: deliveryUrl + 'api/backPlan/' + backPlanId,
    method: 'get'
  })
}
// 备份管理——列表-删除

export function backupDelete (backPlanId) {
  return request({
    url: deliveryUrl + 'api/backPlan/' + backPlanId,
    method: 'delete'
  })
}
// 备份管理——列表-修改详情

export function backupEdit (data, backPlanId) {
  return request({
    url: deliveryUrl + 'api/backPlan/' + backPlanId,
    method: 'put',
    data: data
  })
}
// 方案列表信息
export function Planlist (data) {
  return request({
    url: deliveryUrl + 'api/plan/list',
    method: 'post',
    data: data
  })
}

// 拉取节点列表
export function Nodelist (data) {
  return request({
    url: deliveryUrl + 'api/sshNode/view',
    method: 'post',
    data: data
  })
}

// 根据系统名称搜索部署任务
export function searchDeploytask (data, systemId) {
  return request({
    url: `${deliveryUrl}/api/job/joblike/${systemId}`,
    method: 'post',
    data: data
  })
}

// 根据方案创建任务
export function Addtasklist (data) {
  return request({
    url: deliveryUrl + 'api/job/createByPlan',
    method: 'post',
    data: data
  })
}

// 查询一个系统信息详情
export function systemDetail (data) {
  return request({
    url: deliveryUrl + 'api/sys/' + data.systemId + '?size=' + data.size + '&current=' + data.current,
    method: 'get',
    data: data
  })
}

// 查询任务详情
export function jobdetail (jobId) {
  return request({
    url: deliveryUrl + 'api/job/' + jobId,
    method: 'get'
  })
}

// 删除任务
export function deljob (jobId) {
  return request({
    url: deliveryUrl + 'api/job/task/' + jobId,
    method: 'DELETE'
  })
}

// 任务修改
export function setjob (jobId, data) {
  return request({
    url: deliveryUrl + 'api/job/pipeline/' + jobId,
    method: 'put',
    data: data
  })
}

// 构建是否完成
export function isFinished (jobName) {
  return request({
    url: deliveryUrl + 'api/job/isFinished?jobName=' + jobName,
    method: 'get'
  })
}

// 查看执行日志
export function getJobLog (data) {
  return request({
    url: deliveryUrl + 'api/job/stages?jobName=' + data.jobName + '&jobNumber=' + data.jobNumber,
    method: 'get'
  })
}

// 获取构建历史信息
export function getHistoryLog (jobName) {
  return request({
    url: deliveryUrl + 'api/job/getHistoryLog?jobName=' + jobName,
    method: 'get'
  })
}

// 根据系统名称，查询系统列表信息（包含进入部署任务）
export function getsyslist (datetype, systemIds, issaerch) {
  return request({
    url: deliveryUrl + 'api/sys/list?datetype=' + datetype + '&systemIds=' + systemIds + '&issaerch=' + issaerch,
    method: 'get'
  })
}

// 分页查询一个系统信息的任务
export function findBypage (data) {
  return request({
    url: deliveryUrl + 'api/sys/findBypage',
    method: 'post',
    data: data
  })
}

// 拉取脚本信息
export function getJobTaskBuiled (jobId) {
  return request({
    url: deliveryUrl + 'api/job/getJobTaskBuiled?jobId=' + jobId,
    method: 'get'
  })
}

// 添加脚本
export function addNewScript (data) {
  return request({
    url: deliveryUrl + 'api/tool/createTool',
    method: 'post',
    data: data
  })
}

// 添加功能分类
export function addNewType (data) {
  return request({
    url: deliveryUrl + 'api/greouptag/createFuction',
    method: 'post',
    data: data
  })
}

// 脚本详情
export function toolDetail (fileId) {
  return request({
    url: deliveryUrl + 'api/tool/' + fileId,
    method: 'get'
  })
}

// 脚本参数
export function setToolParams (data) {
  return request({
    url: deliveryUrl + 'api/toolsparam/create',
    method: 'post',
    data: data
  })
}

// 查询所有功能分类
export function allType () {
  return request({
    url: deliveryUrl + 'api/tools/findFunction',
    method: 'get'
  })
}

// 新增部署任务
export function addCreateJob (data) {
  return request({
    url: deliveryUrl + 'api/job/create',
    method: 'post',
    data: data
  })
}

// 修改任务流水线
export function updateJob (jobId, data) {
  return request({
    url: deliveryUrl + 'api/job/update/' + jobId,
    method: 'put',
    data: data
  })
}

// 修改功能分类或者标签
export function editTypeOrTag (data) {
  return request({
    url: deliveryUrl + 'api/grouptag/update',
    method: 'put',
    data: data
  })
}

// 查询脚本
export function scriptListById (data) {
  return request({
    url: deliveryUrl + 'api/grouptagFind',
    method: 'post',
    data: data
  })
}

// 删除分类
export function deleteType (grouptagId) {
  return request({
    url: deliveryUrl + 'api/grouptag/' + grouptagId,
    method: 'delete'
  })
}

// 新增标签
export function scriptTag (data) {
  return request({
    url: deliveryUrl + 'api/greouptag/createThelabel',
    method: 'post',
    data: data
  })
}

// 删除脚本
export function deleteTools (toolId) {
  return request({
    url: deliveryUrl + 'api/tool/' + toolId,
    method: 'delete'
  })
}

// 查询标签
export function tagsList () {
  return request({
    url: deliveryUrl + 'api/tools/findLabel',
    method: 'get'
  })
}

// 脚本审批
export function scriptApprove (data) {
  return request({
    url: deliveryUrl + 'api/tool/approve',
    method: 'post',
    data: data
  })
}

// 发起审批
export function auditLogaAdd (data) {
  return request({
    url: deliveryUrl + 'api/auditLog/add',
    method: 'post',
    data: data
  })
}

// 查询测试节点
export function testNode (name, systemId) {
  return request({
    url: deliveryUrl + 'api/sshNode/tablistdev?name=' + name + '&systemId=' + systemId,
    method: 'get'
  })
}

// 删除标签
export function deleteTag (grouptagId, state) {
  return request({
    url: deliveryUrl + 'api/grouptag/' + grouptagId + '/' + state,
    method: 'delete'
  })
}

// 删除参数
export function deleteParams (paramId) {
  return request({
    url: deliveryUrl + 'api/toolParam/' + paramId,
    method: 'delete'
  })
}

// 新增集群
export function addCluster (data) {
  return request({
    url: deliveryUrl + 'api/cluster/add-update',
    method: 'post',
    data: data
  })
}

export function getNodeDetail (nodeId) {
  return request({
    url: deliveryUrl + 'api/sshNode/nodeIdDetail/' + nodeId,
    method: 'get'
  })
}

// 查询集群（下拉框）
export function pullDownList (systemId, purposes) {
  return request({
    url: deliveryUrl + 'api/cluster/pullDownList/?systemId=' + systemId + '&purposes=' + purposes,
    method: 'get'
  })
}

// 编辑集群
export function editClusterapi (data) {
  return request({
    url: deliveryUrl + 'api/cluster/add-update/',
    method: 'post',
    data: data
  })
}

export function getClusterDrop (data) {
  return request({
    url: deliveryUrl + 'api/cluster/pullDownList/?systemId=' + data.systemId + '&purposes=' + data.purposes,
    method: 'get',
    data: data
  })
}

// 修改脚本及脚本参数
export function updateParams (data) {
  return request({
    url: deliveryUrl + 'api/updateScript',
    method: 'put',
    data: data
  })
}

// 查询所有脚本
export function allsrcipt () {
  return request({
    url: deliveryUrl + 'api/tool/find',
    method: 'get'
  })
}

// 批量删除集群
export function deleteAllCluster (clusterId) {
  return request({
    url: deliveryUrl + 'api/cluster/batchdel' + clusterId,
    method: 'delete'
  })
}

// 删除集群
export function deleteCluster (clusterId) {
  return request({
    url: deliveryUrl + 'api/cluster/' + clusterId,
    method: 'delete'
  })
}

// 查询所有集群,数据中传入名称或用途则模糊查询；分页
export function clusterList (data) {
  return request({
    url: deliveryUrl + 'api/cluster/view',
    method: 'post',
    data: data
  })
}

// 集群详情
export function clusterDetail (clusterId) {
  return request({
    url: deliveryUrl + 'api/cluster/clusterDetail/' + clusterId,
    method: 'get'
  })
}

// 模糊查询没有集群的节点名称
export function nodeList (data) {
  return request({
    url: deliveryUrl + 'api/sshNode/viewwithoutcluster',
    method: 'get'
  })
}

// 通过集群查看节点详情
export function nodeDetail (clusterId) {
  return request({
    url: deliveryUrl + 'api/sshNode/nodeIdDetailByCluster/' + clusterId,
    method: 'get'
  })
}

// 根据节点id 查询节点信息
export function nodeinfo (data) {
  return request({
    url: deliveryUrl + 'api/nodeparam/list?actNodeId=' + data.actNodeId + '&jobId=' + data.jobId,
    method: 'get'
  })
}

// 查询所有脚本和对应的脚本信息还有脚本参数 没有分页API
export function allplanlist (data) {
  return request({
    url: deliveryUrl + 'api/plan/getAllPlanTools',
    method: 'get'
  })
}

// 修改标签
export function editTag (data) {
  return request({
    url: deliveryUrl + 'api/grouptag/update',
    method: 'put',
    data: data
  })
}

// 根据系统id查询生产节点
export function getNodeBySystemId (data) {
  return request({
    url: deliveryUrl + 'api/sshNode/tablistprod?systemId=' + data.systemId,
    method: 'get',
    data: data
  })
}

// 根据系统id和集群id查询节点
export function getNodeName (data) {
  return request({
    url: deliveryUrl + 'api/sshNode/viewer',
    method: 'post',
    data: data
  })
}

// 删除部署任务
export function deleteJob (jobId) {
  return request({
    url: deliveryUrl + 'api/job/task/' + jobId,
    method: 'delete'
  })
}

// 部署任务详情
export function getJobDetail (jobId) {
  return request({
    url: deliveryUrl + 'api/job/' + jobId,
    method: 'get'
  })
}

// 部署任务
export function buildJob (jobId) {
  return request({
    url: deliveryUrl + 'api/job/start/' + jobId,
    method: 'get'
  })
}

// 查询部署任务历史部署
export function getDeployLog (data) {
  return request({
    url: deliveryUrl + 'api/job/getHistoryLog',
    method: 'post',
    data: data
  })
}

// 新增审批
export function addApplay (data) {
  return request({
    url: deliveryUrl + 'api/auditLog/add',
    method: 'post',
    data: data
  })
}

// 获取流程节点参数列表
export function getNodeParam (data) {
  return request({
    url: deliveryUrl + 'api/nodeparam/list',
    method: 'post',
    data: data
  })
}

// 终止任务执行
export function stopJob (jobId) {
  return request({
    url: deliveryUrl + 'api/job/stop/' + jobId,
    method: 'get'
  })
}

// 新增部署方案
export function createPlan (data) {
  return request({
    url: deliveryUrl + 'api/plan/createPlan',
    data: data,
    method: 'post'
  })
}

// 部署方案根据节点id查询节点信息
export function getActParam (data) {
  return request({
    url: deliveryUrl + 'api/plan/getActParam',
    data: data,
    method: 'post'
  })
}

// 查询条件查询
export function findByCondition (data) {
  return request({
    url: deliveryUrl + 'api/tool/list',
    method: 'post',
    data: data
  })
}

// 修改记录
export function editLogs (logId) {
  return request({
    url: deliveryUrl + 'api/toolUpdateLog/' + logId,
    method: 'get'
  })
}

// 获取具体执行的任务的详情
export function getBuildDetail (buildId) {
  return request({
    url: deliveryUrl + 'api/job/builedInfo/' + buildId,
    method: 'get'
  })
}

// 获取审批日志
export function getToolLog (toolId) {
  return request({
    url: deliveryUrl + 'api/updateLogToolId/' + toolId,
    method: 'get'
  })
}

// 获取脚本总数和可执行数
export function getAllNumForTool () {
  return request({
    url: deliveryUrl + 'api/toolCount',
    method: 'get'
  })
}

// 节点管理没有id的集群下拉框
// CMDB 删除CI项之前验证是否影响其他数据
export function pullDownListExtra (systemId) {
  let url = deliveryUrl + 'api/cluster/pullDownListExtra'
  if (systemId !== null) {
    url = url + `?systemId=` + systemId
  } else {
    url = url + `?systemId`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 获取执行日志详情
export function getJobbuildinfo (buildId) {
  return request({
    url: deliveryUrl + 'api/job/builedInfo/' + buildId,
    method: 'get'
  })
}

// 发布管理列表
export function getReleaseList (data) {
  return request({
    url: deliveryUrl + 'api/release/listPaging',
    method: 'post',
    data: data
  })
}

export function releaseLog (data) {
  return request({
    url: deliveryUrl + 'api/releaseLog/page',
    method: 'post',
    data: data
  })
}

// 复制流水线任务
export function copyTask (jobId, name) {
  return request({
    url: deliveryUrl + 'api/job/copy/' + jobId + '?newName=' + name,
    method: 'get'
  })
}

// 根据url获取stage日志输出信息
export function getstagelog (url) {
  return request({
    url: deliveryUrl + 'api/job/stagelog',
    method: 'post',
    data: url
  })
}

// 根据url获取stage日志输出信息
export function getstagelogList (url) {
  return request({
    url: deliveryUrl + 'api/job/stageKeyChange',
    method: 'post',
    data: url
  })
}

// 根据url获取stage日志输出信息
export function getwebstagelog (item) {
  let urldata = {
    urls: []
  }
  item.stageFlowNodes.forEach(d => {
    urldata.urls.push({ url: d._links.log.href })
  })
  return request({
    url: deliveryUrl + 'api/job/stagelog',
    method: 'post',
    data: urldata
  })
}

// 添加发布任务
export function addReleaseTask (data) {
  return request({
    url: deliveryUrl + 'api/releaseTask/newReleaseTask',
    method: 'post',
    data: data
  })
}

// 修改发布任务
export function updateReleaseTask (data) {
  return request({
    url: deliveryUrl + 'api/releaseTask/editReleaseTask',
    method: 'put',
    data: data
  })
}

// 删除发布任务
export function deleteReleaseTask (id) {
  return request({
    url: deliveryUrl + 'api/releaseTask/forgetReleaseTask/' + id,
    method: 'delete'
  })
}

// 查看发布任务详情
export function releaseTaskDetail (id) {
  return request({
    url: deliveryUrl + 'api/release/' + id,
    method: 'get'
  })
}

// 工作台待发布任务和发布动态
export function taskDynamic (data) {
  return request({
    url: deliveryUrl + 'api/release/manListToDay',
    method: 'post',
    data: data
  })
}

// 发布管理提交审批
export function manageApprove (manageId) {
  return request({
    url: deliveryUrl + 'api/manage/approve/' + manageId,
    method: 'get'
  })
}

// 按最高发布频率统计
export function maxCount (days) {
  return request({
    url: deliveryUrl + 'api/release/maxCount/' + days,
    method: 'get'
  })
}

// 我的工作台发布统计
export function publishCount (data) {
  return request({
    url: deliveryUrl + 'api/release/publishCount',
    method: 'post',
    data: data
  })
}

// 人工审核输入
export function getmanualaudit (data) {
  return request({
    url: deliveryUrl + 'api/job/input?input=' + data.input + '&jobId=' + data.jobId + '&jobNumber=' + data.jobNumber,
    method: 'get'
  })
}

// 脚本回退记录
export function toolVersionLog (data) {
  return request({
    url: deliveryUrl + 'api/toolVersionLog',
    method: 'put',
    data: data
  })
}

// 发布管理一建执行
export function releaseTasktoStart (manageId) {
  return request({
    url: deliveryUrl + 'api/releaseTask/toStart?manageId=' + manageId,
    method: 'get'
  })
}

// 发布管理任务日志
export function releaseLogDetail (data) {
  return request({
    url: deliveryUrl + 'api/releaseLog/detail',
    method: 'post',
    data: data
  })
}

// 发布管理发布任务节点详情
export function releaseNodeparam (data) {
  return request({
    url: deliveryUrl + 'api/releaseNodeparam',
    method: 'post',
    data: data
  })
}

// 获取定时任务下拉框
export function cronTask (taskType) {
  return request({
    url: deliveryUrl + 'api/getNameByTaskType/' + taskType,
    method: 'get'
  })
}

// 保存定时任务
export function saveCronTab (data) {
  return request({
    url: deliveryUrl + 'api/releaseManage/cronInfoSaveAndStart',
    method: 'post',
    data: data
  })
}

export function editCronTab (data) {
  return request({
    url: deliveryUrl + 'api/releaseManage/cronInfoModifyAndStart',
    method: 'post',
    data: data
  })
}

// 取消定时任务
export function cancleCronTab (manageId) {
  return request({
    url: deliveryUrl + 'api/releaseManage/removeScheduleTask/' + manageId,
    method: 'post'
  })
}

/***
   * 配置管理
   * Jenkins配置
   * ***/
export function JenkinsList (data) {
  return request({
    url: deliveryUrl + 'api/jenkinsConfig/page',
    method: 'post',
    data: data
  })
}

// 删除jenkins信息
export function deleteJenkins (jenkinsId) {
  return request({
    url: deliveryUrl + 'api/jenkinsConfig/delete/' + jenkinsId,
    method: 'delete'
  })
}

// 检测jenkins信息
export function detectionJenkins (jenkinsId) {
  return request({
    url: deliveryUrl + 'api/jenkinsConfig/detection/' + jenkinsId,
    method: 'get'
  })
}

// 修改jenkins信息
export function updateJenkins (data) {
  return request({
    url: deliveryUrl + 'api/jenkinsConfig/update',
    method: 'PUT',
    data: data
  })
}

// 获取jenkins信息
export function JenkinsDetail (jenkinsId) {
  return request({
    url: deliveryUrl + 'api/jenkinsConfig/' + jenkinsId,
    method: 'GET'
  })
}

// 新增jenkins信息
export function addJenkins (data) {
  return request({
    url: deliveryUrl + 'api/jenkinsConfig/add',
    method: 'POST',
    data: data
  })
}

// 根据系统id查询任务
export function findByStemId (systemId) {
  return request({
    url: deliveryUrl + 'api/sys/findByStemId/' + systemId,
    method: 'post'
  })
}

// jenkins列表查询
export function jenkinsList (params) {
  return request({
    url: deliveryUrl + 'api/jenkinsConfig/page',
    method: 'post',
    data: params
  })
}

// 发布管理列表展开显示流水线信息
export function pipelineByList (manageId) {
  return request({
    url: deliveryUrl + 'api/release/jobTasks/' + manageId,
    method: 'get'
  })
}

// 发布管理日志 下面的流水线列表
export function jobTasks (hisId) {
  return request({
    url: deliveryUrl + 'api/rmHis/jobTasks/' + hisId,
    method: 'get'
  })
}

// 制品库配置列表查询
export function productConfigList (params) {
  return request({
    url: deliveryUrl + 'api/productConfig/page',
    method: 'post',
    data: params
  })
}

// 新增制品库配置
export function addProductConfig (params) {
  return request({
    url: deliveryUrl + 'api/productConfig/add',
    method: 'post',
    data: params
  })
}

// 修改制品库配置
export function updateProductConfig (params) {
  return request({
    url: deliveryUrl + 'api/productConfig/update',
    method: 'put',
    data: params
  })
}

// 删除制品库配置
export function deleteProductConfig (productId) {
  return request({
    url: deliveryUrl + 'api/productConfig/delete/' + productId,
    method: 'delete'
  })
}

// 查询制品库配置详情
export function queryProductConfig (productId) {
  return request({
    url: deliveryUrl + 'api/productConfig/' + productId,
    method: 'get'
  })
}

// 制品库配置检测
export function detectionProductConfig (productId) {
  return request({
    url: deliveryUrl + 'api/productConfig/detection/' + productId,
    method: 'get'
  })
}

// 新增仓库
export function addWarehouse (params) {
  return request({
    url: deliveryUrl + 'api/warehouse/add',
    method: 'post',
    data: params
  })
}

// 获取同类型仓库列表
export function queryWarehouseList (params) {
  return request({
    url: deliveryUrl + 'api/groupRepositories',
    method: 'post',
    data: params
  })
}

// 获取同类型仓库列表
export function queryWarehousePage (params) {
  return request({
    url: deliveryUrl + 'api/getWarehouseList',
    method: 'post',
    data: params
  })
}

// 删除仓库
export function deleteWarehouse (params) {
  return request({
    url: deliveryUrl + `api/warehouse/delete/${params.productId}/${params.warehouseName}`,
    method: 'delete'
  })
}

// 仓库详情
export function queryWarehouse (params) {
  return request({
    url: deliveryUrl + `api/warehouseInfo/?productId=${params.productId}&warehouseName=${params.warehouseName}`,
    method: 'get'
  })
}

// 获取仓库列表
export function queryProductList (params) {
  return request({
    url: deliveryUrl + `api/getProductList`,
    method: 'post',
    data: params
  })
}

// 修改仓库信息
export function updateWarehouse (params) {
  return request({
    url: deliveryUrl + `api/warehouse/update`,
    method: 'put',
    data: params
  })
}

// 新增制品包
export function addProductPackage (params) {
  return request({
    url: deliveryUrl + `api/productPackage/add`,
    method: 'post',
    data: params
  })
}

// 查看制品包在nexus中的详细信息
export function queryNexusAssetInfo (params) {
  return request({
    url: deliveryUrl + `api/getNexusPackageInfo`,
    method: 'post',
    data: params
  })
}

// 删除制品包
export function deleteNexusPackage (params) {
  return request({
    url: deliveryUrl + `api/delNexusPackage`,
    method: 'post',
    data: params
  })
}

// 同步制品包
export function syncNexusPackage (params) {
  return request({
    url: deliveryUrl + `api/synchroPackage`,
    method: 'post',
    data: params
  })
}

// 获取发布任务执行时版本列表
export function getReleaseVersionList (manageId) {
  return request({
    url: deliveryUrl + `api/releaseTask/nexusList?manageId=${manageId}`,
    method: 'get'
  })
}

// 制品库同步时获取仓库列表
export function getWarehouseListOnSync (params) {
  return request({
    url: deliveryUrl + 'api/getNexusDownBox',
    method: 'post',
    data: params
  })
}
