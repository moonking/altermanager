<template>
  <div class="container execute-box">
    <div class="baseInfo">
      <!-- <p class="mark-icon" @click="changeIconArrow(1)">
        基本信息
        <i
          class="iconfont el-icon-arrow-right"
          :style="{transform: blockCheck[1] ? 'rotate(90deg)':'rotate(0)'}"
        ></i>
      </p>-->
      <div class="item-block-title" @click="changeIconArrow(1)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">基本信息</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[1] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <el-form
        :model="toolForm"
        label-width="120px"
        class="block-content"
        :style="{height: blockCheck[1] ? 'auto' : 0}"
      >
        <el-form-item label="脚本名称：">
          <el-row>
            <el-col :span="10">
              <el-input v-model="toolForm.name" :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="脚本分类：">
          <el-row>
            <el-col :span="10">
              <el-input v-model="toolForm.groupName" :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="标签：">
          <el-row>
            <el-col :span="10">
              <div class="tags-box">
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
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="脚本内容：">
          <el-row>
            <el-col :span="10">
              <el-input type="textarea" :rows="5" v-model="toolForm.content" :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="脚本说明：">
          <el-row>
            <el-col :span="10">
              <el-input v-model="toolForm.remarks" :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="执行工具：">
          <!-- <el-select v-model="toolForm.runTool">
            <el-option label="工具一" value="1"></el-option>
          </el-select>-->
          <el-row>
            <el-col :span="10">
              <el-input v-model="toolForm.runTool" :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="脚本类型：">
          <el-row>
            <el-col :span="10">
              <el-select v-model="toolForm.toolType" disabled class="select-input">
                <el-option
                  :label="ty.label"
                  :value="ty.value"
                  v-for="(ty,index) in ToolTypeList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div class="paramInfo">
      <!-- <p class="mark-icon padding-title" @click="changeIconArrow(2)">
        输入参数
        <i
          class="iconfont el-icon-arrow-right"
          :style="{transform: blockCheck[2] ? 'rotate(90deg)':'rotate(0)'}"
        ></i>
      </p>-->
      <div class="item-block-title" @click="changeIconArrow(2)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">输入参数</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[2] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <drop-table
        class="table-params block-content"
        :dataSource="inputData"
        :cols="cols"
        :style="{height: blockCheck[2] ? 'auto' : 0}"
      />
    </div>

    <div class="node-select">
      <label>选择测试节点：</label>
      <el-select v-model="testNode" multiple collapse-tags>
        <el-option
          :label="node.name"
          :value="node.resourcesId"
          v-for="node in nodeList"
          :key="node.nodeId"
        ></el-option>
      </el-select>
    </div>

    <div class="buttonBox">
      <button class="cm-btn deep btn" @click="openConfirm" v-if="canClick">执行</button>
      <el-button class="cm-btn deep" disabled type="primary" :loading="true" v-else>执行中</el-button>
    </div>
    <el-dialog title="执行详情" :visible.sync="resultDialog" width="900px" center>
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
            <drop-table :dataSource="outPutData" :cols="cols" />
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" class="title-label">执行结果</span>
            <el-tabs type="border-card" @tab-click="handleCheckTab">
              <el-tab-pane v-for="no in nodeArr" :key="no.nodeId" class="tab-item-style">
                <span slot="label" class="title-label">
                  {{no.nodeName}}
                  <icon-svg
                    v-if="no.performState === 'SUCCESS'"
                    class="success-operation-color"
                    icon-class="zhengque"
                  />
                  <icon-svg v-else class="middle-operation-color" icon-class="jinggao" />
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
        <param-table
          class="table-params"
          :dataSource="currentParams"
          @rebackData="handleReback"
          :canAdd="false"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="cm-btn deep" style="margin-right: 200px" @click="excuteTool">确认</button>
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
        },
        { label: 'playbook(yml)', value: '6' }
      ],
      nodeList: [],
      resultDialog: false,
      tabVal: '0', // tab切换控制
      tagArr: [],
      cols: [
        { label: '参数名', prop: 'name', judge: 'paramsNameEdit' },
        { label: '参数标题名称', prop: 'titleName', judge: 'titleNameEdit' },
        { label: '参数类型', prop: 'paramType', judge: 'paramsTypeEdit' },
        { label: '参数值', prop: 'paramValue', judge: 'paramsValueEdit' },
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
      performResult: '' // 执行后的结果
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
    this.getExeData()
  },
  filters: {
    changeShow (val) {
      return val === 'SUCCESS' ? '执行成功' : '执行失败'
    }
  },
  methods: {
    getExeData () {
      this.$global.wsdevops.onmessage = this.getMessage
    },
    // websocket的数据获取
    getMessage: function (msg) {
      if (msg) {
        let data = JSON.parse(msg.data)
        if (data.uuid === this.uuid) {
          this.canClick = true
          if (data.runTool) {
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
          } else {
            this.$notify({
              title: '提示',
              type: 'error',
              message: data.status
            })
          }
        }
      }
    },
    send: function (params) {
      this.$global.wsdevops.send(params)
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
          if (select === node.resourcesId) {
            selectArr.push(node.resourcesId)
          }
        }
      }
      this.currentParams.map((item, index) => {
        if (item.titleName && item.paramType && item.isEmpty) {
          if ((item.isEmpty == '1' && item.paramValue) || item.isEmpty == '0') {
            this.errorMessageByInput = ''
          } else {
            this.errorMessageByInput = '必填项的参数值必填'
          }
        } else {
          this.errorMessageByInput = '输入参数有必填项未填写！'
        }

        // if (this.paramsString != '') {
        //   if (item.paramType === '0') {
        //     this.paramsString = `${this.paramValue} ${item.name} ${item.paramValue}`
        //   } else if (item.paramType === '1') {
        //     if (item.paramValue === '1') {
        //       this.paramsString = `${this.paramsString} ${item.name}`
        //     }
        //   } else if (item.paramType === '2') {
        //     this.paramsString = `${this.paramsString} ${item.name}=${item.paramValue}`
        //   } else {
        //     this.paramsString = `${this.paramsString} ${item.paramValue}`
        //   }
        // } else {
        //   if (item.paramType === '0') {
        //     this.paramsString = ` ${item.name} ${item.paramValue}`
        //   } else if (item.paramType === '1') {
        //     if (item.paramValue === '1') {
        //       this.paramsString = ` ${item.name}`
        //     }
        //   } else if (item.paramType === '2') {
        //     this.paramsString = ` ${item.name}=${item.paramValue}`
        //   } else {
        //     this.paramsString = ` ${item.paramValue}`
        //   }
        // }
        if (item.paramType === '0') {
          this.paramsString += ` ${item.name} ${item.paramValue}`
        } else if (item.paramType === '1') {
          if (item.paramValue === '1') {
            this.paramsString += ` ${item.name}`
          }
        } else if (item.paramType === '2') {
          this.paramsString += ` ${item.name}=${item.paramValue}`
        } else {
          this.paramsString += ` ${item.paramValue}`
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
      }
    },
    getAllType () {
      axios.OpsAllType().then(res => {
        if (res.data.function.length > 0) {
          let data = res.data.function
          this.typeList = data
        }
      })
    },
    getToolDetail (id) {
      axios.OpsToolDetail(id).then(res => {
        if (res.data.result) {
          this.inputData = []
          let data = res.data.result
          this.toolForm = data
          let tags = JSON.parse(data.tagId)
          this.tagArr = tags
          let params = res.data.param
          let arr = []
          params.map((i, index) => {
            if (i.paramNature == 1) {
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
          this.currentParams = arr
        }
      })
    },
    getTestNodeList () {
      axios.OpsTestNode().then(res => {
        if (res.data.code === 200) {
          this.nodeList = res.data.data
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
    // 点击tab切换赋值
    handleCheckTab (e) {
      this.performResult = this.nodeArr[e.index].performResult
    }
  }
}
</script>
<style scoped>
.table-params {
  width: 98%;
  border: 0;
  margin: auto;
}
.item-block-title {
  margin: 20px;
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
.node-wrapper {
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
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
/* .code-box > div {
  white-space: pre-line;
} */
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
  width: 40%;
}
.height0 {
  height: 0 !important;
  padding: 0 !important;
  overflow: hidden;
  transition: height 0.3s;
}
.tab-item-style {
  background: #585858;
  color: #fff;
}
.block-content {
  overflow: hidden;
}
.execute-box {
  padding: 0 !important;
}
</style>
