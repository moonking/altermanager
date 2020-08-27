export default {
  GET_ID: ({ state, commit }, payload) => {
    commit('GET_ID', payload)
  },
  GET_TYPE2ID: ({ state, commit }, payload) => {
    commit('GET_TYPE2ID', payload)
  },
  GET_DATA: ({ state, commit }, payload) => {
    commit('GET_DATA', payload)
  },
  GET_NODATA: ({ state, commit }, payload) => {
    commit('GET_NODATA', payload)
  },
  VIEW: ({ state, commit }, payload) => {
    commit('VIEW', payload)
  },
  GET_SIDE ({ state, commit }, payload) {
    let setname = function (sub) {
      for (var j in sub) {
        if (sub[j].name == payload.oldname) {
          // console.log(payload.oldname);
          sub[j].name = payload.newname
        } else {
          if (sub[j].children && sub[j].children.length > 0) {
            setname(sub[j].children)
          }
        }
      }
    }
    if (payload.oldname) {
      for (var i in payload.arr) {
        if (payload.arr[i].name == payload.oldname) {
          payload.arr[i].name = payload.newname
        } else {
          if (payload.arr[i].children && payload.arr[i].children.length > 0) {
            setname(payload.arr[i].children)
          }
        }
      }
    }
    if (payload.oldname) {
      for (var j in payload.arr1) {
        if (payload.arr1[j].name == payload.oldname) {
          payload.arr1[j].name = payload.newname
        } else {
          if (payload.arr1[j].children && payload.arr1[j].children.length > 0) {
            setname(payload.arr1[j].children)
          }
        }
      }
    }
    commit('GET_SIDE', payload)
  },

  GET_TAGSLIST: ({ state, commit }, payload) => {
    let bread = function (bread) {
      if (bread.length && bread.length > 0) {
        for (let i = 0; i < bread.length; i++) {
          if (bread[i].path == payload.href) {
            bread[i].meta.title = payload.name
          }
        }
      }
    }
    let firstFun = function (first) {
      if (first && first.length > 0) {
        for (let i in first) {
          for (let j in payload.path) {
            if (!first[i].path) {
              break
            } else {
              if (first[i].path == payload.path[j].path) {
                first[i].meta.title = payload.path[j].name
              } else {
                if (first[i].children && first[i].children.length > 0) {
                  firstFun(first[i].children)
                }
              }
            }
          }
        }
      }
    }
    // console.log(payload)
    if (payload.href) {
      payload.href = payload.href.split('?')[0]
      for (let i in payload.router) {
        if (payload.router[i].path == payload.href) {
          if (payload.router[i].meta) {
            payload.router[i].meta.title = payload.name
          }
        } else {
          if (payload.router[i].children && payload.router[i].children.length > 0) {
            bread(payload.router[i].children)
          }
        }
      }
    } else {
      for (let i in payload.router) {
        for (let j in payload.path) {
          if (payload.router[i].path == payload.path[j].path) {
            if (payload.router[i].meta) {
              payload.router[i].meta.title = payload.path[j].name
            }
          } else {
            if (payload.router[i].children && payload.router[i].children.length > 0) {
              firstFun(payload.router[i].children)
            }
          }
        }
      }
    }
    // console.log(payload)
    commit('GET_TAGSLIST', payload)
  },
  changeUserPic ({ state, commit }, userPhoto) {
    commit('changeUserPic', userPhoto)
  },
  editMenu ({ state, commit }, menuName) {
    commit('editMenu', menuName)
  },
  getCheckValue ({ state, commit }, checkValue) {
    commit('getCheckValue', checkValue)
  },
  mId ({ state, commit }, mId) {
    commit('mId', mId)
  }
}
