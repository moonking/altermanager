<template>
  <div class="container refreshContainer aibms-color-bg non-border">
    <div class="baseInfo">
      <div class="item-block-title paddingTop" @click="changeIconArrow(1)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">基本信息</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[1] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <el-form
        class="item-block-content"
        :model="toolForm"
        label-width="120px"
        :style="{height: blockCheck[1] ? 'auto' : 0}"
      >
        <el-form-item label="脚本名称">
              <el-input v-model="toolForm.name" :disabled="true" style="width: 632px" />
        </el-form-item>
        <el-form-item label="脚本分类">
              <el-input v-model="toolForm.groupName" :disabled="true" style="width: 632px" />
        </el-form-item>
        <el-form-item label="标签：">
              <div class="tags-box" style="width: 632px">
                <ul>
                  <li v-for="(tag,index) in tagArr" :key="index">
                    <el-row class="left-title">
                      <el-col :span="2">
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="14">
                        <span>{{tag.name}}</span>
                      </el-col>
                    </el-row>
                    <ul class="tags-item">
                      <li v-for="(item,idx) in tag.child" :key="idx">
                        <span>{{item.name}}</span>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div class="clear"></div>
              </div>
        </el-form-item>
        <el-form-item label="脚本内容">
              <el-input type="textarea" style="width: 632px" v-model="toolForm.content" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="脚本说明">
              <el-input v-model="toolForm.remarks" :disabled="true" style="width: 632px"></el-input>
        </el-form-item>
        <el-form-item label="执行工具" >
              <el-input v-model="toolForm.runTool" :disabled="true" style="width: 632px"></el-input>
        </el-form-item>
        <el-form-item label="脚本类型：">
              <el-select v-model="toolForm.toolType" disabled class="select-input" style="width: 632px">
                <el-option
                  :label="ty.label"
                  :value="ty.value"
                  v-for="(ty,index) in ToolTypeList"
                  :key="index"
                ></el-option>
              </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="paramInfo">
      <div class="item-block-title paddingTop" @click="changeIconArrow(2)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">输入参数</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[2] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <DropTable
        class="table-params item-block-content"
        :dataSource="inputData"
        :cols="cols"
        :style="{height: blockCheck[2] ? 'auto' : 0}"
      />
    </div>

    <div class="node-select">
      <label class="white-color">选择测试节点：</label>
      <el-select v-model="testNode" multiple collapse-tags>
        <el-option
          :label="node.name"
          :value="node.nodeId"
          v-for="node in nodeList"
          :key="node.nodeId"
        />
      </el-select>
    </div>

    <div class="buttonBox">
      <button class="cm-btn deep btn" @click="openConfirm" v-if="canClick">执行</button>
      <el-button class="cm-btn deep" disabled type="primary" :loading="true" v-else>执行中</el-button>
    </div>
    <el-dialog title="执行详情" :visible.sync="resultDialog" center>
      <div class="resultInfo">
        <el-row :gutter="16" class="row-style">
          <el-col :span="8">
            <label>执行工具：</label>
            <span>{{common.runTool}}</span>
          </el-col>
          <el-col :span="14">
            <label>执行用户：</label>
            <span>{{common.runUser}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="row-style">
          <el-col :span="8">
            <label>总执行耗时：</label>
            <span>{{common.runTime}} s</span>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="row-style result">
          <el-col :span="3">执行情况：</el-col>
          <el-col :span="20">
            <el-table :data="nodeArr" :header-cell-style="{ background: '#f5f5f5' }">
              <el-table-column prop="nodeName" label="执行节点"></el-table-column>
              <el-table-column prop="performState" label="执行状态">
                <template slot-scope="scope">
                  <span
                    class="block-color"
                    :class="scope.row.performState === 'SUCCESS' ? 'success' : 'error'"
                  >{{scope.row.performState | changeShow}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="performTime" label="执行时间">
                <template slot-scope="scope">
                  <span>{{scope.row.performTime}} s</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-tabs @tab-click="handleChange">
          <el-tab-pane>
            <span slot="label" class="title-label">输出参数</span>
            <DropTable :dataSource="outPutData" :cols="cols" />
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" class="title-label">执行结果</span>
            <el-tabs type="border-card" class="tab-play-result" @tab-click="changeResult">
              <el-tab-pane v-for="no in nodeArr" :key="no.nodeId">
                <span slot="label" class="title-label">
                  {{no.nodeName}}
                  <icon-svg
                    v-if="no.performState == 'SUCCESS'"
                    class="success-operation-color"
                    icon-class="zhengque"
                  />
                  <icon-svg v-else class="task-operation-color" icon-class="jinggao" />
                </span>
              </el-tab-pane>
            </el-tabs>
            <div>
              <Terminal v-if="tabVal === '1'" :printString="performResult"></Terminal>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="cm-btn deep" @click="resultDialog = false">确 定</button>
      </span>
    </el-dialog>

    <el-dialog title="确认参数" :visible.sync="confirmDialog" center>
      <div class="dialog-content">
        <ParamTable :dataSource="currentParams" @rebackData="handleReback" :canAdd="false" />
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="cm-btn deep" @click="excuteTool">确认</button>
        <button class="cm-btn isoutline" @click="handleCancle">取消</button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import DropTable from './common-table.vue'
import ParamTable from './drop-table.vue'
import Terminal from '../../common/Terminal'
import axios from '@/api';
import { websocketurl } from '../../../config'
export default {
  name: 'excute',
  data () {
    return {
      blockCheck: { '1': true, '2': true },
      toolForm: {},
      inputData: [],
      typeList: [],
      currentId: this.$route.query.toolId,
      ToolTypeList: [
        {
          label: 'shell(.sh)',
          value: '1'
        },
        {
          label: 'python2(.py)',
          value: '2'
        },
        {
          label: 'powershell(.ps1)',
          value: '3'
        },
        {
          label: 'dos',
          value: '4'
        },
        {
          label: 'python3(.py)',
          value: '5'
        }
      ],
      nodeList: [],
      resultDialog: false,
      tabVal: '0', // 控制tab
      tagArr: [],
      cols: [
        { label: '参数名', prop: 'name', judge: 'paramsNameEdit' },
        { label: '参数标题名称', prop: 'titleName', judge: 'titleNameEdit' },
        { label: '参数值', prop: 'paramValue', judge: 'paramsValueEdit' },
        { label: '参数类型', prop: 'paramType', judge: 'paramsTypeEdit' },
        { label: '是否必填', prop: 'isEmpty', judge: 'isRequired' },
        { label: '参数说明', prop: 'paramState', judge: 'paramsMarkEdit' }
      ],
      testNode: [],
      outPutData: [],
      common: {},
      nodeArr: [],
      canClick: true,
      paramsString: '',
      confirmDialog: false,
      currentParams: [],
      socket: '',
      uuid: '',
      performResult: '' // 存储结果
    }
  },
  components: {
    DropTable,
    ParamTable,
    Terminal
  },
  beforeMount () {
    axios.userList({
      condition: '',
      current: 1,
      online: false,
      roleIds: [],
      size: 12,
      userStatus: ''
    }).then(res => {
      if (res.data.code === 200) {
        this.userList = res.data.data.result.records
        if (this.currentId) {
          this.getToolDetail(this.currentId)
        }
      }
    })
  },
  mounted () {
    this.getTestNodeList()
    this.getAllType()
    this.init()
  },
  destroyed () {
    // 销毁监听
    this.socket.onclose = this.close
  },
  filters: {
    changeShow (val) {
      if (val) {
        return val === 'SUCCESS' ? '执行成功' : '执行失败'
      } else {
        return val
      }
    }
  },
  methods: {
    init: function () {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(websocketurl)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function () {
      console.log('socket连接成功')
    },
    error: function () {
      console.log('连接错误')
    },
    getMessage: function (msg) {
      if (msg) {
        let data = JSON.parse(msg.data)
        if (data.uuid === this.uuid) {
          if (data.runTool) {
            this.canClick = true
            this.outPutData = []
            let nodeList = data.node
            let allTime = 0
            for (let node of nodeList) {
              allTime += parseInt(node.performTime)
            }
            this.common.runTime = allTime
            this.common.runTool = data.runTool
            this.common.runUser = localStorage.getItem('userName')
            let param = data.param
            for (let key of param) {
              key.paramsNameEdit = false
              key.paramsValueEdit = false
              key.paramsTypeEdit = false
              key.paramsMarkEdit = false
              key.titleNameEdit = false
              this.outPutData.push(key)
            }
            this.nodeArr = data.node
            this.resultDialog = true
          }
        }
      }
    },
    send: function (params) {
      this.socket.send(params)
    },
    close: function () {
      console.log('socket已经关闭')
    },
    changeIconArrow (val) {
      this.blockCheck[val] = !this.blockCheck[val]
    },
    handleCancle () {
      this.confirmDialog = false
      this.canClick = true
    },
    // 获取返回值
    handleReback (val) {
      this.inputData = val
    },
    // 执行前的确认
    openConfirm () {
      if (this.testNode.length > 0) {
        this.confirmDialog = true
        this.canClick = false
      } else {
        this.$notify({
          type: 'error',
          message: '请选择测试节点'
        })
      }
    },
    excuteTool () {
      this.paramsString = ''
      this.canClick = false
      let selectArr = []
      for (let node of this.nodeList) {
        for (let select of this.testNode) {
          if (select === node.nodeId) {
            selectArr.push(node.nodeId)
          }
        }
      }
      this.currentParams.map((item, index) => {
        if (item.name && item.titleName && item.paramType && item.isEmpty) {
          if ((item.isEmpty == '1' && item.paramValue) || item.isEmpty == '0') {
            this.errorMessageByInput = ''
          } else {
            this.errorMessageByInput = '必填项的参数值必填'
          }
        } else {
          this.errorMessageByInput = '输入参数有必填项未填写！'
        }
        if (this.paramsString != '') {
          if (item.paramType === '0') {
            this.paramsString = `${this.paramsString} ${item.name} ${item.paramValue}`
          } else if (item.paramType === '1') {
            if (item.paramValue === '1') {
              this.paramsString = `${this.paramsString} ${item.name}`
            }
          } else if (item.paramType === '2') {
            this.paramsString = `${this.paramsString} ${item.name}=${item.paramValue}`
          } else {
            this.paramsString = `${this.paramsString} ${item.paramValue}`
          }
        } else {
          if (item.paramType === '0') {
            this.paramsString = ` ${item.name} ${item.paramValue}`
          } else if (item.paramType === '1') {
            if (item.paramValue === '1') {
              this.paramsString = ` ${item.name}`
            }
          } else if (item.paramType === '2') {
            this.paramsString = ` ${item.name}=${item.paramValue}`
          } else {
            this.paramsString = ` ${item.paramValue}`
          }
        }
      })
      if (this.errorMessageByInput) {
        // loading.close();
        this.canClick = true
        this.$notify({
          type: 'error',
          message: this.errorMessageByInput
        })
      } else {
        this.confirmDialog = false
        this.uuid = this.getUUID()
        this.send(
          JSON.stringify({
            uuid: this.uuid,
            toolId: this.currentId,
            nodeInform: selectArr,
            userId: localStorage.getItem('userId'),
            paramsString: this.paramsString
          })
        )
        // excuteTool(params).then(res => {
        //   this.canClick = true;

        //   loading.close();
        //   if (res.data) {
        //     if (res.data.status.index == 200) {
        //       this.outPutData = [];
        //       this.common.runTime = res.data.runTime;
        //       this.common.runTool = res.data.runTool;
        //       this.common.runUser = res.data.runUser;
        //       let param = res.data.param;
        //       for (let key of param) {
        //         key.paramsNameEdit = false;
        //         key.paramsValueEdit = false;
        //         key.paramsTypeEdit = false;
        //         key.paramsMarkEdit = false;
        //         key.titleNameEdit = false;
        //         this.outPutData.push(key);
        //       }
        //       this.nodeArr = res.data.node;
        //       this.resultDialog = true;
        //     } else {
        //       this.canClick = true;
        //       this.$notify({
        //         type: 'error',
        //         message: '执行失败:' + res.data.status.info
        //       });
        //     }
        //   }
        // });
      }
    },
    getAllType () {
      axios.allType().then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.typeList = data
        }
      })
    },
    getToolDetail (id) {
      axios.toolDetail(id).then(res => {
        if (res.data.code === 200) {
          this.inputData = []
          let data = res.data.data
          this.toolForm = data
          let tags = JSON.parse(data.tagId)
          this.tagArr = tags
          let params = data.dlvParam
            ? typeof data.dlvParam === 'string'
              ? JSON.parse(data.dlvParam)
              : data.dlvParam
            : []
          let arr = []
          if (params.length > 0) {
            params.forEach((i, index) => {
              if (i.paramNature === '1') {
                i.paramsNameEdit = false
                i.paramsValueEdit = false
                i.paramsTypeEdit = false
                i.paramsMarkEdit = false
                i.titleNameEdit = false
                i.isRequired = false
                i.id = index + 1
                this.inputData.push(i)
                let str = JSON.stringify(i)
                let newStr = JSON.parse(str)
                arr.push(newStr)
              }
            })
          }
          this.currentParams = arr
        }
      })
    },
    getTestNodeList () {
      axios.testNode('', '').then(res => {
        if (res.data.code === 200) {
          this.nodeList = res.data.data.result
        } else {
          this.$notify({
            message: res.data.message
          })
        }
      })
    },
    // 生成特定uuid
    getUUID () {
      let dot = (+new Date()).toString()
      let userId = localStorage.getItem('userId')
      return `${dot}${userId}`
    },
    // 选择tab的回调
    handleChange (tab, event) {
      if (event.target.innerText === '执行结果') {
        this.tabVal = '1'
        this.performResult = this.nodeArr[0].performResult
      } else {
        this.tabVal = '0'
      }
    },
    changeResult (e) {
      this.performResult = this.nodeArr[e.index].performResult
    }
  }
}
</script>
<style scoped>
.table-params {
  width: 80%;
  border: 0;
  margin-left: 10%;
}
.node-select {
  margin-top: 30px;
}
.padding-title {
  padding: 20px 0;
}
.buttonBox {
  padding: 20px;
  text-align: left;
  margin-left: 10%;
}

.icon-style {
  font-size: 18px;
}
.title-label img {
  vertical-align: middle;
}
.node-select {
  padding: 0 10%;
}
.resultInfo > .row-style {
  margin: 10px 0;
}
.resultInfo > .row-style > ul > li {
  margin: 5px 0;
}
.tags-box {
  border: 1px solid #c6c6c6;
  width: 360px;
  min-height: 40px;
  border-radius: 6px;
  position: relative;
}
.tags-box > ul {
  padding: 0 10px;
}
.tags-box > ul > li {
  margin-bottom: 5px;
}
.tags-box > ul > li .tags-item {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.tags-box > ul > li .tags-item > li {
  padding: 0px 16px;
  margin: 6px 10px 6px 0;
  min-width: 40px;
  background-color: #fff;
  box-shadow: 0 0 8px #e0e0e0;
  line-height: 30px;
  border-radius: 16px;
  text-align: center;
}
.select-input {
  width: 100%;
}
.block-color {
  padding: 5px 10px;
  border-radius: 6px;
}
.success {
  background-color: #67c23a;
}
.error {
  background-color: #f56c6c;
}
.resultInfo > .result > ul > li {
  margin-right: 16px;
}
.code-box {
  min-height: 40px;
}
.code-box > div {
  white-space: pre-line;
}
.disable {
  background-color: #666;
  cursor: not-allowed;
}
.su-icon {
  width: 16px;
  height: 16px;
}
.dialog-content {
  text-align: center;
}
.item {
  margin: 5px 0;
}
.height0 {
  height: 0 !important;
  padding: 0 !important;
  overflow: hidden;
  transition: height 0.3s;
}
.tab-play-result /deep/ .el-tabs__content {
  padding: 0 !important;
}
</style>
