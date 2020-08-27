import request from '@/utils/request'
import { workflowUrl } from '../../config'

// 流水线部署
export function deploypipe (data) {
  return request({
    url: workflowUrl + 'api/process/deploy/xml',
    method: 'post',
    data: data
  })
}

// 启动流水线
export function startpipe (procDefKey) {
  return request({
    url: workflowUrl + 'api/task/start?procDefKey=' + procDefKey,
    method: 'get'
  })
}
