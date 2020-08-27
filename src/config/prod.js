/**
 * @description 生产环境配置文件
 * @author ljq
 * @date 2019/6/28
 */
module.exports = {
  aiaUrl: 'http://10.131.111.167:8075/bms/aia/',
  baserUrl: 'http://10.131.111.167:8075/bms/',
  CiBaseUrl: 'http://10.131.111.167:8075/cmdb/',
  deliveryUrl: 'http://10.131.111.167:8075/delivery/',
  devopsUrl: 'http://10.131.111.167:8075/devops/',
  workflowUrl: 'http://10.131.111.167:8091/',
  websocketurl: 'ws://10.131.111.167:1800/ws',
  aibmsWebsocketurl: 'ws://10.131.111.167:1802/ws',
  devopswebsocketurl: 'ws://10.131.111.167:1801/ws',
  resourceManageUrl: 'http://10.131.111.167:8094/',
  resourceManageWebsocketUrl: 'ws://10.131.111.167:8094/socketServer/templateCloning',
  resourceManageSyncUrl: 'ws://10.131.111.167:8094/socketServer/synchronizeData'
}

// resourceManageUrl: 'http://172.20.10.2:8094/',
// resourceManageWebsocketUrl: 'ws://172.20.10.2:8094/socketServer/templateCloning',
// resourceManageSyncUrl: 'ws://172.20.10.2:8094/socketServer/synchronizeData'
