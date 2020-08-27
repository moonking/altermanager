<template>
  <div class="deploy">
    <div class="deploy-title">{{ jobDetail.name }}</div>
    <p class="deploy-waring white-color">
      <icon-svg icon-class="jinggao" />列表中展示了该任务的所有参数
      <span class="deploy-btn" v-if="jobDetail.applyStatus == 0" @click="goExecute">执行</span>
      <span class="deploy-btn" v-else @click="goExecute">测试执行</span>
    </p>
    <div class="node-title" v-for="item in variableList" :key="item.id">
      <!-- <p class="marg10 cursorp"    @click="item.isbl=!item.isbl">
        <span ></span>
        {{item.actNodeName}}
        <i
          :class="item.isbl ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'"

        ></i>
      </p>-->
      <div class="item-block-title paddingTop" @click="openDetail = !openDetail">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">{{item.actNodeName}}</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: openDetail ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <el-row v-if="openDetail">
        <el-table
          :data="item.tmpArr"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="name" label="参数标题名称"></el-table-column>
          <el-table-column prop="type" label="参数类型">
                <template slot-scope="scope">{{ scope.row.type | typeStatusFilter }}</template>
              </el-table-column>
          <el-table-column prop="explain" label="参数说明"></el-table-column>
          <el-table-column prop="value" label="参数值"></el-table-column>
        </el-table>
        <div class="page-limit" style="text-align:right;margin-top:15px">
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
  </div>
</template>

<script>
import axios from '@/api';
import common from '@/utils/commonjs'
export default {
  name: 'FastDeploy',
  data () {
    return {
      page: 1,
      currentJobId: '',
      variableList: [],
      jobDetail: {},
      currPage: 1,
      size: 10,
      total: 0,
      openDetail: true
    }
  },
  filters: {
    typeStatusFilter: (status) => {
      const typeListMap = {
        '0': '字符',
        '1': '布尔',
        '2': '等号连接参数',
        '3': '位置参数'
      }
      return typeListMap[status]
    }
  },
  created () {
    this.currentJobId = this.$route.query.jobId
    this.getNodeParam()
    this.getJobDetail()
  },
  methods: {
    // 获取部署任务参数
    getNodeParam () {
      let data = {}
      data.current = this.currPage
      data.size = this.size
      data.jobId = this.currentJobId
      data.actNodeId = ''
      axios.getNodeParam(data).then(response => {
        if (response.data.code === 200) {
          console.log(response)
          this.variableList = []
          let tmpArr = []
          this.total = parseInt(response.data.data.total)
          response.data.data.records.forEach((item, index) => {
            this.variableList.push({
              tmpArr: tmpArr.concat(common.evil(item.inputParam)),
              actNodeName: item.actNodeName,
              isbl: !!(index == 0 || index == 1)
            })
          })
        } else {
          this.$notify({
            title: '提示',
            message: response.data.message,
            type: 'error'
          })
        }
      })
    },
    // 分页
    handleCurrentChange (val) {
      this.currPage = val
      this.getNodeParam()
      // this.getBackspaceList();
    },
    handleSizeChange (val) {
      this.size = val
      this.getNodeParam()
      // this.getBackspaceList();
    },
    // 查询执行任务详情
    getJobDetail () {
      axios.getJobDetail(this.currentJobId).then(response => {
        console.log(response)
        if (response.data.status.index == 200) {
          this.jobDetail = response.data.jobInfo
        } else {
          this.$notify({
            title: '提示',
            message: response.data.status.info,
            type: 'error'
          })
        }
      })
    },

    // 执行任务
    goExecute () {
      axios.buildJob(this.currentJobId).then(data => {
        // console.log(data.data.data)
        if (data.data.code == 200) {
          this.$router.push({
            path: '/AutomatedRelease/ExecuteTask',
            query: {
              jenkinsId: this.jobDetail.jenkinsId,
              code: 3,
              builedId: data.data.data.builedId,
              jobId: this.currentJobId,
              type: '1',
              plantype: '2'
            }
          })
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.block {
  padding: 20px 0;
  text-align: center;
}
.deploy {
  padding: 10px 20px;
}
.deploy-title {
  color: #3e444a;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  line-height: 40px;
  padding: 0 20px;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.16);
}
.deploy-waring {
  color: #3e444a;
  font-size: 14px;
  line-height: 40px;
  padding: 0 0 0 20px;
}
.deploy-waring img {
  vertical-align: text-bottom;
  margin-right: 10px;
}
span.deploy-btn {
  float: right;
  background: #00A8E8;
  border: 1px solid #00A8E8;
  line-height: 24px;
  padding: 0 20px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  margin: 10px 0;
}
.cursorp {
  cursor: pointer;
}
.marg10 {
  margin: 10px 0;
}
</style>
