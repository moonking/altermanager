<template>
  <div class="bg aibms-color-bg">
    <div class="content">
      <el-tabs type="card" v-model="activeName" @tab-click="handleSelect">
        <el-tab-pane label="基本信息" name="tab1"></el-tab-pane>
        <el-tab-pane label="关系结构" name="tab2"></el-tab-pane>
      </el-tabs>
      <div class="grid-content bg-purple" v-if="selectTab">
        <div v-for="item in toviewDatalist" :key="item.id">
          <el-row v-if="item.title" class="box-title">
            <span class="box-bottom white-color">{{item.title}}</span>
          </el-row>
          <el-row>
            <el-row class="newCIName" v-for="data in item.extend" :key="data.id">
              <el-col :span="3" class="lineheight textr">
                <span style="color:red" v-if="data.required==true">*</span>
                <span style="margin-right: 33px;color:#fff">{{data.label}}:</span>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-if="data.type == 'labelNameInput'"
                  type="text"
                  v-model="data.defaultValue"
                  autocomplete="off"
                  :id="data.fieldName+data.id"
                  :verifier="data.verifier"
                ></el-input>
                <el-input
                  :disabled="data.readOnly"
                  v-if="data.type == 'multiLineInput'"
                  type="textarea"
                  v-model="data.defaultValue"
                  autocomplete="off"
                  :maxLength="data.maxLength"
                  :minLength="data.minLength"
                  :rows="data.rows"
                  :required="data.required"
                  @blur="changeData($event)"
                  :id="data.fieldName+data.id"
                ></el-input>
                <el-date-picker
                  :disabled="data.readOnly"
                  @blur="changeData($event)"
                  :required="data.required"
                  v-if="data.type == 'dateInput' && data.dateOnly ==true"
                  v-model="data.defaultValue"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>

                <el-date-picker
                  :disabled="data.readOnly"
                  @blur="changeData($event)"
                  :required="data.required"
                  v-if="data.type == 'dateInput' && data.dateOnly == false"
                  v-model="data.defaultValue"
                  type="datetime"
                  placeholder="选择日期"
                ></el-date-picker>
                <el-input
                  autocomplete="off"
                  type="text"
                  v-if="data.type == 'singleLineInput'"
                  v-model="data.defaultValue"
                  :maxLength="data.maxLength"
                  :minLength="data.minLength"
                  @blur="changeData($event)"
                  :id="data.fieldName+data.id"
                  :required="data.required"
                  :disabled="data.readOnly"
                ></el-input>
                <el-select
                  v-if="data.type == 'optionsInputSys'"
                  v-model="data.defaultValue"
                  :multiple="data.moreSelect"
                  style="width:100%"
                >
                  <el-option
                    v-for="option in SystablistData"
                    :key="option.systemId"
                    :label="option.name"
                    :value="option.systemId"
                    @blur="changeData($event)"
                    :id="data.fieldName+data.id"
                    :required="data.required"
                  ></el-option>
                </el-select>
                <!-- <el-cascader
                          v-if="data.type == 'optionsInputEnv'"
                            :options="options"
                            v-model="envoptions"
                            @active-item-change='axios.envtablist'
                            :required="data.required"
                             style="width:100%"
                            @change="handleChange">
                </el-cascader>-->
                <el-select
                  v-if="data.type == 'optionsInputEnv'"
                  v-model="data.defaultValue"
                  :multiple="data.moreSelect"
                  style="width:100%"
                >
                  <el-option
                    v-for="option in EnvtablistData"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                    @blur="changeData($event)"
                    :id="data.fieldName+data.id"
                    :required="data.required"
                  ></el-option>
                </el-select>
                <el-input
                  :disabled="data.readOnly"
                  :maxLength="data.maxLength"
                  :minLength="data.minLength"
                  autocomplete="off"
                  type="number"
                  :min="0"
                  v-if="data.type == 'numInput'"
                  v-model="data.defaultValue"
                  @blur="changeData($event)"
                  :id="data.fieldName+data.id"
                  :required="data.required"
                ></el-input>
                <el-input
                  :disabled="data.readOnly"
                  autocomplete="off"
                  type="password"
                  v-if="data.type == 'pwdInput'"
                  v-model="data.defaultValue"
                  :maxLength="data.maxLength"
                  :minLength="data.minLength"
                  @blur="changeData($event)"
                  :id="data.fieldName+data.id"
                  :required="data.required"
                ></el-input>
                <el-select
                  v-if="data.type == 'selectInput'"
                  v-model="data.defaultValue"
                  :multiple="data.moreSelect"
                >
                  <el-option
                    :disabled="data.readOnly"
                    v-for="option in data.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                    @blur="changeData($event)"
                    :id="data.fieldName+data.id"
                    :required="data.required"
                  ></el-option>
                </el-select>
                <el-select
                  v-if="data.type == 'credentialsSelect'"
                  v-model="data.defaultValue"
                  :multiple="data.moreSelect"
                  placeholder="选择凭证类型"
                >
                  <el-option
                    v-for="option in data.sshoptions"
                    :key="option.id"
                    :label="option.name"
                    :value="option.voucherId"
                    @blur="changeData($event)"
                    :id="data.fieldName+data.id"
                    :required="data.required"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-row>
        </div>
        <div style="padding-left:150px">
          <el-row>
            <el-button
              type="primary"
              style="margin-right:20px;width:100px;cursor: pointer"
              @click="save()"
            >保存</el-button>
            <el-button class="nomal-button" style="width:100px;cursor: pointer" @click="go()">取消</el-button>
          </el-row>
        </div>
      </div>

      <div class="relation-box" v-if="!selectTab">
        <el-row :gutter="8">
          <el-col :span="18">
            <app-chart
              style="width: 100%;height: 600px;"
              :nodeTypeId="nodeTypeId"
              :chartType="chartType"
              @editCI="handleCIEdit"
            ></app-chart>
          </el-col>
          <el-col :span="6" class="content-wrapper non-shadow">
            <div class="top-btn">
              <span
                class="content-left-btn white-color"
                @click="addNewPre"
                :class="{'active': selectTabItem }"
              >新增上层结构</span>
              <span
                class="content-left-btn white-color"
                @click="addNewNex"
                :class="{'active': !selectTabItem}"
              >新增下层结构</span>
            </div>
            <div class="top-content">
              <el-form>
                <el-form-item>
                  <el-popover
                    placement="bottom-end"
                    width="240"
                    trigger="manual"
                    v-model="visibedRelation"
                  >
                    <div class="gx-box">
                      <ul>
                        <li
                          v-for="tag in gxTagsList"
                          :key="tag.lab"
                          @click="getgxTag(tag.val)"
                        >{{tag.val}}</li>
                      </ul>
                    </div>
                    <div slot="reference" class="box-font" @click="clickRelation">
                      <p class="font-styles white-color" v-if="gxTag" style="padding-left:12px">{{gxTag}}</p>
                      <p class="font-styles white-color" v-else>选择关系</p>
                    </div>
                  </el-popover>
                </el-form-item>
                <el-form-item>
                  <el-popover
                    placement="bottom-end"
                    width="240"
                    trigger="manual"
                    v-model="visibedCondition"
                  >
                    <div class="gx-box">
                      <ul>
                        <li
                          v-for="tag in tjTagsList"
                          :key="tag.lab"
                          @click="gettjTag(tag.val)"
                        >{{tag.val}}</li>
                      </ul>
                    </div>
                    <div slot="reference" class="box-font" @click="clickCondition">
                      <p class="font-styles white-color" style="padding-left:12px" v-if="tjTag">{{tjTag}}</p>
                      <p class="font-styles white-color" v-else>选择对应条件</p>
                    </div>
                  </el-popover>
                </el-form-item>
                <el-form-item>
                  <el-popover placement="bottom-end" width="240" trigger="manual" v-model="isshow">
                    <div class="type-box">
                      <el-tree
                        :data="CIList"
                        :highlight-current="true"
                        :props="defaultProps"
                        @node-click="gettypeTag"
                      ></el-tree>
                    </div>
                    <div slot="reference" class="box-font" @click="clickBox">
                      <p class="font-styles white-color" style="padding-left:12px" v-if="typeTag">{{typeTag}}</p>
                      <p class="font-styles white-color" v-else>选择CI项</p>
                    </div>
                  </el-popover>
                </el-form-item>
              </el-form>
            </div>
            <div style="text-align: center;">
              <el-button type="primary" @click.stop="confirm">确认</el-button>
              <el-button class="nomal-button" @click="cancleTag">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="编辑CI项关系" :visible.sync="CIdialog" center width="40%">
      <el-form style="margin: 0 auto;">
        <el-form-item label="关系" label-width="120">
          <el-select v-model="curLabel">
            <el-option
              v-for="gx in gxTagsList"
              :key="gx.lab"
              :label="gx.val"
              :value="gx.val"
            >{{gx.val}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条件" label-width="120">
          <el-select v-model="curRelation">
            <el-option
              v-for="tj in tjTagsList"
              :key="tj.lab"
              :label="tj.val"
              :value="tj.val"
            >{{tj.val}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="nomal-button" @click="closeCIDialog">取 消</el-button>
        <el-button type="primary" @click="confirmCIDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
// import { initFileds, checkModification } from "../../../utils/reload.js";
import CIchart from '../CIchart'
import Bus from '../../common/bus.js'
import {
  initFileds,
  checkModification,
  onbeforeunload
} from '../../../utils/reload.js'

export default {
  data () {
    return {
      isbl: false,
      options: [],
      envoptions: ['', ''],
      SystablistData: [],
      toviewDatalist: '',
      itemId: '',
      sysId: '',
      ciname: '',
      envid: '',
      nodeTypeId: this.$route.query.ciitemId,
      chartType: '',
      selectTab: true,
      isshow: false,
      visibedCondition: false,
      visibedRelation: false,
      gxTag: '',
      tjTag: '',
      typeTag: '',
      checkType: '',
      operation: 'up',
      selectTabItem: true,
      gxTagsList: [{
        lab: 'gx-1',
        val: '运行'
      }, {
        lab: 'gx-2',
        val: '连接'
      }, {
        lab: 'gx-3',
        val: '依赖'
      }, {
        lab: 'gx-4',
        val: '包含'
      }, {
        lab: 'gx-5',
        val: '虚拟化'
      }, {
        lab: 'gx-6',
        val: '管理'
      }, {
        lab: 'gx-7',
        val: '安装'
      }],
      tjTagsList: [{
        lab: 'tj-1',
        val: '一对一'
      }, {
        lab: 'tj-2',
        val: '一对多'
      }, {
        lab: 'tj-3',
        val: '多对一'
      }, {
        lab: 'tj-4',
        val: '多对多'
      }],
      CIList: [],
      EnvtablistData: [
        // {
        //   value: "0",
        //   label: "测试环境"
        // },
        // {
        //   value: "1",
        //   label: "预生产环境"
        // },
        // {
        //   value: "2",
        //   label: "生产环境"
        // }
      ],
      currentCI: {},
      activeName: 'tab1',
      sshoptions: [
        // {
        //   value: "0",
        //   label: "选择凭证类型"
        // },
        // {
        //   value: "0",
        //   label: "SSH凭证"
        // },
        // {
        //   value: "1",
        //   label: "应用系统凭证"
        // },
        // {
        //   value: "2",
        //   label: "代码库凭证"
        // },
        // {
        //   value: "3",
        //   label: "数据库凭证"
        // }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      allList: [],
      CIdialog: false,
      curLabel: '',
      curRelation: '',
      relationCI: ''
    }
  },
  components: {
    'app-chart': CIchart
  },
  watch: {
    '$route': {
      handler (val) {
        if (val.query.ciitemId != this.nodeTypeId) {
          // this.$router.push({path: val.fullPath})
          this.nodeTypeId = val.query.ciitemId
          this.chartType = 'editChart'
          this.toviewData()
        } else {
          // // console.log('true');
        }
      },
      deep: true
    }
  },
  methods: {
    // getVList(exitId,i,j) {
    //     let data = {
    //         name: '',
    //         voucherType: '',
    //     };
    //     // console.log(exitId)
    //     getVoucherList(data.name,data.voucherType)
    //         .then(res => {
    //             this.sshoptions = [];
    //             let data = res.data.data.result;
    //             let currentData = data.filter((item,index)=>{
    //                 if(exitId === item.voucherId) {
    //                     return item
    //                 }
    //             })
    //             this.sshoptions = data.filter(item => {
    //                 if(item.voucherType == currentData[0].voucherType) {
    //                     return item
    //                 }
    //             })
    //
    //         })
    //         .catch();
    // },
    // 关闭
    closeCIDialog () {
      this.CIdialog = false
    },
    // 提交修改后的CI关系
    confirmCIDialog () {
      if (this.relationCI.ciitemId) {
        let data = this.currentCI
        if (data) {
          for (let key of data.connect) {
            if (key.ciitemId === this.relationCI.ciitemId) {
              key.label = this.curLabel
              key.relation = this.curRelation
            }
          }
          axios.CiDataDetail(this.currentCI.ciitemId).then(res => {
            if (res) {
              if (res.data.success) {
                let newData = res.data.data.result
                let params = {
                  ciitemId: data.ciitemId,
                  icon: data.icon,
                  name: newData.name,
                  relation: data
                }
                console.log(params)
                axios.CiDataEdit(this.currentCI.ciitemId, params).then(res => {
                  if (res.data.success) {
                    this.updateRelation(this.currentCI.ciitemId)
                  }
                })
              }
            } else {
              this.$notify({
                type: 'error',
                message: '接口请求失败'
              })
            }
          })
        } else {
          this.$notify({
            type: 'error',
            message: '数据不存在'
          })
        }
      } else {
        this.$notify({
          type: 'error',
          message: '接口请求失败'
        })
      }
    },

    // 修改关联项
    updateRelation (curId) {
      let data = JSON.parse(this.relationCI.relation)
      for (let key of data.connect) {
        if (key.ciitemId === curId) {
          key.label = this.curLabel
          key.relation = this.curRelation
        }
      }
      let params = {
        ciitemId: this.relationCI.ciitemId,
        icon: this.relationCI.icon,
        name: this.relationCI.name,
        relation: data
      }
      axios.CiDataEdit(this.relationCI.ciitemId, params).then(res => {
        if (res) {
          if (res.data.success) {
            this.CIdialog = false
            Bus.$emit('editCIitem', this.nodeTypeId)
            this.$notify({
              type: 'success',
              message: 'CI关系编辑成功'
            })
          } else {
            this.$notify({
              type: 'error',
              message: '编辑失败'
            })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 接受传的ci项id
    handleCIEdit (val) {
      axios.CiDataDetail(this.$route.query.ciitemId).then(res => {
        if (res) {
          if (res.data.success) {
            let data = res.data.data.result
            if (data.ciitemId != val) {
              let rel = JSON.parse(data.relation)
              for (let key of rel.connect) {
                if (key.ciitemId === val) {
                  this.curLabel = key.label
                  this.curRelation = key.relation
                }
              }
              this.CIdialog = true
            }
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })

      axios.CiDataDetail(val).then(res => {
        if (res) {
          if (res.data.success) {
            this.relationCI = res.data.data.result
          }
        } else {
          this.relationCI = {}
        }
      })
    },

    // 凭证下拉
    // getVoucherList(vid){
    //       let data = {
    //         name: '',
    //         voucherType: vid,
    //       };
    //       getVoucherList(data.name,data.voucherType)
    //         .then(res => {
    //               res.data.data.result.forEach((item,index)=>{
    //                     this.sshoptions.push({value:item.voucherId,name:item.name})
    //               })
    //         })
    //         .catch();
    // },
    confirm () {
      let conn = {}
      let count = 0
      axios.CiDataDetail(this.$route.query.ciitemId).then(res => {
        if (res) {
          if (res.data.success) {
            let curData = res.data.data.result
            if (curData.relation) {
              this.currentCI = JSON.parse(curData.relation)

              if (this.currentCI.ciitemId != this.checkType.ciitemId) {
                if (this.gxTag) {
                  if (this.tjTag) {
                    if (this.checkType) {
                      if (this.checkType.ciitemId) {
                        conn.ciitemId = this.checkType.ciitemId
                        conn.label = this.gxTag
                        conn.icon = this.checkType.icon
                        conn.relation = this.tjTag
                        if (this.currentCI.connect) {
                          this.currentCI.connect.forEach(item => {
                            if (item.ciitemId == this.checkType.ciitemId) {
                              count += 1
                            }
                          })

                          if (count == 0) {
                            if (this.operation == 'up') {
                              conn.top = 30
                              conn.left = 50
                              conn.tag = this.operation
                            } else if (this.operation == 'down') {
                              conn.top = 70
                              conn.left = 50
                              conn.tag = this.operation
                            }
                            this.currentCI.connect.push(conn)

                            let params = {
                              'ciitemId': curData.ciitemId,
                              'name': curData.name,
                              'relation': this.currentCI
                            }
                            axios.CiDataEdit(this.nodeTypeId, params).then(result => {
                              if (result.data.success) {
                                this.createConnect(this.checkType.ciitemId, curData, this.gxTag, this.tjTag, this.operation)
                                Bus.$emit('editCIitem', this.nodeTypeId)
                                this.gxTag = ''
                                this.tjTag = ''
                                this.checkType = ''
                                this.typeTag = ''
                                this.getCurrentNode(curData.ciitemId)
                              }
                            })
                          } else {
                            this.$notify({
                              title: '提示',
                              message: 'CI项已存在,添加失败',
                              type: 'warning'
                            })
                          }
                        } else {
                          let conRelation = []

                          if (this.operation == 'up') {
                            conn.top = 30
                            conn.left = 50
                            conn.tag = this.operation
                          } else if (this.operation == 'down') {
                            conn.top = 70
                            conn.left = 50
                            conn.tag = this.operation
                          }
                          conRelation.push(conn)
                          this.currentCI.connect = conRelation

                          let params = {
                            'ciitemId': curData.ciitemId,
                            'name': curData.name,
                            'relation': this.currentCI
                          }
                          axios.CiDataEdit(this.nodeTypeId, params).then(result => {
                            if (result.data.success) {
                              this.createConnect(this.checkType.ciitemId, curData, this.gxTag, this.tjTag, this.operation)
                              Bus.$emit('editCIitem', this.nodeTypeId)
                              this.gxTag = ''
                              this.tjTag = ''
                              this.checkType = ''
                              this.typeTag = ''
                              this.getCurrentNode(curData.ciitemId)
                            }
                          })
                        }
                      } else {
                        this.$notify({
                          title: '提示',
                          message: '请选择CI项子项',
                          type: 'warning'
                        })
                      }
                    } else {
                      this.$notify({
                        title: '提示',
                        message: '请选择CI项',
                        type: 'warning'
                      })
                    }
                  } else {
                    this.$notify({
                      title: '提示',
                      message: '请选择条件',
                      type: 'warning'
                    })
                  }
                } else {
                  this.$notify({
                    title: '提示',
                    message: '请选择关系',
                    type: 'warning'
                  })
                }
              } else {
                this.$notify({
                  title: '提示',
                  message: 'CI项已存在',
                  type: 'warning'
                })
              }
            } else {
              let obj = {}
              let connArr = []
              obj.ciitemId = curData.ciitemId
              obj.icon = curData.icon
              obj.top = 44
              obj.left = 50

              if (this.gxTag) {
                if (this.tjTag) {
                  if (this.checkType) {
                    if (this.checkType.ciitemId) {
                      conn.ciitemId = this.checkType.ciitemId
                      conn.label = this.gxTag
                      conn.icon = this.checkType.icon
                      conn.relation = this.tjTag

                      if (this.operation == 'up') {
                        conn.top = 30
                        conn.left = 50
                        conn.tag = this.operation
                      } else if (this.operation == 'down') {
                        conn.top = 70
                        conn.left = 50
                        conn.tag = this.operation
                      }

                      connArr.push(conn)
                      obj.connect = connArr
                      let params = {
                        'ciitemId': curData.ciitemId,
                        'name': curData.name,
                        'relation': obj
                      }

                      axios.CiDataEdit(curData.ciitemId, params).then(result => {
                        if (result.data.success) {
                          this.createConnect(this.checkType.ciitemId, curData, this.gxTag, this.tjTag, this.operation)
                          Bus.$emit('editCIitem', curData.ciitemId)
                          this.gxTag = ''
                          this.tjTag = ''
                          this.checkType = ''
                          this.typeTag = ''
                          this.getCurrentNode(curData.ciitemId)
                        }
                      })
                    } else {
                      this.$notify({
                        title: '提示',
                        message: '请选择CI项子项',
                        type: 'warning'
                      })
                    }
                  } else {
                    this.$notify({
                      title: '提示',
                      message: '请选择CI项',
                      type: 'warning'
                    })
                  }
                } else {
                  this.$notify({
                    title: '提示',
                    message: '请选择条件',
                    type: 'warning'
                  })
                }
              } else {
                this.$notify({
                  title: '提示',
                  message: '请选择关系',
                  type: 'warning'
                })
              }
            }
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 获取新数据
    getCurrentNode (id) {
      axios.CiDataDetail(id).then(res => {
        if (res) {
          if (res.data.success) {
            this.currentCI = res.data.data.result.relation
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 增加关联关系
    createConnect (id, value, label, relation, operation) {
      axios.CiDataDetail(id).then(res => {
        if (res) {
          if (res.data.success) {
            let curData = res.data.data.result
            if (curData.relation) {
              let data = JSON.parse(curData.relation)
              let count = 0
              data.connect.forEach(item => {
                if (item.ciitemId == value.ciitemId) {
                  count += 1
                }
              })
              if (count == 0) {
                let node = {
                  ciitemId: value.ciitemId,
                  name: value.name,
                  icon: value.icon,
                  tag: '',
                  label: label,
                  relation: relation,
                  top: '',
                  left: ''
                }
                if (operation == 'up') {
                  node.top = 70
                  node.left = 50
                  node.tag = 'down'
                } else {
                  node.top = 30
                  node.left = 50
                  node.tag = 'up'
                }
                data.connect.push(node)
                let params = {
                  'ciitemId': id,
                  'icon': curData.icon,
                  'name': curData.name,
                  'relation': data
                }
                axios.CiDataEdit(id, params).then(result => {
                  if (result.data.success) {
                    // // console.log(result);
                  }
                })
              } else {
                // console.log('已存在不修改');
              }
            } else {
              let CurObj = {
                ciitemId: curData.ciitemId,
                name: curData.name,
                icon: curData.icon,
                top: 44,
                left: 50,
                connect: []
              }
              let node = {
                ciitemId: value.ciitemId,
                name: value.name,
                icon: value.icon,
                tag: '',
                label: label,
                relation: relation,
                top: '',
                left: ''
              }
              if (operation == 'up') {
                node.top = 70
                node.left = 50
                node.tag = 'down'
              } else {
                node.top = 30
                node.left = 50
                node.tag = 'up'
              }
              CurObj.connect.push(node)
              // let params = {
              //   'ciitemId': id,
              //   'icon': curData.icon,
              //   'name': curData.name,
              //   'relation': CurObj
              // };

              // axios.CiDataEdit(id, params).then(result => {
              //   if (result.data.success) {
              //   }
              // });
            }
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 环境下拉
    handleChange (value) {
      // // console.log(value);
    },
    //    getenvtablist(){
    //       this.EnvtablistData.forEach((item)=>{
    //     this.options.push({label:item.label,value:item.value,children:[]})
    //   })
    // },
    // 获取环境
    getviewenv (n, typeid) {
      axios.envtablist(n).then(res => {
        this.envoptions[0] = n
        this.options.forEach((item) => {
          if (n == item.value) {
            item.children = []
            res.data.data.result.forEach((d) => {
              item.children.push({ label: d.name, value: d.environmentId })
            })
          }
        })
        res.data.data.result.forEach((item) => {
          if (item.environmentId == typeid) {
            this.envoptions[0] = n
            this.envoptions[1] = typeid
          }
        })
        this.envoptions.reverse().reverse()
        // // console.log( this.envoptions)

        //     if(res.data.success){
        // this.options.forEach((item)=>{
        //       if(val[0]==item.value){
        // //         console.log(item)
        //         item.children=[]
        //         res.data.data.result.forEach((d)=>{
        //         item.children.push({label:d.name,value:d.environmentId})

        //         })
        //       }
        //     })
        //     this.options.reverse().reverse()
        //     }

        // // console.log(res)
      }).catch()
    },
    // 业务系统下拉框
    getSysTablistData () {
      var name = ''

      axios.getcigroupSystablist(name).then(res => {
        this.SystablistData = res.data.data.result
      }).catch(err => {
        if (err) {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    // 获取环境列表
    envtablist (val) {
      // // console.log(val)
      let data = {
        environmentType: val[0],
        name: ''
      }
      axios.envtablist(data).then(res => {
        if (res.data.success) {
          this.options.forEach((item) => {
            if (val[0] == item.value) {
              item.children = []
              res.data.data.result.forEach((d) => {
                item.children.push({ label: d.name, value: d.environmentId })
              })
            }
          })
          this.options.reverse().reverse()
        }
      }).catch()
    },
    // 获取cl列表
    getCIlist () {
      this.allList = []

      axios.CiDataDetail(this.$route.query.ciitemId).then(res => {
        if (res) {
          if (res.data.data.result.citypeId) {
            let citypeId = res.data.data.result.citypeId
            Promise.all([axios.getciListArr(citypeId, 'up'), axios.getciListArr(citypeId, 'down')]).then(res => {
              for (let key in res) {
                if (res[key].data.success) {
                  if (res[key].data.data) {
                    this.allList.push(res[key].data.data)
                  }
                }
              }
              if (this.allList[0].length > 0) {
                this.allList[0].forEach(item => {
                  let node = {
                    name: item[0].citypeName,
                    children: item
                  }

                  this.CIList.push(node)
                })
              }
              initFileds()
            })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    // 点击
    clickBox () {
      this.isshow = !this.isshow
    },
    clickCondition () {
      this.visibedCondition = !this.visibedCondition
    },
    clickRelation () {
      this.visibedRelation = !this.visibedRelation
    },
    // 取消
    cancleTag () {
      this.gxTag = ''
      this.tjTag = ''
      this.typeTag = ''
    },
    // 点击每一条获取
    gettjTag (value) {
      this.visibedCondition = false
      this.tjTag = value
    },
    getgxTag (value) {
      this.visibedRelation = false
      this.gxTag = value
    },
    gettypeTag (value) {
      this.typeTag = value.name
      this.checkType = value
      this.isshow = false
    },
    // 新增上层
    addNewPre () {
      this.CIList = []
      this.selectTabItem = true
      if (this.operation == 'down') {
        this.gxTag = ''
        this.tjTag = ''
        this.typeTag = ''
        this.checkType = ''
      }
      this.operation = 'up'
      if (this.allList[0].length > 0) {
        this.allList[0].forEach(item => {
          let node = {
            name: item[0].citypeName,
            children: item
          }

          this.CIList.push(node)
        })
      }
    },
    // 环境下拉
    getenvtablist () {
      let data = {
        environmentType: '',
        name: ''
      }
      axios.envtablist(data).then(res => {
        if (res) {
          if (res.data.success) {
            // console.log(res)
            //  this.options.forEach((item)=>{
            //   if(val[0]==item.value){
            //     item.children=[]
            res.data.data.result.forEach((d) => {
              this.EnvtablistData.push({ label: d.name, value: d.environmentId })
            })
            //   }
            // })
            // this.options.reverse().reverse()
          }
        }
      }).catch()
      // this.EnvtablistData.forEach((item)=>{
      //       this.options.push({label:item.label,value:item.value,children:[]})
      //     })
    },
    // 新增下层
    addNewNex () {
      this.CIList = []
      this.selectTabItem = false
      if (this.operation == 'up') {
        this.gxTag = ''
        this.tjTag = ''
        this.typeTag = ''
        this.checkType = ''
      }
      this.operation = 'down'
      if (this.allList[1].length > 0) {
        this.allList[1].forEach(item => {
          let node = {
            name: item[0].citypeName,
            children: item
          }

          this.CIList.push(node)
        })
      }
    },
    handleSelect (tab) {
      if (tab.label == '基本信息') {
        this.selectTab = true
      } else {
        this.selectTab = false
        this.chartType = 'editChart'
      }
    },
    // 返回上一级
    go () {
      this.$router.go(-1)
    },
    // ci详情
    toviewData () {
      let id = this.$route.query.ciitemId
      this.itemId = id
      let index = 0
      // let n = 0;
      axios.CiDataDetail(id).then(res => {
        if (res.data.data.result.relation) {
          this.currentCI = JSON.parse(res.data.data.result.relation)
        }
        if (res.data.data.result.content) {
          // // console.log(this.toviewDatalist)
          this.$set([], this.toviewDatalist, JSON.parse(res.data.data.result.content))
          // // console.log(this.toviewDatalist)
          this.toviewDatalist = JSON.parse(res.data.data.result.content)
          // // console.log(this.toviewDatalist)
          this.selectTab = true
          this.activeName = 'tab1'
          // 遍历列表，添加id
          for (var i = 0; i < this.toviewDatalist.length; i++) {
            var extendStr = this.toviewDatalist[i].extend
            for (var j = 0; j < extendStr.length; j++) {
              // console.log( extendStr[j])
              // console.log(this.options)
              // console.log(this.toviewDatalist)
              for (var k = 0; k < this.options.length; k++) {
                if (extendStr[j].defaultValue.split(',')[0] == this.options[k].value) {
                  this.getviewenv(extendStr[j].defaultValue.split(',')[0], extendStr[j].defaultValue.split(',')[1])
                }
                //   if(extendStr[j].label == '业务组'){
                //   this.sysId = extendStr[j].defaultValue

                // }
              }

              if (extendStr[j].label == '凭证') {
                // console.log(extendStr[j])

                // if(n==0){
                //     this.getVoucherList(extendStr[j].Value.split(',')[0])
                //  n++
                // }

              }

              var obj = extendStr[j]
              index = index + i + j
              obj.id = index
              this.toviewDatalist[i].extend[j] = obj
            }

            if (this.toviewDatalist[i].title == '名称') {
              this.ciname = extendStr[0].defaultValue
            }
          }
        } else {
          this.nodeTypeId = id
          this.chartType = 'editChart'
        }

        // this.toviewDatalist.forEach(item => {
        //     item.extend.forEach(minItem => {
        //         // console.log(minItem.type)
        //         if(minItem.type === 'credentialsSelect') {
        //             this.getVList(minItem.defaultValue)
        //         }
        //     })
        //
        // })

        // // console.log(this.toviewDatalist);
        // this.getTages();
        //  setTimeout(()=>{
        //     initFileds()
        //  },200)
      })
    },
    // ci类型保存
    save () {
      let bl = false
      let envval = ''
      let envval2 = ''
      // // console.log(this.options)
      // this.options.forEach((item)=>{
      //   if(item.value == this.envoptions[0]){
      //         envval = item.label
      //         item.children.forEach((item2)=>{
      //         if(  item2.value == this.envoptions[1]){
      //           envval2 = item2.label
      //         }
      //         })
      //   }
      // })
      this.toviewDatalist.forEach((item, index) => {
        if (index == 0) {
          item.extend.forEach((items) => {
            if (items.label == '环境') {
              // envval = item.defaultValue
              this.EnvtablistData.forEach((data) => {
                if (data.value == items.defaultValue) {
                  envval = data.label
                  envval2 = data.value
                }
              })
            }
          })
        }
      })
      for (var i = 0; i < this.toviewDatalist.length; i++) {
        for (var j = 0; j < this.toviewDatalist[i].extend.length; j++) {
          for (var k = 0; k < this.SystablistData.length; k++) {
            if (this.SystablistData[k].systemId == this.toviewDatalist[i].extend[j].defaultValue) {
              this.toviewDatalist[i].extend[j].name = this.SystablistData[k].name
              this.toviewDatalist[i].extend[j].cname = this.SystablistData[k].name
            }
          }
          // if(this.toviewDatalist[i].extend[j].label == "环境"){
          //       this.toviewDatalist[i].extend[j].cname= envval+'/'+envval2
          //     this.toviewDatalist[i].extend[j].defaultValue=this.envoptions[0]+','+this.envoptions[1]+','+envval+','+envval2
          //   }
          if (this.toviewDatalist[i].extend[j].label == '环境') {
            // this.datalist[i].extend[j].defaultValue=this.envoptions[0]+','+this.envoptions[1]+','+envval+','+envval2
            // this.datalist[i].extend[j].defaultValue
            this.toviewDatalist[i].extend[j].cname = envval
          }
          if (this.toviewDatalist[i].extend[j].label == '业务组') {
            this.sysId = this.toviewDatalist[i].extend[j].defaultValue
          }
          if (this.toviewDatalist[i].extend[j].label == '名称') {
            this.ciname = this.toviewDatalist[i].extend[j].defaultValue
            if (this.ciname.length == 0) {
              this.$notify({
                title: '提示',
                message: '名称不能为空',
                type: 'warning'
              })
              bl = true
              break
            }
          }
          if (this.toviewDatalist[i].extend[j].required) {
            if (
              this.toviewDatalist[i].extend[j].defaultValue == '' &&
              this.datalist[i].extend[j].defaultValue != '0'
            ) {
              this.$notify({
                title: '提示',
                message: this.toviewDatalist[i].extend[j].label + '不能为空',
                type: 'warning'
              })
              bl = true
              break
            }
          }
          // 判断验证规则
          if (this.toviewDatalist[i].extend[j].defaultValue.length != 0) {
            if (this.toviewDatalist[i].extend[j].rules) {
              let rules = this.toviewDatalist[i].extend[j].rules
              let rulesrReg = this.toviewDatalist[i].extend[j].rulesrReg
              var myReg = new RegExp(rulesrReg)
              if (!myReg.test(this.toviewDatalist[i].extend[j].defaultValue)) {
                this.$notify({
                  title: '提示',
                  message:
                    this.toviewDatalist[i].extend[j].label +
                    '为' +
                    rules +
                    '类型',
                  type: 'warning'
                })
                bl = true
                break
              }
              // }
            }
            // 判断json
            if (this.toviewDatalist[i].extend[j].dataType) {
              let rules = this.toviewDatalist[i].extend[j].dataType
              if (rules == 'JSON') {
                var str = this.toviewDatalist[i].extend[j].defaultValue
                if (
                  str.indexOf('{') > -1 &&
                  str.indexOf(':') > -1 &&
                  str.indexOf('}') > -1 &&
                  str.indexOf('"') > -1
                ) {
                  var s = JSON.parse(str)
                  if (typeof s !== 'object' || s === null) {
                    this.$notify({
                      title: '提示',
                      message:
                        this.datalist[i].extend[j].label +
                        '输入的内容为json格式',
                      type: 'warning'
                    })
                    bl = true
                    break
                  }
                } else {
                  this.$notify({
                    title: '提示',
                    message:
                      this.toviewDatalist[i].extend[j].label +
                      '输入的内容为json格式',
                    type: 'warning'
                  })
                  bl = true
                  break
                }
              }
            }
            // 判断数据类型;
            if (this.toviewDatalist[i].extend[j].verifier) {
              let rules = this.toviewDatalist[i].extend[j].verifier
              let rulesrReg = this.toviewDatalist[i].extend[j].verifierReg
              var myReg2 = new RegExp(rulesrReg)
              if (!myReg2.test(this.toviewDatalist[i].extend[j].defaultValue)) {
                this.$notify({
                  title: '提示',
                  message:
                    this.toviewDatalist[i].extend[j].label +
                    '为' +
                    rules +
                    '类型',
                  type: 'warning'
                })
                bl = true
                break
              }
              // }
            }

            if (
              this.toviewDatalist[i].extend[j].maxLength != '' &&
              this.toviewDatalist[i].extend[j].minLength != ''
            ) {
              if (
                this.toviewDatalist[i].extend[j].defaultValue.length >
                this.toviewDatalist[i].extend[j].maxLength ||
                this.toviewDatalist[i].extend[j].defaultValue.length <
                this.toviewDatalist[i].extend[j].minLength
              ) {
                this.$notify({
                  title: '提示',
                  message:
                    this.toviewDatalist[i].extend[j].label +
                    '字数长度请控制在' +
                    this.toviewDatalist[i].extend[j].minLength +
                    '~' +
                    this.toviewDatalist[i].extend[j].maxLength +
                    '之间',
                  type: 'warning'
                })
                bl = true
                break
              }
            }
            // 判断长度（最小）
            if (
              this.toviewDatalist[i].extend[j].maxLength == '' &&
              this.toviewDatalist[i].extend[j].minLength != ''
            ) {
              if (
                this.toviewDatalist[i].extend[j].defaultValue.length <
                this.toviewDatalist[i].extend[j].minLength
              ) {
                this.$notify({
                  title: '提示',
                  message:
                    this.toviewDatalist[i].extend[j].label +
                    '字数最少长度为' +
                    this.toviewDatalist[i].extend[j].minLength,
                  type: 'warning'
                })
                bl = true
                break
              }
            }
            // 判断长度（最长）
            if (
              this.toviewDatalist[i].extend[j].maxLength != '' &&
              this.toviewDatalist[i].extend[j].minLength == ''
            ) {
              if (
                this.toviewDatalist[i].extend[j].defaultValue.length >
                this.toviewDatalist[i].extend[j].maxLength
              ) {
                this.$notify({
                  title: '提示',
                  message:
                    this.toviewDatalist[i].extend[j].label +
                    '字数最长长度为' +
                    this.toviewDatalist[i].extend[j].maxLength,
                  type: 'warning'
                })
                bl = true
                break
              }
            }
          }
        }
      }
      if (bl) {
        return false
      }
      var data = { name: this.ciname, content: this.toviewDatalist, environmentId: envval2, systemId: this.sysId }
      // // console.log(this.toviewDatalist);
      this.isbl = true

      axios.CiDataEdit(this.itemId, data).then(res => {
        if (res.data.code == 200) {
          this.$notify({
            title: '提示',
            type: 'success',
            message: '保存成功!',
            duration: 1000
          })
          this.$router.go(-1)
        } else {
          this.isbl = false
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning',
            duration: 1000
          })
        }
      })
    },
    changeData ($this) {
      // 失去焦点的时候替换json串中的值
      var $input = $this.target
      // var id = $input.id;
      // 判断必填
      if ($input.required) {
        if ($input.value.length == 0) {
          this.$notify({
            title: '提示',
            message: '不能为空哦～',
            type: 'warning'
          })
        }
        //  文本框判断

        if (
          $input.getAttribute('maxLength') &&
          $input.getAttribute('minLength')
        ) {
          if (
            $input.value.length > $input.getAttribute('maxLength') ||
            $input.value.length < $input.getAttribute('minLength')
          ) {
            this.$notify({
              title: '提示',
              message:
                '字数请控制在' +
                $input.getAttribute('minLength') +
                '~' +
                $input.getAttribute('maxLength') +
                '之间',
              type: 'warning'
            })
          }
        }
      } else {
        if ($input.value.length != 0) {
          //  文本框判断
          if (
            $input.getAttribute('maxLength') &&
            $input.getAttribute('minLength')
          ) {
            if (
              $input.value.length > $input.getAttribute('maxLength') ||
              $input.value.length < $input.getAttribute('minLength')
            ) {
              this.$notify({
                title: '提示',
                message:
                  '字数请控制在' +
                  $input.getAttribute('minLength') +
                  '~' +
                  $input.getAttribute('maxLength') +
                  '之间',
                type: 'warning'
              })
            }
          }
        }
      }

      // var jsonStr = this.toviewDatalist;
      // for (var i = 0; i < jsonStr.length; i++) {
      //   var extendStr = jsonStr[i].extend;
      //   for (var j = 0; j < extendStr.length; j++) {
      //     var obj = extendStr[j];
      //     if (id == obj.fieldName + obj.id) {
      //       obj.defaultValue = $input.value;
      //       this.toviewDatalist[i].extend[j] = obj;
      //     }
      //   }
      // }
    }
  },
  beforeDestroy () {
    // // console.log(checkModification());
    Bus.$off('editCIitem')
    Bus.$off('deleteCi')
    return false
  },
  updated () {
    // initFileds();
  },
  beforeRouteLeave (to, from, next) {
    let bl = checkModification(this.isbl)
    if (bl) {
      const answer = window.confirm(
        '页面相关数据还未保存，是否离开当前页面!'
      )
      if (answer) {
        next()
      } else {
        // 不支持传递回调(因为this实例已经创建可以获取到，所以没必要)
        next(false)
      }
    } else {
      next()
    }
  },
  destroyed () {
    window.onbeforeunload = null
  },
  mounted () {
    onbeforeunload()
    // this.getenvtablist()
    this.toviewData()
    this.getSysTablistData()
    this.getCIlist()
    this.getenvtablist()
    // checkModification()
    let _this = this
    Bus.$on('deleteCi', function (val) {
      if (_this.currentCI.ciitemId != val) {
        let idx = 0
        for (let key in _this.currentCI.connect) {
          if (_this.currentCI.connect[key].ciitemId == val) {
            idx = key
          }
        }
        _this.currentCI.connect.splice(idx, 1)
      }
    })

    Bus.$on('clear', function () {
      _this.visibedRelation = false
      _this.visibedCondition = false
      _this.isshow = false
    })
  }
}
</script>
<style scoped lang="scss">
.bg {
  margin: 10px;
  background: #fff;
  .content {
    margin: 10px;
    overflow-y: auto !important;
    .el-tabs {
      margin-top: 10px;
      /deep/ .el-tabs__header {
        margin: 0 !important;
      }
    }

    .grid-content {
      padding: 10px;
      .box-title {
        padding-bottom: 10px;
        .box-bottom {
          border-bottom: 1px solid #ccc;
          width: 62%;
          font-size: 20px;
          font-weight: 400;
          display: inline-block;
          padding-bottom: 10px;
          line-height: 42px;
        }
      }
      .newCIName {
        .lineheight {
          line-height: 42px;
        }
        .textr {
          text-align: right;
        }
      }
    }
    .relation-box {
      width: 100%;
      height: 600px;
      .content-wrapper {
        padding: 20px;
        box-shadow: 0 0 8px #e0e0e0;
        .top-content {
          margin: 20px;
          .top-content {
            .gx-box {
              color: #fff;
              ul {
                margin: 10px;
                li {
                  display: inline-block;
                  list-style-type: none;
                  padding: 5px 8px;
                  margin: 5px 5px;
                  background-color: #aeaeae;
                  color: #fff;
                  border-radius: 3px;
                  cursor: pointer;
                  font-size: 14px;
                }
              }
            }
            .font-styles {
              text-align: center;
              color: #afafaf;
            }
            .type-box {
              ul {
                margin: 10px;
                li {
                  list-style-type: none;
                  cursor: pointer;
                  font-size: 12px;
                  padding: 5px 10px;
                  &:hover {
                    background: #409eff;
                    color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .top-btn {
    margin: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .content-left-btn {
      flex: 1;
      text-align: center;
      padding: 10px 0;
    }
  }

  .containerbox {
    margin: 20px;
    background: #fff;
  }
  .title {
    width: 50%;
    padding-top: 20px;
    margin: 20px 0;
    border-bottom: 2px solid #f5f5f5;
  }
  .containBox {
    margin-top: 20px;
    margin-left: 20px;
    padding: 1rem;
    background-color: #fff;
  }
  .mrgTop {
    margin-top: 0.7rem;
  }
  .newCIName,
  .nameWrapper,
  .classificationWrapper {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .redColor {
    color: red;
  }
  .el-col-1 {
    .el-icon-error {
      color: red;
    }
    .el-icon-success {
      color: dodgerblue;
    }
  }
  .fontstyle {
    font-size: 22px;
    color: #333;
    font-weight: 400;
    border-bottom: 2px solid #423be2;
    padding-bottom: 14px;
    display: inline-block;
    width: 62%;
  }
  .textc {
    text-align: center;
  }
  .textl {
    text-align: left;
  }
  .tabstyle {
    margin-top: 20px;
    overflow: auto;
    height: 518px;
  }
  .box-font {
    height: 40px;
    cursor: pointer;
    border: 1px solid #436382;
  }
  .active {
    background-color: #00A8E8;
    color: #fff;
  }
}
</style>
