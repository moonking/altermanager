<template>
  <div class="node-layout">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input v-model="nodeName" placeholder="请输入流水线名称" clearable></el-input>
      </el-col>
      <el-col :span="4">
        <el-select clearable style="width: 100%" v-model="runStatus" placeholder="请选择执行状态">
          <el-option
            v-for="(item,index)  in systemTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select placeholder="请选择所属环境" v-model="environmentId" :clearable="true">
          <el-option
            v-for="environmental in environmentals"
            :label="environmental.label"
            :value="environmental.value"
            :key="environmental.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="12" class="search-wrapper">
        <el-button icon="el-icon-search" class="common-btn-style" @click="searchByKey">查找</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding:30px 10px;">
      <el-table
        :data="logList"
        style="background:#fff"
        center="true"
        :header-cell-style="{ background: '#f5f5f5' }"
        :default-sort="{prop: 'pipeStartTime', order: 'descending'}"
        @row-click="editNode"
      >
        <el-table-column prop="name" label="流水线名称" align="center"></el-table-column>
        <el-table-column prop="environmentName" label="执行环境" align="center"></el-table-column>
        <el-table-column prop="source" label="来源" align="center"></el-table-column>
        <el-table-column prop="pipeStartTime" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="timeConsum" label="共执行时间" align="center"></el-table-column>
        <el-table-column prop="userName" label="执行人" align="center"></el-table-column>
        <el-table-column prop="runStatus" label="执行状态">
          <template slot-scope="scope">{{ scope.row.runStatus | getStatus}}</template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="editNode(scope.row)">
                <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                  <img class="see" src="../../../../static/img/seeblue.png" alt />
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="page-limit">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          style="margin-right:15px;cursor: pointer;"
        ></el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'PerformLog',
  data () {
    return {
      environmentId: '',
      environmentals: [],
      runStatus: '',
      //  notice: '',
      isbl: false,
      nodeName: '',
      systemId: '',
      currPage: 1,
      name: '',
      way: '',
      dialogVisible: false,
      size: 10,
      total: 0,
      page: false,
      fileList: [],
      data: { nodeId: '' },
      nodeUse: [
        { label: '测试', value: '1' },
        { label: '正式', value: '2' }
      ],
      logList: [],
      systemTypes: [
        {
          value: 'building',
          label: '执行中'
        },
        {
          value: 'SUCCESS',
          label: '执行成功'
        },
        {
          value: 'FAILURE',
          label: '执行失败'
        },
        {
          value: 'ABORTED',
          label: '手动结束'
        }
      ],
      clusterList: [],
      clusterId: '',
      tableChecked: []
    }
  },

  created () {
    this.getpipelineLogList()
    this.envtablist()
    this.nodeName = this.$route.query.name
  },
  filters: {
    getStatus (val) {
      if (val === 'building') return '执行中'
      else if (val === 'SUCCESS') return '执行成功'
      else if (val === 'ABORTED') return '手动结束'
      else if (val === 'FAILURE') return '执行失败'
    }
  },
  watch: {},
  methods: {
    // 获取列表
    getpipelineLogList (isbl) {
      let query = this.$route.query
      if (query.name) {
        this.nodeName = query.name
      }
      let data = {
        name: this.nodeName,
        environmentId: this.environmentId,
        runStatus: this.runStatus,
        current: this.currPage,
        size: this.size
      }
      this.logList = []
      axios.getpipelineLogList(data).then(data => {
        console.log(data)

        if (data.data.code === 200) {
          data.data.data.records.forEach(item => {
            if (item.timeConsum !== '') {
              item.timeConsum = item.timeConsum + 's'
            } else {
              item.timeConsum = '-'
            }

            if (item.remarks == '4') {
              item.source = '模板'
            } else if (item.remarks == '3') {
              item.source = '流水线'
            }
          })
          this.logList = data.data.data.records
          this.total = Number(data.data.data.total)
          this.$global.wsdevops.onmessage = this.handleWebsocketData
        } else {
          this.$notify({
            title: '错误',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    // 获取环境下拉列表
    envtablist () {
      let data = {
        name: ''
      }
      axios.envtablist(data).then(res => {
        if (res.data.code === 200 && res.data.data.result) {
          // console.log(res)
          res.data.data.result.forEach(item => {
            this.environmentals.push({
              value: item.environmentId,
              label: item.name
            })
          })
        }
      })
    },
    // 查看详情
    editNode (row) {
      let type
      if (row.source == '流水线') {
        type = 3
      } else {
        type = 4
      }
      this.$router.push({
        path: '/AutomaticOperation/LogDetail',
        query: {
          code: 4,
          type: type,
          logId: row.logId,
          key: 'detail'
        }
      })
    },
    searchByKey () {
      this.currPage = 1
      this.getpipelineLogList()
    },
    // 分页
    handleCurrentChange (val) {
      this.currPage = val
      this.getpipelineLogList()
    },
    handleSizeChange (val) {
      this.size = val
      this.getpipelineLogList()
    },
    addNode () {
      this.$router.push({
        path: '/AutomatedRelease/NodeAdd',
        query: { code: 3 }
      })
    },
    handleSelectionChange (val) {
      this.tableChecked = val
    },
    handleRemove (file, fileList) { },
    handlePreview (file) {
      this.resid = file.uid
    },
    handleClose () {
      this.dialogVisible = false
    },
    handleWebsocketData (msg) {
      const data = JSON.parse(msg.data) || {}
      for (let k of this.logList) {
        if (k.logId === data.logId) {
          this.$set(k, 'runStatus', data.runStatus)
        }
      }
    }
  }
}
</script>

<style scoped>
.node-layout {
  padding: 10px 10px;
}
.page-limit {
  text-align: center;
  margin: 40px 0 20px;
}
.search-wrapper {
  padding-top: 5px;
}
.center {
  text-align: center;
  padding: 5px 10px;
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
  /* padding: 0 8px; */
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
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
.titleNotice p {
  color: #3e444a;
  padding: 3px 0;
  width: 80%;
}
.right {
  position: absolute;
  right: 5px;
  font-size: 14px;
}
.searbtn {
  float: right;
}
</style>
