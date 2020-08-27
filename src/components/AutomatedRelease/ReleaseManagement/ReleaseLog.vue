<template>
  <div class="layout aibms-role">
    <div class="layout-panel">
      <el-table
        stripe
        align="center"
        :data="logs"
        :header-cell-style="{ background: '#f5f5f5' }"
        @expand-change="handleExpansion"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" :inline="true">
              <div v-for=" (item,index) in scope.row.jobtaskBuiled" :key="index">
                <el-form-item label="任务流水线名称:" class="form-item-style">
                  <span
                    class="jobskip"
                    @click="logDetailBtn(item.builedId,item.jobtaskId,item.runType,item)"
                  >{{item.name }}</span>
                </el-form-item>
                <el-form-item label="执行状态:" class="form-item-style">
                  <span v-if="scope.row.taskStatus===''">-</span>
                  <span
                    v-else
                    :class="statusFix(item.buildStatus)"
                  >{{ item.buildStatus | getStatus }}</span>
                </el-form-item>
                <el-form-item label="执行时间:" class="form-item-style">
                  <span v-if="scope.row.taskStatus!==''">{{item.duration | timeFormat }}</span>
                  <span v-else>-</span>
                </el-form-item>
                <el-form-item label="执行阶段:" class="form-item-style">
                  <span v-if="scope.row.buildStatus!==''">{{ getRunPhase(item) }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="执行状态" prop="taskStatus">
          <template slot-scope="scope">
            <span :class="statusFix(scope.row.taskStatus)">{{scope.row.taskStatus | getStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行次数" prop="sort">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="执行人" prop="createBy"></el-table-column>
        <el-table-column label="共执行时间" prop="deployDate">
          <template slot-scope="scope">{{scope.row.deployTime | timeFormat }}</template>
        </el-table-column>
        <el-table-column label="开始时间" prop="createDate"></el-table-column>
        <el-table-column label="操作" align="center" prop="operate" width="255px">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <el-tooltip class="item" effect="dark" content="发布日志" placement="top-start">
                <span class="special" @click="goTaskLog(scope.row.manageId,scope.row.hisId)">
                  <icon-svg icon-class="cha" />
                </span>
              </el-tooltip>
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
    </div>
  </div>
</template>

<script>
import axios from '@/api';
import common from '../../../utils/commonjs'
export default {
  name: 'ReleaseLog.vue',
  data () {
    return {
      search: {
        current: 1,
        size: 10,
        manageId: ''
      },
      total: 0,
      logs: [],
      manageId: ''
    }
  },
  created () {
    this.manageId = this.$route.query.id
    if (this.manageId) {
      this.search.manageId = this.manageId
      this._releaseLog()
    }
  },
  filters: {
    getStatus (val) {
      if (val === 'building') {
        return '执行中'
      } else if (val === 'SUCCESS') {
        return '执行成功'
      } else if (val === 'ABORTED') {
        return '手动结束'
      } else if (val === 'FAILURE') {
        return '执行失败'
      }
    },
    timeFormat (val) {
      return common.timer(val * 1000)
      // if (val) {
      //   val = parseInt(val)
      //   let hourse = Math.floor(val / 60 / 60)
      //   let minutes = Math.floor(val / 60)
      //   let seconds = val - hourse * 60 * 60 - minutes * 60

      //   return hourse ? `${hourse}时${minutes}分${seconds}秒` : `${minutes}分${seconds}秒`
      // } else {
      //   return '0分0秒'
      // }
    }
  },
  methods: {
    // 查看发布日志
    goTaskLog (manageId, hisId) {
      this.$router.push({
        path: '/AutomatedRelease/logDetail',
        query: {
          manageId: manageId,
          hisId: hisId,
          code: 3,
          type: 1,
          plantype: 1
        }
      })
    },
    statusFix (state) {
      if (state === 'building') {
        return 'build'
      } else if (state === 'SUCCESS') {
        return 'success'
      } else if (state === 'ABORTED') {
        return 'error'
      } else if (state === 'FAILURE') {
        return 'error'
      }
    },
    // 跳转查看执行
    logDetailBtn (builedId, jobId, dd, cc) {
      this.$router.push({
        path: '/AutomatedRelease/logDetail',
        query: {
          code: 3,
          jenkinsId: cc.jenkinsId,
          builedId: builedId,
          jobId: jobId,
          type: '1',
          plantype: '2'
        }
      })
    },
    getRunPhase (item) {
      let result = ''
      try {
        const taskStages = item.stages.stages
        result = taskStages[taskStages.length - 1].name
      } catch (err) {
        result = ''
      }
      return result
    },
    _releaseLog () {
      axios.releaseLog(this.search)
        .then(result => {
          if (result.data.code === 200) {
            this.logs = result.data.data.log.records
            this.total = parseInt(result.data.data.log.total)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCurrentChange (val) {
      this.search.current = val
      this._releaseLog()
    },
    handleSizeChange (val) {
      this.search.size = val
      this._releaseLog()
    },
    // 查看发布管理日志详情
    handleExpansion (row, expanded) {
      console.log(this.logs)

      axios.jobTasks(row.hisId)
        .then(res => {
          console.log(res)
          this.logs.forEach(item => {
            if (item.hisId === row.hisId) {
              item.jobtaskBuiled = res.data.data.jobTasks
            }
          })
        })
        .catch()
    }
  }
}
</script>

<style scoped>
.layout {
  padding: 10px;
}
.block {
  text-align: center;
  padding: 20px 0;
}
.jobskip {
  color: #0066ff;
  cursor: pointer;
  display: inline-block;
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
.form-item-style {
  width: 22%;
  text-align: center;
}
.build {
  color: orange;
}
.success {
  color: green;
}
.error {
  color: red;
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
  margin: 5px 0;
}
.task-btn-box span:hover {
  background: #0066ff;
}
.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
}
</style>
