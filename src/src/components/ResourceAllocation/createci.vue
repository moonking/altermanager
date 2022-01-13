<template>
  <div class="containBox deep-aibms-color-bg">
    <el-button
       class="margin-left-btn nomal-button"
      plain
      style="float: right;position: relative;z-index:100"
      @click="getFromExcel"
    >EXCEL导入</el-button>
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input class="search" v-model="ciName" placeholder="请输入CI类型名称" clearable></el-input>
      </el-col>
      <el-col :span="10" class="search-wrapper item-right">
        <el-button icon="el-icon-search" type="primary" @click="searchCitype">查找</el-button>
        <el-button
          class="margin-left-btn nomal-button"
          @click="getFromServer"
        >从服务端获取</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <el-row class="tabstyle">
            <el-menu
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :default-openeds="openeds"
              :default-active="selectIndex"
            >
              <el-submenu :index="index+''" v-for="(item,index) in tablist" :key="index">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item-group>
                  <!-- <template slot="title">分组一</template> -->
                  <el-menu-item
                    class="color666"
                    :index="index+'-'+index2"
                    v-for="(data,index2) in item.citypeList"
                    :key="index2"
                    @click="getcitype(data)"
                  >
                    <img :src="data.icon" alt style="width:20px;height:20px;margin:0 5px 0 20px;" />
                    {{data.name}}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-row>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple" v-if="showData">
          <!-- <el-row>
            <el-row style="float: right;position: absolute; left: 62%;z-index: 1000;">
              <el-button type="warning">csv导入</el-button>
              <el-button type="warning">Excel导入</el-button>
              <el-button type="warning">服务器获取</el-button>
            </el-row>
          </el-row>-->
          <el-row>
            <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="属性" name="first"></el-tab-pane>
            <el-tab-pane label="关系" name="second"></el-tab-pane>-->

            <div class="myTab">
              <div
                :class="{'click': activeName == 'first' ? true : false}"
                @click="handleClick('first')">属性</div>
              <!-- <div
                :class="{'click': activeName == 'second' ? true : false}"
                @click="handleClick('second')">关系</div> -->
            </div>
            <div v-if="visible" class="myTab-content white-color">
              <el-row v-for="item in datalist" :key="item.id">
                <el-row v-if="item.title != '名称'">
                  <span class="fontstyle" v-if="item.title">{{item.title}}</span>
                </el-row>
                <el-row>
                  <el-row class="newCIName" v-for="data in item.extend" :key="data.id">
                    <el-col :span="3" class="lineheight textr">
                      <span style="color:red" v-if="data.required==true">*</span>
                      <span style="margin-right: 33px;">{{data.label}}:</span>
                    </el-col>
                    <el-col :span="10">
                      <el-input
                        v-if="data.type == 'labelNameInput'"
                        type="text"
                        v-model="data.defaultValue"
                        :maxLength="data.maxLength"
                        :minLength="data.minLength"
                        :rows="data.rows"
                        :required="data.required"
                        :input="inputFun(data.defaultValue)"
                        @blur="changeData($event)"
                        :id="data.fieldName+data.id"
                        :disabled="isdisable == 1 ? true : false"
                        :verifier="data.verifier"
                      ></el-input>
                      <el-input
                        v-if="data.type == 'multiLineInput'"
                        type="textarea"
                        v-model="data.defaultValue"
                        :maxLength="data.maxLength"
                        :minLength="data.minLength"
                        :rows="data.rows"
                        :required="data.required"
                        :input="inputFun(data.defaultValue)"
                        @blur="changeData($event)"
                        :id="data.fieldName+data.id"
                        :disabled="isdisable == 1 ? true : false"
                        :verifier="data.verifier"
                      ></el-input>
                      <el-date-picker
                        :required="data.required"
                        v-if="data.type == 'dateInput' && !data.dateOnly "
                        v-model="data.defaultValue"
                        type="datetime"
                        :id="data.fieldName+data.id"
                        :disabled="isdisable == 1 ? true : false"
                        placeholder="选择日期"
                      ></el-date-picker>
                      <el-date-picker
                        :required="data.required"
                        v-if="data.type == 'dateInput' && data.dateOnly "
                        v-model="data.defaultValue"
                        type="date"
                        placeholder="选择日期"
                        :disabled="isdisable == 1 ? true : false"
                        :id="data.fieldName+data.id"
                      ></el-date-picker>
                      <el-input
                        v-if="data.type == 'singleLineInput'"
                        type="text"
                        v-model="data.defaultValue"
                        maxlength="20"
                        minlength="0"
                        :id="data.fieldName+data.id"
                        :required="data.required"
                        :disabled="isdisable == 1 ? true : false"
                        :rules="data.rules"
                      ></el-input>
                      <el-input
                        :maxLength="data.maxLength"
                        :minLength="data.minLength"
                        type="text"
                        :min="0"
                        :disabled="data.readOnly"
                        :controls="controls"
                        v-if="data.type == 'numInput'"
                        v-model="data.defaultValue"
                        @blur="changeData($event)"
                        :id="data.fieldName+data.id"
                        :required="data.required"
                        :rules="data.rules"
                      ></el-input>
                      <el-input
                        type="password"
                        v-if="data.type == 'pwdInput'"
                        v-model="data.defaultValue"
                        :maxLength="data.maxLength"
                        :minLength="data.minLength"
                        @blur="changeData($event)"
                        :id="data.fieldName+data.id"
                        :required="data.required"
                        :disabled="isdisable == 1 ? true : false"
                        :verifier="data.verifier"
                      ></el-input>
                      <el-select
                        :clearable="true"
                        v-if="data.type == 'selectInput'"
                        v-model="data.defaultValue"
                        :multiple="data.moreSelect"
                        :disabled="isdisable == 1 ? true : false"
                      >
                        <el-option
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
                        :clearable="true"
                        v-if="data.type == 'credentialsSelect'"
                        v-model="data.defaultValue"
                        :multiple="data.moreSelect"
                        placeholder="请选择凭证"
                        :disabled="isdisable == 1 ? true : false"
                        style="width:100%"
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
                      <el-select
                        :clearable="true"
                        v-if="data.type == 'optionsInputSys'"
                        v-model="data.defaultValue"
                        :multiple="data.moreSelect"
                        :disabled="isdisable == 1 ? true : false"
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
                      <el-select
                        :clearable="true"
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
                    </el-col>
                  </el-row>
                </el-row>
              </el-row>
              <el-row :gutter="20" class="textc save-top" v-if="clickBtn">
                <el-col :span="10" style="margin-left: 110px">
                  <el-button
                    type="primary"
                    @click="addcitype"
                    v-if="isdisable == 0 ? true : false"
                  >保存</el-button>
                  <el-button
                    class="nomal-button"
                    @click="cancel"
                    v-if="isdisable == 0 ? true : false"
                  >取消</el-button>
                </el-col>
              </el-row>
            </div>
            <!-- <div v-if="!visible" class="last-box">
              <el-row :gutter="8" style="border: 1px solid #e0e0e0;">
                <el-col :span="17">
                  <app-chart
                    style="width: 100%;height: 600px;"
                    :nodeTypeId="nodeTypeId"
                    :chartType="chartType"
                    @createCI="handleEdit"
                  ></app-chart>
                </el-col>
                <el-col :span="7" class="content-wrapper">
                  <div class="top-btn">
                    <span
                      @click="addNewPre"
                      style="border-right: 1px solid #00A8E8"
                      :class="{'active': selectTabItem }"
                    >新增上层结构</span>
                    <span @click="addNewNex" :class="{'active': !selectTabItem}">新增下层结构</span>
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
                            <p class="font-styles" v-if="gxTag">{{gxTag}}</p>
                            <p class="font-styles" v-else>选择关系</p>
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
                            <p class="font-styles" v-if="tjTag">{{tjTag}}</p>
                            <p class="font-styles" v-else>选择对应条件</p>
                          </div>
                        </el-popover>
                      </el-form-item>
                      <el-form-item>
                        <el-popover
                          placement="bottom-end"
                          width="240"
                          trigger="manual"
                          v-model="isshow"
                        >
                          <div class="type-box">
                            <el-tree
                              :data="CIList"
                              :highlight-current="true"
                              :props="defaultProps"
                              @node-click="handleNodeClick"
                            ></el-tree>
                          </div>
                          <div slot="reference" class="box-font" @click="clickBox">
                            <p class="font-styles" v-if="typeTag">{{typeTag}}</p>
                            <p class="font-styles" v-else>选择CI项</p>
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
            </div> -->
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="编辑CI项关系" :visible.sync="CIdialog" center width="40%">
      <el-form style="margin: 0 auto;">
        <el-form-item label="关系" label-width="120">
          <el-select v-model="curLabel" :clearable="true">
            <el-option
              v-for="gx in gxTagsList"
              :key="gx.lab"
              :label="gx.val"
              :value="gx.val"
            >{{gx.val}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条件" label-width="120">
          <el-select v-model="curRelation" :clearable="true">
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
        <el-button @click="closeCIDialog">取 消</el-button>
        <el-button type="primary" @click="confirmCIDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
// import { initFileds, checkModification } from "../../utils/reload.js";
import {
  initFileds,
  checkModification,
  onbeforeunload
} from '../../utils/reload.js'
import CIchart from './CIchart.vue'
import Bus from '../common/bus.js'

export default {
  inject: ['reload'],
  data () {
    return {
      isbl: false,
      value1: '',
      Sname: '',
      vid: '',
      showRedIcon: false,
      showSuccess: false,
      number: 0,
      num: 0,
      controls: true,
      totalNumber: 20,
      datalist: [],
      tablist: [],
      ciName: '',
      openeds: [0],
      citypeId: '',
      ciname: '',
      selectIndex: '',
      showData: true,
      clickBtn: false,
      clickNextBtn: true,
      isedit: false, // 记录页面是否修改了内容
      isCanSubmit: false, // 记录用户是否保存内容
      index: 0,
      nodeTypeId: '',
      chartType: '',
      gxTagsList: [
        {
          lab: 'gx-1',
          val: '运行'
        },
        {
          lab: 'gx-2',
          val: '连接'
        },
        {
          lab: 'gx-3',
          val: '依赖'
        },
        {
          lab: 'gx-4',
          val: '包含'
        },
        {
          lab: 'gx-5',
          val: '虚拟化'
        },
        {
          lab: 'gx-6',
          val: '管理'
        },
        {
          lab: 'gx-7',
          val: '安装'
        }
      ],
      tjTagsList: [
        {
          lab: 'tj-1',
          val: '一对一'
        },
        {
          lab: 'tj-2',
          val: '一对多'
        },
        {
          lab: 'tj-3',
          val: '多对一'
        },
        {
          lab: 'tj-4',
          val: '多对多'
        }
      ],
      CIList: [],
      visibedCondition: false,
      visibedRelation: false,
      isshow: false,
      gxTag: '',
      tjTag: '',
      typeTag: '',
      operation: 'up',
      checkType: '',
      activeName: 'first',
      currentData: {},
      SystablistData: [],
      EnvtablistData: [],
      currentIcon: '',
      sshoptions: [
      ],
      options: [],
      // envoptions:['',''],

      // EnvtablistData: [
      //   {
      //     value: "0",
      //     label: "测试环境"
      //   },
      //   {
      //     value: "1",
      //     label: "预生产环境"
      //   },
      //   {
      //     value: "2",
      //     label: "生产环境"
      //   }
      // ],
      citypeName: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      cigroupId: '',
      selectTabItem: true,
      visible: true,
      selectValue: {},
      isdisable: 0,
      allList: [],
      CIdialog: false,
      curLabel: '',
      curRelation: '',
      editId: '',
      relationCI: '',
      curCI: {}
    }
  },
  components: {
    'app-chart': CIchart
  },
  filters: {
    Dtype (val) {
      if (val) {
        return val == 0 ? 'SSH凭证' : val == 1 ? '应用管理凭证' : val == 2 ? '代码库凭证' : '据'
      } else {
        return ''
      }
    }
  },
  methods: {
    // 关闭修改弹框
    closeCIDialog () {
      this.CIdialog = false
    },
    // 修改关系后保存
    confirmCIDialog () {
      let data = JSON.parse(this.currentData.relation)
      data.connect.forEach(item => {
        if (this.editId === item.ciitemId) {
          item.label = this.curLabel
          item.relation = this.curRelation
        }
      })
      let params = {
        'ciitemId': this.currentData.ciitemId,
        'icon': this.currentData.icon,
        'name': this.currentData.name,
        'relation': data
      }
      axios.CiDataEdit(this.currentData.ciitemId, params).then(res => {
        if (res) {
          if (res.data.success) {
            let data = res.data.data.result
            if (data.relation) {
              let rel = JSON.parse(data.relation)
              rel.connect.forEach(item => {
                if (this.editId === item.ciitemId) {
                  item.label = this.curLabel
                  item.relation = this.curRelation
                }
              })
              let params = {
                'ciitemId': this.currentData.ciitemId,
                'icon': this.currentData.icon,
                'name': this.currentData.name,
                'relation': rel
              }
              // console.log(params);
              axios.CiDataEdit(this.currentData.ciitemId, params).then(res => {
                // console.log(res);
                if (res.data.success) {
                  this.updateRelationInfo(this.currentData.ciitemId)
                }
              })
            } else {
              this.$notify({
                type: 'warning',
                message: '返回格式不正确'
              })
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
    // 接受值
    handleEdit (val) {
      this.editId = val
      if (this.currentData.ciitemId !== val) {
        if (this.currentData.relation) {
          let data = JSON.parse(this.currentData.relation)
          data.connect.forEach(item => {
            if (item.ciitemId === val) {
              this.curLabel = item.label
              this.curRelation = item.relation
              this.CIdialog = true
            }
          })
        }
      }

      axios.CiDataDetail(val).then(res => {
        if (res) {
          if (res.data.success) {
            this.relationCI = res.data.data.result
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
    getNewSource (val) {
      axios.CiDataDetail(val).then(res => {
        if (res) {
          if (res.data.success) {
            this.currentData = res.data.data.result
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 修改关联项信息
    updateRelationInfo (curId) {
      let data = JSON.parse(this.relationCI.relation)

      data.connect.forEach(item => {
        if (item.ciitemId === curId) {
          item.label = this.curLabel
          item.relation = this.curRelation
        }
      })
      let params = {
        'ciitemId': this.relationCI.ciitemId,
        'icon': this.relationCI.icon,
        'name': this.relationCI.name,
        'relation': data
      }
      axios.CiDataEdit(this.relationCI.ciitemId, params).then(res => {
        if (res) {
          if (res.data.success) {
            Bus.$emit('createCI', curId)
            this.CIdialog = false
            this.$notify({
              type: 'success',
              message: '编辑成功!'
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

    // 环境下拉
    getenvtablist () {
      let data = {
        environmentType: '',
        name: ''
      }
      axios.envtablist(data).then(res => {
        if (res) {
          if (res.data.success) {
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
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      }).catch()
      // this.EnvtablistData.forEach((item)=>{
      //       this.options.push({label:item.label,value:item.value,children:[]})
      //     })
    },
    // envtablist(val){

    //   let data = {
    //     environmentType:val[0],
    //     name:''
    //   }
    //   envtablist(data).then(res=>{
    //     if(res.data.success){
    // this.options.forEach((item)=>{
    //       if(val[0]==item.value){
    //         item.children=[]
    //         res.data.data.result.forEach((d)=>{
    //         item.children.push({label:d.name,value:d.environmentId})

    //         })
    //       }
    //     })
    //     this.options.reverse().reverse()
    //     }

    //   }).catch()
    // },
    handleChange (value) {
    },
    handleNodeClick (value) {
      this.checkType = value
      this.isshow = false
      this.typeTag = value.name
    },
    // ci类型列表
    getCIlistArr (id, name) {
      this.allList = []
      this.CIList = []
      Promise.all([axios.getciListArr(id, 'up'), axios.getciListArr(id, 'down')]).then(res => {
        for (let key in res) {
          if (res[key]) {
            if (res[key].data.success) {
              if (res[key].data.data) {
                this.allList.push(res[key].data.data)
              }
            }
          } else {
            this.$notify({
              type: 'error',
              message: '接口请求失败'
            })
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
      }).catch(err => {
        if (err) {
          console.log(err)
        }
      })
    },
    // 环境下拉框
    getSysTablistData () {
      var name = ''

      axios.getcigroupSystablist(name).then(res => {
        this.SystablistData = res.data.data.result
      })
    },
    confirm () {
      let count = 0
      let conn = {
        top: '',
        left: '',
        tag: '',
        ciitemId: '',
        label: '',
        relation: '',
        icon: ''
      }
      axios.CiDataDetail(this.curCI.ciitemId).then(res => {
        if (res) {
          if (res.data.success) {
            this.currentData = res.data.data.result
            if (this.curCI.ciitemId != this.checkType.ciitemId) {
              if (this.currentData.relation) {
                if (this.gxTag) {
                  if (this.tjTag) {
                    if (this.checkType) {
                      if (this.checkType.ciitemId) {
                        conn.ciitemId = this.checkType.ciitemId
                        conn.label = this.gxTag
                        conn.relation = this.tjTag
                        conn.icon = this.checkType.icon
                        let data = JSON.parse(this.currentData.relation)
                        if (data.connect) {
                          data.connect.forEach(item => {
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

                            data.connect.push(conn)

                            let params = {
                              'ciitemId': this.currentData.ciitemId,
                              'name': this.currentData.name,
                              'relation': data
                            }

                            axios.CiDataEdit(this.currentData.ciitemId, params).then(result => {
                              if (result) {
                                if (result.data.success) {
                                  this.createConnect(this.checkType.ciitemId, this.currentData, this.gxTag, this.tjTag, this.operation)
                                  this.gxTag = ''
                                  this.tjTag = ''
                                  this.checkType = ''
                                  this.typeTag = ''
                                  Bus.$emit('createCI', this.currentData.ciitemId)
                                  this.getNewSource(this.currentData.ciitemId)
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
                              title: '提示',
                              message: '已存在该节点！',
                              type: 'warning'
                            })
                          }
                        } else {
                          let con = []
                          if (this.operation == 'up') {
                            conn.top = 30
                            conn.left = 50
                            conn.tag = this.operation
                          } else if (this.operation == 'down') {
                            conn.top = 70
                            conn.left = 50
                            conn.tag = this.operation
                          }

                          con.push(conn)
                          data.connect = con

                          let params = {
                            'ciitemId': this.currentData.ciitemId,
                            'name': this.currentData.name,
                            'relation': data
                          }

                          axios.CiDataEdit(this.currentData.ciitemId, params).then(result => {
                            if (result) {
                              if (result.data.success) {
                                this.createConnect(this.checkType.ciitemId, this.currentData, this.gxTag, this.tjTag, this.operation)
                                this.gxTag = ''
                                this.tjTag = ''
                                this.checkType = ''
                                this.typeTag = ''
                                Bus.$emit('createCI', this.currentData.ciitemId)
                              }
                            } else {
                              this.$notify({
                                type: 'error',
                                message: '接口请求失败'
                              })
                            }
                          })
                        }
                      } else {
                        this.$notify({
                          title: '提示',
                          message: '请选择子项内容',
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
                let obj = {}
                let coArr = []
                obj.top = 44
                obj.left = 50
                obj.ciitemId = this.curCI.ciitemId
                obj.icon = this.curCI.icon
                if (this.gxTag) {
                  if (this.tjTag) {
                    if (this.checkType) {
                      if (this.checkType.ciitemId) {
                        conn.ciitemId = this.checkType.ciitemId
                        conn.label = this.gxTag
                        conn.relation = this.tjTag
                        conn.icon = this.checkType.icon
                        if (this.operation == 'up') {
                          conn.top = 30
                          conn.left = 50
                          conn.tag = this.operation
                        } else if (this.operation == 'down') {
                          conn.top = 70
                          conn.left = 50
                          conn.tag = this.operation
                        }
                        coArr.push(conn)
                        obj.connect = coArr
                        let params = {
                          'ciitemId': this.currentData.ciitemId,
                          'name': this.currentData.name,
                          'relation': obj,
                          'icon': this.curCI.icon
                        }
                        axios.CiDataEdit(this.currentData.ciitemId, params).then(result => {
                          if (result) {
                            if (result.data.success) {
                              this.createConnect(this.checkType.ciitemId, this.currentData, this.gxTag, this.tjTag, this.operation)
                              Bus.$emit('createCI', this.currentData.ciitemId)
                              this.gxTag = ''
                              this.tjTag = ''
                              this.checkType = ''
                              this.typeTag = ''

                              this.getNewSource(this.currentData.ciitemId)
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
                          title: '提示',
                          message: '请选择子项内容',
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
            } else {
              this.$notify({
                title: '提示',
                message: '已存在该节点！',
                type: 'warning'
              })
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

    // 关联相关CI项
    createConnect (id, value, label, relation, operation) {
      axios.CiDataDetail(id).then(res => {
        if (res) {
          if (res.data.success) {
            let curData = res.data.data.result
            if (curData.relation) {
              let data = JSON.parse(curData.relation)
              let count = 0
              if (data.connect) {
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
                  // let params = {
                  //   'ciitemId': id,
                  //   'icon': curData.icon,
                  //   'name': curData.name,
                  //   'relation': data
                  // };
                  // axios.CiDataEdit(id, params).then(result => {
                  //   if (result.data.success) {

                  //   }
                  // });
                } else {
                  this.$notify({
                    title: '提示',
                    message: '已存在该节点！',
                    type: 'warning'
                  })
                  console.log('已存在不修改')
                }
              } else {
                let conn = []
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
                conn.push(node)
                data.connect = conn
                let params = {
                  'ciitemId': id,
                  'icon': curData.icon,
                  'name': curData.name,
                  'relation': data
                }
                axios.CiDataEdit(id, params).then(result => {
                  if (result.data.success) {
                    // console.log(result);
                  }
                })
              }
            } else {
              let CurObj = {
                ciitemId: curData.ciitemId,
                icon: curData.icon,
                top: 44,
                left: 50,
                connect: []
              }
              let node = {
                ciitemId: value.ciitemId,
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
              let params = {
                'ciitemId': id,
                'icon': curData.icon,
                'name': curData.name,
                'relation': CurObj
              }

              axios.CiDataEdit(id, params).then(result => {
                if (result.data.success) {
                  // console.log(result);
                }
              })
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
      this.type = ''
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
      this.isshow = false
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
    // 新增下层
    addNewNex () {
      this.CIList = []
      this.selectTabItem = false
      this.isshow = false
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
    handleClick (tab) {
      if (tab == 'first') {
        this.visible = true
        this.activeName = 'first'
      } else {
        let create = JSON.parse(sessionStorage.getItem('createCI'))
        if (create) {
          this.chartType = 'createCI'
          this.nodeTypeId = create.ciitemId
          this.visible = false
          this.activeName = 'second'
          this.getCurrentNode(create.ciitemId)
        } else {
          this.$notify({
            title: '提示',
            message: '请先填写新增内容！',
            type: 'warning'
          })
          this.visible = true

          this.activeName = 'first'
        }
      }
    },
    // changedom() {
    //   let dom1 = document.getElementById("tab-0");
    //   let dom2 = document.getElementById("tab-0").nextElementSibling;
    //   let dom3 = document.getElementById("tab-0").previousElementSibling;
    //   dom1.style.fontSize = "24px";
    //   dom2.style.fontSize = "24px";
    //   dom3.style.width = "50px";
    // },
    getFromExcel () {
      this.$router.push({
        path: '/ResourceAllocation/Excel',
        query: { code: 1 }
      })
    },
    getFromServer () {
      this.$router.push({
        path: '/ResourceAllocation/creatci/getFromServer',
        query: { code: 1 }
      })
    },
    inputFun (value) {
      if (value) {
        this.number = value.length
      }
    },
    blurFun (value) {
      if (value.length < 5) {
        this.showRedIcon = true
        this.showSuccess = false
      } else if (value.length > 2) {
        this.showSaveBtn = true
        this.showRedIcon = false
        this.showSuccess = true
      }
    },
    // input框失焦点
    changeData ($this) {
      // 失去焦点的时候替换json串中的值
      var $input = $this.target
      // var id = $input.id;

      // 判断必填
      if ($input.required) {
        if ($input.value.length == 0) {
          this.$notify({
            title: '提示',
            message: '不能为空！',
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
    },
    // 取消
    cancel () {
      this.reload()
    },
    // 获取ci类型列表的信息
    getcitype (data) {
      sessionStorage.clear()
      this.citypeId = data.citypeId
      this.cigroupId = data.cigroupId
      this.selectValue = data
      this.citypeName = data.name
      this.activeName = 'first'
      this.isdisable = 0
      this.visible = true
      // this.envoptions=['','']
      this.getCIlistArr(data.citypeId, data.name)

      axios.getcitype(this.citypeId)
        .then(res => {
          if (!res.data.data.result.extend) {
            res.data.data.result.extend = [{ 'extend': [
              { 'defaultValue': '', 'label': '名称', 'type': 'singleLineInput' },
              { 'defaultValue': '', 'label': '业务组', 'type': 'optionsInputSys' },
              { 'defaultValue': '', 'label': '环境', 'type': 'optionsInputEnv' }] }]
          }
          if (res.data.data.result.extend) {
            this.showData = true
            this.clickBtn = true
            this.currentIcon = res.data.data.result.icon
            // console.log(res.data.data.result)
            if ((typeof res.data.data.result.extend) !== 'string') {
              this.datalist = res.data.data.result.extend
            } else {
              this.datalist = JSON.parse(res.data.data.result.extend)
            }
            for (var i = 0; i < this.datalist.length; i++) {
              for (var j = 0; j < this.datalist[i].extend.length; j++) {
                if (this.datalist[i].extend[j].label == '名称') {
                  this.ciname = this.datalist[i].extend[j].defaultValue
                }
                if (this.datalist[i].extend[j].label == '环境') {
                  this.datalist[i].extend[j].type = 'optionsInputEnv'
                }
                if (this.datalist[i].extend[j].label == '业务组') {
                  this.datalist[i].extend[j].type = 'optionsInputSys'
                }
                if (this.datalist[i].extend[j].label == '凭证') {
                  this.datalist[i].extend[j].type = 'credentialsSelect'
                  this.vid = this.datalist[i].extend[j].defaultValue + ''
                  // console.log(this.vid)
                  let data = {
                    name: '',
                    voucherType: this.vid
                  }
                  // this.datalist[i].extend[j].sshoptions = [];
                  this.getSshoptions(data, i, j)
                  this.datalist[i].extend[j].defaultValue = ''
                }
                var obj = this.datalist[i].extend[j]
                this.index = this.index + i + j
                obj.id = this.index
              }
            }
            initFileds()
          } else {
            this.showData = false
            this.clickBtn = false
          }
        })
        .catch()
    },
    getSshoptions (data, i, j) {
      let k = i
      let m = j
      axios.getVoucherList(data.name, data.voucherType)
        .then(res => {
          this.$set(this.datalist[k].extend[m], 'sshoptions', res.data.data.result)
        })
        .catch()
    },
    isJson (str) { },
    // 保存
    addcitype () {
      this.clickNextBtn = true
      let data = {}
      let bl = false
      let envval = ''
      let envval2 = ''
      this.datalist.forEach((item, index) => {
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
      // this.options.forEach((item)=>{
      //   if(item.value == this.envoptions[0]){
      //         envval = item.label
      //         // item.children.forEach((item2)=>{
      //         // if(  item2.value == this.envoptions[1]){
      //         //   envval2 = item2.label
      //         // }
      //         // })
      //   }
      // })
      console.log('yyy')
      data.citypeId = this.citypeId
      for (var i = 0; i < this.datalist.length; i++) {
        for (var j = 0; j < this.datalist[i].extend.length; j++) {
          for (var k = 0; k < this.SystablistData.length; k++) {
            if (this.SystablistData[k].systemId == this.datalist[i].extend[j].defaultValue) {
              this.datalist[i].extend[j].name = this.SystablistData[k].name
              this.datalist[i].extend[j].cname = this.SystablistData[k].name
              this.Sname = this.SystablistData[k].systemId
            }
          }
          if (this.datalist[i].extend[j].label == '环境') {
            // this.datalist[i].extend[j].defaultValue=this.envoptions[0]+','+this.envoptions[1]+','+envval+','+envval2
            // this.datalist[i].extend[j].defaultValue
            this.datalist[i].extend[j].cname = envval
          }
          if (this.datalist[i].extend[j].label == '凭证类型') {
            //  console.log(this.datalist[i].extend[j])
            this.datalist[i].extend[j].Value = this.vid + ',' + this.datalist[i].extend[j].defaultValue
          }

          if (this.datalist[i].extend[j].label == '名称') {
            this.ciname = this.datalist[i].extend[j].defaultValue
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
          // 判断必填
          if (this.datalist[i].extend[j].required) {
            if (
              this.datalist[i].extend[j].defaultValue == '' &&
              this.datalist[i].extend[j].defaultValue != '0'
            ) {
              this.$notify({
                title: '提示',
                message: this.datalist[i].extend[j].label + '不能为空',
                type: 'warning'
              })
              bl = true
              break
            }
          }
          // 判断验证规则
          if (this.datalist[i].extend[j].defaultValue && this.datalist[i].extend[j].defaultValue.length != 0) {
            if (this.datalist[i].extend[j].rules) {
              let rules = this.datalist[i].extend[j].rules
              let rulesrReg = this.datalist[i].extend[j].rulesrReg
              var myReg = new RegExp(rulesrReg)
              if (!myReg.test(this.datalist[i].extend[j].defaultValue)) {
                if (
                  this.datalist[i].extend[j].rules === '无' &&
                  this.datalist[i].extend[j].type == 'numInput'
                ) {
                  this.$notify({
                    title: '提示',
                    message: '必须为数字类型',
                    type: 'warning'
                  })
                } else {
                  this.$notify({
                    title: '提示',
                    message:
                      this.datalist[i].extend[j].label + '为' + rules + '类型',
                    type: 'warning'
                  })
                }

                bl = true
                break
              }
              // }
            }
            // 判断数据类型;
            if (this.datalist[i].extend[j].verifier) {
              let rules = this.datalist[i].extend[j].verifier
              let rulesrReg = this.datalist[i].extend[j].verifierReg
              var myReg2 = new RegExp(rulesrReg)
              if (!myReg2.test(this.datalist[i].extend[j].defaultValue)) {
                this.$notify({
                  title: '提示',
                  message:
                    this.datalist[i].extend[j].label + '为' + rules + '类型',
                  type: 'warning'
                })
                bl = true
                break
              }
              // }
            }
            // 验证正
            // json判断
            if (this.datalist[i].extend[j].dataType) {
              let rules = this.datalist[i].extend[j].dataType
              if (rules == 'JSON') {
                var str = this.datalist[i].extend[j].defaultValue
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
                      this.datalist[i].extend[j].label + '输入的内容为json格式',
                    type: 'warning'
                  })
                  bl = true
                  break
                }
              }
            }
            console.log('zzz')
            // 判断长度（最小最大都有）
            if (
              this.datalist[i].extend[j].maxLength != '' &&
              this.datalist[i].extend[j].minLength != ''
            ) {
              if (
                this.datalist[i].extend[j].defaultValue.length >
                this.datalist[i].extend[j].maxLength ||
                this.datalist[i].extend[j].defaultValue.length <
                this.datalist[i].extend[j].minLength
              ) {
                this.$notify({
                  title: '提示',
                  message:
                    this.datalist[i].extend[j].label +
                    '字数长度请控制在' +
                    this.datalist[i].extend[j].minLength +
                    '~' +
                    this.datalist[i].extend[j].maxLength +
                    '之间',
                  type: 'warning'
                })
                bl = true
                break
              }
            }
            // 判断长度（最小）
            if (
              this.datalist[i].extend[j].maxLength == '' &&
              this.datalist[i].extend[j].minLength != ''
            ) {
              if (
                this.datalist[i].extend[j].defaultValue.length <
                this.datalist[i].extend[j].minLength
              ) {
                this.$notify({
                  title: '提示',
                  message:
                    this.datalist[i].extend[j].label +
                    '字数最少长度为' +
                    this.datalist[i].extend[j].minLength,
                  type: 'warning'
                })
                bl = true
                break
              }
            }
            // 判断长度（最长）
            if (
              this.datalist[i].extend[j].maxLength != '' &&
              this.datalist[i].extend[j].minLength == ''
            ) {
              if (
                this.datalist[i].extend[j].defaultValue.length >
                this.datalist[i].extend[j].maxLength
              ) {
                this.$notify({
                  title: '提示',
                  message:
                    this.datalist[i].extend[j].label +
                    '字数最长长度为' +
                    this.datalist[i].extend[j].maxLength,
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
      console.log('kkk')
      data.name = this.ciname
      data.content = JSON.stringify(this.datalist)
      data.icon = this.currentIcon
      data.systemId = this.Sname
      data.environmentId = envval2
      let regName = /^[-a-zA-Z0-9_.:@\u4e00-\u9fa5]+$/
      if (!regName.test(data.name)) {
        return this.$notify({
          title: '提示',
          message: '名称格式错误：请输入1~20位字符，可包含中文、字母、数字、点或下划线！',
          type: 'warning',
          duration: 1000
        })
      }
      if (this.num > 0) {
        return false
      }
      this.num++
      this.isbl = true
      console.log('xxxx')
      setTimeout(() => {
        this.num = 0
      }, 100)
      axios.addcitype(data)
        .then(res => {
          if (res.data.code == 200) {
            this.$notify({
              title: '提示',
              message: '保存成功！',
              type: 'success',
              duration: 1000
            })
            this.isdisable = 1
            let obj = {
              ciitemId: res.data.data.ciitemId,
              name: this.ciname,
              icon: this.currentIcon,
              citypeId: this.citypeId
            }

            this.curCI = obj
            this.chartType = 'createCI'
            this.nodeTypeId = res.data.data.ciitemId
            this.activeName = 'second'
            this.visible = false
          } else {
            this.isbl = false
            this.num = 0
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'warning',
              duration: 1000
            })
          }
        })
        .catch()
    },
    // 获取ci类型列表
    getcigrouptablist () {
      // this.openeds = [0];
      this.selectIndex = '0-0'
      let data = {}
      data.name = ''
      data.templateId = ''
      axios.getcigrouptablist(data)
        .then(res => {
          this.tablist = res.data.data.result
          console.log(this.tablist)
          if (
            this.tablist.length > 0 &&
            this.tablist[0].citypeList.length > 0
          ) {
            this.getcitype(this.tablist[0].citypeList[0])
            // this.openeds = [0];
            this.selectIndex = '0-0'
          }
        })
        .catch()
    },
    // 搜索ci类型
    searchCitype (a) {
      if (a == 1) {
        // this.openeds = [0];
        this.selectIndex = '0-0'
      } else {
        if (this.ciName != '') {
          this.openeds = []
          this.selectIndex = ''
          this.tablist.forEach((item, index) => {
            if (item.name.indexOf(this.ciName) > -1) {
              this.openeds.push(index + '')
            }
            item.citypeList.forEach((value, a) => {
              if (value.name.indexOf(this.ciName) > -1) {
                this.openeds.push(index + '')
              }
            })
          })
        } else {
          this.$notify({
            title: '提示',
            message: '请输入搜索内容！',
            type: 'warning',
            duration: 1000
          })
        }
      }
    },
    handleOpen (key, keyPath) { },
    handleClose (key, keyPath) { }
  },
  updated () {
    // this.changedom();
  },
  beforeDestroy () { },
  destroyed () {
    window.onbeforeunload = null
  },
  beforeRouteLeave (to, from, next) {
    let bl = checkModification(this.isbl)
    if (bl) {
      const answer = window.confirm(
        '页面相关数据还未保存，是否离开当前页面'
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

  mounted () {
    this.searchCitype(1)
    onbeforeunload()
    this.getcigrouptablist()
    this.getSysTablistData()
    this.getenvtablist()
    this.isdisable = 0

    let _this = this
    Bus.$on('clear', function () {
      _this.visibedRelation = false
      _this.visibedCondition = false
      _this.isshow = false
    })
  },
  created () {
    this.getcigrouptablist()
  },
  watch: {
    tablist: {
      handler: function (obj) { },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.containBox {
  margin: 10px;
  padding: 20px;
  background-color: #fff;

  .search-wrapper {
    vertical-align: middle;
    text-align: right;
    .btn-font-line {
      line-height: 0 !important;
    }
  }
  .grid-content {
    .tabstyle {
      margin-top: 20px;
      overflow: auto;
      height: 558px;
    }
    .myTab {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 40px;
      margin-bottom: 5px;
      div {
        width: 60px;
        line-height: 40px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        cursor: pointer;
      }
    }
    .myTab-content {
      .fontstyle {
        font-size: 18px;
        color: #fff;
        font-weight: 400;
        /* border-bottom: 2px solid #423be2; */
        // border-bottom: 1px solid #00A8E8;
        padding-bottom: 14px;
        display: inline-block;
        width: 82%;
      }
      .newCIName {
        .lineheight {
          line-height: 42px;
          .textr {
            text-align: right;
            color: #606266;
          }
        }
      }
      .textc {
        text-align: center;
      }
    }
    .last-box {
      .content-wrapper {
        padding: 20px;
        box-shadow: 0 0 8px #e0e0e0;
        .top-btn {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          /* border: 1px solid rgba(22, 155, 213, 1);
          color: rgba(22, 155, 213, 1); */
          color: #00A8E8;
          span {
            flex: 1;
            text-align: center;
            padding: 10px 0;
          }
        }
        .top-content {
          /* width: 250px; */
          margin: 20px 0;
          .gx-box {
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
          .box-font {
            height: 40px;
            cursor: pointer;
            border: 1px solid #00A8E8;
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
  .newCIName,
  .nameWrapper,
  .classificationWrapper {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .mrgTop {
    margin-top: 0.7rem;
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
  .textl {
    text-align: left;
  }
  .aLabel {
    background-color: #fff;
  }
  .active {
    background-color: #00A8E8;
    color: #fff;
  }
  .click {
    /* border-bottom: 2px solid #409eff; */
    color: #00A8E8!important;
    border-bottom: 2px solid #00A8E8;
  }
  .color666 {
    color: #666;
  }
  .el-menu-item.is-active {
    color: #00A8E8;
  }
  .searchbtn {
    margin-top: 5px;
  }
}
</style>
