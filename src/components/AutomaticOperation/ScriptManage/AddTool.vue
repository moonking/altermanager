<template>
  <div class="container refreshContainer aibms-bg non-border">
    <div class="wrapper aibms-color-bg">
      <div class="block-item base-info">
        <!-- <div class="block-title" @click="closeBlock(1)">
          <div class="title-tips"></div>
          <h3>
            基本信息
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
            ></i>
          </h3>
        </div>-->
        <div class="item-block-title" @click="closeBlock(1)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">基本信息</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <!-- <p class="mark-icon padding-title" @click="closeBlock(1)">
          基本信息&nbsp;&nbsp;
          <i
            class="iconfont el-icon-arrow-right"
            :style="{transform: blockSwitch[1] ? 'rotate(90deg)':'rotate(0)'}"
          ></i>
        </p>-->
        <div class="block-content" :class="{height0: !blockSwitch[1]}">
          <el-form
            class="white-color"
            :model="baseFormData"
            ref="baseFormData"
            label-position="right"
            label-width="100px"
            :rules="rules"
          >
            <el-form-item label="脚本名称：" prop="name">
              <el-input v-model="baseFormData.name" maxlength="20" :style="{width: '360px'}"></el-input>
            </el-form-item>
            <el-form-item label="功能分类：" prop="groupId">
              <el-select
                v-model="baseFormData.groupId"
                placeholder="请选择"
                :style="{width: '360px'}"
                @change="handleSelectOption"
              >
                <el-option
                  v-for="(type,index) in typeList"
                  :key="index"
                  :label="type.name"
                  :value="type.grouptagId"
                ></el-option>
                <el-option label="+" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签云：">
              <div>
                <div v-if="selectTagList.length == 0">
                  <i class="el-icon-plus" @click="openSelect"></i>
                </div>
                <div v-if="selectTagList.length > 0" style="width: 360px;">
                  <div class="tags-box">
                    <div class="box-wrapper">
                      <div class="box-left">
                        <ul>
                          <li v-for="(tag,index) in selectTagList" :key="index">
                            <el-row class="left-title">
                              <el-col :span="6" @click.native="changeIcon(tag)">
                                <i class="el-icon-caret-right" v-if="tag.iscloose == true"></i>
                                <i class="el-icon-caret-bottom" v-if="tag.iscloose == false"></i>
                              </el-col>
                              <el-col :span="12">
                                <span>{{tag.name}}</span>
                              </el-col>
                            </el-row>
                            <ul class="tagsList" v-if="tag.iscloose == false">
                              <li v-for="(item,idx) in tag.child" :key="idx">
                                <span>{{item.name}}</span>
                              </li>
                            </ul>
                            <div class="edit-icon" v-if="tag.iscloose == false">
                              <i class="el-icon-edit cursor" @click="tagOperation"></i>
                              <i class="el-icon-delete cursor" @click="tagOperation"></i>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="脚本类型：" prop="toolType">
              <el-select v-model="baseFormData.toolType" :style="{width: '360px'}">
                <el-option
                  :label="ty.label"
                  :value="ty.value"
                  v-for="(ty,index) in ToolTypeList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="脚本内容：" prop="content">
              <!-- <el-input
                type="textarea"
                v-model=""
                :rows="6"
                :style="{width: '360px'}"
              ></el-input>-->
              <editor editorId="code-editor" :value.sync="baseFormData.content" :initWidth="600"></editor>
            </el-form-item>
            <el-form-item label="脚本说明：">
              <el-input v-model="baseFormData.remarks" maxlength="150" :style="{width: '360px'}"></el-input>
            </el-form-item>
            <el-form-item label="执行工具：" prop="runTool">
              <el-select v-model="baseFormData.runTool" :style="{width: '360px'}">
                <el-option
                  v-for="item in toolkitList"
                  :label="item.name"
                  :value="item.name"
                  :key="item.toolsId"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="block-item input-param">
        <!-- <div class="block-title" @click="closeBlock(2)">
          <div class="title-tips"></div>
          <h3>
            输入参数
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'}"
            ></i>
          </h3>
        </div>-->
        <div class="item-block-title" @click="closeBlock(2)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">输入参数</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <!-- <p class="mark-icon padding-title" @click="closeBlock(2)">
          输入参数&nbsp;&nbsp;
          <i
            class="iconfont el-icon-arrow-right"
            :style="{transform: blockSwitch[2] ? 'rotate(90deg)':'rotate(0)'}"
          ></i>
        </p>-->
        <div :class="{height0: !blockSwitch[2]}">
          <drop-table
            class="table-params"
            :dataSource="inputData"
            @rebackData="handleReback"
            @isDelete="handleDeleteParam"
          />
        </div>
      </div>
      <div class="block-item output-param">
        <!-- <div class="block-title" @click="closeBlock(3)">
          <div class="title-tips"></div>
          <h3>
            输出参数
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: blockSwitch[3] ? 'rotate(90deg)' : 'rotate(0)'}"
            ></i>
          </h3>
        </div>-->
        <div class="item-block-title" @click="closeBlock(3)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">输出参数</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[3] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <!-- <p class="mark-icon padding-title" @click="closeBlock(3)">
          输出参数&nbsp;&nbsp;
          <i
            class="iconfont el-icon-arrow-right"
            :style="{transform: blockSwitch[3] ? 'rotate(90deg)':'rotate(0)'}"
          ></i>
        </p>-->
        <div :class="{height0: !blockSwitch[3]}">
          <drop-table
            class="table-params"
            :dataSource="outputData"
            @rebackData="handleOutputReback"
            @isDelete="handleParamDelete"
          />
          <!-- <OutputTable
            class="table-params"
            :dataSource="outputData"
            @rebackData="handleOutputReback"
            @isDelete="handleParamDelete"
          />-->
        </div>
      </div>
      <div class="block-item approve-info">
        <!-- <div class="block-title" @click="closeBlock(4)">
          <div class="title-tips"></div>
          <h3>
           审批信息
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: blockSwitch[4] ? 'rotate(90deg)' : 'rotate(0)'}"
            ></i>
          </h3>
        </div>-->
        <div class="item-block-title" @click="closeBlock(4)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">审批信息</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[4] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <!-- <p class="mark-icon padding-title" @click="closeBlock(4)">
          审批信息&nbsp;&nbsp;
          <i
            class="iconfont el-icon-arrow-right"
            :style="{transform: blockSwitch[4] ? 'rotate(90deg)':'rotate(0)'}"
          ></i>
        </p>-->
        <div :class="['block-content',{height0: !blockSwitch[4]}]">
          <el-form :model="approveFormData">
            <el-form-item label="审批人：">
              <user-selector
                :selected-list.sync="approveList"
                :candidates="userList"
                :isEdit="true"
              ></user-selector>
            </el-form-item>
            <el-form-item label="抄送人：">
              <user-selector :selected-list.sync="copyToList" :candidates="userList" :isEdit="true"></user-selector>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="confirm-canseladd">
        <el-button
          type="primary"
          class="margin-right"
          :style="{marginRight: '100px'}"
          @click.stop="addTool"
        >保存</el-button>
        <span v-if="!currentId">
          <el-button
            type="primary"
            class=" margin-right"
            :style="{marginRight: '100px'}"
            @click.stop="addTool(1)"
          >保存并发起审批</el-button>
        </span>
        <el-button class="nomal-button" @click="cancelAdd">取消</el-button>
      </div>
      <div class="clear"></div>
    </div>

    <el-dialog center title="新增功能分类" :visible.sync="typeDialog" width="30%">
      <el-form label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="newTypeName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button class="cm-btn deep margin-right" @click="confirmType">确 定</button>
        <button class="cm-btn isoutline" @click="handleCancle">取 消</button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="tagDialog" title="选择标签" center>
      <el-row>
        <el-col :span="24">
          <div class="tags-box">
            <div class="newBtn" @click="openTagDialog">
              <icon-svg icon-class="wenjianjia" />
              <span>创建标签分类</span>
            </div>
            <ul>
              <li v-for="(tag,index) in tagArr" :key="index">
                <el-row :gutter="20">
                  <el-col :span="22">
                    <el-row class="left-title">
                      <el-col :span="2" @click.native="changeIcon(tag, true)">
                        <i class="el-icon-caret-right cursor" v-if="tag.iscloose == true"></i>
                        <i class="el-icon-caret-bottom cursor" v-if="tag.iscloose == false"></i>
                      </el-col>
                      <el-col :span="14" @dblclick.native="handleDbclick(tag)">
                        <el-input
                          class="input-style"
                          v-model="tag.name"
                          maxlength="20"
                          @keyup.enter.native="handleInputTag(tag)"
                          v-if="tag.typetag == 1"
                        ></el-input>
                        <button
                          class="cm-btn deep private"
                          @click="handleInputTag(tag)"
                          v-if="tag.typetag == 1"
                        >保存</button>
                        <span class="cursor" v-if="tag.typetag == 0">{{tag.name}}</span>
                        <span class="cursor" v-if="tag.typetag == 2">编辑标签</span>
                      </el-col>
                    </el-row>
                    <ul class="tags-item" v-if="tag.iscloose == false">
                      <li
                        class="cursor"
                        v-for="(item,idx) in tag.groupOp"
                        :key="idx"
                        :class="{'isSelect': item.isSelected}"
                        @click.stop="selectTag(item,index,idx)"
                        @dblclick.stop="editTagOpen(item)"
                      >
                        <span v-if="!item.isEditTag">{{item.name}}</span>
                        <el-input
                          class="input-style"
                          v-model="item.name"
                          maxlength="20"
                          v-if="item.isEditTag"
                          @blur="handleConfirmEdit"
                          @keyup.enter.native="handleConfirmEdit(item)"
                        ></el-input>
                        <button
                          class="cm-btn deep private"
                          @click="handleConfirmEdit(item)"
                          v-if="item.isEditTag"
                        >保存</button>
                        <i
                          class="el-icon-error position-icon cursor"
                          style="margin-left: 2px"
                          v-if="!item.isEditTag"
                          @click.stop="removeTag(item.grouptagId)"
                        ></i>
                      </li>
                      <li>
                        <span
                          class="add-font-style cursor"
                          v-if="!tag.clickEdit"
                          @click="clickEdit(tag,index)"
                        >+新建标签</span>
                        <el-input
                          class="input-new-tag input-style"
                          v-if="tag.clickEdit"
                          v-model="test"
                          size="small"
                          maxlength="20"
                          @keyup.enter.native="handleConfirmTag(tag,index)"
                        ></el-input>
                        <button
                          class="cm-btn deep private cursor"
                          v-if="tag.clickEdit"
                          @click="handleConfirmTag(tag,index)"
                        >保存</button>
                      </li>
                    </ul>
                  </el-col>

                  <el-col :span="2">
                    <i class="el-icon-delete cursor" @click="deleteTagArr(tag,index)"></i>
                  </el-col>
                </el-row>
              </li>
            </ul>
            <div class="clear"></div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <button class="cm-btn deep" style="margin-right: 200px" @click="confirmForTags">确 定</button>
        <button class="cm-btn isoutline" @click="cancelConfirm">取 消</button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import DropTable from './drop-table.vue'
import UserSelector from '../../AutomatedRelease/ToolsManagement/UserSelector'
import axios from '@/api';
import Editor from '../../common/Editor'
export default {
  data () {
    return {
      baseFormData: {},
      blockSwitch: { '1': true, '2': true, '3': true, '4': true },
      inputData: [],
      outputData: [],
      approveFormData: {},
      approveList: [],
      copyToList: [],
      testList: [],
      userList: [],
      toolkitList: [],
      userApproveSelected: '',
      // 表示是否在选择审批用户，用来控制添加按钮和添加列表的互斥显示
      isApproveSelecting: false,
      userCopyToSelected: '',
      // 表示是否在选择抄送用户，用来控制添加按钮和添加列表的互斥显示
      isCopyToSelecting: false,
      tagsDialog: false,
      typeList: [],
      test: '',
      dbClickParent: 0,
      dialogDbClick: 0,
      tagArr: [],
      typeDialog: false,
      newTypeName: '',
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
          label: 'bat(.bat)',
          value: '4'
        },
        {
          label: 'python3(.py)',
          value: '5'
        }
      ],
      isEditTag: false,
      dialogIsclickEdit: true,
      curName: '',
      belongTag: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择功能分类', trigger: 'change' }
        ],
        content: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        runTool: [
          { required: true, message: '请选择执行工具', trigger: 'change' }
        ],
        toolType: [
          { required: true, message: '请选择脚本类型', trigger: 'change' }
        ]
      },
      tagDialog: false,
      selectTagList: [],
      errorMessageByInput: '',
      errorMessageByOutput: '',
      saveToolId: '',
      flag: false, // 跳转编辑页面是否进行修改的标记
      version: '' // 记录版本
    }
  },
  created () {
    this.currentId = this.$route.query.toolId
    this.getToolkitList()
  },
  beforeMount () {
    // 初始进入时获取人员列表及标签列表
    Promise.all([
      axios.userList({
        condition: '',
        current: 1,
        online: false,
        roleIds: [],
        size: 20,
        userStatus: ''
      }),
      axios.OpsTagsList()
    ]).then(res => {
      let userData = res[0]
      let tagsListArr = res[1]
      if (userData && userData.data) {
        let data = userData.data.data.result.records
        for (let key of data) {
          key.isCheck = false
        }
        this.userList = data
      }
      if (tagsListArr.data.code === 200) {
        let data = tagsListArr.data.data.result
        // 将数据解析生成对应的标签
        for (let key of data) {
          key.clickEdit = false
          key.typetag = 0
          key.iscloose = false
          for (let i of key.groupOp) {
            if (this.belongTag.length > 0) {
              for (let y of this.belongTag) {
                if (i.grouptagId === y.grouptagId) {
                  i.isSelected = true
                  i.isEditTag = false
                }
              }
            } else {
              i.isSelected = false
              i.isEditTag = false
            }
          }
          this.tagArr = data
        }
      }
      // 根据路由参数判断是新增或编辑
      if (this.currentId) {
        this.getToolDetail(this.currentId)
      }
    })
  },
  mounted () {
    this.getAllType()
  },
  watch: {
    newTableData: {
      handler (newData, oldData) {
        // let data1 = JSON.parse(newData);
        // let data2 = JSON.parse(oldData);
        if (newData === oldData) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      deep: true
    },
    newInputData: {
      handler (newData, oldData) {
        // let data1 = JSON.parse(newData);
        // let data2 = JSON.parse(oldData);
        if (newData === oldData) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      deep: true
    },
    newOutputData: {
      handler (newData, oldData) {
        // let data1 = JSON.parse(newData);
        // let data2 = JSON.parse(oldData);
        if (newData === oldData) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      deep: true
    },
    newApproveData: {
      handler (newData, oldData) {
        // let data1 = JSON.parse(newData);
        // let data2 = JSON.parse(oldData);
        if (newData === oldData) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      deep: true
    },
    newSendCopyData: {
      handler (newData, oldData) {
        // let data1 = JSON.parse(newData);
        // let data2 = JSON.parse(oldData);
        if (newData === oldData) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      deep: true
    },
    newTagList: {
      handler (newData, oldData) {
        // let data1 = JSON.parse(newData);
        // let data2 = JSON.parse(oldData);
        if (newData === oldData) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      deep: true
    }
  },
  computed: {
    newTableData () {
      return JSON.stringify(this.baseFormData)
    },
    newInputData () {
      return JSON.stringify(this.inputData)
    },
    newOutputData () {
      return JSON.stringify(this.outputData)
    },
    newApproveData () {
      return JSON.stringify(this.approveList)
    },
    newSendCopyData () {
      return JSON.stringify(this.copyToList)
    },
    newTagList () {
      return JSON.stringify(this.selectTagList)
    }
  },
  methods: {
    handleParamDelete (param) {
      this.outputData = param
    },
    handleDeleteParam (param) {
      this.inputData = param
    },
    // 获取工具集列表
    getToolkitList () {
      axios.OpsToolkitList().then(res => {
        if (res.data.code === 200) {
          this.toolkitList = res.data.data
        }
      })
    },
    // 标签块的展开或收缩
    changeIcon (tag, str) {
      if (str) {
        let idx = 0
        let obj = {}
        this.tagArr.map((item, index) => {
          if (item.grouptagId === tag.grouptagId) {
            item.iscloose = !item.iscloose
            idx = index
            obj = item
          }
        })
        this.$set(this.tagArr, idx, obj)
      } else {
        let idx = 0
        let obj = {}
        this.selectTagList.map((item, index) => {
          if (item.grouptagId === tag.grouptagId) {
            item.iscloose = !item.iscloose
            idx = index
            obj = item
          }
        })
        this.$set(this.selectTagList, idx, obj)
      }
    },
    tagOperation () {
      this.tagDialog = true
    },
    cancelConfirm () {
      // for(let i of this.tagArr){
      //   for(let n of i.groupOp){
      //     n.isSelected = false;
      //   }

      //   if(obj.child.length > 0){
      //     selectArr.push(obj);
      //   }
      // }
      this.tagDialog = false
    },
    // 将选择弹窗中选择的标签记录赋值
    confirmForTags () {
      let selectArr = []
      // let idx = 0;
      for (let i of this.tagArr) {
        let obj = {
          name: i.name,
          grouptagId: i.grouptagId,
          child: [],
          clickEdit: false,
          iscloose: false
        }
        // this.$set(obj, 'iscloose', false);
        for (let n of i.groupOp) {
          if (n.isSelected === true) {
            obj.child.push(n)
          }
        }

        if (obj.child.length > 0) {
          selectArr.push(obj)
        }
      }
      this.selectTagList = selectArr
      this.tagDialog = false
    },
    // 删除标签类
    deleteTagArr (tag, index) {
      this.$confirm('此操作将删除改类别及其下子标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (tag.grouptagId) {
            axios.OpsDeleteTag(tag.grouptagId, 1).then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  type: 'success',
                  message: '删除成功'
                })
                this.getAllTagList()
              } else if (res.data.code === 500) {
                this.$notify({
                  type: 'error',
                  message: res.data.message
                })
              }
            })
          } else {
            this.tagArr.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 输入标签名
    handleInputTag (tag) {
      if (tag.grouptagId) {
        if (tag.name) {
          let params = {
            grouptagId: tag.grouptagId,
            name: tag.name
          }
          axios.OpsEditTag(params).then(res => {
            if (res.data.status.index === '202') {
              this.getAllTagList()
            }
          })
        } else {
          tag.typetag = 2
        }
      } else {
        if (tag.name) {
          let params = {
            DlvToolsGrouptag: [
              {
                grouptagId: '',
                name: tag.name,
                child: [],
                sort: tag.sort
              }
            ]
          }
          axios.OpsScriptTag(params).then(res => {
            // let type = ''
            if (res.data.status.index === '201') {
              this.test = ''
              tag.typetag = 0
              this.getAllTagList()
            } else {
              this.$notify({
                type: 'error',
                title: '提示',
                message: res.data.status.info
              })
            }
          })
        } else {
          tag.typetag = 2
        }
      }
    },
    handleDbclick (tag) {
      tag.typetag = 1
      let newItem = {}
      let idx = 0
      this.tagArr.map((item, index) => {
        if (item.name == tag.name) {
          item.typetag = 1
          newItem = item
          idx = index
        }
      })
      this.$set(this.tagArr, idx, newItem)
    },
    handleConfirmEdit (item) {
      if (item) {
        if (item.name) {
          let params = {
            grouptagId: item.grouptagId,
            name: item.name
          }
          axios.OpsEditTag(params).then(res => {
            if (res.data.status.index === '202') {
              this.getAllTagList()
            }
          })
        } else {
          item.name = this.curName
        }
      }
      item.isEditTag = false
    },
    editTagOpen (item) {
      this.curName = item.name
      item.isEditTag = true
    },
    removeTag (id) {
      // 删除标签 1为删除大标签 2为删除小标签
      axios.OpsDeleteTag(id, 2).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            message: '删除成功'
          })
          this.getAllTagList()
        } else if (res.data.code === 500) {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    selectTag (tag, indexTop, index) {
      tag.isSelected = !tag.isSelected
      this.$set(this.tagArr[indexTop].groupOp, index, tag)
    },
    // 查询所属标签
    getAllTagList () {
      axios.OpsTagsList().then(res => {
        if (res.data.code === 200) {
          // let index = 0;
          let data = res.data.data.result
          for (let key of data) {
            key.clickEdit = false
            key.iscloose = false
            key.typetag = 0
            for (let i of key.groupOp) {
              if (this.belongTag.length > 0) {
                for (let y of this.belongTag) {
                  if (i.grouptagId === y.grouptagId) {
                    i.isSelected = true
                    i.isEditTag = false
                  }
                }
              } else {
                i.isSelected = false
                i.isEditTag = false
              }
            }
          }
          this.tagArr = data
        } else {
          this.$notify({
            title: '提示',
            message: '数据请求失败'
          })
        }
      })
    },
    openTagDialog () {
      // this.tagsDialog = true;
      let inx = 0
      let sortArr = []
      for (let key of this.tagArr) {
        if (key.name == '') {
          inx++
        } else {
          if (key.sort) {
            sortArr.push(key.sort)
          }
        }
      }

      let max
      if (sortArr.length > 0) {
        max = Math.max.apply(Math, sortArr)
      } else {
        max = 0
      }
      if (inx > 0) {
        this.$notify({
          message: '请先填写新增项'
        })
      } else {
        this.tagArr.push({
          name: '',
          groupOp: [],
          typetag: 2,
          clickEdit: false,
          iscloose: false,
          sort: max + 1
        })
      }
    },
    // 获取所有类型
    getAllType () {
      axios.OpsAllType().then(res => {
        if (res.data.function) {
          let data = res.data.function
          this.typeList = data
        }
      })
    },
    // 获取脚本详情
    getToolDetail (id) {
      axios.OpsToolDetail(id).then(res => {
        if (res.data.result) {
          let data = res.data.result
          this.baseFormData = data
          let approve = JSON.parse(data.approvalids)
          let arr = JSON.parse(data.tagId) || []
          let belong = []
          for (let i of arr) {
            for (let item of i.child) {
              belong.push(item)
            }
          }
          for (let j of arr) {
            for (let k of this.tagArr) {
              if (j.grouptagId === k.grouptagId) {
                j.name = k.name
                j.iscloose = false
              }
            }
          }
          this.selectTagList = arr
          this.belongTag = belong
          for (let k of this.tagArr) {
            for (let y of k.groupOp) {
              for (let be of belong) {
                if (y.grouptagId === be.grouptagId) {
                  y.isSelected = true
                }
              }
            }
          }
          approve.forEach(item => {
            this.userList.forEach(user => {
              if (user.userId === item.userId) {
                item.photo = user.photo
                item.name = user.name
              }
            })
          })
          this.approveList = approve
          let copyList = JSON.parse(data.sendcopyids) || []
          copyList.forEach(item => {
            this.userList.forEach(user => {
              if (user.userId === item.userId) {
                item.name = user.name
                item.photo = user.photo
              }
            })
          })
          this.copyToList = copyList
          let params = res.data.param || []
          let idx1 = 0
          let idx2 = 0
          params.forEach(item => {
            if (item.paramNature == 1) {
              idx1++
              item.id = 'x' + idx1
              item.paramsNameEdit = false
              item.paramsValueEdit = false
              item.paramsTypeEdit = false
              item.paramsMarkEdit = false
              item.titleNameEdit = false
              item.isRequired = false
              this.inputData.push(item)
            } else if (item.paramNature == 2) {
              idx2++
              item.id = 'x' + idx2
              item.paramsNameEdit = false
              item.paramsValueEdit = false
              item.paramsTypeEdit = false
              item.paramsMarkEdit = false
              item.isRequired = false
              item.titleNameEdit = false
              this.outputData.push(item)
            }
          })
        } else {
          this.$notify({
            type: 'error',
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    handleCancle () {
      this.typeDialog = false
      this.baseFormData.groupId = ''
    },
    confirmType () {
      let params = {
        grouptagId: '',
        name: this.newTypeName,
        parentId: 'string',
        tagType: 1 // 1是分类 2是标签
      }
      axios.OpsAddNewType(params).then(res => {
        if (res.data.result) {
          this.typeDialog = false
          this.getAllType()
          this.$notify({
            title: '提示',
            message: '添加成功'
          })
        } else {
          this.$notify({
            title: '提示',
            message: '添加失败'
          })
        }
      })
    },
    handleSelectOption (value) {
      if (value == 0) {
        this.typeDialog = true
      }
    },
    handleClose (index, idx) {
      this.tagArr[index].child.splice(idx, 1)
    },
    confirmSub () {
      this.tagsDialog = false
    },
    handleOutputReback (val) {
      this.outputData = val
    },
    handleReback (val) {
      this.inputData = val
    },
    handleConfirmParentTag (val) {
      if (val) {
        this.dbClickParent = 2
      } else {
        this.dbClickParent = 0
      }
    },
    handleConfirmTag (tag, index) {
      if (this.test) {
        let params = {
          DlvToolsGrouptag: [
            {
              grouptagId: tag.grouptagId || '',
              name: tag.name,
              child: [{ name: this.test }]
            }
          ]
        }
        axios.OpsScriptTag(params).then(res => {
          this.test = ''
          this.getAllTagList()
        })
        // this.tagArr[index].groupOp.push({name: this.test,grouptagId: "", isSelected: false});
      }
      tag.clickEdit = false
    },
    handleCloseInput (tag, num) {
      if (num === 0) {
        tag.typetag = 0
      } else if (num === 1) {
        tag.isEditTag = false
      } else if (num === 2) {
        tag.clickEdit = false
      }
      this.test = ''
    },
    dialogHandleConfirmTag (index) {
      this.tagArr[index].child.push({ name: this.test })
      this.dialogIsclickEdit = true
      this.isEditTag = true
      this.test = ''
    },
    clickEdit (tag, index) {
      if (tag.name !== '编辑标签分类' && tag.name) {
        tag.clickEdit = true
        this.$set(this.tagArr, index, tag)
      } else {
        this.$notify({
          title: '提示',
          message: '请先添加父级分类名称'
        })
      }
    },
    dialogClickEdit (tag, index) {
      if (tag.name) {
        this.dialogIsclickEdit = false
      } else {
        this.$notify({
          title: '提示',
          message: '请先添加父级分类名称'
        })
        this.dialogIsclickEdit = true
      }
    },
    isEdit () {
      this.dbClickParent = 1
    },
    dialogIsEdit () {
      this.dialogDbClick = 1
    },
    openSelect () {
      this.tagDialog = true
    },
    closeBlock (index) {
      this.blockSwitch[index] = !this.blockSwitch[index]
    },
    selectApprovetUser () {
      const list = this.userList
      for (let i = 0; i < list.length; i++) {
        if (list[i].userId === this.userApproveSelected) {
          this.approveList.push(list[i])
          this.isApproveSelecting = false
        }
      }
      this.userApproveSelected = ''
    },
    deleteApproveSeleted (index) {
      this.approveList.splice(index, 1)
    },
    selectCopyToUser () {
      const list = this.userList
      for (let i = 0; i < list.length; i++) {
        if (list[i].userId === this.userCopyToSelected) {
          this.copyToList.push(list[i])
          this.isCopyToSelecting = false
        }
      }
      this.userCopyToSelected = ''
    },
    deleteCopyToSeleted (index) {
      this.copyToList.splice(index, 1)
    },
    addTool (str) {
      let content = this.baseFormData.content
      for (let i = 0; i < content.length; i++) {
        // console.log(content.charCodeAt(i));
      }
      // console.log(/\r\n/g.test(this.baseFormData.content));
      // console.log(/\r/g.test(this.baseFormData.content));
      // console.log(/\n/g.test(this.baseFormData.content));
      // const temp = content.replace(/[\n]/g, "\r")
      // console.log(temp);
      // for(let i=0;i<temp.length;i++) {
      //   console.log(temp.charCodeAt(i))
      // }
      this.errorMessageByInput = ''
      this.errorMessageByOutput = ''
      this.$refs.baseFormData.validate(valid => {
        if (valid) {
          let arr = []
          let idx = 0
          this.approveList.forEach(item => {
            idx += 1
            let obj = {
              order: idx,
              userId: item.userId
            }
            arr.push(obj)
          })
          let count = 0
          let copyList = []
          this.copyToList.forEach(item => {
            count++
            let obj = {
              order: count,
              userId: item.userId
            }
            copyList.push(obj)
          })

          let input = this.sortParams(this.inputData, 1)
          let output = this.sortParams(this.outputData, 2)
          let options = [...input, ...output]
          if (
            this.errorMessageByInput == '' &&
            this.errorMessageByOutput == ''
          ) {
            if (str !== 1 || (str === 1 && arr.length)) {
              if (this.currentId) {
                if (this.flag === true) {
                  let params = {
                    toolId: this.currentId,
                    approvalids: arr,
                    content: this.baseFormData.content,
                    groupId: this.baseFormData.groupId,
                    name: this.baseFormData.name,
                    remarks: this.baseFormData.remarks,
                    runTool: this.baseFormData.runTool,
                    tagId: this.selectTagList,
                    sendcopyids: copyList,
                    dlvParam: options,
                    toolVersion: this.baseFormData.toolVersion,
                    toolType: this.baseFormData.toolType
                  }
                  this.updateTools(params, str)
                } else {
                  this.handleByNoEdit()
                }
              } else {
                let params = {
                  approvalids: arr,
                  content: this.baseFormData.content,
                  groupId: this.baseFormData.groupId,
                  name: this.baseFormData.name,
                  remarks: this.baseFormData.remarks,
                  runTool: this.baseFormData.runTool,
                  tagId: this.selectTagList,
                  sendcopyids: copyList,
                  dlvParam: options,
                  toolType: this.baseFormData.toolType
                }
                this.addNewTools(params, str)
              }
              this.flag = false
            } else {
              this.$notify({
                type: 'error',
                message: '未选择审批人，请选择审批人'
              })
            }
          } else {
            this.$notify({
              type: 'error',
              message:
                this.errorMessageByInput == ''
                  ? this.errorMessageByOutput
                  : this.errorMessageByInput
            })
          }
        } else {
          this.$notify({
            title: '提示',
            message: '有属性未填写'
          })
          return false
        }
      })
    },
    // 没有修改提示
    handleByNoEdit () {
      this.$alert('还未进行任何操作，请编辑后继续保存', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          console.log('1111')
        }
      })
    },
    // 参数处理
    sortParams (data, str) {
      let options = []
      let index = 0
      data.forEach(item => {
        index += 1
        if (item.name && item.titleName && item.paramType && item.isEmpty) {
          this.errorMessageByInput = ''
          let toolId
          if (this.currentId) {
            toolId = this.currentId
          } else {
            toolId = item.toolId || ''
          }
          let obj = {
            name: item.name,
            paramNature: str, // 标志输入还是输出 1为输入 2为输出
            paramType: item.paramType,
            isEmpty: item.isEmpty,
            paramValue: item.paramValue,
            paramState: item.paramState,
            titleName: item.titleName,
            paramId: item.paramId,
            toolId: toolId,
            sort: index
          }
          options.push(obj)
        } else {
          if (str === 1) {
            this.errorMessageByInput = '输入参数有必填项未填写！'
          } else {
            this.errorMessageByOutput = '输出参数有必填项未填写！'
          }
        }
      })
      return options
    },
    cancelAdd () {
      this.$router.push({
        path: '/AutomaticOperation/ScriptList',
        query: {
          code: 4
        }
      })
    },
    // 修改脚本
    updateTools (params, str) {
      axios.OpsUpdateParams(params).then(res => {
        if (res.data.code == 500) {
          this.$notify({
            type: 'warning',
            title: '提示',
            message: res.data.message
          })
        } else if (res.data.code == 200) {
          sessionStorage.setItem('editTool', this.currentId)
          if (str === 1) {
            this.approveTools(this.currentId)
          } else {
            this.$notify({
              type: 'success',
              title: '提示',
              message: res.data.message
            })
            this.$router.push({
              path: '/AutomaticOperation/ScriptList',
              query: {
                code: 4
              }
            })
          }
        }
      })
    },
    // 添加脚本
    addNewTools (params, str, arr) {
      if (this.saveToolId) {
        this.approveTools(this.saveToolId, this.version)
      } else {
        axios.OpsAddNewScript(params).then(res => {
          if (res.data.code == 500) {
            this.$notify({
              type: 'warning',
              title: '提示',
              message: res.data.message
            })
          } else if (res.data.code === 200) {
            this.saveToolId = res.data.toolId
            this.version = res.data.version
            if (str === 1) {
              this.approveTools(res.data.toolId, res.data.toolVersion)
            } else {
              this.$notify({
                type: 'success',
                title: '提示',
                message: res.data.message
              })
              this.$router.push({
                path: '/AutomaticOperation/ScriptList',
                query: {
                  code: 4
                }
              })
            }
          }
        })
      }
    },
    // 发起审批
    approveTools (id, version) {
      let params = {
        businessType: 1,
        businessId: id,
        version: version
      }
      axios.OpsAuditLogaAdd(params).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            type: 'success',
            message: '内容保存并提交审批成功'
          })
          this.$router.push({
            path: '/AutomaticOperation/ScriptList',
            query: {
              code: 4
            }
          })
        } else {
          this.$notify({
            type: 'error',
            message: '内容保存成功但审批提交失败'
          })
        }
      })
    }
  },
  components: {
    UserSelector,
    DropTable,
    // OutputTable,
    Editor
  }
}
</script>
<style scoped>
.block-content {
  padding-left: 20px;
}
.add-tool {
  box-sizing: border-box;
  margin: 10px;
}
.item-block-title {
  margin: 20px 0;
}
.wrapper {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  padding-bottom: 60px;
  color: #333;
  background-color: #fff;
  box-sizing: border-box;
}
.wrapper .block-item {
  box-sizing: border-box;
}
.block-item > h3 {
  font-size: 16px;
  padding-left: 40px;
  border-left: 4px solid #06f;
  font-weight: normal;
  cursor: pointer;
}
.block-item > h3 > i {
  transition: all 0.3s;
}
.block-item > .block-content {
  /* height: 282px; */
  /* padding: 20px 0px 20px 114px; */
  overflow: hidden;
  transition: height 0.3s;
}
.height0 {
  height: 0 !important;
  padding: 0 !important;
  overflow: hidden;
  transition: height 0.3s;
}

.table-btn:hover {
  color: #0066ff;
  cursor: pointer;
}
.dragable-btn {
  width: 10px;
  height: 100%;
  line-height: 16px;
  background-color: #ccc;
  color: #666;
  text-align: center;
}
.dragable-btn:hover {
  color: #999;
  cursor: pointer;
}
.confirm-canseladd {
  text-align: center;
}
.table-params {
  width: 98%;
  margin: auto;
  /* margin-left: 5%;
  padding-left: 128px; */
}
.padding-title {
  padding: 10px 0;
}
.tags-list .parentTag {
  padding: 10px;
}
.tags-list .parentTag .title {
  padding-bottom: 10px;
}
.tags-list .parentTag .tag-wrapper {
  padding: 10px;
}
.tags-list .parentTag .tag-wrapper .input-new-tag {
  width: 100px;
}
.tag-item {
  margin: 0 5px;
}
.tags-box {
  border: 1px solid #c6c6c6;
  min-height: 40px;
  border-radius: 6px;
  position: relative;
}
.tags-box .newBtn {
  margin: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #06f;
  width: 110px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #0066ff;
  border-radius: 4px;
  cursor: pointer;
}
.tags-box > ul,
.tags-box > div > div > ul {
  padding: 0 10px;
}
.tags-box > ul > li,
.tags-box > div > div > ul > li {
  margin-bottom: 5px;
}
.tags-box > ul > li .tags-item,
.tags-box > div > div > ul > li .tags-item {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.tags-box > ul > li .tags-item > li,
.tags-box > div > div > ul > li .tags-item > li {
  padding: 0px 16px;
  margin: 6px 10px 6px 0;
  min-width: 40px;
  background-color: #fff;
  box-shadow: 0 0 8px #e0e0e0;
  line-height: 30px;
  border-radius: 16px;
  text-align: center;
}
.isSelect {
  border: 1px solid rgb(255, 151, 151);
}
.margin-right {
  margin-right: 40px;
}
.position-icon {
  vertical-align: middle;
}
.clear {
  clear: both;
}
.private {
  padding: 3px 4px !important;
  font-size: 14px !important;
  height: 24px !important;
}
.left-title {
  padding: 4px 0;
}
.input-style {
  width: 100px;
  display: inline-block;
}
.add-font-style {
  color: #0066ff;
}
.box-left {
  display: inline-block;
}
.edit-icon {
  display: inline-block;
}
.cursor {
  cursor: pointer;
}
.tagsList {
  display: inline-block;
}
.tagsList > li {
  padding: 0px 16px;
  margin: 6px 10px 6px 0;
  min-width: 40px;
  background-color: #fff;
  box-shadow: 0 0 8px #e0e0e0;
  line-height: 30px;
  border-radius: 16px;
  text-align: center;
}
.unclick {
  background-color: rgb(170, 170, 170);
  border-radius: 4px;
  cursor: not-allowed;
}
.clear {
  clear: both;
}
.block-title {
  position: relative;
  top: 0;
  left: 0;
  padding-left: 34px;
  cursor: pointer;
}
.block-title .title-tips {
  width: 8px;
  height: 100%;
  background-color: #0066ff;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
}
.icons {
  color: #0066ff;
  font-size: 20px;
  vertical-align: middle;
  margin-left: 4px;
}
.block-title > h3 {
  font-size: 16px;
  font-weight: normal;
  line-height: 32px;
}
</style>
