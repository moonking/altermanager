<template>
  <div class="containers" ref="content">
    <div id="div2">
      <div class="canvas" ref="canvas"></div>
      <div
        id="js-properties-panel"
        style="opacity: 0;z-index: -10;height:0; overflow: hidden;width: 300px;    left: 70%;"
        class="panel"
      ></div>
      <div id="div1"></div>
      <div id="bottom">↓</div>
    </div>
    <!-- <div id="js-properties-panel" class="panel"></div> -->
    <ul class="buttons" v-show="false">
      <li>下载</li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN diagram</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG image</a>
      </li>
    </ul>
    <el-dialog
      :visible.sync="addSystemBox"
      title="编辑节点"
      size="tiny"
      :before-close="handleDialogClose"
      width="1000px"
    >
      <div class="wrapperdialog" @scroll="viewscroll($event)">
        <el-form
          :model="NodeForm"
          label-width="120px"
          ref="form"
          label-position="right"
          :rules="NodeFormRules"
        >
          <div class="block-item base-info" id="first">
            <div class="block-title" @click="switchBlock(1)">
              <div class="title-tips"></div>
              <h3>
                基本信息
                <i
                  class="el-icon-arrow-right"
                  :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)',color:'#0066FF','margin-left':'10px'}"
                ></i>
              </h3>
            </div>
            <div class="block-content" v-show="blockSwitch[1]">
              <!-- <el-checkbox style="margin: 10px 38px;" v-model="checked" text-color>复用上一节点内容</el-checkbox> -->
              <el-radio-group
                style="margin: 10px 38px;"
                v-model="multiplexing"
                v-if="nodeParam&&nodeParam.length>0&&nodeParam[0].actNodeId!=ID"
                :disabled="$route.query.key=='detail'"
              >
                <el-radio @click.native.prevent="clickitem(3)" :label="3">复用上一节点内容</el-radio>
              </el-radio-group>
              <el-form-item label="节点名称：" prop="name" style="margin-bottom:0">
                <el-input
                  :disabled="$route.query.key=='detail'"
                  maxlength="20"
                  autocomplete="off"
                  clearable
                  v-model.trim="NodeForm.name"
                  placeholder="请为该节点设置名称"
                  :style=" {width: '280px'}"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="block-item task-process" id="second">
            <div class="block-title" @click="switchBlock(2)">
              <div class="title-tips"></div>
              <h3>
                资源设置
                <i
                  class="el-icon-arrow-right"
                  :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)',color:'#0066FF','margin-left':'10px'}"
                ></i>
              </h3>
            </div>
            <div class="block-content" v-show="blockSwitch[2]">
              <el-form-item label="选择资源类型：" style="margin-bottom:0">
                <el-radio-group
                  :disabled="$route.query.key=='detail'"
                  @change="ischangeval('resources')"
                  v-model="resourcesradio"
                >
                  <el-radio :label="1">OS</el-radio>
                  <el-radio :label="2">中间件</el-radio>
                  <el-radio :label="3">数据库</el-radio>
                  <el-radio :label="4">网络设备</el-radio>
                </el-radio-group>
              </el-form-item>

              <div class="rl42">
                <el-select
                  v-model="NodeForm.environmentId"
                  :disabled="$route.query.key=='detail'"
                  clearable
                  placeholder="请选择所属环境"
                  class="mrr"
                >
                  <el-option
                    v-for="item in Envlist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input
                  class="mrr"
                  :disabled="$route.query.key=='detail'"
                  maxlength="20"
                  clearable
                  v-model="NodeForm.resourcesName"
                  placeholder="请输入资源名称"
                  :style=" {width: '222px'}"
                ></el-input>
                <el-input
                  class="mrr"
                  :disabled="$route.query.key=='detail'"
                  maxlength="20"
                  v-model="NodeForm.ipAddress"
                  clearable
                  placeholder="请输入IP地址"
                  :style=" {width: '222px'}"
                ></el-input>
                <el-button class="headerIcon searchBtn titlesearch" @click="getResources(1)">
                  <img src="../../../static/img/searchs.png" alt />
                  <div>搜索</div>
                </el-button>
              </div>
              <div class="tablemg">
                <el-table
                  max-height="500"
                  ref="multipleTable"
                  :data="ResourcesData"
                  tooltip-effect="dark"
                  :header-cell-style="{ background: '#f5f5f5' }"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" :selectable="selectable"></el-table-column>
                  <el-table-column prop="name" label="资源名称"></el-table-column>
                  <el-table-column prop="environmentName" label="所属环境" v-if="resourcesradio !== 3"></el-table-column>
                  <el-table-column prop="ipAddress" label="IP地址"></el-table-column>
                  <el-table-column prop="instanceName" label="实例名称" v-if="resourcesradio === 3"></el-table-column>
                  <el-table-column prop="portNum" label="端口号" v-if="resourcesradio === 3"></el-table-column>
                </el-table>
              </div>
              <!-- 分页 -->
              <div class="block" style="text-align: right;width: 100%;margin-left: -66px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currPage"
                  :page-size="size"
                  :page-sizes="[10,30,50]"
                  layout="prev, pager, next, sizes, total, jumper"
                  :total="total"
                  v-if="page"
                  style="cursor: pointer;"
                ></el-pagination>
              </div>
            </div>
          </div>
          <div class="block-item task-process" id="third">
            <div class="block-title" @click="switchBlock(3)">
              <div class="title-tips"></div>
              <h3>
                工具集设置
                <i
                  class="el-icon-arrow-right"
                  :style="{transform: blockSwitch[3] ? 'rotate(90deg)' : 'rotate(0)',color:'#0066FF','margin-left':'10px'}"
                ></i>
              </h3>
            </div>
            <div class="block-content" v-show="blockSwitch[3]">
              <el-form-item label="选择工具集：" style="margin-bottom:0">
                <el-select
                  :disabled="$route.query.key=='detail'"
                  v-model="NodeForm.toolset"
                  @change="ischangeval('toolset')"
                  @visible-change="showoption"
                  clearable
                  placeholder="请选择工具集"
                >
                  <el-option
                    v-for="item in Toolsetdata"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="block-item task-process" id="fourth">
            <div class="block-title" @click="switchBlock(4)">
              <div class="title-tips"></div>
              <h3>
                脚本设置
                <i
                  class="el-icon-arrow-right"
                  :style="{transform: blockSwitch[4] ? 'rotate(90deg)' : 'rotate(0)',color:'#0066FF','margin-left':'10px'}"
                ></i>
              </h3>
            </div>
            <div class="block-content" v-show="blockSwitch[4]">
              <el-form-item label="选择脚本：" style="margin-bottom:22">
                <el-cascader
                  placeholder="请选择脚本"
                  :disabled="$route.query.key=='detail'"
                  clearable
                  :options="scriptdata"
                  v-model="scriptlist"
                  @change="getselectscriptvalue"
                  @visible-change="showoptionscript"
                ></el-cascader>
              </el-form-item>
              <el-form-item
                label="参数值："
                style="margin-right: 20px;"
                v-if="scriptlist.length>0&&scriptlist[1].length>0"
              >
                <el-table
                  :data="scripttabledata"
                  style="width: 94%"
                  max-height="300"
                  :header-cell-style="{ background: '#f5f5f5' }"
                >
                  <el-table-column prop="name" label="参数名" width="120" />
                  <el-table-column prop="titleName" label="参数标题名称" width="120" />
                  <el-table-column label="参数类型" width="120">
                    <template slot-scope="scope">{{ scope.row.paramType | typeStatusFilter }}</template>
                  </el-table-column>
                  <el-table-column prop="remarks" label="参数说明" width="120" />
                  <el-table-column label="参数值">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.paramValue"
                        placement="right"
                      >
                        <el-input
                          @change="ischangeval"
                          :disabled="$route.query.key=='detail'"
                          size="mini"
                          v-model="scope.row.paramValue"
                        ></el-input>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="isEmpty" label="是否必填" width="120"></el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </div>
          <div class="block-item task-process" id="fifth">
            <div class="block-title" @click="switchBlock(5)">
              <div class="title-tips"></div>
              <h3>
                其他设置
                <i
                  class="el-icon-arrow-right"
                  :style="{transform: blockSwitch[5] ? 'rotate(90deg)' : 'rotate(0)',color:'#0066FF','margin-left':'10px'}"
                ></i>
              </h3>
            </div>
            <div class="block-content" v-show="blockSwitch[5]">
              <el-form-item label="节点依赖：" style="margin-bottom:0">
                <el-select
                  :disabled="$route.query.key=='detail'"
                  v-model="NodeForm.nodedep"
                  @change="ischangeval"
                  clearable
                  placeholder="请选择节点依赖"
                >
                  <el-option
                    v-for="item in nodedeplist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="同步节点状态：" style="margin-top:16px">
                <el-select
                  :disabled="$route.query.key=='detail'"
                  v-model="NodeForm.upActNodeId"
                  @change="ischangeval"
                  clearable
                  placeholder="请需要同步的节点"
                >
                  <el-option
                    v-for="item in NodeIdList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-radio-group
                v-model="isAsync"
                :disabled="$route.query.key=='detail'"
                style="margin-left: 16px;"
              >
                <el-radio @click.native.prevent="clickitem2(1)" :label="1">异步执行</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="op-btns">
            <el-button
              v-if="$route.query.key!=='detail'"
              type="primary"
              @click="sure"
              :style="{marginRight: '60px'}"
            >保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-form>
      </div>
      <div class="right_anchor">
        <ul>
          <div v-for="(item,index) in anchordata" :key="index">
            <!-- <span v-if="steps>=(index+1)" class="tit">{{item.title}}</span> -->
            <li class="dot">
              <a :class="steps>=(index+1)?'firsta':''" @click="changeHash('#'+item.name)"></a>
            </li>
            <li v-if="index!=4" :class="steps>(index+1)?'lines':'no_line'"></li>
          </div>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import common from '@/utils/commonjs'
// import Anchor from "./anchorNav.vue";
import axios from '@/api';
const typeListMap = {
  '0': '字符',
  '1': '布尔',
  '2': '等号连接参数',
  '3': '位置参数'
}

export default {
  name: 'Workflow',
  props: {
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    activityData: {
      type: Object
    }
  },
  filters: {
    typeStatusFilter: status => typeListMap[status]
  },
  data () {
    // var validatejudgements = (rule, value, callback) => {
    //   if (this.judgement == '') {
    //     callback(new Error('请选择判断人'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      nocopy: false,
      NodeIdList: [],
      steps: 1,
      anchordata: [
        {
          name: 'first',
          title: '基本信息'
        },
        {
          name: 'second',
          title: '资源设置'
        },
        {
          name: 'third',
          title: '工具集设置'
        },
        {
          name: 'fourth',
          title: '脚本设置'
        },
        {
          name: 'fifth',
          title: '其他设置'
        }
      ],
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      bpmnXmlStr: '',
      // dialog参数
      idlist: '',
      isarraybl: false,
      ID: '',
      key: '',
      checked: false,
      nodeParam: [],
      addSystemBox: false,
      blockSwitch: {
        '1': true,
        '2': false,
        '3': false,
        '4': false,
        '5': false
      },
      Envlist: [],
      scriptlist: [],
      multiplexing: 0, // 是否复用上一节点
      ischange: false, // 弹出框数据是否改变
      isAsync: 0, // 异步节点
      resourcesradio: 1, // 资源类型
      ResourcesData: [], // 资源管理数据
      Toolsetdata: [], // 工具集
      scriptdata: [], // 脚本数据
      scripttabledata: [],
      // 分页数据
      page: 1,
      total: 1,
      currPage: 1,
      size: 10,
      nodedeplist: [
        {
          value: 'success',
          label: '前置节点成功后执行'
        },
        {
          value: 'failed',
          label: '前置节点失败后执行'
        },
        {
          value: 'always',
          label: '前置节点执行后执行'
        }
      ],
      value: '',
      multipleSelection: [],
      NodeForm: {
        name: '',
        nodedep: '',
        toolset: ''
      },
      NodeFormRules: {
        name: [{ required: true, message: '请输入节点名称', trigger: 'change' }]
      },
      oDiv: null,
      oDiv2: null,
      right: null,
      bottom: null,
      mouseStart: {},
      divStart: {},
      rightStart: {},
      bottomStart: {}
    }
  },
  watch: {
    // 复用节点
    ischange: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.multiplexing = 0
        }
      }
    },
    // 实时刷新xml的状态显示
    activityData: {
      handler (newValue, oldValue) {
        if (newValue.envid) {
          this.$set(this.NodeForm, 'environmentId', newValue.envid)
          return
        }
        this.createNewDiagram(this.bpmnModeler)
      },
      deep: true
    }
  },
  methods: {
    // 禁止table checkbox选中
    selectable (row, index) {
      if (this.key == 'detail') {
        return false
      } else {
        return true
      }
    },
    // 分页size改变
    handleSizeChange (val) {
      this.size = val
      this.getResources()
    },
    // 分页页数改变
    handleCurrentChange (val) {
      this.currPage = val
      this.getResources()
    },
    // 监听dialog滚动事件改变右侧anchor
    viewscroll (event) {
      let secondheight = document.getElementById('second').clientHeight
      let thirdheight = document.getElementById('third').clientHeight
      let fourthheight = document.getElementById('fourth').clientHeight
      let scrollTop = parseInt(event.target.scrollTop)
      if (scrollTop < 92) {
        this.steps = 1
      } else if (scrollTop < secondheight + 92 && scrollTop >= 92) {
        this.steps = 2
      } else if (
        scrollTop < secondheight + thirdheight + 92 &&
        scrollTop >= secondheight + 92
      ) {
        this.steps = 3
      } else if (
        scrollTop < secondheight + fourthheight - 20 &&
        scrollTop >= secondheight + thirdheight + 92
      ) {
        this.steps = 4
      } else if (scrollTop >= secondheight + fourthheight - 20) {
        this.steps = 5
      }
    },
    // 查询锚点状态
    Setsteps (idName) {
      if (idName == '#first') {
        return '1'
      } else if (idName == '#second') {
        return '2'
      } else if (idName == '#third') {
        return '3'
      } else if (idName == '#fourth') {
        return '4'
      } else if (idName == '#fifth') {
        return '5'
      }
    },
    // 使用document.querySelector实现锚点的效果
    changeHash (idName) {
      this.steps = this.Setsteps(idName)
      // 使div滚动至锚点位置
      document.querySelector(idName).scrollIntoView(true)
    },
    // radio单选选中和取消
    clickitem (e) {
      //  这个获取上一个nodeparam里面的数据 ，当为改变前面的节点直接新增新节点时 拿取api返回的数据进行保存
      e === this.multiplexing
        ? (this.multiplexing = 0)
        : (this.multiplexing = e)
      if (this.multiplexing) {
        this.nocopy = true
        this.ischange = false
        let index = this.returnindex()
        this.NodeForm.nodedep =
          this.nodeParam[index].nodedep || this.nodeParam[index].actStrategy
        this.resourcesradio =
          this.nodeParam[index].resourcesradio ||
          Number(this.nodeParam[index].resourcesType)
        this.isAsync = this.nodeParam[index].isAsync
        if (this.nodeParam[index].toolset && !this.nodeParam[index].maToolsId) {
          this.NodeForm.toolset =
            this.nodeParam[index].toolset == '10086'
              ? ''
              : this.nodeParam[index].toolset
        } else if (
          this.nodeParam[index].toolset &&
          this.nodeParam[index].maToolsId
        ) {
          this.NodeForm.toolset =
            this.nodeParam[index].toolset == '10086'
              ? ''
              : this.nodeParam[index].toolset
        } else if (
          !this.nodeParam[index].toolset &&
          this.nodeParam[index].maToolsId
        ) {
          this.NodeForm.toolset =
            this.nodeParam[index].maToolsId == '10086'
              ? ''
              : this.nodeParam[index].maToolsId
        }
        if (typeof this.nodeParam[index].resourcesIds === 'string') {
          this.nodeParam[index].multipleSelection = common.evil(
            this.nodeParam[index].resourcesIds
          )
          delete this.nodeParam[index].resourcesIds
        }
        if (this.nodeParam[index].multipleSelection) {
          this.getResources(this.nodeParam[index])
        }
        this.getscriptdata(this.nodeParam[index].actNodeId)
      } else if (!this.multiplexing && !this.ischange) {
        this.nocopy = false
        this.scripttabledata = []
        this.scriptlist = []
        this.NodeForm.nodedep = ''
        this.resourcesradio = 1
        this.isAsync = 0
        this.NodeForm.toolset = ''
        this.$refs.multipleTable.clearSelection()
      }
    },
    clickitem2 (e) {
      e === this.isAsync ? (this.isAsync = 0) : (this.isAsync = e)
      this.ischange = true
    },
    // table 左侧checkedbox选择
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.getCanToolslist(val)
      // }
    },
    getCanToolslist (val) {
      this.Toolsetdata = []
      let reslist = {
        maResourseArray: []
      }
      val.forEach(item => {
        reslist.maResourseArray.push(item.resourcesId)
      })
      if (reslist.maResourseArray.length == 0) {
        return
      }
      axios.getCanTools(reslist)
        .then(res => {
          res.data.data.forEach(item => {
            this.Toolsetdata.push({
              label: item.name,
              value: item.toolsId
            })
            let toolname = ''
            this.Toolsetdata.forEach(item => {
              if (item.value == this.NodeForm.toolset) {
                toolname = item.label
              }
            })
            this.getallsrcipt(toolname)
          })
        })
        .catch()
    },
    // xml状态显示
    viewxmlstages () {
      if (
        this.activityData &&
        this.activityData.stages &&
        this.activityData.stages.length > 0
      ) {
        let stagedomlist = document.getElementsByClassName('djs-element')
        // console.log(this.activityData.stages);
        for (var i = 0; i < stagedomlist.length; i++) {
          for (var j = 0; j < this.activityData.stages.length; j++) {
            if (
              this.activityData.stages[j].actNodeId ==
              stagedomlist[i].getAttribute('data-element-id')
            ) {
              var xmlns = 'http://www.w3.org/2000/svg'
              var svgimg = document.createElementNS(xmlns, 'image')
              svgimg.setAttributeNS(null, 'x', 35)
              svgimg.setAttributeNS(null, 'y', 50)
              svgimg.setAttributeNS(null, 'height', '30px')
              svgimg.setAttributeNS(null, 'width', '30px')

              if (this.activityData.stages[j].status == 'SUCCESS') {
                stagedomlist[i].childNodes[0].childNodes[0].style.stroke =
                  '#49BC71'
                svgimg.href.baseVal = require('../../../static/img/exec_success.png')
                stagedomlist[i].childNodes[0].appendChild(svgimg)
              } else if (
                this.activityData.stages[j].status == 'FAILURE' ||
                this.activityData.stages[j].status == 'FAILED' ||
                this.activityData.stages[j].status == 'ABORTED'
              ) {
                stagedomlist[i].childNodes[0].childNodes[0].style.stroke =
                  'red'
                svgimg.href.baseVal = require('../../../static/img/exec_fail.png')
                stagedomlist[i].childNodes[0].appendChild(svgimg)
              } else if (this.activityData.stages[j].status == 'UNKNOWN') {
                svgimg.href.baseVal = require('../../../static/img/t_question.png')
                stagedomlist[i].childNodes[0].appendChild(svgimg)
              } else if (this.activityData.stages[j].status == 'NOTEXECUTED') {
                stagedomlist[i].childNodes[0].childNodes[0].style.fill =
                  '#F2F2F2'
              } else if (
                this.activityData.stages[j].status == 'building' ||
                this.activityData.stages[j].status == 'IN_PROGRESS'
              ) {
                svgimg.href.baseVal = require('../../../static/img/task/20140524124238403.gif')
                stagedomlist[i].childNodes[0].appendChild(svgimg)
              }
            }
          }
        }
      }
    },

    // 删除左侧不用图标
    deleteimg () {
      document.getElementsByClassName('bjs-powered-by')[0].style.display =
        'none'
      if (document.getElementsByClassName('djs-palette-entries')[0]) {
        let entrieslist = document.getElementsByClassName(
          'djs-palette-entries'
        )[0].childNodes

        for (let i = 0; i < entrieslist.length; i++) {
          if (i == 0) {
            entrieslist[i].childNodes[0].setAttribute('title', '移动')
            entrieslist[i].childNodes[3].setAttribute('title', '连接')
            entrieslist[i].childNodes[1].style.display = 'none'
            entrieslist[i].childNodes[2].style.display = 'none'
          }
          if (i == 1) {
            entrieslist[i].childNodes[0].setAttribute('title', '开始')
            entrieslist[i].childNodes[1].style.display = 'none'
            entrieslist[i].childNodes[2].setAttribute('title', '结束')
          }
          if (i == 2) {
            entrieslist[i].childNodes[0].setAttribute('title', '并行网关')
          }
          if (i == 3) {
            entrieslist[i].childNodes[0].setAttribute('title', '任务')
            entrieslist[i].childNodes[1].style.display = 'none'
          }
          if (i > 3) {
            entrieslist[i].style.display = 'none'
          }
        }
      }
    },
    // 初始化工作流 xml
    createNewDiagram (n, newxml) {
      //  key 类型 detail : 查看 ， edit : 编辑
      console.log(this.activityData)
      // if (this.activityData.envid) {
      //   this.$set(this.NodeForm, "env", this.activityData.envid);
      //   // console.log(this.NodeForm)
      // }
      if (this.activityData.nodeParam && this.nodeParam.length == 0) {
        this.nodeParam = this.activityData.nodeParam
      }
      if (newxml) {
        n.importXML(newxml, function (err) {
          if (err) {
            console.log(err)
          }
        })
      } else {
        let _this = this
        if (this.activityData && this.activityData.actXml) {
          if (this.activityData.isImported) {
            this.activityData.actXml = common.changexmlid(this.activityData.actXml)
          }
          this.bpmnXmlStr = this.activityData.actXml
        } else {
          let timestamp = common.randChar() + new Date().valueOf()
          this.bpmnXmlStr = `'<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef">\n' +
            '  <process id="${timestamp}" name="${timestamp}" isExecutable="true">\n' +
            '    <startEvent id="StartEvent_1" name="开始"/>\n' +
            "  </process>\n" +
            '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
            '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
            '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
            '        <omgdc:Bounds height="36.0" width="36.0" x="200.0" y="150.0"/>\n' +
            "      </bpmndi:BPMNShape>\n" +
            "    </bpmndi:BPMNPlane>\n" +
            "  </bpmndi:BPMNDiagram>\n" +
            "</definitions>"`
        }
        // console.log(this.activityData);

        // 将字符串转换成图显示出来
        n.importXML(this.bpmnXmlStr, function (err) {
          if (err) {
            console.log(err)
          }
          if (_this.key === 'detail') {
            let domList = document.getElementsByClassName('djs-shape')
            for (let dom of domList) {
              dom.onmouseenter = function () {
                // 如果时详情则不显示右侧的工具
                let spaceNode = document.querySelector('.djs-context-pad')
                let bettwonNode = document.querySelector(
                  '.djs-overlay-container'
                )
                if (spaceNode && spaceNode !== '') {
                  spaceNode.style.display = 'none'
                }
                if (bettwonNode && bettwonNode !== '') {
                  bettwonNode.style.display = 'none'
                }
              }
            }
          }
          _this.viewxmlstages()
          _this.deleteimg()
          // 这里将新增 查看 编辑的逻辑分开
          _this.newnode() // 新增
          _this.getreturndata() // 查看 编辑
        })
      }
    },
    // 绑定事件已经回显数据
    getreturndata () {
      if (this.key == 'edit' || this.key == 'detail') {
        // this.getallsrcipt();
        if (this.key == 'detail') {
          document.getElementsByClassName('djs-palette')[0].style.display =
            'none'
        }
        let glist = document.getElementsByClassName('layer-base')[0]
        let _this = this
        glist.onclick = function (event) {
          // console.log(event)
          setTimeout(() => {
            // console.log(document.getElementById("camunda-id"));
            _this.ID = document.getElementById('camunda-id').value
            _this.nocopy = false
            let id = _this.ID
            if (id.indexOf('Task') > -1) {
              _this.idlist = ''
              if (_this.nodeParam.length > 0) {
                _this.nodeParam.forEach(item => {
                  _this.idlist += item.actNodeId
                })
                if (_this.idlist.indexOf(id) == -1) {
                  _this.addSystemBox = true
                } else {
                  _this.nodeParam.forEach((item, index) => {
                    if (id == item.actNodeId) {
                      if (item.dlvToolsId) {
                        item.toolId = item.dlvToolsId
                        delete item.dlvToolsId
                      }
                      if (item.maToolsId) {
                        item.maToolsId == '10086'
                          ? (item.toolset = '')
                          : (item.toolset = item.maToolsId)
                        delete item.maToolsId
                      }
                      _this.NodeForm.name = item.actNodeName
                      _this.multiplexing = item.multiplexing
                      _this.getscriptdata(id)
                      _this.resourcesradio =
                        item.resourcesradio || Number(item.resourcesType)
                      if (typeof item.resourcesIds === 'string') {
                        item.multipleSelection = common.evil(item.resourcesIds)
                        delete item.resourcesIds
                      }
                      _this.isAsync = item.isAsync
                      _this.$set(
                        _this.NodeForm,
                        'nodedep',
                        item.actStrategy ? item.actStrategy : item.nodedep
                      )
                      _this.$set(
                        _this.NodeForm,
                        'resourcesName',
                        item.resourcesName
                      )
                      _this.$set(_this.NodeForm, 'ipAddress', item.ipAddress)
                      _this.$set(
                        _this.NodeForm,
                        'environmentId',
                        item.environmentId
                      )
                      _this.$set(_this.NodeForm, 'toolset', item.toolset)
                      _this.$set(
                        _this.NodeForm,
                        'upActNodeId',
                        item.upActNodeId
                      )
                      _this.currPage = item.pageCurrent
                        ? item.pageCurrent
                        : item.current
                      delete item.pageCurrent
                      _this.getResources(item)
                    }
                  })
                }
              }
            }
          }, 100)
        }
      }
    },
    // 新增时创建节点、
    newnode () {
      let _this = this
      if (_this.key != 'detail' && _this.key != 'edit') {
        let startnode = document.getElementsByClassName('layer-base')[0]
          .children[0].children[0].children[1]
        startnode.onclick = function (e) {
          _this.getsvgchildrennode(1)
        }
      }
    },
    // 获取点击后的子节点
    getsvgchildrennode (n) {
      let _this = this
      if (n == 1) {
        setTimeout(() => {
          let djsnode = document.getElementsByClassName('djs-context-pad')[0]
          djsnode.onclick = function (e) {
            _this.getsvgchildrennode(2)
          }
        }, 100)
      }

      if (n == 2) {
        setTimeout(() => {
          let glist = document.getElementsByClassName('layer-base')[0]
          glist.onclick = function (event) {
            setTimeout(() => {
              if (
                document.getElementById('camunda-id').value.indexOf('Task') > -1
              ) {
                _this.ID = document.getElementById('camunda-id').value
                _this.nocopy = false
                if (_this.nodeParam.length > 0) {
                  _this.nodeParam.forEach((item, index) => {
                    if (_this.ID == item.actNodeId) {
                      if (item.dlvToolsId) {
                        item.toolId = item.dlvToolsId
                        delete item.dlvToolsId
                      }
                      if (item.maToolsId) {
                        item.maToolsId == '10086'
                          ? (item.toolset = '')
                          : (item.toolset = item.maToolsId)
                        delete item.maToolsId
                      }
                      _this.$set(
                        _this.NodeForm,
                        'toolset',
                        item.toolset == '10086' ? '' : item.toolset
                      )
                      _this.$set(
                        _this.NodeForm,
                        'upActNodeId',
                        item.upActNodeId
                      )
                      _this.$set(
                        _this.NodeForm,
                        'environmentId',
                        item.environmentId
                      )
                      _this.$set(
                        _this.NodeForm,
                        'resourcesName',
                        item.resourcesName
                      )
                      _this.$set(_this.NodeForm, 'ipAddress', item.ipAddress)
                      _this.$set(
                        _this.NodeForm,
                        'nodedep',
                        item.nodedep
                          ? item.nodedep
                          : index == 0
                            ? ''
                            : 'success'
                      )
                      _this.isAsync = item.isAsync
                      _this.multiplexing = item.multiplexing
                      _this.NodeForm.name = item.actNodeName
                      // _this.resourcesradio = item.resourcesradio;
                      _this.resourcesradio =
                        item.resourcesradio || Number(item.resourcesType)
                      if (typeof item.resourcesIds === 'string') {
                        item.multipleSelection = common.evil(item.resourcesIds)
                        delete item.resourcesIds
                      }
                      _this.getscriptdata(_this.ID)
                      _this.currPage = item.pageCurrent
                        ? item.pageCurrent
                        : item.current
                      delete item.pageCurrent
                      if (item.multipleSelection) {
                        _this.getResources(item)
                      } else {
                        _this.getResources()
                      }
                    }
                  })
                }
                _this.addSystemBox = true
              }
            }, 100)
          }
        }, 200)
      }
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG (done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram (done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml)
      })
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded (link, name, data) {
      // 从左侧拖出的点击从这里开始
      if (this.key != 'detail') {
        this.getsvgchildrennode(2)
      }
      this.$nextTick(() => {
        if (
          this.key == 'detail' &&
          document.getElementsByClassName('djs-context-pad').length > 0
        ) {
          document.getElementsByClassName('djs-context-pad')[0].style.display =
            'none'
        }
      })

      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
      // 这里对nodeParam做删除筛选
      let copyarray = []
      let editdata = ''
      if (data.indexOf('definitions') > -1) {
        let xmlarrary = data.split('process')[2].split('<task id="')
        xmlarrary.forEach(item => {
          if (item.indexOf('Task') > -1) {
            let splitarray = item.split('"')
            this.nodeParam.forEach(d => {
              if (d.actNodeId == splitarray[0]) {
                copyarray.push(d)
              }
            })
            if (
              (splitarray[0].indexOf('Task') > -1 &&
                JSON.stringify(copyarray).indexOf(splitarray[0]) == -1) ||
              (copyarray.length == 0 && splitarray[0].indexOf('Task') > -1)
            ) {
              copyarray.push({
                actNodeId: splitarray[0],
                actNodeName:
                  splitarray.length >= 3 && splitarray[1].indexOf('name') > -1
                    ? splitarray[2]
                    : '',
                environmentId: this.activityData.envid,
                resourcesradio: this.resourcesradio
              })
            }
            this.idlist = ''
            copyarray.forEach(d => {
              this.idlist += d.actNodeId + ''
              if (d.actNodeId == splitarray[0]) {
                d.actNodeName =
                  splitarray.length >= 3 && splitarray[1].indexOf('name') > -1
                    ? splitarray[2]
                    : ''
              }
            })
          }
        })
        this.nodeParam = copyarray
        editdata = {
          actXml: this.xmlStr,
          nodeParam: copyarray
        }
        this.$emit('confirm', editdata)
      }

      // 这里处理xml变化时图片消失
      this.viewxmlstages()
    },
    // 关闭dialog
    handleDialogClose () {
      if (this.key != 'detail' && this.key != 'edit') {
        if (!this.idlist) {
          this.idlist += this.ID + ''
        } else {
          if (this.idlist.indexOf(this.ID) == -1) {
            this.idlist += this.ID + ''
          }
        }

        if (this.nodeParam.length == 0) {
          this.nodeParam.push({
            actNodeId: this.ID
          })
        } else if (this.nodeParam.length > 0) {
          if (JSON.stringify(this.nodeParam).indexOf(this.ID) == -1) {
            this.nodeParam.push({
              actNodeId: this.ID
            })
          }
          // console.log( this.nodeParam)
        }
      }
      this.$refs.form.resetFields()
      this.scriptlist = []
      this.isAsync = 0
      this.multiplexing = 0
      this.$set(this.NodeForm, 'name', '')
      this.$set(this.NodeForm, 'nodedep', '')
      this.$set(this.NodeForm, 'toolset', '')
      this.$set(this.NodeForm, 'upActNodeId', '')
      this.resourcesradio = 1
      this.blockSwitch[5] = false
      this.blockSwitch[4] = false
      this.blockSwitch[3] = false
      this.blockSwitch[2] = false
      this.scripttabledata = []
      this.addSystemBox = false
      this.$refs.multipleTable.clearSelection()
    },
    // 关闭dialog X
    cancel () {
      this.$refs.form.resetFields()
      this.scriptlist = []
      this.isAsync = 0
      this.multiplexing = 0
      this.$set(this.NodeForm, 'name', '')
      this.$set(this.NodeForm, 'nodedep', '')
      this.$set(this.NodeForm, 'toolset', '')
      this.$set(this.NodeForm, 'upActNodeId', '')
      this.resourcesradio = 1
      this.blockSwitch[5] = false
      this.blockSwitch[4] = false
      this.blockSwitch[3] = false
      this.blockSwitch[2] = false
      this.scripttabledata = []
      this.addSystemBox = false
      this.$refs.multipleTable.clearSelection()
    },
    // 重置光标定位
    // getinput(event) {
    //   document.body.onkeydown = function(event) {
    //     if (event.keyCode == 13) {
    //       event.keyCod = 0;
    //       return false;
    //     }
    //   };
    //   var namedom = document.getElementById("camunda-name");
    //   // 重定位div中的光标位置
    //   if (namedom.addEventListener) {
    //     // 所有主流浏览器，除了 IE 8 及更早 IE版本
    //     namedom.addEventListener("focus", element => {
    //       var range, selection, pos;
    //       pos = element.srcElement.innerHTML.length;
    //       if (document.createRange) {
    //         // Firefox, Chrome, Opera, Safari, IE 9+
    //         range = document.createRange(); // 创建一个选中区域
    //         range.selectNodeContents(element.srcElement); // 选中节点的内容
    //         if (element.srcElement.innerHTML.length > 0) {
    //           range.setStart(element.srcElement.childNodes[0], pos); // 设置光标起始为指定位置
    //         }
    //         range.collapse(true); // 设置选中区域为一个点
    //         selection = window.getSelection(); // 获取当前选中区域
    //         selection.removeAllRanges(); // 移出所有的选中范围
    //         selection.addRange(range); // 添加新建的范围
    //       } else if (document.selection) {
    //         // IE 8 and lower
    //         range = document.body.createTextRange(); // Create a range (a range is a like the selection but invisible)
    //         range.moveToElementText(element); // Select the entire contents of the element with the range
    //         range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
    //         range.select(); // Select the range (make it the visible selection
    //       }
    //     });
    //   } else if (namedom.attachEvent) {
    //     // IE 8 及更早 IE 版本
    //     // 重定位div中的光标位置
    //     namedom.attachEvent("focus", element => {
    //       var range, selection, pos;
    //       pos = element.srcElement.innerHTML.length;
    //       if (document.createRange) {
    //         // Firefox, Chrome, Opera, Safari, IE 9+
    //         range = document.createRange(); // 创建一个选中区域
    //         range.selectNodeContents(element.srcElement); // 选中节点的内容
    //         if (element.srcElement.innerHTML.length > 0) {
    //           range.setStart(element.srcElement.childNodes[0], pos); // 设置光标起始为指定位置
    //         }
    //         range.collapse(true); // 设置选中区域为一个点
    //         selection = window.getSelection(); // 获取当前选中区域
    //         selection.removeAllRanges(); // 移出所有的选中范围
    //         selection.addRange(range); // 添加新建的范围
    //       } else if (document.selection) {
    //         // IE 8 and lower
    //         range = document.body.createTextRange(); // Create a range (a range is a like the selection but invisible)
    //         range.moveToElementText(element); // Select the entire contents of the element with the range
    //         range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
    //         range.select(); // Select the range (make it the visible selection
    //       }
    //     });
    //   }
    //   namedom.focus();
    //   if (namedom.addEventListener) {
    //     // 所有主流浏览器，除了 IE 8 及更早 IE版本
    //     namedom.addEventListener("input", (element, event) => {
    //       this.NodeForm.name = namedom.innerHTML;
    //     });
    //   } else if (namedom.attachEvent) {
    //     // IE 8 及更早 IE 版本
    //     namedom.attachEvent("input", () => {
    //       this.NodeForm.name = namedom.innerHTML;
    //     });
    //   }
    // },
    // 脚本表格数据存储
    scripttableset () {
      var inputParam = []
      var istrue = false
      this.scripttabledata.forEach((item, index) => {
        //   console.log(item)
        if (item.isEmpty == '是' && !item.paramValue) {
          istrue = true
        }
        inputParam.push({
          order: index + 1,
          name: item.name,
          value: item.paramValue,
          type: item.paramType,
          explain: item.remarks,
          titleName: item.titleName,
          isEmpty: item.isEmpty == '是' ? '1' : '0'
        })
      })
      if (istrue) {
        return false
      } else {
        return inputParam
      }
    },
    // 过滤资源id
    // getmultipleid(){
    //   let mid = []
    //   this.multipleSelection.forEach((item)=>{
    //       mid.push(item.resourcesId)
    //   })
    //   return mid
    // },
    // dialog提交
    sure () {
      let data = {}

      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.scripttableset()) {
            this.$notify({
              title: '提示',
              message: '表格中必填为是时，参数值不能为空！',
              type: 'error'
            })
            return false
          }
          if (this.nodeParam.length == 0) {
            this.nodeParam.push({
              actNodeName: this.NodeForm.name,
              actNodeId: this.ID,
              toolId: this.scriptlist[1],
              version: this.getversion(this.scriptlist[1]),
              inputParam: this.scripttableset(),
              toolset: this.NodeForm.toolset || '10086', // 工具集
              resourcesradio: this.resourcesradio, // 资源类型
              nodedep: this.NodeForm.nodedep, // 节点依赖
              resourcesName: this.NodeForm.resourcesName,
              ipAddress: this.NodeForm.ipAddress,
              current: this.currPage,
              environmentId: this.NodeForm.environmentId,
              isAsync: this.isAsync,
              upActNodeId: this.NodeForm.upActNodeId,
              multipleSelection: this.multipleSelection, // 选中资源
              // multipleSelectionid:this.getmultipleid(),
              multiplexing: this.multiplexing
            })
          } else {
            if (this.idlist.indexOf(this.ID) > -1) {
              this.nodeParam.forEach(item => {
                if (item.actNodeId == this.ID) {
                  item.actNodeName = this.NodeForm.name
                  item.actNodeId = this.ID
                  item.environmentId = this.NodeForm.environmentId
                  item.toolId = this.scriptlist[1] // 脚本id
                  item.version = this.getversion(this.scriptlist[1])
                  item.inputParam = this.scripttableset()
                  item.toolset = this.NodeForm.toolset || '10086'
                  item.resourcesradio = this.resourcesradio
                  item.resourcesName = this.NodeForm.resourcesName
                  item.ipAddress = this.NodeForm.ipAddress
                  item.current = this.currPage
                  item.upActNodeId = this.NodeForm.upActNodeId
                  item.nodedep = this.NodeForm.nodedep
                  item.isAsync = this.isAsync
                  item.multipleSelection = this.multipleSelection
                  delete item.actStrategy

                  // item.multipleSelectionid=this.getmultipleid();
                  item.multiplexing = this.multiplexing
                }
              })
            } else {
              let array = {}
              array.actNodeName = this.NodeForm.name
              array.actNodeId = this.ID
              array.toolId = this.scriptlist[1]
              array.version = this.getversion(this.scriptlist[1])
              array.inputParam = this.scripttableset()
              array.toolset = this.NodeForm.toolset || '10086'
              array.resourcesradio = this.resourcesradio
              array.environmentId = this.NodeForm.environmentId
              array.resourcesName = this.NodeForm.resourcesName
              array.ipAddress = this.NodeForm.ipAddress
              array.upActNodeId = this.NodeForm.upActNodeId
              array.nodedep = this.NodeForm.nodedep
              array.current = this.currPage
              array.isAsync = this.isAsync
              array.multipleSelection = this.multipleSelection
              // array.multipleSelectionid=this.getmultipleid();
              array.multiplexing = this.multiplexing
              this.nodeParam.push(array)
            }
          }
          this.idlist = ''
          this.nodeParam.forEach(item => {
            this.idlist += item.actNodeId + ''
          })
          // 这里对xml的名字做替换
          if (this.xmlStr) {
            this.xmlStr = common.setxmlname(this.xmlStr, this.ID, this.NodeForm.name)
            this.createNewDiagram(this.bpmnModeler, this.xmlStr)
          } else if (this.activityData.actXml) {
            this.activityData.actXml = common.setxmlname(
              this.activityData.actXml,
              this.ID,
              this.NodeForm.name
            )
            this.createNewDiagram(this.bpmnModeler, this.activityData.actXml)
          }

          data = {
            actXml: this.xmlStr || this.activityData.actXml,
            nodeParam: this.nodeParam
          }
          console.log(data)
          this.$emit('confirm', data)
          this.cancel()
          this.scriptlist = []
        }
      })
      // console.log(this.nodeParam);
    },
    // 获取版本号
    getversion (id) {
      var version
      this.scriptdata.forEach(item => {
        if (item.children.length > 0) {
          item.children.forEach(d => {
            if (d.toolId == id) {
              version = d.toolVersion
            }
          })
        }
      })
      return version
    },
    // 返回复制的index
    returnindex () {
      let l
      if (this.idlist.indexOf(this.ID) > -1) {
        this.nodeParam.forEach((item, index) => {
          if (item.actNodeId == this.ID) {
            if (this.nodeParam.length == 1) {
              l = 0
            } else {
              l = index - 1
            }
          }
        })
      } else {
        if (this.nodeParam.length == 1) {
          l = 0
        } else {
          l = this.nodeParam.length - 1
        }
      }
      return l
    },
    // 脚本下拉框回显和脚本参数回显
    returnscripttable (data) {
      // console.log(data);
      let pipearr = []
      data.inputParam.forEach(d => {
        this.scripttabledata.push({
          name: d.name,
          paramValue: d.value,
          paramType: d.type,
          remarks: d.explain,
          titleName: d.titleName,
          isEmpty: d.isEmpty == '1' ? '是' : '否'
        })
      })
      // console.log(this.scriptdata);
      if (data.dlvToolsId) {
        data.toolId = data.dlvToolsId
        delete data.dlvToolsId
      }
      this.scriptdata.forEach(t => {
        if (t.children.length > 0) {
          t.children.forEach(d => {
            if (d.toolId == data.toolId) {
              pipearr.push(t.value, data.toolId)
            }
          })
        }
      })
      this.scriptlist = pipearr
      // console.log(this.scriptlist);
    },
    // 编辑脚本回填
    getscriptdata (id) {
      this.scripttabledata = []
      this.scriptlist = []
      if (this.multiplexing && this.nocopy) {
        let index = this.returnindex()
        if (typeof this.nodeParam[index].inputParam === 'string') {
          this.nodeParam[index].inputParam = common.evil(
            this.nodeParam[index].inputParam
          )
        }
        this.returnscripttable(this.nodeParam[index])
      } else {
        this.nodeParam.forEach(item => {
          if (id == item.actNodeId && item.inputParam) {
            if (typeof item.inputParam === 'string') {
              item.inputParam = common.evil(item.inputParam)
            }
            this.returnscripttable(item)
          }
        })
      }
      this.addSystemBox = true
    },
    // 渲染
    Rendering () {
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas

      // 建模，官方文档这里讲的很详细
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        // 添加控制板
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 左边工具栏以及节点
          propertiesProviderModule,
          // 右边的工具栏
          propertiesPanelModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })

      // 下载画图
      let _this = this
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram
      const downloadSvgLink = this.$refs.saveSvg
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', function () {
        _this.saveSVG(function (err, svg) {
          _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
        })

        _this.saveDiagram(function (err, xml) {
          _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
        })
      })
    },
    // 是否展开
    switchBlock (index) {
      if (index == 5) {
        this.NodeIdList = []
        if (this.nodeParam.length == 0) {
          this.NodeIdList.push({
            label: !this.NodeForm.name ? '当前节点' : this.NodeForm.name,
            value: this.ID
          })
        } else {
          this.nodeParam.forEach(item => {
            this.NodeIdList.push({
              label: !item.actNodeName ? '当前节点' : item.actNodeName,
              value: item.actNodeId
            })
          })
          if (this.idlist.indexOf(this.ID) == -1) {
            this.NodeIdList.push({
              label: !this.NodeForm.name ? '当前节点' : this.NodeForm.name,
              value: this.ID
            })
          }
        }
      }
      return (this.blockSwitch[index] = !this.blockSwitch[index])
    },
    // 脚本table显示
    getselectscriptvalue () {
      this.ischange = true
      this.scripttabledata = []
      axios.devopstoolDetail(this.scriptlist[1])
        .then(res => {
          // console.log(res)
          if (res.data.param && res.data.param.length > 0) {
            res.data.param.forEach(item => {
              this.scripttabledata.push({
                name: item.name, // 参数名
                remarks: item.remarks, // 参数说明
                paramType: item.paramType, // 参数类型
                titleName: item.titleName, // 参数标题名称
                isEmpty: item.isEmpty == '1' ? '是' : '否', // 是否必填
                paramValue: item.paramValue // 参数值
              })
            })
          }
        })
        .catch()
    },
    // 获取所有脚本
    getallsrcipt (toolname) {
      let toolId = ''
      this.nodeParam.forEach(item => {
        if (item.actNodeId == this.ID) {
          toolId = item.applyStatus == 'true' ? '' : item.toolId
        }
      })
      let data = {
        toolname: toolname,
        toolId: toolId
      }
      axios.devallsrcipt(data)
        .then(res => {
          let copydata = []
          // console.log(res.data.result);
          res.data.result.forEach(item => {
            if (this.key == 'detail' || this.key == 'edit') {
              if (item.toolsUpdateOp.length > 0) {
                item.toolsUpdateOp.forEach(d => {
                  item.toolsOp.push(d)
                })
              }
            }
            if (item.toolsOp.length > 0) {
              copydata.push({
                value: item.grouptagId,
                label: item.name,
                children: item.toolsOp
              })
            } else {
              copydata.push({
                value: item.grouptagId,
                label: item.name,
                children: []
              })
            }
          })
          copydata.forEach(item => {
            if (item.children.length > 0) {
              item.children.forEach(d => {
                d.value = d.toolId
                d.label = d.name
              })
            }
          })
          this.scriptdata = copydata
          this.getscriptdata(this.ID)
        })
        .catch()
    },
    // 资源与工具集的联动
    showoption (val) {
      if (val) {
        if (this.multipleSelection.length == 0) {
          this.$notify({
            title: '提示',
            message: '请先选择资源！',
            type: 'error'
          })
          return false
        }
      }
    },
    // 资源与工具集的联动
    showoptionscript (val) {
      if (val) {
        if (!this.NodeForm.toolset) {
          this.$notify({
            title: '提示',
            message: '请先选择工具集！',
            type: 'error'
          })
          return false
        }
      }
    },
    // 资源type改变
    ischangeval (type) {
      if (type == 'resources') {
        this.currPage = 1
        this.getResources()
        // this.getmaToolslist()
        // this.getallsrcipt()
        this.scriptlist = []
        this.$set(this.NodeForm, 'toolset', '')
      }
      if (type == 'toolset') {
        this.scripttabledata = []
        if (!this.NodeForm.toolset) {
          this.scriptlist = []
          return false
        }
        let toolname = ''
        this.Toolsetdata.forEach(item => {
          if (item.value == this.NodeForm.toolset) {
            toolname = item.label
          }
        })
        // console.log(toolname)
        this.getallsrcipt(toolname)
      }
      this.ischange = true
    },
    // 搜索资源管理数据
    getResources (item) {
      if (typeof item === 'number') {
        this.currPage = item
      }
      //
      // console.log(item)
      let data = {
        current: this.currPage,
        size: this.size,
        resourcesType: this.resourcesradio,
        environmentId: this.NodeForm.environmentId,
        name: this.NodeForm.resourcesName,
        ipAddress: this.NodeForm.ipAddress
      }
      axios.resourceListData(data)
        .then(res => {
          // console.log(res)
          this.ResourcesData = res.data.data.records
          this.total = parseInt(res.data.data.total)

          if (item && typeof item !== 'number') {
            let cpoyRdata = []
            res.data.data.records.forEach(d => {
              if (item.multipleSelection) {
                item.multipleSelection.forEach(row => {
                  if (d.resourcesId == row.resourcesId) {
                    cpoyRdata.push(d)
                  }
                })
              }
            })
            // console.log(cpoyRdata)
            this.$nextTick(() => {
              this.toggleSelection(cpoyRdata)
            })
          }
        })
        .catch()
    },
    // 回显资源table
    toggleSelection (rows) {
      // console.log(rows)
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      }
    },
    // 获取工具集列表
    // getmaToolslist() {
    //   this.Toolsetdata = [];
    //   maToolslist()
    //     .then(res => {
    //       res.data.data.forEach(item => {
    //         this.Toolsetdata.push({
    //           label: item.name,
    //           value: item.toolsId
    //         });
    //       });
    //     })
    //     .catch();
    // },
    // 获取环境下来列表
    getenvtablist () {
      let data = {
        environmentType: '',
        name: ''
      }
      axios.envtablist(data)
        .then(res => {
          res.data.data.result.forEach(d => {
            this.Envlist.push({
              label: d.name,
              value: d.environmentId
            })
          })
        })
        .catch()
    },
    // 获取所需数据
    getallapi () {
      // this.getallsrcipt();
      // this.getmaToolslist();
      this.getResources()
      this.getenvtablist()
    },
    Drag () {
      let _this = this
      _this.oDiv = document.getElementById('div1')
      _this.oDiv2 = document.getElementById('div2')
      _this.right = document.getElementById('right')
      _this.bottom = document.getElementById('bottom')

      // 往下拽
      _this.bottom.onmousedown = function (ev) {
        var oEvent = ev || event
        _this.mouseStart.x = oEvent.clientX
        _this.mouseStart.y = oEvent.clientY
        _this.bottomStart.y = _this.bottom.offsetTop
        if (_this.bottom.setCapture) {
          _this.bottom.onmousemove = _this.doDrag
          _this.bottom.onmouseup = _this.stopDrag
          _this.bottom.setCapture()
        } else {
          document.addEventListener('mousemove', _this.doDrag, true)
          document.addEventListener('mouseup', _this.stopDrag, true)
        }
      }
    },
    doDrag (ev) {
      var oEvent = ev || event
      var t = oEvent.clientY - this.mouseStart.y + this.bottomStart.y
      var h = t + this.oDiv.offsetHeight

      if (h < this.oDiv.offsetHeight) {
        h = this.oDiv.offsetHeight
      } else if (
        h >
        document.documentElement.clientHeight - this.oDiv2.offsetTop
      ) {
        h = document.documentElement.clientHeight - this.oDiv2.offsetTop - 2
      }
      this.oDiv2.style.height = h + 'px'
    },
    stopDrag () {
      if (this.bottom.releaseCapture) {
        this.bottom.onmousemove = null
        this.bottom.onmouseup = null
        this.bottom.releaseCapture()
      } else {
        document.removeEventListener('mousemove', this.doDrag, true)
        document.removeEventListener('mouseup', this.stopDrag, true)
      }
    }
  },
  mounted () {
    this.key = this.$route.query.key
    this.Drag()
    this.getallapi()
    this.Rendering()
    this.createNewDiagram(this.bpmnModeler)
  }
}
</script>

<style lang="scss" >
/*左边工具栏以及编辑节点的样式*/
@import "bpmn-js/dist/assets/diagram-js.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
/*右边工具栏样式*/
@import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
.containers {
  background-color: #ffffff;
  /* width: 98.5%; */
  /* display: block; */
}
.canvas {
  width: 100%;
  height: 100%;
}

.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
}
ul li span.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li.el-select-dropdown__item span {
  margin-left: 14px;
}
ul li.el-select-dropdown__item span.el-tree-node__label {
  margin-left: 0;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.f12 {
  font-size: 12px;
}
.buttons {
  bottom: 20px !important;
}
.add-deploy-task {
  padding: 10px;
}
.wrapperdialog {
  width: 100%;
  background-color: #fff;
  overflow-y: scroll;
  height: 400px;
}
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  font-weight: 500;
  color: #3e444a;
}
.el-dialog__header {
  padding: 20px 20px 0;
  text-align: center;
}
.el-dialog__body {
  padding: 20px 0;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.block-item {
  margin-bottom: 20px;
  /* height: 100%; */
}
.block-title {
  position: relative;
  top: 0;
  left: 10px;
  padding-left: 34px;
  cursor: pointer;
}
.block-title .title-tips {
  width: 6px;
  height: 26px;
  background-color: #0066ff;
  position: absolute;
  top: 3px;
  left: 0;
  border-radius: 4px;
}
.block-title > h3 {
  font-size: 16px;
  font-weight: normal;
  line-height: 32px;
}
.block-content {
  padding-left: 70px;
  // padding-right: 50px;
}
.op-btns {
  text-align: center;
}
.el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
  box-shadow: 0 0 0;
}
.headerIcon {
  padding: 10px 10px 10px 10px;
  /*width: 74px;*/
  height: 36px;
  background-repeat: no-repeat;
  background-size: 60% 60%;
  background-position: -2px;
  margin-top: 26px;
  margin-left: 8px;
  border: 1px solid #707070;
  font-size: 14px;
}
.searchBtn {
  display: inline-block;
}
.searchBtn img {
  height: 14px;
  width: 14px;
}
.searchBtn div {
  font-size: 14px !important;
  margin-left: 5px;
  float: right;
}
.rl42 {
  margin-left: 42px;
}
.mrr {
  margin-right: 20px;
}
.tablemg {
  margin: 20px 72px 20px 40px;
}
.el-dialog {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 50%;
}

.wrapperdialog::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  opacity: 0.5;
}
.wrapperdialog::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  opacity: 0.5;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ffffff;
}
.wrapperdialog::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: #ededed;
}

.no_line {
  width: 4px;
  height: 40px;
  background: none;
  text-align: center;
  border-radius: 0;
  margin: 0 auto;
}
.lines {
  width: 4px;
  height: 40px;
  background: #82b0f7;
  text-align: center;
  border-radius: 0;
  margin: 0 auto;
}
// .dot:hover+span.tit {
//   color: #3e444a
// }
span.tit {
  display: block;
  color: #0066ff;
  position: absolute;
  width: 80px;
  margin-left: -60px;
}
.right_anchor {
  position: fixed;
  width: 20px;
  margin-top: -280px;
  margin-left: 962px;
  height: 100px;
  z-index: 999;
  ul {
    padding-top: 20px;
    padding-bottom: 20px;
    background: #d2def2;
    border-radius: 12px;
    div {
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 100%;
        margin: 0 auto;
        background: #0066ff;
        position: relative;
        a.firsta {
          width: 6px;
          height: 6px;
          background: #0066ff;
          display: block;
          position: absolute;
          border-radius: 50%;
          top: 26%;
          left: 26%;
        }
        a {
          width: 6px;
          height: 6px;
          background: #fff;
          display: block;
          position: absolute;
          border-radius: 50%;
          top: 26%;
          left: 26%;
        }
      }
      .dot {
        cursor: pointer;
      }
    }
  }
}
#div2 {
  position: relative;
  height: 300px;
}
#div1 {
  width: 15px;
  height: 15px;
  position: absolute;
  right: 0px;
  bottom: 0px;
  cursor: nw-resize;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  line-height: 15px;
  float: right;
  z-index: 3;
}
// #right {
//   width: 15px;
//   height: 100%;
//   background: #f00;
//   float: right;
//   position: absolute;
//   right: 0;
//   top: 0;
//   cursor: e-resize;
//   overflow: hidden;
//   opacity: 0;
//   z-index: 1;
// }
#bottom {
  width: 100%;
  text-align: center;
  height: 15px;
  /* background: #f00; */
  position: absolute;
  left: 0;
  bottom: 0;
  line-height: 10px;
  cursor: n-resize;
  overflow: hidden;
  opacity: 1;
  z-index: 1;
}
</style>
