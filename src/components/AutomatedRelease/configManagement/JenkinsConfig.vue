<template>
  <div class="config aibms-role">
    <el-form :inline="true" :model="search" class="config-search">
      <el-form-item>
        <el-input placeholder="请输入名称" v-model="search.jenkinsName"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 15px">
        <el-input placeholder="请输入账号" v-model="search.name"></el-input>
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
        <el-table-column prop="jenkinsName" label="名称"></el-table-column>
        <el-table-column prop="baseurl" label="url"></el-table-column>
        <el-table-column prop="name" label="账号"></el-table-column>
        <el-table-column prop="detectionStatus" label="连通性">
          <template slot-scope="scope">
            <i v-if="scope.row.detectionStatus" class="success-icon el-icon-circle-check"></i>
            <i v-else class="el-icon-circle-close fail-icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="editJenkins(scope.row.jenkinsId)">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <icon-svg icon-class="bianji" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="warningDelete(scope.row.jenkinsId)">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <icon-svg icon-class="shanchu" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="detectionJenkins(scope.row.jenkinsId)">
                <el-tooltip class="item" effect="dark" content="检测" placement="top-start">
                  <icon-svg icon-class="jiance" class="whiteness-icon-color" />
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
        <i class="el-icon-warning"></i>&nbsp;&nbsp;删除可能会影响调用该Jenkins的流水线，请谨慎操作！
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
export default {
  name: 'JenkinsConfig',
  data () {
    return {
      // 确认删除对话框控制
      confirmDeleteDialogVisible: false,
      search: {
        jenkinsName: '',
        name: '',
        detectionStatus: '',
        current: 0,
        size: 10
      },
      configList: [
        {
          name: 'Jenkins1'
        }
      ],
      total: 0,
      page: true,
      tableHeaderStyle: {
        background: '#f5f5f5'
      },
      currentDeleteId: ''
    }
  },
  created () {
    this._JenkinsList()
  },
  methods: {
    warningDelete (jenkinsId) {
      this.confirmDeleteDialogVisible = true
      this.currentDeleteId = jenkinsId
    },
    confirmDelete () {
      this._deleteJenkins()
    },
    // 检测
    detectionJenkins (id) {
      axios.detectionJenkins(id).then(result => {
        if (result.data.code === 200) {
          const loading = this.$loading({
            lock: true,
            text: '拼命检查中，1分钟后可查看报告',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          setTimeout(() => {
            loading.close()
          }, 2000)
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
          message: '检测出错，请稍后重试',
          duration: 2000,
          type: 'error'
        })
      })
    },
    // 删除Jenkins列表
    _deleteJenkins () {
      axios.deleteJenkins(this.currentDeleteId).then(result => {
        if (result.status === 200) {
          if (result.data.jobtaskList && result.data.jobtaskList.length) {
            this.$notify({
              title: '提示',
              message: '流水线正在调用该Jenkins服务器，无法删除',
              duration: 2000,
              type: 'error'
            })
          } else {
            this._JenkinsList()
            this.$notify({
              title: '提示',
              message: '删除成功',
              duration: 2000,
              type: 'success'
            })
          }
          this.confirmDeleteDialogVisible = false
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
          message: '删除出错，请稍后重试',
          duration: 2000,
          type: 'error'
        })
      })
    },
    //  获取Jenkins列表
    _JenkinsList () {
      axios.JenkinsList(this.search).then(result => {
        if (result.data.code === 200) {
          this.configList = result.data.data.records
          this.total = parseInt(result.data.data.total)
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
          message: '查询出错，请稍后重试',
          duration: 2000,
          type: 'error'
        })
      })
    },
    // 更新Jenkins
    editJenkins (id) {
      this.$notify({
        title: '错误',
        message: '修改可能会影响调用该Jenkins的流水线，请谨慎操作！',
        type: 'warning'
      })
      this.$router.push({
        path: '/AutomatedRelease/editJenkinsConfig/' + id,
        query: {
          code: 3
        }
      })
    },
    searchHandle () {
      this._JenkinsList()
    },
    toAddConfig () {
      this.$router.push({
        path: '/AutomatedRelease/addJenkinsConfig',
        query: {
          code: 3
        }
      })
    },
    handleSizeChange (val) {
      this.search.size = val
      this._JenkinsList()
    },
    handleCurrentChange (val) {
      this.search.current = val
      this._JenkinsList()
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
