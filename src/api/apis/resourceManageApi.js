import request from '@/utils/request'
import { resourceManageUrl } from '../../config'

// 资源环境管理

// 新增vcenter
export function addVcenter (data) {
  return request({
    url: resourceManageUrl + 'api/addVcenter',
    method: 'post',
    data: data
  })
}

// 删除vcenter
export function deleteVcenter (vcenterId) {
  return request({
    url: resourceManageUrl + `/api/vcenter/${vcenterId}`,
    method: 'delete'
  })
}

// 编辑vcenter updateaddVcenter (data) {
export function updateVcenter (data) {
  return request({
    url: resourceManageUrl + 'api/updateVcenter',
    method: 'put',
    data: data
  })
}

// vcenter详情
export function vcenterDetail (vcenterId) {
  return request({
    url: resourceManageUrl + `/api/vcenter/${vcenterId}`,
    method: 'get'
  })
}

// 分页获取vcenter
export function vcenterList ({ current, size, ipAddress = '' }) {
  return request({
    url: resourceManageUrl + `api/vcenterPageQuery?current=${current}&size=${size}&ipAddress=${ipAddress}`,
    method: 'get'
  })
}

/**
   * 主机管理
   * *****/
// 根据Vcenter查找出主机信息并分页显示
export function hostListCheck ({ vcenterId, synchronizeType }) {
  return request({
    url: resourceManageUrl + `api/hostAndInstanceQuery?vcenterId=${vcenterId}&synchronizeType=${synchronizeType}`,
    method: 'get'
  })
}

// 根据Vcenter查询并分页
export function hostList ({ current, size, vcenterId }) {
  return request({
    url: resourceManageUrl + `api/hostPageQuery?vcenterId=${vcenterId}&size=${size}&current=${current}`,
    method: 'get'
  })
}

// 下拉
export function getHostDropList () {
  return request({
    url: resourceManageUrl + `api/hostNameDropDownBox`,
    method: 'get'
  })
}

/****
   * 实例管理
   *
   * ****/

// 开关机
export function closeAndOpenInstance ({ instanceId, operatingType }) {
  return request({
    url: resourceManageUrl + `api/hostOpenOrClose?operatingType=${operatingType}&instanceId=${instanceId}`,
    method: 'put'
  })
}

// 根据Vcenter查询并分页
export function instanceList (data) {
  return request({
    url: resourceManageUrl + `api/instancePageQuery`,
    method: 'POST',
    data: data
  })
}

// 复制实例
export function copyInstance (data) {
  return request({
    url: resourceManageUrl + `api/instanceCopy`,
    method: 'POST',
    data: data
  })
}

// 模板管理
export function templateList ({ current, size, vcenterId }) {
  return request({
    url: resourceManageUrl + `api/tempPageQuery?current=${current}&size=${size}&vcenterId=${vcenterId}`,
    method: 'get'
  })
}

// 模板克隆
export function cloneTemplates (data) {
  return request({
    url: resourceManageUrl + `api/templateCloning`,
    method: 'post',
    data: data
  })
}

// 查询下拉
export function dropInfo ({ directoryType, vcenterId }) {
  return request({
    url: resourceManageUrl + `api/fandDropDownBox?directoryType=${directoryType}&vcenterId=${vcenterId}`,
    method: 'get'
  })
}

// 查询目录是否存在
export function dropInfoExist ({ inputValue, vcenterId, directoryType }) {
  return request({
    url: resourceManageUrl + `api/detectionInfo?inputValue=${inputValue}&vcenterId=${vcenterId}&directoryType=${directoryType}`,
    method: 'get'
  })
}
