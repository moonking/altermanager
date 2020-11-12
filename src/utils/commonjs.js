import bus from '../components/common/bus'

const Urldata = [
  {
    'url': 'api/job/start', 'msg': '执行接口请求失败，请稍后再试。'
  },
  {
    'url': 'api/process/start', 'msg': '执行接口请求失败，请稍后再试。'
  },
  {
    'url': 'api/releaseTask/toStart', 'msg': '执行接口请求失败，请稍后再试。'
  },
  {
    'url': 'api/task/start', 'msg': '执行接口请求失败，请稍后再试。'
  },
  {
    'url': 'api/login?', 'msg': '登录失败，请稍后再试。'
  },
  {
    'url': 'api/loginout', 'msg': '登出失败，请稍后再试。'
  }
]
// eval
function evil (fn) {
  var Fn = Function
  return new Fn('return ' + fn)()
}

// 修改xml的随机id
function changexmlid (xml) {
  let timestamp = randChar() + new Date().valueOf()
  let a = xml.split('process')
  let b = a[2].split('isExecutable')
  b[0] = ` id="${timestamp}" name="${timestamp}" `
  a[2] = b.join('isExecutable')
  xml = a.join('process')
  return xml
}

// 工作流组件xml名称的替换
function setxmlname (xml, id, name) {
  let a = []
  let b = []
  a = xml.split('task')
  a.forEach((item, index) => {
    if (item.indexOf(`id="${id}">`) > -1 || item.indexOf(`id="${id}" name`) > -1) {
      if (item.indexOf(`id="${id}" name="${name}" />`) > -1) {
        b = item.split('>')
        b[0] = ` id="${id}" name="${name}" /`
        a[index] = b.join('>')
      } else {
        b = item.split('>')
        b[0] = ` id="${id}" name="${name}"`
        a[index] = b.join('>')
      }
    } else if (item.indexOf(`id="${id}" />`) > -1) {
      b = item.split('>')
      b[0] = ` id="${id}" name="${name}" /`
      a[index] = b.join('>')
    }
  })
  xml = a.join('task')
  return xml
}

// 随机字母生成
function randChar () {
  let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let length = 1
  let result = '' // 返回的结果。
  // length为所需长度，characters为所包含的所有字符，默认为字母+数字。
  characters = characters.split('') // 分割字符。

  while (result.length < length) { result += characters[Math.floor(Math.random() * characters.length)] }
  return result
}

// 判断节点名称和脚本是否为空
function inspectNode (nodeParam, type) {
  let isbl = false
  let num = 0
  let msg = ''
  if (nodeParam.length > 0) {
    nodeParam.forEach(item => {
      if (!item.actNodeName) {
        isbl = true
        msg = '流程图节点名称不能为空！'
        num++
      }
      if ((!item.toolId && !item.dlvToolsId && !type) || (!item.businessId && item.businessType == '1' && type == 'delivery')) {
        isbl = true
        msg = '流程图节点脚本不能为空！'
        num++
      }
    })
  }
  if (isbl) {
    if (num == 2) {
      msg = '流程图节点内容不能为空！'
    }
    return msg
  }
}

// 判断部分url
function judgeUrl (Urldata, url) {
  let bl = false
  let Index
  Urldata.forEach((item, index) => {
    if (url.indexOf(item.url) > -1) {
      bl = true
      Index = index
    }
  })
  return bl ? Urldata[Index].msg : '获取数据失败，请稍后再试。'
}

// 时间转换
function timer (timeStr) {
  // 将时间的毫秒转换为时分秒
  let time = timeStr ? timeStr / 1000 : 0;
  let str;
  if (time >= 0) {
    if (time < 60 && time >= 0) {
      str = `${time.toFixed(2)}秒`;
    } else {
      if (time >= 60 && time < 3600) {
        if (time == 60) {
          str = '1分钟';
        } else {
          str = `${Math.floor(time / 60)}分${Math.floor(time % 60)}秒`;
        }
      } else {
        if (time == 3600) {
          str = '1小时';
        } else {
          str = `${Math.floor(time / 60 / 60)}时${Math.floor(time / 60) %
            60}分${Math.floor(time % 60)}秒`;
        }
      }
    }
  }
  return str;
}

// 接口验证
function Remotelogin (res) {
  if (res.data.code && res.data.code === 4101) {
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userPhoto')
    localStorage.removeItem('token')
    window.location.hash = '/login'

    if (localStorage.getItem('bl') === 'true') {
      return false
    } else {
      localStorage.setItem('bl', 'true')

      setTimeout(() => {
        localStorage.setItem('bl', 'false')
      }, 1000)

      bus.$notify({
        title: '提示',
        message: res.data.message,
        type: 'error'
      })
    }
  } else {
    localStorage.setItem('bl', 'false')
    return res
  }
}

// 错误信息提示
function errorapi (res) {
  if (res) {
    if (res.code && res.code === 'ECONNABORTED') {
      if (localStorage.getItem('bl') === 'true') {
        return false
      } else {
        localStorage.setItem('bl', 'true')

        setTimeout(() => {
          localStorage.setItem('bl', 'false')
        }, 1000)
        bus.$notify({
          title: '提示',
          message: '请求超时',
          type: 'error'
        })
      }
    } else if (res.response && res.response.status === 401) {
      if (localStorage.getItem('bl') === 'true') {
        return false
      } else {
        localStorage.setItem('bl', 'true')

        setTimeout(() => {
          localStorage.setItem('bl', 'false')
        }, 1000)
        bus.$notify({
          title: '提示',
          message: res.response.data.message,
          type: 'error'
        })
      }
    } else if (res.message && res.message === 'Network Error') {
      // console.log(judgeUrl(Urldata,res.config.url))
      if (!localStorage.getItem('userId')) {
        // localStorage.removeItem('userId');
        // localStorage.removeItem('userName');
        // localStorage.removeItem('userPhoto');
        // localStorage.removeItem('token');
        window.location.hash = '/login'
      }

      if (localStorage.getItem('bl') === 'true') {
        return false
      } else {
        localStorage.setItem('bl', 'true')

        setTimeout(() => {
          localStorage.setItem('bl', 'false')
        }, 1000)
        bus.$notify({
          title: '提示',
          message: judgeUrl(Urldata, res.config.url),
          type: 'error'
        })
      }
    } else {
      if (localStorage.getItem('bl') === 'true') {
        return false
      } else {
        localStorage.setItem('bl', 'true')

        // setTimeout(() => {
        //   localStorage.setItem('bl', 'false')
        // }, 1000)
        // bus.$notify({
        //   title: '提示',
        //   message: '服务器出错了！',
        //   type: 'error'
        // })
      }
    }
  }
}

export default {
  evil,
  setxmlname,
  randChar,
  changexmlid,
  inspectNode,
  judgeUrl,
  timer,
  Remotelogin,
  errorapi
}
