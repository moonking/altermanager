<!--name: 'Warehouse'-->
<template>
  <div class="task-list">
    <el-row>
      <el-form :inline="true" :model="search" class="form-area">
        <el-form-item class="form-select">
          <el-select v-model="search.vcenterId" placeholder="请选择Vcenter" clearable>
            <el-option
              v-for="vcenter in vcenterList"
              :label="vcenter.ipAddress"
              :value="vcenter.vcenterId"
              :key="vcenter.vcenterId"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="operation-form">
          <el-button icon="el-icon-search" class="search-button" @click="searchList">搜索</el-button>
          <el-button
            icon="el-icon-plus"
            type="primary"
            class="add-form"
            :loading="isComplate"
            @click="_hostListCheck({vcenterId: search.vcenterId,synchronizeType: 'host'})"
          >同步</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="group-btn">
      <div class="btn">
        <el-dropdown>
          <span class="el-dropdown-link" style="color:#fff">
            批量操作
            <i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>上线</el-dropdown-item>
            <el-dropdown-item>下线</el-dropdown-item>
            <el-dropdown-item>关机</el-dropdown-item>
            <el-dropdown-item>重启</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <p style="float: right;padding-right: 10px;color: #888888">上次同步时间：2019-03-05 12：30</p> -->
    </el-row>
    <el-row>
      <el-table
        :data="hostList"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column type="selection" width="55" style="text-align: center"/>
        <el-table-column prop="name" label="主机名"/>
        <!-- <el-table-column align="center" prop="label" label="所属集群"></el-table-column>
        <el-table-column align="center" prop="label" label="IP"></el-table-column>-->
        <el-table-column prop="instanceNum" label="实例数"/>
        <el-table-column prop="logicalCpus" label="CPU情况（核）">
          <template slot-scope="scope">{{ scope.row.cpuUsage + '/' + scope.row.logicalCpus }}</template>
        </el-table-column>
        <el-table-column prop="memory" label="内存情况（GB）">
          <template slot-scope="scope">{{ scope.row.memoryUsage + '/' + scope.row.memory }}</template>
        </el-table-column>
        <el-table-column prop="processorType" label="CPU型号"/>
        <el-table-column prop="address" label="操作" width="230px">
          <template>
            <div class="task-btn-box">
              <span class="special">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <icon-svg icon-class="bianji" />
                </el-tooltip>
              </span>
              <span class="special">
                <el-tooltip class="item" effect="dark" content="关机" placement="top-start">
                  <icon-svg icon-class="guanbi" />
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
            <p class="empty-text">暂无相关数据,请手动同步</p>
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
  </div>
</template>

<script>
import axios from '@/api';
import { resourceManageSyncUrl } from '../../config'
export default {
  name: 'HostManage',
  data () {
    return {
      socket: {},
      dialogVisible: false,
      search: {
        vcenterId: '',
        current: 1,
        size: 10
      },
      vcenterList: '',
      total: 0,
      hostList: [],
      loading: false,
      times: 0,
      timer: null,
      isComplate: false
    }
  },
  created () {
    this.init()
    // 初始化vcenter下拉列表
    this._vcenterList()
  },
  // 清除定时器
  beforeDestroy () {
    this.socket.close()
    // clearInterval( this.timer)
  },
  methods: {
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
          this._hostList(false)
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
    // 关键字搜索
    searchList () {
      if (!this.search.vcenterId) {
        return this.$notify({
          title: '提示',
          message: '请选择vcenter',
          duration: 2000,
          type: 'error'
        })
      }
      this.search.current = 1
      this._hostList(true)
    },
    // 查询vcenter下拉列表
    _vcenterList () {
      axios.vcenterList({ current: 1, size: 20 }).then(result => {
        if (result.data.code === 200) {
          this.vcenterList = result.data.data.records
          this.search.vcenterId = this.vcenterList[0].vcenterId
          this._hostList(true)
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
    // 检查获取hostList
    _hostListCheck ({ vcenterId, synchronizeType = 'host' }) {
      if (!this.search.vcenterId) {
        return this.$notify({
          title: '提示',
          message: '请先选择Cventer',
          duration: 2000,
          type: 'error'
        })
      }
      this.loading = true
      axios.hostListCheck({ vcenterId: vcenterId, synchronizeType: synchronizeType }).then(result => {
        if (result.data.code === 200) {
          this.loading = false
          this.isComplate = true
          // this.init()
          // this._hostList(false)
          // this.timer = setInterval(() => {
          //   if(this.hostList.length === 0 && this.times < 3) {
          //     this.loading = false
          //     this._hostList(false)
          //     this.times++
          //   }else {
          //     this.times = 0
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
    //  获取hostList
    _hostList (isInit) {
      axios.hostList(this.search).then(result => {
        if (result.data.code === 200) {
          this.hostList = result.data.data.records
          this.total = result.data.data.total

          // if (this.hostList.length) { this.loading = false }

          // if (isInit && this.hostList.length === 0) {
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
    //  添加主机
    goAddHost () {
      this.$router.push({
        path: '/ResourceManagement/AddHost',
        query: {
          code: 5
        }
      })
    },

    deleteWarehouse () {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },

    // 分页
    handleCurrentChange (val) {
      this.search.current = val
      this._hostList(false)
    },

    handleSizeChange (val) {
      this.search.size = val
      this._hostList(false)
    },

    // 同步
    synchronous () {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
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
.form-area {
  position: relative;
}
.form-area .operation-form {
  position: absolute;
  right: -10px;
}
.form-area .search-button {
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
.form-area .add-form {
  position: absolute;
  right: 0;
  top: -55px;
}
.task-list {
  padding: 10px;
  margin-top: 58px;
}
.form-select,.item-right {
  margin-bottom:20px!important;
}
.group-btn {
  padding:0 5px;
  .btn {
  float: left;
  position: relative;
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
.el-table {
  margin-top: 20px!important;
}
.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
}
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
.task-btn-box span:hover {
  background: #0066ff;
}
</style>
