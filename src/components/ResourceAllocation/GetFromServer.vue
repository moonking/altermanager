<template>
  <div class="containBox layout-box aibms-bg aibms-role">
    <!--<div class="
    "></div>-->
    <GetFromServerDialog @getTaskList="getTaskList" ref="showDialog" />
    <el-row :gutter="20" type="flex" style="align-items:center">
      <el-col :span="5">
        <el-input v-model="name" placeholder="请输入任务名称" clearable></el-input>
      </el-col>

      <el-col :span="20" class="search-wrapper item-right">
        <!-- <el-button type="primary" icon="el-icon-search" @click="searchByKey">查找</el-button> -->
        <!-- <el-button @click="addTask" type="warning">+ 新建任务</el-button> -->
        <el-button icon="el-icon-search" class="nomal-button" @click="searchByKey">查找</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click.prevent="addTask"
        >新增</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding:20px 10px;">
      <el-table
        :data="CiDataList"
        stripe
        :header-cell-style="{background:'#f5f5f5'}"
        center="true"
      >
        <el-table-column label="任务名称">
          <template slot-scope="scope">
            <span v-html="scope.row.name"></span>
          </template>
        </el-table-column>
        <el-table-column prop="taskType" label="获取方式" />
        <el-table-column prop="lastRunDate" label="最后执行时间" />
        <el-table-column prop="lastRunStatus" label="最后执行状态" />
        <el-table-column type="index" label="状态" align="center" width="80">
          <template slot-scope="scope">
            <!--<el-switch-->
            <!--v-model="scope.row.status"-->
            <!--active-color="#169bd5"-->
            <!--inactive-color="#009900">-->
            <!--</el-switch>-->
            <span
              class="switch"
              :class="scope.row.openStatus == 2 ? 'active': '' "
              @click="toggleSwitch(scope.$index)"
            >
              <i></i>
              <b class="text-left" v-if="scope.row.openStatus == 2">ON</b>
              <b class="text-right" v-else>OFF</b>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="editTask(scope.row.citaskId,'detail')">
                <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                  <icon-svg icon-class="chakan" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="editTask(scope.row.citaskId,'edit')">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <icon-svg icon-class="bianji" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="showDeleteSel(scope.row.citaskId)">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <icon-svg icon-class="shanchu" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          style="cursor: pointer;"
        ></el-pagination>
      </div>
    </el-row>

    <el-dialog center :visible.sync="dialogVisibleDelete" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisibleDelete = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="deleteSel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import GetFromServerDialog from './GetFromServerDialog.vue'
export default {
  name: 'GetFromServer',
  data () {
    return {
      dialogVisibleDelete: false,
      deleteCiTaskId: '',
      currPage: 1,
      name: '',
      ischeck: false,
      way: '',
      size: 10,
      total: 1,
      page: false,
      CiDataList: [],
      sourceType: [
        { label: '服务器获取', value: '1' },
        { label: 'zabbix', value: '2' },
        { label: 'prometheus', value: '3' }
      ]
    }
  },
  components: {
    GetFromServerDialog: GetFromServerDialog
  },
  created () {
    this.getTaskList()
  },
  methods: {
    showDeleteSel (id) {
      this.dialogVisibleDelete = true
      this.deleteCiTaskId = id
    },
    getTaskList () {
      let data = {}
      data.current = this.currPage
      data.size = this.size
      data.name = this.name.trim()
      let _this = this
      axios.getTaskList(data).then(res => {
        if (res.data.code === 200) {
          res.data.data.result.records.forEach(item => {
            _this.sourceType.forEach(itemMin => {
              if (item.taskType == itemMin.value) {
                item.taskType = itemMin.label
              }
            })
            if (item.lastRunStatus == 1) {
              item.lastRunStatus = ''
            } else if (item.lastRunStatus == 2) {
              item.lastRunStatus = '成功'
            }
          })
          _this.total = parseInt(res.data.data.result.total)
          _this.CiDataList = res.data.data.result.records
        } else {
          this.$notify({
            title: '提示',
            message: '获取数据失败',
            type: 'warning'
          })
        }
        // CiDataList
      })
    },
    searchByKey () {
      this.currPage = 1
      this.getTaskList()
    },
    // 分页
    handleCurrentChange (val) {
      this.currPage = val
      this.getTaskList()
    },
    handleSizeChange (val) {
      this.size = val
      this.getTaskList()
    },
    searchCitype () { },
    toggleSwitch (index) {
      let _this = this
      let tmp = this.CiDataList[index].openStatus
      if (this.CiDataList[index].openStatus == 1) {
        this.CiDataList[index].openStatus = 2
      } else {
        this.CiDataList[index].openStatus = 1
      }
      axios.changeStatus(this.CiDataList[index].citaskId, tmp).then(res => {
        if (res.data.code === 200) {
          let status = ''
          if (this.CiDataList[index].openStatus == 2) {
            status = '开启'
          } else {
            status = '关闭'
          }
          _this.$notify({
            title: '提示',
            message: `${status}成功`,
            type: 'success'
          })
        } else {
          _this.$notify({
            title: '提示',
            message: '操作失败，请检查网络！',
            type: 'error'
          })
        }
      })
    },
    deleteSel () {
      let id = this.deleteCiTaskId
      let _this = this
      axios.deleteTask(id).then(res => {
        if (res.data.code === 200) {
          _this.$notify({
            title: '提示',
            message: '删除成功！',
            type: 'success'
          })
          _this.getTaskList()
          this.dialogVisibleDelete = false
        } else {
          _this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(e => {
        _this.$notify({
          title: '错误',
          message: '删除出错，请稍后重试',
          type: 'error'
        })
      })
    },
    addTask () {
      this.$refs.showDialog.openDialog(null, 'add')
    },
    editTask (dataRow, key) {
      this.$refs.showDialog.openDialog(dataRow, key)
    }
  }
}
</script>

<style scoped>
.search-wrapper {
  text-align: right;
}
.btn-fr {
  float: right;
}
.layout-box {
  background: #fff;
  padding: 20px 20px 5px 20px;
  margin: 10px;
}
.block {
  text-align: center;
  width: 100%;
  padding-top: 92px;
}
.el-switch__core:after {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  border-radius: 100%;
  transition: all 0.3s;
  width: 16px;
  height: 16px;
  background-color: #fff;
}
.switch {
  width: 50px;
  height: 20px;
  border-radius: 20px;
  background: gray;
  display: inline-block;
  position: relative;
  cursor: pointer;
}
.switch b {
  display: block;
  font-size: 12px;
  color: #fff;
  padding: 0 5px;
}
.switch b.text-left {
  text-align: left;
}
.switch b.text-right {
  text-align: right;
}
.switch i {
  display: inline-block;
  position: absolute;
  top: 1px;
  left: 1px;
  border-radius: 100%;
  transition: all 0.3s;
  width: 18px;
  height: 18px;
  background-color: #fff;
}
.switch.active {
  background: #00d1b2;
}
.switch.active i {
  animation: switch 0.1s forwards;
}
@keyframes switch {
  from {
    left: 0px;
  }
  to {
    left: 30px;
  }
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
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
</style>
