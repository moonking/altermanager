<template>
  <div class="table-expand-tr">
    <div class="expand-row-top">
      <div class="left-part">
        <span class="left-part-font">最近一次发布</span>
        <span class="left-part-time" v-if="expandInfo.time">{{expandInfo.time}}</span>
        <span class="left-part-time" v-else>-</span>
        <span
          class="status-tag"
          :class="filterStatus(expandInfo.status)"
        >{{getRunStatus(expandInfo.status)}}</span>
      </div>
      <el-button class="right-part" plain size="mini" @click="goTaskLog(manageId)">查看发布日志</el-button>
    </div>
    <div class="expand-content-box">
      <div class="pipeline-info" v-for="(pipe,index) in expandInfo.expandList" :key="index">
        <el-row :gutter="8" class="expand-content-item">
          <el-col :span="8">
            <label>流水线名称：</label>
            <span class="pipeline-name">{{pipe.name}}</span>
            <el-button
              class="expand-content-btn"
              plain
              size="mini"
              @click="logDetailBtn(pipe.buildId, pipe.jobId, pipe.jenkinsId)"
            >查看流水日志</el-button>
          </el-col>
          <el-col :span="4">
            <label>所属应用：</label>
            <span>{{pipe.systemName}}</span>
          </el-col>
          <el-col :span="4">
            <label>执行状态：</label>
            <span
              class="status-tag"
              :class="filterStatus(pipe.buildStatus)"
            >{{getRunStatus(pipe.buildStatus)}}</span>
          </el-col>
          <el-col :span="8">
            <label>制品版本：</label>
            <span>201911138989cc</span>
          </el-col>
        </el-row>
        <el-row :gutter="8" class="expand-content-item">
          <el-col :span="8">
            <label>制品包：</label>
            <span>test_hua-2019121212.zip</span>
          </el-col>
          <el-col :span="4">
            <label>执行时间：</label>
            <span>{{pipe.duration | timeFormat}}</span>
          </el-col>
          <el-col :span="4">
            <label>jenkinsFile：</label>
            <el-button
              plain
              size="mini"
              class="expand-content-btn"
              @click="handleOpenJenkins(pipe.jenkinsFile)"
            >
              <i class="el-icon-document"></i>
              预览
            </el-button>
          </el-col>
          <el-col :span="8">
            <label>执行阶段：</label>
            <span>{{ getRunPhase(pipe.stages) }}</span>
            <span>-</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
import common from '../../../utils/commonjs'
export default {
  name: 'expandli',
  data () {
    return {
      expandInfo: {}
    }
  },
  props: {
    manageId: {
      type: String,
      default: ''
    }
  },
  watch: {
    manageId (newVal) {
      if (newVal) {
        this.handleExpand(newVal)
      }
    }
  },
  filters: {
    timeFormat (val) {
      return common.timer(val)
    }
  },
  created () {
    this.handleExpand(this.manageId)
  },
  methods: {
    // 根据执行状态改变颜色
    filterStatus (item) {
      let result = ''
      switch (item) {
        case 'FAILURE':
          result = 'error-tag'
          break
        case 'SUCCESS':
          result = 'success-tag'
          break
        case 'building':
          result = 'wraning-tag'
          break
        default:
          result = ''
          break
      }
      return result
    },
    getRunStatus (item) {
      let result = ''
      switch (item) {
        case 'FAILURE':
          result = '失败'
          break
        case 'SUCCESS':
          result = '成功'
          break
        case 'building':
          result = '发布中'
          break
        default:
          result = '未发布'
          break
      }
      return result 
    },
    // 查看执行日志
    goTaskLog (id) {
      this.$router.push({
        path: '/AutomatedRelease/releaseLog',
        query: {
          code: 3,
          id: id
        }
      })
    },
    // 跳转查看执行
    logDetailBtn (id, di, jenkinsId) {
      this.$router.push({
        path: '/AutomatedRelease/logDetail',
        query: {
          code: 3,
          hisId: this.expandInfo.hisId,
          builedId: id,
          manageId: this.expandInfo.manageId,
          jobId: di,
          type: '1',
          plantype: '2',
          jenkinsId: jenkinsId
        }
      })
    },
    // 执行阶段获取
    getRunPhase (item) {
      let result = []
      try {
        item.stages.forEach(node => {
          result.push(node.name)
        })
      } catch (err) {
        result = []
      }
      return result.join(',')
    },
    // 获取流水线
    handleExpand (manageId) {
      axios.pipelineByList(manageId).then(res => {
        if (res.data.code === 200) {
          let obj = {}
          obj.expandList = res.data.data.jobTasks
          obj.time = res.data.data.runTime
          obj.status = res.data.data.runStatus
          obj.hisId = res.data.data.hisId
          obj.manageId = manageId
          this.expandInfo = obj
          console.log(this.expandInfo)
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    handleOpenJenkins (file) {
      this.$emit('visibal', file)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-expand-tr {
  background: #fff !important;
  /*设置展开行的标题样式*/
  .expand-row-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 10px 0;
    .left-part {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      align-items: center;
      span {
        margin: 0 20px;
      }
      .left-part-font {
        font-size: 18px;
        font-weight: bold;
      }
      .left-part-time {
        font-size: 14px;
        color: #909399;
      }
    }
    .right-part {
      margin-right: 20px;
    }
  }
  .expand-content-box {
    padding: 0 40px;
    .pipeline-info {
      margin-top: 10px;
      border-bottom: 1px solid #e0e0e0;

      &:last-child {
        border: none;
      }

      .expand-content-item {
        padding-bottom: 20px;
        font-size: 12px;
      }
      .pipeline-name {
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .expand-content-btn {
      padding: 5px 10px !important;
    }
  }
  .status-tag {
    color: #909399;
    background: #f4f4f5;
    border: 1px solid #d3d4d6;
    padding: 2px 10px;
    border-radius: 5px;
  }
  .success-tag {
    color: #67c23a;
    background: #f0f9eb;
    border-color: #67c23a;
  }
  .error-tag {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #f56c6c;
  }
  .wraning-tag {
    color: #e6a23c;
    background: #fdf6ec;
    border-color: #e6a23c;
  }
}
</style>
