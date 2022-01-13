import axios from 'axios'
import common from '@/utils/commonjs'
// 创建axios 实例

const service = axios.create({
  // 是否跨站点访问控制请求使用凭证(Cookie)
  withCredentials: true,
  // 修改请求的数据再发送到服务器
  // transformRequest: [
  //   data => {
  //     const {roleId, userId} = store.state.app.userInfo;
  //     const payload = {
  //       ...data,
  //       roleId,
  //       userId
  //     };
  //     data = roleId ? payload : data;
  //     return JSON.stringify(data);
  //   } // 序列化请求的数据
  // ],
  timeout: 100000 // 配置请求超时
});
service.interceptors.request.use(config => {
  // 修改请求头信息
  if (config.type == 'change') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  } else {
    config.headers['Content-Type'] = 'application/json'
  }
  if (localStorage.getItem('token')) {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    config.headers['sessionId'] = localStorage.getItem('sessionId')
  }
  // config.headers["Authorization"] =
  //   "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNTUwODI5OTgyLCJpYXQiOjE1NTAyMjUxODJ9.fYZl_ShWh4ht-yWXdDKJZQVh0yyJL8-i2pMGS7cPodaezAQW6Y3wCmvJnxOTmc2E9Yd1apyxxIXPgnsJFIkbXg";
  return config
})
/**
 * 响应拦截
 */
service.interceptors.response.use(
  response => {
    return common.Remotelogin(response);
  },
  error => {
    common.errorapi(error)
    return Promise.reject(error);
  }
);

export default service
