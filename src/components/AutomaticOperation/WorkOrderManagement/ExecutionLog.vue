<template>
  <div class="execution-log">
    <el-form :model="executeForm" :inline="true" class="formclass">
      <el-form-item>
        <el-input v-model="executeForm.name" placeholder="请输入工单名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="executeForm.state" placeholder="请选择执行状态" clearable>
          <el-option
            v-for="(exe,index) in executeState"
            :key="index"
            :label="exe.lab"
            :value="exe.val"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="executeForm.env" placeholder="请选择所属环境" clearable>
          <el-option
            v-for="env in envList"
            :value="env.environmentId"
            :label="env.name"
            :key="env.environmentId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="exe-search-btn overHideMargin">
        <el-button icon="el-icon-search" class="nomal-button" @click.prevent="searchOrder">查找</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="exeData"
      stripe
      style="width: 100%"
      empty-text="暂无数据"
      @row-click="watch"
      :header-cell-style="{ background: '#f5f5f5' }"
    >
      <el-table-column label="工单名称" prop="name" />
      <el-table-column label="执行环境" prop="environmentName" />
      <el-table-column label="开始时间" prop="jobStartTime" />
      <el-table-column label="共执行时间" prop="timeConsum" />
      <el-table-column label="执行人" prop="userName" />
      <el-table-column label="是否定时" prop="isTiming" :formatter="handleTimingState" />
      <el-table-column
        label="执行状态"
        align="center"
        prop="runStatus"
        :formatter="handleExecuteStatus"
      ></el-table-column>
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
           <div class="btn-box">
                <span @click="watch(scope.row.logId)">查看</span>
      </div>-->
      <!-- <div class="task-btn-box">
            <span class="special" @click="watch(scope.row.logId)">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <img class="see" src="../../../../static/img/seeblue.png" alt />
              </el-tooltip>
            </span>
      </div>-->
      <!-- </template>
      </el-table-column>-->
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[10,30,50]"
        :page-size="size"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        style="text-align: center;cursor: pointer;"
      />
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  data () {
    return {
      executeForm: {
        name: '',
        state: '',
        env: ''
      },
      exeData: [
        {
          name: 'test',
          env: 1,
          startTime: '2019-7-26 10:00:00',
          allTime: '1min',
          exeUser: 'xuchao',
          isTiming: 0,
          exeState: 'building'
        }
      ],
      executeState: [
        { lab: '执行成功', val: 0 },
        { lab: '未开始', val: 1 },
        { lab: '执行中', val: 2 }
      ],
      envList: [{ lab: '生产环境', val: 0 }, { lab: '开发测试环境', val: 1 }],
      currPage: 1,
      total: 0,
      size: 10
    }
  },
  created () {
    this.envtablist()
    let params = {
      name: '',
      environmentId: '',
      runStatus: '',
      current: this.currPage,
      size: this.size
    }
    this.logList(params)
  },
  methods: {
    // 查询
    searchOrder () {
      this.currPage = 1
      this.size = 10
      let params = {
        name: this.executeForm.name,
        environmentId: this.executeForm.env,
        runStatus: this.executeForm.state,
        current: this.currPage,
        size: this.size
      }
      this.logList(params)
    },
    // 获取日志列表
    logList (params) {
      axios.getLogList(params).then(res => {
        if (res.data.code === 200) {
          this.exeData = res.data.data.records
          this.total = res.data.data.total * 1
          this.$global.wsdevops.onmessage = this.handleWebsocketData
        }
      })
    },
    // 环境代号转文字
    handleEnv (row) {
      let label = ''
      for (let k of this.envList) {
        if (row.env === k.environmentId) {
          label = k.name
        }
      }
      return label
    },
    // 获取环境
    envtablist () {
      let data = {}
      axios.envtablist(data).then(res => {
        if (res.data.code === 200 && res.data.data.result) {
          if (res.data.code === 200) {
            this.envList = res.data.data.result
          }
        }
      })
    },
    // 定时状态代号转文字
    handleTimingState (row) {
      return row.isTiming === 1 ? '是' : '否'
    },
    // 执行状态代号转文字
    handleExecuteStatus (row) {
      return row.runStatus === 'SUCCESS'
        ? '执行成功'
        : row.runStatus === 'building'
          ? '执行中'
          : row.runStatus === 'FAILURE'
            ? '执行失败'
            : row.runStatus === 'ABORTED'
              ? '手动结束'
              : '未开始'
    },
    // 查看操作
    watch (row) {
      this.$router.push({
        path: '/AutomaticOperation/ExecuteWorkOrder',
        query: {
          code: 4,
          logId: row.logId,
          key: 'detail'
        }
      })
    },
    // 切换size
    handleSizeChange (size) {
      this.size = size
      let params = {
        name: this.executeForm.name,
        environmentId: this.executeForm.env,
        runStatus: this.executeForm.state,
        current: this.currPage,
        size: this.size
      }
      this.logList(params)
    },
    // 切换页
    handleCurrentChange (page) {
      this.currPage = page
      let params = {
        name: this.executeForm.name,
        environmentId: this.executeForm.env,
        runStatus: this.executeForm.state,
        current: this.currPage,
        size: this.size
      }
      this.logList(params)
    },
    handleWebsocketData (msg) {
      const data = JSON.parse(msg.data) || {}
      for (let k of this.exeData) {
        if (k.logId === data.logId) {
          this.$set(k, 'runStatus', data.runStatus)
        }
      }
    }
  }
}
</script>
<style scoped>
.execution-log {
  width: 98%;
  margin-left: 1%;
}
.exe-search-btn {
  float: right;
}
.task-btn-box span {
  display: inline-block;
  background: #fff;
  border: 1px solid #0066ff;
  line-height: 24px;
  /* padding: 0 8px; */
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
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
.block {
  margin-top: 20px;
}
.btn-box span {
  margin: 0 5px;
  cursor: pointer;
}
.btn-box span:hover {
  color: #0066ff;
}
.formclass {
  padding-top: 10px;
  /* padding-bottom: 10px; */
}
.formclass /deep/ .overHideMargin {
  margin-right: 0 !important;
}
.el-pagination {
  margin-top: 92px;
}
</style>
