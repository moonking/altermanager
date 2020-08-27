<template>
  <div class="config aibms-role">
    <el-form :inline="true" :model="search" class="config-search">
      <el-form-item>
        <el-input placeholder="请输入名称" v-model="search.name"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 15px">
        <el-input placeholder="请输入账号" v-model="search.accountNumber"></el-input>
      </el-form-item>
      <el-form-item class="item-right overHideMargin">
        <el-button icon="el-icon-search" class="nomal-button" @click="searchHandle">查找</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="toAddConfig"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <div class="deploy-plan-list">
      <el-table stripe :data="configList" :header-cell-style="tableHeaderStyle">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="baseurl" label="url"></el-table-column>
        <el-table-column prop="accountNumber" label="账号"></el-table-column>
        <el-table-column prop="detectionStatus" label="连通性">
          <template slot-scope="scope">
            <span v-if="scope.row.isDetecting">
              检测中
              <i class="el-icon-loading"></i>
            </span>
            <i
              v-else
              :class="[
                      {'success-icon': scope.row.detectionStatus},
                      {'fail-icon': !scope.row.detectionStatus},
                      {'el-icon-circle-check': scope.row.detectionStatus},
                      {'el-icon-circle-close': !scope.row.detectionStatus}]"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="editProductConfig(scope.row.productId)">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <icon-svg icon-class="bianji" class="whiteness-icon-color"/>
                </el-tooltip>
              </span>
              <span class="special" @click="warningDelete(scope.row.productId)">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <icon-svg icon-class="shanchu" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="detectionProductConfig(scope.row.productId)">
                <el-tooltip class="item" effect="dark" content="检测" placement="top-start">
                  <icon-svg icon-class="jiance" class="whiteness-icon-color"/>
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
        <div slot="empty">
          <div class="blank-page">
            <div class="imgdiv">
              <img src="../../../../static/img/blank-page.png" alt />
            </div>
            <p class="empty-text">暂无相关数据</p>
          </div>
        </div>
      </el-table>
    </div>
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

    <el-dialog center :visible.sync="confirmDeleteDialogVisible" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该制品库配置信息吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="confirmDeleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="confirmDelete">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import { websocketurl } from '../../../config'
export default {
  name: 'JenkinsConfig',
  data () {
    return {
      // 确认删除对话框控制
      confirmDeleteDialogVisible: false,
      search: {
        name: '',
        accountNumber: '',
        detectionStatus: '',
        current: 0,
        size: 10
      },
      configList: [],
      total: 0,
      page: true,
      tableHeaderStyle: {
        background: '#f5f5f5'
      },
      currentDeleteId: '',
      // 用于检测连通性的websocket实例
      wsInfo: {
        productId: '',
        ws: ''
      },
      // 当前检测中的wsInfo集合
      wsInfoCollection: []
    }
  },
  created () {
    this.getProductConfigList()
  },
  methods: {
    warningDelete (productId) {
      this.confirmDeleteDialogVisible = true
      this.currentDeleteId = productId
    },
    confirmDelete () {
      this.deleteProductConfig()
    },
    // 检测
    detectionProductConfig (id) {
      let ws = new WebSocket(websocketurl)
      ws.onopen = res => {
        console.log('ws已连接')
        this.setIsDetecting(id, true)
        ws.send(`{"productId":"${id}"}`)
      }
      ws.onmessage = res => {
        let result = JSON.parse(JSON.parse(res.data))
        let data = result.data
        if (result.code === 200) {
          this.$notify({
            title: '提示',
            message: '请求成功，检测已完成！',
            type: 'success'
          })
        } else {
          this.$notify({ title: '提示', message: data.result, type: 'error' })
        }
        this.setDetectionStatus(data.productId, data.status)
        ws.close()
      }
      ws.onclose = res => {
        console.log('ws已关闭')
        this.setIsDetecting(id, false)
      }
    },
    // 设置检测状态
    setDetectionStatus (productId, status) {
      this.configList.forEach(config => {
        if (config.productId === productId) {
          config.detectionStatus = status
        }
      })
    },
    // 设置isDetecting
    setIsDetecting (productId, status) {
      this.configList.forEach(config => {
        if (config.productId === productId) {
          config.isDetecting = status
        }
      })
    },
    // 删除Jenkins列表
    deleteProductConfig () {
      axios.deleteProductConfig(this.currentDeleteId)
        .then(result => {
          if (result.status === 200) {
            this.getProductConfigList()
            this.$notify({
              title: '提示',
              message: '删除成功',
              duration: 2000,
              type: 'success'
            })
            this.confirmDeleteDialogVisible = false
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
            message: '删除出错，请稍后重试',
            duration: 2000,
            type: 'error'
          })
        })
    },
    //  获取制品库配置列表
    getProductConfigList () {
      axios.productConfigList(this.search)
        .then(result => {
          if (result.data.code === 200) {
            let list = result.data.data.records
            list.forEach(config => {
              config.isDetecting = false
            })
            this.configList = list
            this.total = parseInt(result.data.data.total)
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
            message: '查询出错，请稍后重试',
            duration: 2000,
            type: 'error'
          })
        })
    },
    // 编辑制品配置
    editProductConfig (id) {
      this.$router.push({
        path: '/AutomatedRelease/editProductConfig/' + id,
        query: {
          code: 3
        }
      })
    },
    searchHandle () {
      this.getProductConfigList()
    },
    toAddConfig () {
      this.$router.push({
        path: '/AutomatedRelease/addProductConfig',
        query: {
          code: 3
        }
      })
    },
    handleSizeChange (val) {
      this.search.size = val
      this.getProductConfigList()
    },
    handleCurrentChange (val) {
      this.search.current = val
      this.getProductConfigList()
    }
  }
}
</script>

<style lang="stylus" scoped>
.block {
  padding: 92px 0 0 0;
  text-align: center;
}

.task-btn-box {
  /* padding: 10px; */
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

.task-btn-box span.special {
  /* border: 1px solid #777777; */
  cursor: pointer;
}

.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
}

.task-btn-box .disabled {
  display: inline-block;
  font-size: 14px;
  margin-right: 12px;
  line-height: 24px;
  padding: 0 8px;
  border-radius: 5px;
}

.task-btn-box span.active {
  color: #fff;
  border: 1px solid #0066ff;
}

.task-btn-box span.text {
  background: #0066ff;
  color: #fff;
  border: 1px solid #0066ff;
}

.task-btn-box span.specials {
  border: 1px solid #777777;
}

.task-btn-box .dis {
  cursor: not-allowed;
}

.task-btn-box .jobdisabled {
  cursor: not-allowed;
  background-color: #ddd;
  border: 1px solid #777777;
}

.task-btn-box span.special:hover {
  background: #0066FF;
}

.success-icon {
  color: #49BC71;
  font-size: 24px;
}

.fail-icon {
  color: #FF0000;
  font-size: 24px;
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
}

.config {
  padding: 10px;
}
</style>
