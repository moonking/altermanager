<template>
  <div class="task-list">
    <el-row>
      <el-form :inline="true" :model="search" class="form-area">
        <!-- <el-form-item style="margin-left: 15px">
          <el-input placeholder="请输入实例名" v-model="search.hostName"></el-input>
        </el-form-item>-->
        <el-form-item class="form-select">
          <el-select v-model="search.vcenterId" placeholder="请选择vCenter" :clearable="true">
            <el-option
              v-for="vcenter in vcenterList"
              :label="vcenter.ipAddress"
              :value="vcenter.vcenterId"
              :key="vcenter.vcenterId"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select placeholder="请选择宿主机" v-model="search.machineIp" :clearable="true">
            <el-option
              v-for="host in hostList"
              :label="host.label"
              :value="host.value"
              :key="host.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item class="operation-form">
          <el-button icon="el-icon-search" class="search-button" @click.stop="searchList">查找</el-button>
          <el-button
            icon="el-icon-plus"
            type="primary"
            class="add-form"
            :loading="isComplate"
            @click="_hostListCheck({vcenterId: search.vcenterId})"
          >同步</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="group-btn">
      <div class="btn">
        <el-dropdown>
          <span class="el-dropdown-link" style="color:#fff">
            批量操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>拍快照</el-dropdown-item>
            <el-dropdown-item>查看快照</el-dropdown-item>
            <el-dropdown-item>生成模板</el-dropdown-item>-->
            <el-dropdown-item>开机</el-dropdown-item>
            <el-dropdown-item>关机</el-dropdown-item>
            <!-- <el-dropdown-item>监控</el-dropdown-item>
            <el-dropdown-item>复制</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <p style="float: right;padding-right: 10px;color: #888888">上次同步时间：2019-03-05 12：30</p> -->
    </el-row>
    <el-row>
      <el-table
        :data="instances"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column type="selection" width="55" style="text-align: center" />
        <el-table-column align="center" prop="instanceName" label="实例名" />
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{ scope.row.status | getStatus }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" prop='ipAddress'  label="主机IP">
           <template slot-scope="scope">
            {{ scope.row.ipAddress || '-' }}
          </template>
        </el-table-column>-->
        <el-table-column prop="cpus" label="CUP" />
        <el-table-column prop="memorys" label="内存情况" />
        <el-table-column label="所属主机" prop="host" />
        <el-table-column prop="address" label="操作" width="330px">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="shutUp(scope.row)">
                <el-tooltip class="item" effect="dark" content="开机" placement="top-start">
                  <icon-svg icon-class="dengdai" />
                  <!-- <img class="shutUp" src="../../../static/img/icon_reset_.png" alt /> -->
                </el-tooltip>
              </span>
              <span class="special" @click="shutDown(scope.row)">
                <el-tooltip class="item" effect="dark" content="关机" placement="top-start">
                  <icon-svg icon-class="guanbi" />
                </el-tooltip>
              </span>
              <span class="special" @click="handleCopyInstance(scope.row)">
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
          style="text-align:right;cursor: pointer;"
        />
      </div>
    </el-row>

    <el-dialog title="克隆实例" :visible.sync="centerDialogVisible" width="35%" center>
      <el-form
        style="padding-right: 50px;"
        label-width="80px"
        :model="copyInstanceInfo"
        :rules="rules"
        ref="copyInstanceInfo"
      >
        <el-form-item label="新实例名" prop="name">
          <el-input v-model="copyInstanceInfo.name" placeholder="请输入新实例名"></el-input>
        </el-form-item>
        <el-form-item label="主机名" prop="hostName" v-if="isSelectHost">
          <el-select
            placeholder="请选择主机"
            class="speical-item"
            v-model="copyInstanceInfo.hostName"
            :clearable="true"
          >
            <el-option v-for="host in hostDrop" :label="host" :value="host" :key="host"></el-option>
          </el-select>
          <i class="el-icon-circle-plus-outline icon-plus" @click="checkSelect(2)"></i>
        </el-form-item>
        <el-form-item class="special-item" label="主机" prop="net" v-else>
          <el-input
            v-model="copyInstanceInfo.hostName"
            @blur="_dropInfoExist(copyInstanceInfo.hostName, 2)"
            placeholder="请输入主机"
          ></el-input>

          <i class="el-icon-remove-outline icon-plus" @click="checkSelect(2)"></i>
        </el-form-item>

        <el-form-item class="special-item" label="网络" prop="net" v-if="isSelectNet">
          <el-select
            @change="_dropInfoExist(copyInstanceInfo.net, 4)"
            placeholder="请选择网络"
            class="speical-item"
            v-model="copyInstanceInfo.net"
            :clearable="true"
          >
            <el-option v-for="net in dropNet" :label="net" :value="net" :key="net"></el-option>
          </el-select>
          <i class="el-icon-circle-plus-outline icon-plus" @click="checkSelect(4)"></i>
        </el-form-item>

        <el-form-item class="special-item" label="网络" prop="net" v-else>
          <el-input
            v-model="copyInstanceInfo.net"
            @blur="_dropInfoExist(copyInstanceInfo.net, 4)"
            placeholder="请输入参数net，例：/DC0/network/VM Network"
          ></el-input>
          <i class="el-icon-remove-outline icon-plus" @click="checkSelect(4)"></i>
        </el-form-item>

        <el-form-item class="special-item" label="存储" prop="ds" v-if="isSelect">
          <el-select
            @change="_dropInfoExist(copyInstanceInfo.ds,3)"
            placeholder="请选择存储"
            class="speical-item"
            v-model="copyInstanceInfo.ds"
            :clearable="true"
          >
            <el-option v-for="host in dropStorage" :label="host" :value="host" :key="host"></el-option>
          </el-select>
          <!-- <el-input v-model="copyInstanceInfo.ds" placeholder="请输入参数ds，例：/DC0/datastore/LocalDS_0 test(复制后的名称)"></el-input> -->
          <i class="el-icon-circle-plus-outline icon-plus" @click="checkSelect(3)"></i>
        </el-form-item>
        <el-form-item class="special-item" label="存储" prop="ds" v-else>
          <el-input
            v-model="copyInstanceInfo.ds"
            @blur="_dropInfoExist(copyInstanceInfo.ds, 3)"
            placeholder="请输入参数ds，例：/DC0/datastore/LocalDS_0 test(复制后的名称)"
          ></el-input>
          <i class="el-icon-remove-outline icon-plus" @click="checkSelect(3)"></i>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit('copyInstanceInfo')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import { resourceManageSyncUrl } from '../../config'
export default {
  name: 'InstanceManage',
  data () {
    return {
      socket: {},
      rules: {
        name: [
          { required: true, message: '请选择输入新实例名称', trigger: 'blur' }
        ],
        hostName: [
          { required: true, message: '请选择选择主机', trigger: 'change' }
        ],
        net: [
          {
            required: true,
            message: '请输入参数net，例：/DC0/network/VM Network',
            trigger: 'blur'
          }
        ],
        ds: [
          {
            required: true,
            message: '请输入参数ds，例：/DC0/datastore/LocalDS_0',
            trigger: 'blur'
          }
        ]
      },
      copyInstanceInfo: {},
      // 下拉选择主机
      centerDialogVisible: false,
      hostDrop: [],
      search: {
        current: 1,
        size: 10,
        hostName: '',
        status: '',
        machineIp: '',
        vcenterId: ''
      },

      instances: [],
      hostList: [],
      instanceStatus: [
        {
          value: 'poweredOff',
          label: '关机'
        },
        {
          value: 'poweredOn',
          label: '开机'
        }
      ],
      total: 0,
      timer: null,
      times: 0,
      loading: true,
      vcenterId: '',
      vcenterList: [],
      isComplate: false,
      isSelect: true,
      dropStorage: null,
      isSelectNet: true,
      dropNet: null,
      isSelectHost: true
    }
  },
  created () {
    this.init()
    // this._instanceList()
    // 初始化vcenter下拉列表
    this._vcenterList()
  },
  // 清除定时器
  beforeDestroy () {
    this.socket.close()
    // clearInterval( this.timer)
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
    _dropInfoExist (value, dropType) {
      let params = {
        vcenterId: this.search.vcenterId,
        inputValue: value,
        directoryType: dropType
      }
      if (!value || !value.trim()) {
        return
      }
      axios.dropInfoExist(params)
        .then(result => {
          let item = ''
          if (result.data.code === 200) {
            if (result.data.data !== 'EXIST') {
              if (dropType === 4) {
                item = '网络'
                this.copyInstanceInfo.net = ''
              } else if (dropType === 3) {
                item = '存储'
                this.copyInstanceInfo.ds = ''
              } else if (dropType === 2) {
                item = '主机'
                this.copyInstanceInfo.host = ''
              }
              this.$notify({
                title: '提示',
                message: `${item}路径错误`,
                duration: 2000,
                type: 'error'
              })
            }
          } else {
            this.$notify({
              title: '提示',
              message: result.data.message,
              duration: 2000,
              type: 'error'
            })
            if (dropType === 4) {
              item = '网络'
              this.copyInstanceInfo.net = ''
            } else if (dropType === 3) {
              item = '存储'
              this.copyInstanceInfo.ds = ''
            } else if (dropType === 2) {
              item = '主机'
              this.copyInstanceInfo.host = ''
            }
          }
        })
        .catch(() => {
          let item = ''
          if (dropType === 4) {
            item = '网络'
            this.copyInstanceInfo.net = ''
          } else if (dropType === 3) {
            item = '存储'
            this.copyInstanceInfo.ds = ''
          } else if (dropType === 2) {
            item = '主机'
            this.copyInstanceInfo.host = ''
          }
          this.$notify({
            title: '提示',
            message: `${item}出错，请稍后重试`,
            duration: 2000,
            type: 'error'
          })
        })
    },
    _dropInfo (dropType) {
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
        directoryType: dropType
      }
      axios.dropInfo(params)
        .then(result => {
          if (result.data.code === 200) {
            if (dropType === 4) {
              this.dropNet = result.data.data
            } else if (dropType === 3) {
              this.dropStorage = result.data.data
            } else if (dropType === 2) {
              this.hostDrop = result.data.data
            }
          } else {
            this.$notify({
              title: '提示',
              message: result.data.message,
              duration: 2000,
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            message: '网络出错，请稍后重试',
            duration: 2000,
            type: 'error'
          })
        })
    },
    //
    checkSelect (dropType) {
      if (dropType === 4) {
        this.isSelectNet = !this.isSelectNet
        this.copyInstanceInfo.net = ''
      } else if (dropType === 3) {
        this.isSelect = !this.isSelect
        this.copyInstanceInfo.ds = ''
      } else if (dropType === 2) {
        this.isSelectHost = !this.isSelectHost
        this.copyInstanceInfo.hostName = ''
      }
    },

    init: function () {
      if (typeof WebSocket === 'undefined') {
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
          this._instanceList(false)
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
    // 查询vcenter下拉列表
    _vcenterList () {
      axios.vcenterList({ current: 1, size: 20 })
        .then(result => {
          if (result.data.code === 200) {
            this.vcenterList = result.data.data.records
            this.search.vcenterId = this.vcenterList[0].vcenterId
            this._instanceList(true)
          } else {
            this.$notify({
              title: '提示',
              message: result.data.message,
              duration: 2000,
              type: 'error'
            })
          }
        })
        .catch(e => {
          this.$notify({
            title: '提示',
            message: '网络错误，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        })
    },
    cancel () {
      this.copyInstanceInfo = {}
      this.centerDialogVisible = false
    },
    // 关键字搜索
    searchList () {
      this.search.current = 1
      this._instanceList(false)
    },
    // 主机下拉数据
    _getHostDropList () {
      axios.getHostDropList().then(result => {
        if (result.data.code === 200) {
          this.hostDropList = result.data.data
        }
      })
    },
    // 准备复制实例
    handleCopyInstance (row) {
      this.copyInstanceInfo.instanceId = row.instanceId
      this.centerDialogVisible = true
      this._dropInfo(4)
      this._dropInfo(2)
      this._dropInfo(3)
    },
    // 提交复制表单
    submit (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this._copyInstance()
        } else {
          return false
        }
      })
    },
    // 复制实例
    _copyInstance () {
      let obj = this.copyInstanceInfo
      obj.hostName = obj.hostName.replace(/[\r\n]/g, '')
      obj.ds = obj.ds + ' ' + obj.name
      delete obj.name
      axios.copyInstance(obj)
        .then(result => {
          if (result.data.code === 200) {
            this.copyInstanceInfo = {}
            this.$notify({
              title: '提示',
              message: '复制成功',
              duration: 2000,
              type: 'success'
            })
            this.centerDialogVisible = false
            this._instanceList(true)
          } else {
            this.copyInstanceInfo = {}
            this.centerDialogVisible = false
            this.$notify({
              title: '提示',
              message: result.data.message,
              duration: 2000,
              type: 'error'
            })
          }
        })
        .catch(e => {
          this.$notify({
            title: '提示',
            message: '网络错误，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        })
    },
    // 检查获取instanceList
    _hostListCheck ({ vcenterId, synchronizeType = 'instance' }) {
      if (!this.search.vcenterId) {
        return this.$notify({
          title: '提示',
          message: '请先选择Cventer',
          duration: 2000,
          type: 'error'
        })
      }
      this.loading = true
      axios.hostListCheck({ vcenterId: vcenterId, synchronizeType: 'instance' })
        .then(result => {
          if (result.data.code === 200) {
            this.loading = false
            this.isComplate = true
            //  this.timer = setInterval(() => {
            //     if(this.instances.length === 0 && this.times < 3) {
            //       this._instanceList(false)
            //       this.times++
            //     }else {
            //        this.times = 0
            //       this.loading = false
            //       clearInterval(this.timer)
            //     }
            //   }, 10000)
          } else {
            this.loading = false
            this.$notify({
              title: '提示',
              message: result.data.message,
              duration: 2000,
              type: 'error'
            })
          }
        })
        .catch(e => {
          this.loading = false
          this.$notify({
            title: '提示',
            message: '网络错误，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        })
    },
    // 查询实例列表
    _instanceList (isInit) {
      axios.instanceList(this.search)
        .then(result => {
          if (result.data.code === 200) {
            this.instances = result.data.data.records
            this.total = result.data.data.total

            // if (this.instances.length) {
            //   this.loading = false
            // }

            // if (isInit && this.instances.length === 0) {
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
        })
        .catch(e => {
          this.loading = false
          this.$notify({
            title: '提示',
            message: '网络错误，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        })
    },
    // 请求开关机
    _changeShutUpAndShutDown (data) {
      axios.closeAndOpenInstance(data)
        .then(result => {
          if (result.data.code === 200) {
            this.$notify({
              title: '提示',
              message: '已完成',
              duration: 2000,
              type: 'success'
            })
            this._instanceList(false)
          } else {
            this.$notify({
              title: '提示',
              message: result.data.message,
              duration: 2000,
              type: 'error'
            })
          }
        })
        .catch(e => {
          this.$notify({
            title: '提示',
            message: '网络错误，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        })
    },

    //  关机
    shutDown (row) {
      if (
        row.status &&
        (row.status.indexOf('poweredOff') > -1 ||
          row.status.indexOf('clone') > -1)
      ) {
        return this.$notify({
          title: '提示',
          message: '已是关机状态，请勿重复操作',
          duration: 2000,
          type: 'error'
        })
      } else {
        this._changeShutUpAndShutDown({
          instanceId: row.instanceId,
          operatingType: 'poweredOff'
        })
      }
    },
    // 开机
    shutUp (row) {
      if (
        !row.status &&
        (row.status.indexOf('poweredOn') > -1 ||
          row.status.indexOf('open') > -1)
      ) {
        return this.$notify({
          title: '提示',
          message: '已是开机状态，请勿重复操作',
          duration: 2000,
          type: 'error'
        })
      } else {
        this._changeShutUpAndShutDown({
          instanceId: row.instanceId,
          operatingType: 'poweredOn'
        })
      }
    },
    // 分页
    handleCurrentChange (val) {
      this.search.current = val
      this._instanceList(false)
    },
    handleSizeChange (val) {
      this.search.size = val
      this._instanceList(false)
    },

    // 同步
    synchronous () { }
  }
}
</script>

<style lang="scss" scoped>
.special-item {
  position: relative;
}
.form-select {
  margin-bottom: 20px !important;
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
.speical-item {
  width: 100%;
}
.task-list {
  padding: 10px;
  margin-top: 58px;
}
.blank-page {
  .imgdiv {
    height: 200px;
    padding-top: 15px;
  }
  .empty-text {
    font-size: 18px;
    height: 30px;
    line-height: 30px;
    margin-top: -30px;
    margin-bottom: 10px;
    color: #fff;
  }
}
.group-btn {
  padding: 0 5px;
  .btn {
    float: left;
    position: relative;
    margin-bottom: 20px;
  }
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
</style>
