// 页面编辑数据

var inputsData
var textareasData
var selectsData

// 记录下表单中的原始值
function initFileds () {
  var inputs
  var textareas
  var selects
  setTimeout(() => {
    inputs = document.getElementsByTagName('input')
    textareas = document.getElementsByTagName('textarea')
    selects = document.getElementsByTagName('select')
    //  console.log(inputs[0].parentNode.className)
    inputsData = new Array(inputs.length)
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].parentNode.className.indexOf('search') > -1) {
        continue
      }
      inputsData[i] = inputs[i].value
      if (inputs[i].type == 'radio') {
        inputsData[i] = inputs[i].checked
      }
    }
    textareasData = new Array(textareas.length)
    for (var j = 0; j < textareas.length; j++) {
      textareasData[j] = textareas[j].value
    }
    selectsData = new Array(selects.length)
    for (var k = 0; k < selects.length; k++) {
      selectsData[k] = selects[k].value
    }
    // console.log(inputsData,textareasData,selectsData)
  }, 100)
}
/*
 * 判断表单中值是否被修改了
 * submitCommand 表单有改动时,执行的javascript代码
 */
function checkModification (submitCommand) {
  var hasBeenChanged = false

  if (submitCommand) {
    hasBeenChanged = false
    return hasBeenChanged
  }
  var inputs = document.getElementsByTagName('input')
  var textareas = document.getElementsByTagName('textarea')
  var selects = document.getElementsByTagName('select')

  for (var l = 0; l < inputs.length; l++) {
    if (inputs[l].parentNode.className.indexOf('search') > -1) {
      continue
    }
    if (inputs[l].type == 'radio' && inputs[l].checked != inputsData[l]) {
      hasBeenChanged = true
      inputsData[l] = inputs[l].checked
    }
    if (inputs[l].type != 'radio' && inputsData[l] != inputs[l].value) {
      if (inputs[l].name != 'actionType') {
        hasBeenChanged = true
      }
      inputsData[l] = inputs[l].value
    }
  }
  for (var g = 0; g < textareas.length; g++) {
    if (textareasData[g] != textareas[g].value) {
      hasBeenChanged = true
      textareasData[g] = textareas[g].value
    }
  }
  for (var h = 0; h < selects.length; h++) {
    if (selectsData[h] != selects[h].value) {
      hasBeenChanged = true
      selectsData[h] = selects[h].value
    }
  }
  // console.log(inputsData, textareasData, selectsData)
  return hasBeenChanged
}
// 浏览器刷新时
function onbeforeunload () {
  window.onbeforeunload = function (e) {
    let bl = checkModification()
    if (bl) {
      e = e || window.event
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '关闭提示'
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '关闭提示'
    }
  }
}

module.exports = {
  initFileds,
  checkModification,
  onbeforeunload
}
