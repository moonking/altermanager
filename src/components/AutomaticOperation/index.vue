<template>
  <div class="panel">
    <div class="panel-main">
      <div class="workbench aibms-bg non-shadow">
        <div class="panel-title white-color">
          <div>
            <span>待执行工单</span>
          </div>
          <div>
            <el-tooltip class="item" effect="dark" content="更多" placement="top">
              <span class="get-more" @click="goOperationWorkOrder">
                <icon-svg icon-class="duo" />
              </span>
            </el-tooltip>
          </div>
        </div>
        <div class="icon_box">
          <el-button-group>
            <el-button @click="changeWorkRange(1)" class="button-group">今日</el-button>
            <el-button @click="changeWorkRange(7)" class="button-group">本周</el-button>
            <el-button @click="changeWorkRange(30)" class="button-group">本月</el-button>
          </el-button-group>
        </div>
        <el-table
          :data="warehouseList"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="name" label="工单名称" />
          <el-table-column prop="environmentName" label="所属环境" />
          <el-table-column prop="runUserName" label="执行人" />
          <el-table-column prop="planStartTime" label="计划开始时间" />

          <el-table-column align="center" prop="address" label="操作">
            <template>
              <div class="btn-box">
                <el-dropdown>
                  <el-tooltip class="edit" effect="dark" content="更多" placement="top-start">
                    <span class="el-dropdown-link drop_down">
                      <icon-svg icon-class="gengduo" />
                    </span>
                  </el-tooltip>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>设置为自动提醒</el-dropdown-item>
                    <el-dropdown-item>设置为自动执行</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <!-- <div class="task-btn-box">
                <span
                class="special"

              >
                  <el-tooltip class="edit" effect="dark" content="设置为自动提醒" placement="top-start">
                    <img class="open" src="../../../../static/img/icon_time.png" alt />
                  </el-tooltip>
                </span>
                <span class="special">
                  <el-tooltip class="see" effect="dark" content="设置为自动执行" placement="top-start">
                    <img class="see" src="../../../../static/img/icon_warn.png" alt />
                  </el-tooltip>
                </span>
              </div>-->
            </template>
          </el-table-column>
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
          />
        </div>
      </div>
    </div>
    <div class="panel-bar">
      <div class="bar-item aibms-color-bg non-shadow">
        <div class="panel-title white-color">
          <div>
            <span>资源统计</span>
          </div>
          <div>
            <el-tooltip class="item" effect="dark" content="更多" placement="top">
              <span class="get-more" @click="goResourceManage">
                <icon-svg icon-class="duo" />
              </span>
            </el-tooltip>
          </div>
        </div>
        <ul class="panel-items">
          <li v-for="(item,index) in sources" :key="index" class="white-color">
            <span>
              <img :src="item.name | getPhoto " alt />
            </span>
            <span>{{item.name| getSourceName}}</span>
            <span>{{ item.countMumber }}个</span>
          </li>
        </ul>
      </div>
      <div class="bar-item aibms-color-bg non-shadow">
        <div class="panel-title white-color">
          <div>
            <span>健康检查</span>
          </div>
          <div>
            <el-select
              style="width: 150px;"
              class="workbench-select"
              size="mini"
              @change="_healthyTotal()"
              v-model="healthyDays"
              placeholder="请选择"
            >
              <el-option
                v-for="item in totalTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-tooltip class="item" effect="dark" content="更多" placement="top">
              <span class="get-more" @click="goHealthyReport">
                <icon-svg icon-class="duo" />
              </span>
            </el-tooltip>
          </div>
        </div>
        <ul class="panel-items">
          <li>
            <span>
              <icon-svg icon-class="jiankang" class="helath-icon" />
            </span>
            <span>{{ healthyResult.successCount }}个</span>
          </li>
          <li>
            <span>
              <icon-svg icon-class="bujiankang" class="unhelath-icon" />
            </span>
            <span>{{ healthyResult.failcount }}个</span>
          </li>
        </ul>
      </div>
      <div class="bar-item aibms-color-bg non-shadow">
        <div class="panel-title special white-color">
          <div>
            <span>我的工作量</span>
          </div>
          <div>
            <el-select
              style="width: 150px"
              class="workbench-select"
              size="mini"
              v-model="workSearch.days"
              @change="getWorksTotal"
              placeholder="请选择"
            >
              <el-option
                v-for="item in totalTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <!--<img class="get-more" src="../../../../static/img/get_more.png" alt="更多">-->
          </div>
        </div>
        <ul class="panel-items">
          <li v-for="(item,index) in works" :key="index">
            <span class="line">{{ item.name }}：{{ item.count }}</span>
            <span class="icon">
              <el-progress type="circle" :width="60" :percentage="item.sucessRate"></el-progress>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'Workbench',
  data () {
    return {
      warehouseList: [],
      total: 0,
      search: {
        current: 1,
        size: 10,
        days: 1
      },
      totalTime: [
        {
          label: '最近一天',
          value: '1'
        },
        {
          label: '最近一周',
          value: '7'
        }
      ],
      // 资源
      sources: [],
      works: [],
      healthyDays: '1',
      healthyResult: [],
      // 工作量查询条件
      workSearch: {
        days: '1'
      }
    }
  },
  mounted () {

  },
  created () {
    // 查询待执行运维工单
    this.waitForExecuteList()
    // 资源统计
    this.getSourcesTotal()
    // 工作量
    this.getWorksTotal()
    // 统计健康检查
    this._healthyTotal()
  },
  filters: {
    getSourceName (val) {
      if (val == 1) {
        return 'OS'
      } else if (val == 2) {
        return '中间件'
      } else if (val == 3) {
        return '数据库'
      } else if (val == 4) {
        return '网络设备'
      }
    },
    getPhoto (val) {
      return `../../../static/img/0${val}_icon.png`
    }
  },
  methods: {
    // 统计健康检查
    _healthyTotal () {
      axios.healthyTotal(this.healthyDays).then(result => {
        if (result.data.code === 200) {
          this.healthyResult = result.data.data[0]
        } else {
          this.$notify({
            type: 'error',
            title: '提示',
            message: result.data.message
          })
        }
      })
    },
    // 查看健康检查
    goHealthyReport () {
      this.$router.push({
        path: '/AutomaticOperation/healthIndex',
        query: {
          code: 4
        }
      })
    },
    // 查询待执行工单列表
    waitForExecuteList () {
      axios.waitForExecute(this.search).then(result => {
        if (result.data.code === 200) {
          this.warehouseList = result.data.data.records
          console.log(this.warehouseList)
          this.total = parseInt(result.data.data.total)
        }
      })
    },
    // 资源统计
    getSourcesTotal () {
      axios.sourceTotal().then(result => {
        if (result.data.code === 200) {
          this.sources = result.data.data
        }
      })
    },
    changeWorkRange (value) {
      this.search.days = value
      this.waitForExecuteList()
    },
    // 工作量
    getWorksTotal () {
      axios.workTotal(this.workSearch).then(result => {
        if (result.data.code === 200) {
          this.works = []
          result.data.data.forEach((item, index) => {
            let obj = {}
            if (item.name == 1) {
              obj.name = '流水线执行总数'
            } else {
              obj.name = '工单执行总数'
            }
            obj.count = parseInt(item.countMumber)
            obj.countSuccess = parseInt(item.sucessCount)
            if (!obj.count) { obj.sucessRate = 0 } else { obj.sucessRate = (obj.countSuccess / obj.count).toFixed(2) * 100 }
            this.works.push(obj)
          })
        }
      })
    },
    // 跳转到工单
    goOperationWorkOrder () {
      this.$router.push({
        path: '/AutomaticOperation/OperationWorkOrder',
        query: {
          code: 4
        }
      })
    },
    // 跳转到资源管理
    goResourceManage () {
      this.$router.push({
        path: '/AutomaticOperation/ResourceManage',
        query: {
          code: 4
        }
      })
    },
    // 分页
    handleCurrentChange (val) {
      this.search.current = val
      this.waitForExecuteList()
    },
    handleSizeChange (val) {
      this.search.size = val
      this.waitForExecuteList()
    }
  }
}
</script>

<style scoped>
.icon_more {
  width: 30px;
}
.panel {
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
}
.panel-main {
  flex: 1;
  padding: 0 20px 10px 0;
}
.panel-bar {
  width: 400px;
}
.workbench {
  box-shadow: 0 1px 4px #ccc;
  background: #fff;
  border-radius: 5px;
  padding: 20px;
}
.bar-item {
  box-shadow: 0 2px 6px #ddd;
  background: #fff;
  border-radius: 3px;
  padding: 10px 20px 30px;
}
.bar-item + .bar-item {
  margin-top: 10px;
}
.panel-title {
  line-height: 30px;
  color: #777777;
  font-size: 14px;
  overflow: hidden;
  font-weight: bold;
  display: flex;
}
.panel-title > div {
  flex: 1;
}
.panel-title .get-more {
  float: right;
  width: 15px;
  cursor: pointer;
  margin-top: 10px;
}
.block {
  text-align: center;
  padding: 20px 0 10px;
}
.panel-title.special {
}
.panel-items {
  border-bottom: 10px;
}
.panel-items li {
  display: flex;
  border-top: 1px solid #fafafa;
  border-bottom: 1px solid #fafafa;
  line-height: 50px;
}
.panel-items li + li {
  border-top: none;
  /*border-bottom: 1px solid #FAFAFA;*/
}
.panel-items li img {
  height: 30px;
  vertical-align: middle;
}
.panel-items li span {
  flex: 1;
  text-align: center;
}
.panel-items li .icon {
  padding-top: 10px;
}
.panel-items li .icon i {
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 60px;
  margin-top: 5px;
  border: 3px solid #49bc71;
  font-style: normal;
  overflow: hidden;
  font-size: 12px;
  line-height: 20px;
  color: #49bc71;
}
.panel-items .line {
  line-height: 90px;
  padding-top: 0 !important;
}
.icon_box {
  text-align: center;
  padding-bottom: 20px;
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
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
/* .task-btn-box span .edit:hover {
  content: url("../../../static/img/icon_item_.png");
  background-repeat: no-repeat;
}
.task-btn-box span .see:hover {
  content: url("../../../static/img/icon_warn_.png");
  background-repeat: no-repeat;
} */
.cm-btn-more {
  margin-top: 8px;
  border: 1px solid #d3d3d3;
  float: right;
  color: #a1a1a2 !important;
  background: #fff;
  border-radius: 3px;
  outline: none;
  font-size: 12px;
  padding: 3px 10px 3px 30px;
  background: url("/static/img/search02.png") no-repeat 10px center;
  background-size: 12px 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.cm-btn-more:hover {
  background: url("/static/img/icon/watch_hover.png") no-repeat 10px center !important;
  background-size: 12px !important;
  color: #0066ff !important;
}
.workbench-box_tchart .el-input__inner {
  line-height: 24px !important;
  height: 24px !important;
}

.workbench-box {
  /*background: #fff;*/
}
.workbench-box_item {
  background: #fff;
  border: 1px solid #d3d3d3;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  min-height: 200px;
}
.workbench-box_item + .workbench-box_item {
  margin-top: 20px;
}
.workbench-box_title {
  line-height: 40px;
  color: #777777;
  padding: 0 10px;
  border-bottom: 1px solid #d3d3d3;
  position: relative;
}
.workbench-box_item ul {
  padding: 10px;
  min-height: 100px;
  max-height: 220px;
}
.workbench-box_item ul li {
  color: #777777;
  font-size: 14px;
  line-height: 30px;
  min-height: 30px;
}
.workbench-box_item ul li + li {
  border-top: 1px solid #eee;
}

.workbench-box_item ul .workbench-list_content {
  max-width: 200px;
  overflow: hidden;
  text-wrap: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  float: left;
}
.workbench-box_item ul .workbench-list_date {
  float: right;
  color: #d0d0d0;
  font-size: 13px;
  position: relative;
}
.workbench-box_chart {
  height: 300px;
  width: 100%;
}
.workbench-box_tchart {
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  color: #777777;
  padding-top: 10px;
  position: relative;
}
.workbench-box_tchart .workbench-select {
  width: 100px;
  position: absolute;
  right: 20%;
  top: 10px;
}
.workbench-box_title .workbench-select {
  width: 180px;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  top: 0;
}
.cursor {
  cursor: pointer;
}
.block {
  text-align: center;
}
.successState {
  color: #0066ff;
}
.bg-img {
  width: 60px !important;
  height: 20px !important;
}
.font {
  font-size: 10px !important;
  position: absolute;
  top: -4px;
  left: 2px;
}
.font-more {
  font-size: 9px !important;
  position: absolute;
  top: -4px;
  left: 2px;
}
.errorState {
  color: #ff0000;
}
.waitState {
  color: #ff9b00;
}
.btn-box span {
  margin: 0 5px;
  cursor: pointer;
}
.btn-box span:hover {
  color: #0066ff;
}
</style>
