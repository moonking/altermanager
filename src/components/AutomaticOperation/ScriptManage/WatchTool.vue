<template>
  <div class="container baseInfo aibms-color-bg non-border">
    <div class="baseInfo">
      <!-- <p class="mark-icon" @click="changeStatus(1)">
        基本信息
        <i
          class="iconfont el-icon-arrow-right"
          :style="{transform: blockCheck[1] ? 'rotate(90deg)':'rotate(0)'}"
        ></i>
      </p>-->
      <div class="item-block-title" @click="changeStatus(1)">
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
        :style="{height: blockCheck[1] ? 'auto' : 0}"
        class="block-content"
      >
        <el-form-item label="脚本名称：">
          <el-row>
            <el-col :span="10">
              <el-input v-model="toolForm.name" :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="功能分类：">
          <el-row>
            <el-col :span="10">
              <el-input v-model="toolForm.groupName" :disabled="true"></el-input>
              <!-- <el-select v-model="toolForm.groupId" style="width: 100%;">
                <el-option v-for="(type,index) in typeList" :key="index" :label="type.name" :value="type.grouptagId"></el-option>
              </el-select>-->
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="标签云：">
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
        <el-form-item label="脚本内容：">
          <el-row>
            <el-col :span="10">
              <!-- <el-input type="textarea" :rows="8" v-model="toolForm.content" :disabled="true"></el-input> -->
              <editor
                editorId="editor2"
                :readValue="toolForm.content"
                :readOnly="true"
                :initWidth="465"
                :initHeight="180"
              ></editor>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="脚本说明：">
          <el-row>
            <el-col :span="10">
              <el-input v-model="toolForm.remarks" :disabled="true" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="执行工具：">
          <!-- <el-select v-model="toolForm.runTool">
            <el-option label="工具一" value="1"></el-option>
          </el-select>-->
          <el-row>
            <el-col :span="10">
              <el-input v-model="toolForm.runTool" :disabled="true" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div class="paramInfo">
      <!-- <p class="mark-icon padding-title" @click="changeStatus(2)">
        输入参数
        <i
          class="iconfont el-icon-arrow-right"
          :style="{transform: blockCheck[2] ? 'rotate(90deg)':'rotate(0)'}"
        ></i>
      </p>-->
      <div class="item-block-title" @click="changeStatus(2)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">输入参数</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[2] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <common-table
        :dataSource="inputTableData"
        :cols="inputParams"
        class="table-params block-content"
        :style="{height: blockCheck[2] ? 'auto' : 0}"
      />
    </div>
    <div class="paramInfo">
      <!-- <p class="mark-icon padding-title" @click="changeStatus(3)">
        输出参数
        <i
          class="iconfont el-icon-arrow-right"
          :style="{transform: blockCheck[3] ? 'rotate(90deg)':'rotate(0)'}"
        ></i>
      </p>-->
      <div class="item-block-title" @click="changeStatus(3)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">输出参数</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[3] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <common-table
        :dataSource="outputTableData"
        :cols="outputParams"
        class="table-params block-content"
        :style="{height: blockCheck[3] ? 'auto' : 0}"
      />
    </div>
    <div class="approveInfo">
      <!-- <p class="mark-icon padding-title" @click="changeStatus(4)">
        审批信息
        <i
          class="iconfont el-icon-arrow-right"
          :style="{transform: blockCheck[4] ? 'rotate(90deg)':'rotate(0)'}"
        ></i>
      </p>-->
      <div class="item-block-title" @click="changeStatus(4)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">审批信息</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[4] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <el-form
        :model="approveInfo"
        class="form-box block-content"
        label-width="100px"
        :style="{height: blockCheck[4] ? 'auto' : 0}"
      >
        <el-form-item label="审批人: ">
          <user-selector :selectedList="ApproveList" />
        </el-form-item>
        <el-form-item label="抄送人: ">
          <user-selector :selectedList="copyToList" />
        </el-form-item>
      </el-form>
    </div>
    <div class="logInfo">
      <!-- <p class="mark-icon padding-title" @click="changeStatus(5)">
        修改日志
        <i
          class="iconfont el-icon-arrow-right"
          :style="{transform: blockCheck[5] ? 'rotate(90deg)':'rotate(0)'}"
        ></i>
      </p>-->
      <div class="item-block-title" @click="changeStatus(5)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">修改日志</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[5] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div class="block block-content" :style="{height: blockCheck[5] ? 'auto' : 0}">
        <ul>
          <li class="timeline-item" v-for="user in editArr" :key="user.logId">
            <p>
              <img src="../../../../static/img/icon/time.png" alt />
              <span>{{user.createDate}}</span>
            </p>
            <ul class="list-box">
              <li>
                <span class="time"></span>
                <img :src="user.photo" alt />
                <span class="operation">
                  <label>操作人：</label>
                  <span>{{user.loginName}}</span>
                </span>
                <span class="code">
                  <label>版本号：</label>
                  <span @click="logDetail(user.logId)">{{user.logId}}</span>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="excuteInfo">
      <!-- <p class="mark-icon padding-title" @click="changeStatus(6)">
        执行记录
        <i
          class="iconfont el-icon-arrow-right"
          :style="{transform: blockCheck[6] ? 'rotate(90deg)':'rotate(0)'}"
        ></i>
      </p>-->
      <div class="item-block-title" @click="changeStatus(6)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">执行记录</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[6] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div class="table-params block-content">
        <el-table
          :data="tableData"
          :header-cell-style="{background:'#f5f5f5'}"
          :default-sort="{prop: 'sort', order: 'descending'}"
          :style="{height: blockCheck[6] ? 'auto' : 0}"
        >
          <el-table-column type="expand" width="60px">
            <template slot-scope="scope">
              <div class="tool-display-box">
                <div class="tool-title">
                  <img
                    src="../../../../static/img/icon/success.png"
                    alt
                    v-if="scope.row.performState ==='SUCCESS'"
                  />
                  <img src="../../../../static/img/icon/error.png" alt v-else />
                  <span class="tool-user-box">
                    <label>启动用户：</label>
                    <span>{{scope.row.createBy}}</span>
                  </span>
                  <span class="tool-file-box">
                    <label>目录：</label>
                    <span>{{scope.row.homeFile}}</span>
                  </span>
                </div>
                <div class="content-code">
                  <terminal :printString="scope.row.performResult" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="执行状态" width="120px">
            <template slot-scope="scope">
              <img
                class="common-icon"
                src="../../../../static/img/icon/success.png"
                alt
                v-if="scope.row.performState ==='SUCCESS'"
              />
              <img class="common-icon" src="../../../../static/img/icon/error.png" alt v-else />
            </template>
          </el-table-column>
          <el-table-column label="运行次数" prop="sort" width="120px" />
          <el-table-column label="执行用户" prop="createBy" />
          <el-table-column label="执行节点" prop="nodeName" />
          <el-table-column label="启动时间" prop="createDate" />
        </el-table>
      </div>
    </div>
    <el-dialog center :title="log.name" :visible.sync="logDialog">
      <div class="baseInfo">
        <p class="mark-icon">基本信息</p>
        <el-form :model="log" label-width="120px">
          <el-form-item label="脚本名称：">
            <el-row>
              <el-col :span="10">
                <span>{{log.name}}</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="脚本分类：">
            <el-row>
              <el-col :span="10">
                <span>{{log.groupName}}</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="标签：">
            <el-row>
              <el-col :span="10">
                <div class="tags-box">
                  <ul>
                    <li v-for="(tag,index) in logTags" :key="index">
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
          <el-form-item label="脚本类型：">
            <el-row>
              <el-col :span="10">
                <span>{{log.toolType | filterType}}</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="脚本内容：">
            <el-row>
              <el-col :span="10">
                <editor
                  editorId="dialogEditor"
                  :readValue="log.content"
                  :readOnly="true"
                  :initWidth="465"
                  :initHeight="380"
                ></editor>
                <!-- <editor :readValue="log.content" :readOnly="true"  :initWidth="465" :initHeight="180"></editor> -->
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="脚本说明：">
            <el-row>
              <el-col :span="10">
                <span>{{log.remarks}}</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="执行工具：">
            <el-row>
              <el-col :span="10">
                <span>{{log.runTool}}</span>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div class="paramInfo">
        <p class="mark-icon padding-title">输入参数</p>
        <common-table :dataSource="logInputData" :cols="inputParams" class="table-params" />
      </div>
      <div class="paramInfo">
        <p class="mark-icon padding-title">输出参数</p>
        <common-table :dataSource="logOutputData" :cols="outputParams" class="table-params" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Editor from '../../common/Editor.vue'
import CommonTable from './common-table.vue'
import axios from '@/api';
import UserSelector from './user-selector'
import Terminal from '../../common/Terminal'

export default {
  name: 'watchTool',
  data () {
    return {
      blockCheck: {
        '1': true,
        '2': true,
        '3': true,
        '4': true,
        '5': true,
        '6': true
      },
      toolForm: {},
      inputTableData: [],
      outputTableData: [],
      inputParams: [
        { label: '参数名', prop: 'name' },
        { label: '参数标题名称', prop: 'titleName' },
        { label: '参数值', prop: 'paramValue' },
        { label: '参数类型', prop: 'paramType' },
        { label: '是否必填', prop: 'isEmpty' },
        { label: '参数说明', prop: 'paramState' }
      ],
      outputParams: [
        { label: '参数名', prop: 'name' },
        { label: '参数标题名称', prop: 'titleName' },
        { label: '参数值', prop: 'paramValue' },
        { label: '参数类型', prop: 'paramType' },
        { label: '是否必填', prop: 'isEmpty' },
        { label: '参数说明', prop: 'paramState' }
      ],
      approveInfo: {},
      ApproveList: [],
      tableData: [
        {
          state: 1,
          run: 21,
          user: 'root',
          node: '152.79.woeladd',
          time: '2019-05-04'
        }
      ],
      currentId: this.$route.query.toolId,
      userList: [],
      copyToList: [],
      tagArr: [],
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
        {
          label: 'playbook(yml)',
          value: '6'
        }
      ],
      log: {},
      logTagArr: [],
      logDialog: false,
      editArr: [],
      logTags: [],
      logInputData: [],
      logOutputData: [],
      defaultData: [
        {
          applyUserid: '[]',
          approvalids: '[]',
          content: 'GIT',
          createBy: '',
          createName: '',
          dlvParam: '',
          groupId: '',
          groupName: '',
          name: 'GIT代码获取',
          nodeInform: '',
          remarks: 'knkjn',
          runTool: 'ansible',
          sendcopyids: '[]',
          tagId: '[]',
          toolId: 'x037a1271e83b4d629053b4978eec1b5b',
          toolType: '2'
        },
        {
          applyUserid: '[]',
          approvalids: '[]',
          content: 'SVN',
          createBy: '',
          createName: '',
          groupId: '',
          groupName: '',
          name: 'SVN代码获取',
          nodeInform: '',
          remarks: 'knkjn',
          runTool: 'ansible',
          sendcopyids: '[]',
          tagId: '[]',
          toolId: 'x037a1271e83b4d629053b4978eec1b5c',
          toolType: '2'
        }
      ]
      // type: this.$route.query.type
    }
  },
  components: {
    CommonTable,
    UserSelector,
    Editor,
    Terminal
  },
  mounted () {
    // if (this.type) {
    //   this.getLocal();
    // } else {
    axios.userList({
      condition: '',
      current: 1,
      online: false,
      roleIds: [],
      size: 30,
      userStatus: ''
    }).then(res => {
      if (res.data.code === 200) {
        this.userList = res.data.data.result.records
        this.getToolDetail()
      } else {
        this.$notify({
          message: '用户信息请求失败'
        })
      }
    })
    // }
  },
  filters: {
    filterType (val) {
      if (val) {
        return val == 1
          ? 'shell(.sh)'
          : val == 2
            ? 'python(.py)'
            : val == 3
              ? 'powershell(.ps1)'
              : 'dos'
      } else {
        return val
      }
    }
  },
  methods: {
    // 折叠控制
    changeStatus (val) {
      this.blockCheck[val] = !this.blockCheck[val]
    },
    // getLocal () {
    //   let data;
    //   for (let key of this.defaultData) {
    //     if (key.toolId == this.currentId) {
    //       data = key;
    //     }
    //   }
    //   this.toolForm = data;
    //   let tags = JSON.parse(this.toolForm.tagId);
    //   this.tagArr = tags;
    //   let approve = JSON.parse(this.toolForm.approvalids);
    //   approve.forEach(item => {
    //     this.userList.forEach(user => {
    //       if (user.userId === item.userId) {
    //         item.name = user.name;
    //         item.photo = user.photo;
    //       }
    //     });
    //   });
    //   console.log(approve);
    //   this.ApproveList = approve;
    //   let copyList = JSON.parse(data.sendcopyids);
    //   copyList.forEach(item => {
    //     this.userList.forEach(user => {
    //       if (user.userId === item.userId) {
    //         item.name = user.name;
    //         item.photo = user.photo;
    //       }
    //     });
    //   });
    //   this.copyToList = copyList;
    //   let params = [];
    //   this.inputTableData = [];
    //   this.outputTableData = [];
    //   params.forEach(item => {
    //     if (item.paramNature == 1) {
    //       this.inputTableData.push(item);
    //     } else if (item.paramNature == 2) {
    //       this.outputTableData.push(item);
    //     }
    //   });
    //   this.tableData = [];
    //   this.editArr = [];
    // },
    logDetail (id) {
      axios.OpsEditLogs(id).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.log = data
          let tags = JSON.parse(data.tagId)
          this.logTags = tags
          let params = JSON.parse(data.toolParams)
          this.logInputData = []
          this.logOutputData = []
          if (params) {
            params.forEach(item => {
              if (item !== null && item.paramNature == 1) {
                this.logInputData.push(item)
              } else if (item !== null && item.paramNature == 2) {
                this.logOutputData.push(item)
              }
            })
          } else {
            this.logInputData = []
            this.logOutputData = []
          }
          this.logDialog = true
        }
      })
    },
    getToolDetail () {
      axios.OpsToolDetail(this.currentId).then(res => {
        if (res.data.result) {
          let data = res.data.result
          this.toolForm = data
          let tags = JSON.parse(this.toolForm.tagId)
          this.tagArr = tags
          let approve = JSON.parse(this.toolForm.approvalids)
          approve.forEach(item => {
            this.userList.forEach(user => {
              if (user.userId === item.userId) {
                item.name = user.name
                item.photo = user.photo
              }
            })
          })
          this.ApproveList = approve
          let copyList = JSON.parse(data.sendcopyids)
          copyList.forEach(item => {
            this.userList.forEach(user => {
              if (user.userId === item.userId) {
                item.name = user.name
                item.photo = user.photo
              }
            })
          })
          this.copyToList = copyList
          let params = res.data.param
          this.inputTableData = []
          this.outputTableData = []
          params.forEach(item => {
            if (item.paramNature == 1) {
              this.inputTableData.push(item)
            } else if (item.paramNature == 2) {
              this.outputTableData.push(item)
            }
          })
          this.tableData = res.data.toolsLog
          this.editArr = res.data.updateLogs
        }
      })
    }
  }
}
</script>
<style scoped>
.baseInfo {
  padding: 10px 0;
}
.item-block-title {
  margin-top: 0;
  margin-bottom: 20px;
}
.el-table::before {
  height: 0 !important;
}
.table-params {
  width: 100%;
  box-sizing: border-box;
  border: none;
  margin-bottom: 30px;
  padding: 0 20px;
  /* margin-left: 5%; */
}
.paramInfo > .padding-title,
.approveInfo > .padding-title,
.logInfo > .padding-title,
.resultInfo > .padding-title,
.excuteInfo > .padding-title {
  padding: 20px 0;
}
.icon-style {
  font-size: 18px;
}
.title-label > img {
  vertical-align: middle;
}
.approveInfo .form-box {
  padding: 0 10%;
}
.approveInfo .userInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.approveInfo .userInfo > img {
  width: 60px;
  height: 60px;
  margin: 0 20px;
  border-radius: 50%;
  border: 2px solid #0280ff;
}
.logInfo .block {
  padding: 0 10%;
}
.logInfo .block .list-box > li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logInfo .block .list-box > li > img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.logInfo .block .timeline-item {
  padding: 10px;
}
.logInfo .block .timeline-item > p {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.logInfo .block .timeline-item > p > img {
  width: 20px;
  height: 20px;
}
.logInfo .block .timeline-item > p > span {
  padding-left: 20px;
  font-size: 14px;
  color: #3e444a;
}
.logInfo .block .timeline-item > .list-box {
  width: 90%;
  margin-left: 20px;
  padding-left: 30px;
  border-left: 2px solid #707070;
}
.logInfo .block .timeline-item > .list-box > li {
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logInfo .block .timeline-item > .list-box > li .time {
  font-size: 15px;
  color: #3e444a;
  padding: 0 20px;
}
.logInfo .block .timeline-item > .list-box > li > img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.logInfo .block .timeline-item > .list-box > li .operation {
  padding: 0 30px 0 20px;
  font-size: 15px;
  color: #3e444a;
}
.logInfo .block .timeline-item > .list-box > li .code {
  font-size: 15px;
}
.logInfo .block .timeline-item > .list-box > li .code > span {
  color: #0066ff;
  cursor: pointer;
}
.excuteInfo .tool-display-box {
  min-height: 100px;
  background-color: #585858;
}
.excuteInfo .tool-display-box .tool-title {
  padding: 5px 0;
  background-color: #ededed;
  font-size: 15px;
  color: #777;
}
.excuteInfo .tool-display-box .tool-title > img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0 20px;
}
.excuteInfo .tool-display-box .tool-title > .tool-user-box {
  vertical-align: middle;
  padding: 0 10px;
  font-size: 14px;
}
.tool-title > .tool-user-box label,
.tool-title > .tool-user-box span,
.tool-title > .tool-file-box label,
.tool-title > .tool-file-box span {
  font-size: 14px;
}
.excuteInfo .tool-display-box .tool-title > .tool-file-box {
  vertical-align: middle;
  padding: 0 0 0 10px;
  font-size: 14px;
}
.excuteInfo .tool-display-box .content-code {
  font-size: 18px;
  color: #fff;
  white-space: pre-line;
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
.common-icon {
  width: 20px;
  height: 20px;
}
.block-content {
  overflow: hidden;
}
</style>
<style>
.excuteInfo
  .el-table
  .el-table__body-wrapper
  .el-table__body
  > tbody
  > tr
  .el-table__expanded-cell {
  padding: 0 !important;
}
.item-block-title {
  margin: 20px 0;
}
</style>
