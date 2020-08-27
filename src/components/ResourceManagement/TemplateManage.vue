<template>
  <div class="task-list">
    <el-row>
      <el-form :inline="true" :model="search" class="form-area">
        <el-form-item class="form-select">
          <el-select v-model="search.vcenterId" placeholder="请选择vCenter" :clearable="true">
            <el-option
              v-for="vcenter in vcenterList"
              :label="vcenter.ipAddress"
              :value="vcenter.vcenterId"
              :key="vcenter.vcenterId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="operation-form">
          <el-button icon="el-icon-search" class="search-button" @click="searchList">查找</el-button>
          <el-button
            icon="el-icon-plus"
            type="primary"
            class="synchronization-form"
            :loading="isComplate"
            @click="_hostListCheck({vcenterId: search.vcenterId})"
          >同步</el-button>
          <el-button
            icon="el-icon-plus"
            type="primary"
            class="add-form">导入</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="group-btn">
      <div class="btn">
        <el-dropdown>
          <span class="el-dropdown-link" style="color: #fff">
            批量操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>克隆</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <p style="float: right;padding-right: 10px;color: #888888">上次同步时间：2019-03-05 12：30</p> -->
    </el-row>
    <el-row>
      <el-table
        :data="templates"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column type="selection" width="55" style="text-align: center"></el-table-column>
        <el-table-column align="center" prop="tempName" label="模板名称"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{ scope.row.status | getStatus }}</template>
        </el-table-column>
        <el-table-column align="center" prop="cpus" label="CPU"></el-table-column>
        <el-table-column align="center" prop="memorys" label="内存情况"></el-table-column>
        <el-table-column align="center" prop="host" label="所属主机"></el-table-column>
        <el-table-column align="center" prop="guestName" label="操作系统名称"></el-table-column>
        <!-- <el-table-column align="center" prop="ipAddress" label="IP地址">
         <template slot-scope="scope">
            {{ scope.row.ipAddress  || '-' }}
          </template>
        </el-table-column>-->
        <el-table-column align="center" prop="address" label="操作" width="330px">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="handleCopyTemplate(scope.row)">
                <el-tooltip class="item" effect="dark" content="克隆" placement="top-start">
                  <icon-svg icon-class="fuzhi" />
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
        <div slot="empty">
          <div class="blank-page">
            <div class="imgdiv">
              <img src="../../../static/img/blank-page.png" alt />
            </div>
            <p class="empty-text">暂无相关数据</p>
          </div>
        </div>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.current"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          v-if="total"
          style="margin-right:15px;cursor: pointer;"
        ></el-pagination>
      </div>
    </el-row>

    <el-dialog
      :title="currentTemplate.tempName + '克隆'"
      :visible.sync="centerDialogVisible"
      width="55%"
      center
    >
      <div class="module" v-for="(template, index) in copyTemplates" :key="index">
        <div class="title-info">
          {{template.hostName || `主机${index + 1}`}}：
          <span class="icon-opera">
            <i
              v-if="index === (copyTemplates.length - 1)"
              @click="addTemplate"
              class="el-icon-circle-plus-outline"
            ></i>
            <i v-if="index !== 0" @click="deleteTemplate(index)" class="el-icon-remove-outline"></i>
          </span>
        </div>
        <el-form
          class="form"
          size="mini"
          label-width="80px"
          :model="template"
          :rules="rules"
          :ref="'copyTemplate'+index"
        >
          <el-form-item label="主机名" prop="hostName">
            <el-input v-model="template.hostName" placeholder="请输入主机名"></el-input>
          </el-form-item>
          <el-form-item label="文件夹" prop="fileDir" v-if="template.isDir">
            <el-input
              v-model="template.fileDir"
              @blur="_dropInfoExist(index, 1)"
              placeholder="请输入文件夹，例：/DC1/vm/test_VM"
            ></el-input>
            <i class="el-icon-remove-outline icon-plus" @click="checkSelect(index, 'isDir')"></i>
          </el-form-item>
          <el-form-item label="文件夹" prop="fileDir" v-else>
            <el-select
              placeholder="请选择文件夹"
              @change="_dropInfoExist(index, 1)"
              class="item-select"
              v-model="template.fileDir"
              :clearable="true"
            >
              <el-option v-for="dir in dropDir" :label="dir" :value="dir" :key="dir"></el-option>
            </el-select>
            <i class="el-icon-circle-plus-outline icon-plus" @click="checkSelect(index, 'isDir')"></i>
          </el-form-item>

          <el-form-item label="宿主机" prop="host" v-if="template.isHost">
            <el-input
              v-model="template.host"
              @blur="_dropInfoExist(index, 2)"
              placeholder="请输入宿主机，例：/DC1/host/Cluster1/10.0.1.2"
            ></el-input>
            <i class="el-icon-remove-outline icon-plus" @click="checkSelect(index, 'isHost')"></i>
          </el-form-item>
          <el-form-item label="宿主机" prop="host" v-else>
            <el-select
              placeholder="请选择宿主机"
              @change="_dropInfoExist(index, 2)"
              class="item-select"
              v-model="template.host"
              :clearable="true"
            >
              <el-option v-for="host in dropHost" :label="host" :value="host" :key="host"></el-option>
            </el-select>
            <i class="el-icon-circle-plus-outline icon-plus" @click="checkSelect(index, 'isHost')"></i>
          </el-form-item>

          <el-form-item label="存储" prop="storage" v-if="template.isStorage">
            <el-input
              v-model="template.storage"
              @blur="_dropInfoExist(index, 3)"
              placeholder="请输入数据存储，例：/DC1/datastore/DS1"
            ></el-input>
            <i class="el-icon-remove-outline icon-plus" @click="checkSelect(index, 'isStorage')"></i>
          </el-form-item>
          <el-form-item label="存储" prop="storage" v-else>
            <el-select
              placeholder="请选择数据存储"
              class="item-select"
              @change="_dropInfoExist(index, 3)"
              v-model="template.storage"
              :clearable="true"
            >
              <el-option
                v-for="storage in dropStorage"
                :label="storage"
                :value="storage"
                :key="storage"
              ></el-option>
            </el-select>
            <i
              class="el-icon-circle-plus-outline icon-plus"
              @click="checkSelect(index, 'isStorage')"
            ></i>
          </el-form-item>
          <el-form-item label="网络" prop="virtualNetWork" v-if="template.isNet">
            <el-input
              v-model="template.virtualNetWork"
              @blur="_dropInfoExist(index, 4)"
              placeholder="请输入数据网络，例：/DC1/datastore/DS1"
            ></el-input>
            <i class="el-icon-remove-outline icon-plus" @click="checkSelect(index, 'isNet')"></i>
          </el-form-item>
          <el-form-item label="网络" prop="virtualNetWork" v-else>
            <el-select
              placeholder="请选择数据网络"
              @change="_dropInfoExist(index, 4)"
              class="item-select"
              v-model="template.virtualNetWork"
              :clearable="true"
            >
              <el-option
                v-for="virtualNetWork in dropNet"
                :label="virtualNetWork"
                :value="virtualNetWork"
                :key="virtualNetWork"
              ></el-option>
            </el-select>
            <i class="el-icon-circle-plus-outline icon-plus" @click="checkSelect(index, 'isNet')"></i>
          </el-form-item>
          <!--
          <el-form-item label="宿主机" prop='host'>
             <el-input v-model="template.host" placeholder="请输入宿主机，例：/DC1/host/Cluster1/10.0.1.2"></el-input>
              <el-select placeholder="请选择宿主机" class='item-select' v-model="template.host" :clearable="true">
              <el-option
                v-for="host in hostDropList"
                :label="host.name"
                :value="host.name"
                :key="host.name"
              ></el-option>
          </el-select>
          </el-form-item>-->
          <!-- <el-form-item label="存储" prop='storage'>
          <el-input v-model="template.storage" placeholder="请输入数据存储，例：/DC1/datastore/DS1"></el-input>-->
          <!-- <el-select placeholder="请选择数据存储"  class='item-select' v-model="template.storage" :clearable="true">
              <el-option
                v-for="storage in storageDropList"
                :label="storage.name"
                :value="storage.name"
                :key="storage.name"
              ></el-option>
          </el-select>-->
          <!-- </el-form-item>
          <el-form-item label="网络" prop='virtualNetWork'>-->
          <!-- <el-input v-model="template.virtualNetWork" placeholder="请输入网络，例：/DC1/network/DV1"></el-input> -->
          <!-- <el-select placeholder="请选择网络"  class='item-select' v-model="template.virtualNetWork" :clearable="true">
              <el-option
                v-for="virtualNetWork in virtualNetWorkDropList"
                :label="virtualNetWork.name"
                :value="virtualNetWork.name"
                :key="virtualNetWork.name"
              ></el-option>
          </el-select>-->
          <!-- </el-form-item> -->
          <el-form-item label="IP地址" prop="IP">
            <el-input v-model="template.IP" placeholder="请输入IP地址"></el-input>
          </el-form-item>
          <el-form-item label="子网掩码" prop="subnetMask">
            <el-input v-model="template.subnetMask" placeholder="请输入子网掩码"></el-input>
          </el-form-item>
          <el-form-item label="网关" prop="gateway">
            <el-input v-model="template.gateway" placeholder="请输入网关"></el-input>
          </el-form-item>
          <el-form-item label="规范名称" prop="selfStandard">
            <el-input v-model="template.selfStandard" placeholder="请输入自定义规范名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit('copyTemplate0')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import Bus from '../common/bus.js'
import { resourceManageSyncUrl } from '../../config'
export default {
  name: 'InstanceManage',
  data () {
    // 校验IP
    let validateIP = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        let ipReg = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/g
        if (ipReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的IP地址'))
        }
      }
    }
    let validateTrim = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入值'))
      } else if (!value.trim()) {
        callback(new Error('请输入正确的值'))
      } else {
        callback()
      }
    }
    return {
      socket: {},
      // 下拉列表
      fileDirDropList: [
        { name: 'test', value: 1 }
      ],
      hostDropList: [
        { name: 'test', value: 1 }
      ],
      storageDropList: [
        { name: 'test', value: 1 }
      ],
      virtualNetWorkDropList: [
        { name: 'test', value: 1 }
      ],
      // 搜索及分页条件
      search: {
        current: 1,
        size: 10,
        vcenterId: ''
      },
      total: 0,
      // 模板列表数据
      templates: [],
      // 定时器
      timer: null,
      // 已请求次数
      times: 0,
      // 是否开启列表加载状态
      loading: true,
      // 当前选择的vcenterId
      vcenterId: '',
      // 下拉vcenter列表
      vcenterList: [],
      // 是否复制模板弹框
      centerDialogVisible: false,
      // 复制模板数据
      copyTemplates: [{}],
      // 复制模板表单规则
      rules: {
        hostName: [
          { required: true, trigger: 'blur', message: '请输入主机名称' },
          { validator: validateTrim, message: '请输入正确的主机名称', trigger: 'blur' }
        ],
        fileDir: [
          { required: true, message: '请输入文件夹目录', trigger: 'blur' },
          { validator: validateTrim, message: '请输入正确的文件夹目录', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '请输入宿主机', trigger: 'blur' },
          { validator: validateTrim, message: '请输入正确的宿主机', trigger: 'blur' }
        ],
        storage: [
          { required: true, message: '请输入数据存储', trigger: 'blur' },
          { validator: validateTrim, message: '请输入正确的数据存储', trigger: 'blur' }
        ],
        virtualNetWork: [
          { required: true, message: '请输入网络', trigger: 'blur' },
          { validator: validateTrim, message: '请输入正确的网络', trigger: 'blur' }
        ],
        IP: [
          { required: true, message: '请输入IP', trigger: 'blur' },
          { validator: validateTrim, trigger: 'blur', message: '请输入正确的IP' },
          { validator: validateIP, trigger: 'blur', message: '请输入正确的IP' }
        ],
        subnetMask: [
          { required: true, message: '请输入子网掩码', trigger: 'blur' },
          { validator: validateTrim, trigger: 'blur', message: '请输入正确的子网掩码' }
        ],
        gateway: [
          { required: true, message: '请输入网关', trigger: 'blur' },
          { validator: validateTrim, trigger: 'blur', message: '请输入正确的网关' }
        ],
        selfStandard: [
          { required: true, message: '请输入规范名称', trigger: 'blur' },
          { validator: validateTrim, trigger: 'blur', message: '请输入正确的规范名称' }
        ]
      },
      // 当前选中的要复制的模板
      currentTemplate: {},
      isComplate: false,
      dropDir: null,
      dropHost: null,
      dropStorage: null,
      dropNet: null
    }
  },
  created () {
    this.init()
    Bus.$emit('startWebSocket')
    // 初始化vcenter下拉列表
    this._vcenterList()
  },
  // 清除定时器
  beforeDestroy () {
    this.socket.close()
  },
  filters: {
    getStatus (val) {
      if (val) {
        if (val.indexOf('poweredOn') > -1 || val.indexOf('open') > -1) {
          return '开机'
        } else {
          return '关机'
        }
      } else {
        return '-'
      }
    }
  },
  methods: {
    // 检查目录是否存在
    _dropInfoExist (index, searchType) {
      let item = ''
      let value = ''
      if (searchType == 1) {
        item = '文件'
        value = this.copyTemplates[index].fileDir
      } else if (searchType == 2) {
        item = '主机'
        value = this.copyTemplates[index].host
      } else if (searchType == 3) {
        item = '存储'
        value = this.copyTemplates[index].storage
      } else if (searchType == 4) {
        item = '网络'
        value = this.copyTemplates[index].virtualNetWork
      }
      if (!value || !value.trim()) {
        return
      }

      let params = {
        vcenterId: this.search.vcenterId,
        inputValue: value,
        directoryType: searchType
      }
      axios.dropInfoExist(params).then(result => {
        if (result.data.code === 200) {
          if (result.data.data !== 'EXIST') {
            this.$notify({
              title: '提示',
              message: `${item}路径错误`,
              duration: 2000,
              type: 'error'
            })
            if (searchType == 1) {
              this.copyTemplates[index].fileDir = ''
            } else if (searchType == 2) {
              this.copyTemplates[index].host = ''
            } else if (searchType == 3) {
              this.copyTemplates[index].storage = ''
            } else if (searchType == 4) {
              this.copyTemplates[index].virtualNetWork = ''
            }
          }
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })

          if (searchType == 1) {
            this.copyTemplates[index].fileDir = ''
          } else if (searchType == 2) {
            this.copyTemplates[index].host = ''
          } else if (searchType == 3) {
            this.copyTemplates[index].storage = ''
          } else if (searchType == 4) {
            this.copyTemplates[index].virtualNetWork = ''
          }
        }
      }).catch(() => {
        this.$notify({
          title: '提示',
          message: '网络出错，请稍后重试',
          duration: 2000,
          type: 'error'
        })

        if (searchType == 1) {
          this.copyTemplates[index].fileDir = ''
        } else if (searchType == 2) {
          this.copyTemplates[index].host = ''
        } else if (searchType == 3) {
          this.copyTemplates[index].storage = ''
        } else if (searchType == 4) {
          this.copyTemplates[index].virtualNetWork = ''
        }
      })
    },
    checkSelect (index, dir) {
      // this.copyTemplates[index][dir] = !this.copyTemplates[index][dir]
      this.$set(this.copyTemplates[index], [dir], !this.copyTemplates[index][dir])
    },
    _dropInfo (SearchType) {
      if (!this.search.vcenterId) {
        return this.$notify({
          title: '提示',
          message: '请先选择Vcenter',
          duration: 2000,
          type: 'error'
        })
      }
      let params = {
        vcenterId: this.search.vcenterId,
        directoryType: SearchType
      }
      axios.dropInfo(params).then(result => {
        if (result.data.code === 200) {
          if (SearchType == 1) { this.dropDir = result.data.data } else if (SearchType == 2) { this.dropHost = result.data.data } else if (SearchType == 3) { this.dropStorage = result.data.data } else if (SearchType == 4) { this.dropNet = result.data.data }
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$notify({
          title: '提示',
          message: '网络出错，请稍后重试',
          duration: 2000,
          type: 'error'
        })
      })
    },
    init: function () {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(resourceManageSyncUrl)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
        this.socket.onclose = this.close
      }
    },
    open: function (msg) {
      console.log('websocket已连接')
      // this.getMessage()
    },
    error: function () {
      console.log('连接错误')
    },
    getMessage: function (msg) {
      if (msg) {
        let result = JSON.parse(msg.data)
        if (result.synchronization_Completed) {
          this._templateList(false)
          this.isComplate = false

          return this.$notify({
            title: '提示',
            message: '同步已完成',
            duration: 2000,
            type: 'success'
          })
        } else if (result.synchronization_Failed) {
          return this.$notify({
            title: '提示',
            message: '同步失败，请稍后重试',
            duration: 2000,
            type: 'error'
          })
        }
      }
    },
    send: function (params) {
      // this.socket.send(params)
    },
    close: function () {
      console.log('socket已经关闭')
    },

    // 展开复制模板框
    handleCopyTemplate (template) {
      this.currentTemplate = template
      this.centerDialogVisible = true
      this._dropInfo(1)
      this._dropInfo(2)
      this._dropInfo(3)
      this._dropInfo(4)
    },
    // 取消复制
    cancel () {
      this.centerDialogVisible = false
    },
    // 克隆
    _cloneTemplates (data) {
      axios.cloneTemplates(data).then(result => {
        if (result.data.code === 200) {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'success'
          })
          //  Bus.$emit('startWebSocket')
          setTimeout(() => {
            this.copyTemplates = [{}]
          }, 2000)
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$notify({
          title: '提示',
          message: '网络错误，请稍后重试！',
          duration: 2000,
          type: 'error'
        })
      })
    },
    submit () {
      // 得到所有表单的校验结果
      let promiseTmp = []
      for (let i = 0; i < this.copyTemplates.length; i++) {
        promiseTmp.push(this.$refs[`copyTemplate${i}`][0].validate())
      }
      Promise.all(promiseTmp).then(data => {
        let cloneTemplates = {
          vcenterId: this.search.vcenterId,
          tempId: this.currentTemplate.templateId,
          tempName: this.currentTemplate.tempName,
          tempArrray: this.copyTemplates
        }
        this._cloneTemplates(cloneTemplates)
        this.centerDialogVisible = false
      }).catch(err => {
        return err
      })
    },
    // 添加模板复制项
    addTemplate () {
      let addItem = JSON.parse(JSON.stringify(this.copyTemplates[this.copyTemplates.length - 1]))
      this.copyTemplates.push(addItem)
    },
    // 删除模板复制项
    deleteTemplate (index) {
      this.copyTemplates.splice(index, 1)
    },
    // 查询vcenter下拉列表
    _vcenterList () {
      axios.vcenterList({ current: 1, size: 20 }).then(result => {
        if (result.data.code === 200) {
          this.vcenterList = result.data.data.records
          this.search.vcenterId = this.vcenterList[0].vcenterId
          this._templateList(true)
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$notify({
          title: '提示',
          message: '网络错误，请稍后重试！',
          duration: 2000,
          type: 'error'
        })
      })
    },

    // 关键字搜索
    searchList () {
      this.search.current = 1
      this._templateList(false)
    },

    // 检查获取instanceList
    _hostListCheck ({ vcenterId, synchronizeType = 'temp' }) {
      if (!vcenterId) {
        return this.$notify({
          title: '提示',
          message: '请先选择Cventer',
          duration: 2000,
          type: 'error'
        })
      }
      this.loading = true
      axios.hostListCheck({ vcenterId: vcenterId, synchronizeType: 'temp' }).then(result => {
        if (result.data.code === 200) {
          this.loading = false
          this.isComplate = true

          // this.timer = setInterval(() => {
          //   if(this.templates.length === 0 && this.times < 3) {
          //     this._templateList(false)
          //     this.times++
          //   }else {
          //      this.times = 0
          //     this.loading = false
          //     clearInterval(this.timer)
          //   }
          // }, 10000)
        } else {
          this.loading = false
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(e => {
        this.loading = false
        this.$notify({
          title: '提示',
          message: '网络错误，请稍后重试！',
          duration: 2000,
          type: 'error'
        })
      })
    },

    // 查询模板列表
    _templateList (isInit) {
      axios.templateList(this.search).then(result => {
        if (result.data.code === 200) {
          this.templates = result.data.data.records
          this.total = result.data.data.total

          // if (this.templates.length) { this.loading = false }

          // if (isInit && this.templates.length === 0) {
          //   this._hostListCheck({ vcenterId: this.search.vcenterId })
          // } else {
          //   this.loading = false
          // }
        } else {
          this.loading = false
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(e => {
        this.loading = false
        this.$notify({
          title: '提示',
          message: '网络错误，请稍后重试！',
          duration: 2000,
          type: 'error'
        })
      })
    },

    // 分页- 点击页数
    handleCurrentChange (val) {
      this.search.current = val
      this._templateList(false)
    },

    // 分页- 选择每页数量
    handleSizeChange (val) {
      this.search.size = val
      this._templateList(false)
    }
  }

}
</script>

<style lang="scss" scoped>
.special-item {
  position: relative;
}
.form-area {
  position: relative;
  .operation-form {
    position: absolute;
    right: -10px;
  }
  .search-button {
    border: 1px solid #fff;
    color: #fff;
    &:hover {
      border: 1px solid #fff;
      color: #fff;
      background: transparent;
    }
    &:focus {
      color: #fff;
      background: transparent;
    }
    &:active {
      border: 1px solid #fff;
      background: transparent;
      color: #fff;
    }
  }
  .add-form {
    position: absolute;
    right: 0;
    top: -55px;
  }
}
.icon-plus {
  position: absolute;
  right: -20px;
  top: 10px;
  cursor: pointer;
  color: #0066ff;
}
.form {
  display: flex;
  flex-wrap: wrap;
}
.form > div {
  width: 50%;
  padding-right: 20px;
  box-sizing: border-box;
}
.title-info {
  line-height: 40px;
  padding-left: 20px;
}
.item-select {
  width: 100%;
}
.icon-opera i {
  font-size: 18px;
  margin: 5px;
  color: #06f;
}
.speical-item {
  width: 100%;
}
.task-list {
  padding: 10px;
  margin-top: 58px;
}
.blank-page .imgdiv {
  height: 200px;
  padding-top: 15px;
}
.blank-page .empty-text {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  margin-bottom: 10px;
  color: #fff;
}
.group-btn {
  padding: 0 5px;
  margin-bottom: 20px;

}
.group-btn .btn {
  float: left;
  position: relative;
}

.block {
  padding: 20px;
  text-align: center;
}
.task-btn-box span {
  display: inline-block;
  background: #fff;
  border: 1px solid #0066ff;
  line-height: 24px;
  padding: 0 4px;
  border-radius: 5px;
  color: #0066ff;
  font-size: 14px;
  margin-right: 12px;
  cursor: pointer;
}
.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
}
.task-btn-box span:hover {
  background: #0066ff;
}
</style>
