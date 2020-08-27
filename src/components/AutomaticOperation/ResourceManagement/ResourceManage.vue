<template>
  <div class="resource-manage">
    <el-row>
      <el-form :inline="true" :model="searchres" class="form-list">
        <el-form-item>
          <el-input placeholder="请输入资源名称" v-model="searchres.name"></el-input>
        </el-form-item>
        <el-form-item class="form-select">
          <el-select v-model="resType" placeholder="请选择资源类型" :clearable="true">
            <el-option
              v-for="type in resourceTypes"
              :label="type.label"
              :value="type.value"
              :key="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-select">
          <el-select placeholder="请选择所属环境" v-model="searchres.environmentId" :clearable="true">
            <el-option
              v-for="environmental in environmentals"
              :label="environmental.label"
              :value="environmental.value"
              :key="environmental.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="add-btn">
          <el-button icon="el-icon-search" class="nomal-button" @click.stop="searchList">查询</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="margin-left-btn"
            @click.prevent="goResource('create')"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div class="panel">
      <el-tabs v-model="pageStates" @tab-click="getList">
        <el-tab-pane label="OS" name="1">
          <el-table
            :data="resourceList"
            style="width: 100%;"
            :header-cell-style="{ background: '#f5f5f5' }"
            @row-click="readResource"
          >
            <el-table-column prop="name" label="资源名称" width="180" />
            <el-table-column prop="ipAddress" label="IP地址" width="180" />
            <el-table-column prop="environmentName" label="所属环境" width="180" />
            <el-table-column prop="supTools" label="可用工具集" width="230">
              <template slot-scope="scope">{{scope.row.supTools | filterTools}}</template>
            </el-table-column>
            <el-table-column prop="healthStatus" label="健康状态" width="180">
              <template slot-scope="scope">{{scope.row.healthStatus | getHealthyStatus}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="btn-box">
                  <!-- <span @click="readResource('read',scope.row.resourcesId)">查看</span> -->
                  <span @click.stop="resourceReport(scope.row.resourcesId)">报告</span>
                  <span @click.stop="editResource('edit',scope.row.resourcesId)">编辑</span>
                  <span @click.stop="delResource(scope.row)">删除</span>
                </div>
                <!-- :header-cell-style="{background:'#f5f5f5',color:'#2a2f55'}" -->
                <!-- <div class="task-btn-box">
                           <span class="special" @click="readResource('read',scope.row.resourcesId)">
                            <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                              <img class="see" src="../../../../static/img/seeblue.png" alt />
                            </el-tooltip>
                          </span>
                          <span class="special" @click="readResource('edit',scope.row.resourcesId)">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                              <img class="edit" src="../../../../static/img/editblue.png" alt />
                            </el-tooltip>
                          </span>
                          <span class="special" @click="delResource(scope.row)">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                              <img class="del" src="../../../../static/img/delblue.png" alt />
                            </el-tooltip>
                          </span>
                </div>-->
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleOsSizeChange"
              @current-change="handleOsCurrentChange"
              :current-page="searchres.current"
              :page-sizes="[10,30,50]"
              layout="prev, pager, next, sizes, total, jumper"
              :total="total"
              v-if="total"
              style="cursor: pointer;"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="中间件" name="2">
          <el-table
            :data="resourceList"
            style="width: 100%;"
            :header-cell-style="{ background: '#f5f5f5' }"
            @row-click="readResource"
          >
            <el-table-column prop="name" label="资源名称" width="180" />
            <el-table-column prop="ipAddress" label="IP地址" width="180" />
            <el-table-column prop="environmentName" label="所属环境" width="180" />
            <el-table-column prop="supTools" label="可用工具集" width="230">
              <template slot-scope="scope">{{scope.row.supTools | filterTools}}</template>
            </el-table-column>
            <el-table-column prop="healthStatus" label="健康状态" width="180">
              <template slot-scope="scope">{{scope.row.healthStatus | getHealthyStatus}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="btn-box">
                  <!-- <span @click="readResource('read',scope.row.resourcesId)">查看</span> -->
                  <span @click.stop="resourceReport(scope.row.resourcesId)">报告</span>
                  <span @click.stop="editResource('edit',scope.row.resourcesId)">编辑</span>
                  <span @click.stop="delResource(scope.row)">删除</span>
                </div>
                <!-- <div class="task-btn-box">
                           <span class="special" @click="readResource('read',scope.row.resourcesId)">
                            <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                              <img class="see" src="../../../../static/img/seeblue.png" alt />
                            </el-tooltip>
                          </span>
                          <span class="special" @click="readResource('edit',scope.row.resourcesId)">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                              <img class="edit" src="../../../../static/img/editblue.png" alt />
                            </el-tooltip>
                          </span>
                          <span class="special" @click="delResource(scope.row)">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                              <img class="del" src="../../../../static/img/delblue.png" alt />
                            </el-tooltip>
                          </span>
                </div>-->
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleOsSizeChange"
              @current-change="handleOsCurrentChange"
              :current-page="searchres.current"
              :page-sizes="[10,30,50]"
              layout="prev, pager, next, sizes, total, jumper"
              :total="total"
              v-if="total"
              style="cursor: pointer;"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据库" name="3">
          <el-table
            :data="resourceList"
            style="width: 100%;"
            :header-cell-style="{ background: '#f5f5f5' }"
            @row-click="readResource"
          >
            <el-table-column prop="name" label="资源名称" width="180" />
            <el-table-column prop="ipAddress" label="IP地址" width="180" />
            <el-table-column prop="portNum" label="端口号" width="180" />
            <el-table-column prop="instanceName" label="实例名" />
            <el-table-column prop="supTools" label="可用工具集" width="230">
              <template slot-scope="scope">{{scope.row.supTools | filterTools}}</template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="healthStatus" label="健康状态" width="180">
                   <template slot-scope="scope">{{scope.row.healthStatus | getHealthyStatus}}</template>
            </el-table-column>-->
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="btn-box">
                  <!-- <span @click="readResource('read',scope.row.resourcesId)">查看</span> -->
                  <span @click.stop="resourceReport(scope.row.resourcesId)">报告</span>
                  <span @click.stop="editResource('edit',scope.row.resourcesId)">编辑</span>
                  <span @click.stop="delResource(scope.row)">删除</span>
                </div>
                <!-- <div class="task-btn-box">
                           <span class="special" @click="readResource('read',scope.row.resourcesId)">
                            <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                              <img class="see" src="../../../../static/img/seeblue.png" alt />
                            </el-tooltip>
                          </span>
                          <span class="special" @click="readResource('edit',scope.row.resourcesId)">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                              <img class="edit" src="../../../../static/img/editblue.png" alt />
                            </el-tooltip>
                          </span>
                          <span class="special" @click="delResource(scope.row)">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                              <img class="del" src="../../../../static/img/delblue.png" alt />
                            </el-tooltip>
                          </span>
                </div>-->
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleOsSizeChange"
              @current-change="handleOsCurrentChange"
              :current-page="searchres.current"
              :page-sizes="[10,30,50]"
              layout="prev, pager, next, sizes, total, jumper"
              :total="total"
              v-if="total"
              style="cursor: pointer;"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="网络设备" name="4">
          <el-table
            :data="resourceList"
            style="width: 100%;"
            :header-cell-style="{ background: '#f5f5f5' }"
            @row-click="readResource"
          >
            <el-table-column prop="name" label="资源名称" width="180"></el-table-column>
            <el-table-column prop="ipAddress" label="IP地址" width="180"></el-table-column>
            <el-table-column prop="environmentName" label="所属环境" width="180"></el-table-column>
            <el-table-column prop="supTools" label="可用工具集" width="230">
              <template slot-scope="scope">{{scope.row.supTools | filterTools}}</template>
            </el-table-column>
            <el-table-column prop="healthStatus" label="健康状态" width="180">
              <template slot-scope="scope">{{scope.row.healthStatus | getHealthyStatus}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="btn-box">
                  <!-- <span @click="readResource('read',scope.row.resourcesId)">查看</span> -->
                  <span @click.stop="resourceReport(scope.row.resourcesId)">报告</span>
                  <span @click.stop="editResource('edit',scope.row.resourcesId)">编辑</span>
                  <span @click.stop="delResource(scope.row)">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleOsSizeChange"
              @current-change="handleOsCurrentChange"
              :current-page="searchres.current"
              :page-sizes="[10,30,50]"
              layout="prev, pager, next, sizes, total, jumper"
              :total="total"
              v-if="total"
              style="cursor: pointer;"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog center title="删除提示" :visible.sync="confirmDeleteDialogVisible" width="25%">
      <div style="text-align: center">
        <i class="el-icon-warning"></i> 确定要删除这个发布任务吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDeleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'健康检查报告'" :visible.sync="dialogVisible" width="50%" center>
      <div class="main-info">
        <el-form class="item-box" size="mini" label-width="120px">
          <el-form-item class="item" label="检查类型：">{{ resultInfo.checkType | checkType }}</el-form-item>
          <el-form-item class="item" label="检查时间：">{{ resultInfo.checkDate }}</el-form-item>
          <el-form-item class="item" label="IP地址：">{{ resultInfo.ipAddress }}</el-form-item>
          <el-form-item class="item" label="健康状态：">{{ resultInfo.healthStatus | getHealthyStatus }}</el-form-item>
        </el-form>
      </div>
      <div v-for="(result,index) in resultList" :key="index">
        <div class="title">
          <span></span>
          {{ result.name }}
          <i
            v-if="isFirst"
            @click="changeDrop(1)"
            class="el-icon-arrow-right icon"
          ></i>
          <i v-else @click="changeDrop(1)" class="el-icon-arrow-down icon"></i>
        </div>
        <el-table
          v-if="isFirst"
          :data="result.checkStandardList"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="name" label="检查子项" />
          <el-table-column prop="name" label="检查标准">
            <template
              slot-scope="scope"
            >{{ scope.row.name}} {{scope.row.checkRool | checkRule}} {{ scope.row.checkNumber}}</template>
          </el-table-column>
          <el-table-column prop="name" label="实际指标">
            <template slot-scope="scope">{{ scope.row.realNumber || '-' }}</template>
          </el-table-column>
          <el-table-column prop="name" label="是否健康">
            <template slot-scope="scope">{{scope.row.checkStatus | getHealthyStatus}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  data () {
    return {
      isFirst: true,
      isSecond: true,
      isThird: true,
      dialogVisible: false,
      resType: '',
      confirmDeleteDialogVisible: false,
      // searchres: {},  搜索数据
      pageStates: '1', // tab选项
      resourceList: [
        {
          // resourcesId: '1',
          // toolsName: 'shell,Pathon'
        }
      ], // 资源列表
      resourceTypes: [
        {
          value: '1',
          label: 'OS'
        },
        {
          value: '2',
          label: '中间件'
        },
        {
          value: '3',
          label: '数据库'
        },
        {
          value: '4',
          label: '网络设备'
        }
      ],
      // environmentals: [
      //   {
      //     value: 1,
      //     label: '生产'
      //   }, {
      //     value: 2,
      //     label: '准生产'
      //   }, {
      //     value: 3,
      //     label: '开发测试'
      //   }
      // ],
      environmentals: [],
      total: 0,
      searchres: {
        // page: false,
        // total: 0,
        current: 1,
        size: 10,
        detail: ''
      },
      currentReport: {},
      resultInfo: {},
      resultList: [],
      resourcesId: ''
    }
  },
  created () {
    this.resourceListData()
    this.envtablist()
  },
  filters: {
    filterTools (val) {
      if (val) {
        //  let tools = val.replace(/^a-zA-Z/,'');
        // let tools = val.toString();
        return val.replace(/^a-zA-Z/, '')
      }
    },
    getHealthyStatus (value) {
      if (value === '') {
        return '-'
      } else if (value == 0) {
        return '健康'
      } else if (value == 1) {
        return '不健康'
      }
    },
    checkRule (value) {
      if (value === 'exit') {
        return '存在'
      } else {
        return value
      }
    },
    checkType (value) {
      if (value == '0') {
        return '定时'
      } else if (value == '1') {
        return '手动检查'
      }
    }
  },
  methods: {
    resourceReport (resourcesId) {
      this._healthyReport(resourcesId)
      this.dialogVisible = true
    },
    // 获取健康检查报告
    _healthyReport (resourcesId) {
      let search = {
        resourcesType: this.pageStates,
        resourcesId: resourcesId
      }
      axios.healthyReport(search).then(result => {
        if (result.data.code === 200) {
          let data = result.data.data
          this.resultInfo = data.maResources
          this.resultList = data.maCheckTermsList

          this.resultList.forEach((checkItem, index) => {
            checkItem.checkStandardList.forEach(
              (checkChildItem, childIndex) => {
                this.resultInfo.resourcesStdHealthy.forEach(
                  (resultItem, resultIndex) => {
                    if (checkChildItem.standardId === resultItem.standardId) {
                      this.$set(
                        this.resultList[index].checkStandardList[childIndex],
                        'realNumber',
                        resultItem.realNumber
                      )
                      this.$set(
                        this.resultList[index].checkStandardList[childIndex],
                        'checkStatus',
                        resultItem.checkStatus
                      )
                      this.$set(
                        this.resultList[index].checkStandardList[childIndex],
                        'checkType',
                        resultItem.checkType
                      )
                    }
                  }
                )
              }
            )
          })
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      })
    },
    // 健康报告-切换显示
    changeDrop (index) {
      if (index === 1) {
        this.isFirst = !this.isFirst
      } else if (index === 2) {
        this.isSecond = !this.isSecond
      } else if (index === 3) {
        this.isThird = !this.isThird
      }
    },
    // 获取环境
    envtablist () {
      let data = {
        name: ''
      }
      axios.envtablist(data).then(res => {
        if (res.data.code === 200 && res.data.data.result) {
          res.data.data.result.forEach(item => {
            this.environmentals.push({
              value: item.environmentId,
              label: item.name
            })
          })
        }
      })
    },
    // 获取资源列表
    resourceListData (val) {
      this.searchres.current = val
      if (this.resType) {
        this.searchres.resourcesType = this.resType
      } else {
        this.searchres.resourcesType = this.pageStates
      }
      let data = {
        current: this.searchres.current,
        size: this.searchres.size,
        resourcesType: this.searchres.resourcesType,
        environmentId: this.searchres.environmentId,
        name: this.searchres.name
      }
      axios.resourceListData(data).then(res => {
        if (res.data.code === 200) {
          let _this = this
          _this.resourceList = res.data.data.records
          // let tools = '';
          // tools = res.data.data.records.supTools;
          // for(var i=0;i<=_this.resourceList.length;i++){
          //   tools = _this.resourceList[i].supTools;
          // }
          this.total = parseInt(res.data.data.total)

          for (var i = 0; i < _this.resourceList.length; i++) {
            let aa = _this.resourceList[i].supTools.substring(
              2,
              _this.resourceList[i].supTools.lastIndexOf('"')
            )
            _this.resourceList[i].supTools = aa.replace(/\'/g, '')
          }
        } else {
          this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    // 查询资源
    searchList () {
      // this.searchres.current = val;
      // let curr = this.searchres.current;
      if (this.resType == '1') {
        this.searchres.resourcesType = this.resType
        this.pageStates = '1'
        this.resourceListData()
      } else if (this.resType == '2') {
        this.searchres.resourcesType = this.resType
        this.pageStates = '2'
        this.resourceListData()
      } else if (this.resType == '3') {
        this.searchres.resourcesType = this.resType
        this.pageStates = '3'
        this.resourceListData()
      } else if (this.resType == '4') {
        this.searchres.resourcesType = this.resType
        this.pageStates = '4'
        this.resourceListData()
      } else if (
        this.searchres.name === '' &&
        this.searchres.environmentId === ''
      ) {
        this.searchres.resourcesType = this.resType
        // this.pageStates = '4'
        this.resourceListData(1)
      } else {
        this.searchres.resourcesType = this.resType
        // this.pageStates = '4'
        this.resourceListData()
      }
    },
    // 新增跳转
    goResource (key) {
      this.$router.push({
        path: '/AutomaticOperation/ResourceManage/' + key,
        query: {
          code: 4
        }
      })
    },
    // 查看跳转
    readResource (row) {
      // this.detail = row;
      this.$router.push({
        path: '/AutomaticOperation/ResourceManage/read',
        query: {
          code: 4,
          resourcesId: row.resourcesId
        }
      })
    },
    editResource (key, resourcesId) {
      this.$router.push({
        path: '/AutomaticOperation/ResourceManage/' + key,
        query: {
          code: 4,
          resourcesId: resourcesId
        }
      })
    },
    // readResource(row){
    //   console.log(row)
    // },
    // 改变tab选项
    getList () {
      this.searchres.current = 1
      if (this.resType) {
        this.resType = ''
        this.searchres.resourcesType = this.pageStates
        this.resourceListData(1)
      } else if (this.searchres.environmentId) {
        this.searchres.environmentId = ''
        this.resourceListData(1)
      } else if (this.searchres.name) {
        this.searchres.name = ''
        this.resourceListData(1)
      } else {
        this.resourceListData(1)
      }
    },
    // 删除资源
    delResource (item) {
      this.resourcesId = item.resourcesId
      this.confirmDeleteDialogVisible = true
    },
    confirmDelete () {
      axios.deleteresource(this.resourcesId).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '删除成功！',
            type: 'success'
          })
          this.resourceListData()
          this.confirmDeleteDialogVisible = false
        } else {
          this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    // OS分页
    handleOsSizeChange (val) {
      this.searchres.size = val
      this.resourceListData()
    },
    handleOsCurrentChange (val) {
      this.searchres.current = val
      this.resourceListData(val)
    }
  }
}
</script>
<style scoped lang="stylus">
.icon {
  color: #1e90ff;
  font-size: 20px;
  vertical-align: text-bottom;
}

.title {
  font-size: 14px;
  color: #585858;
  padding: 20px 0 10px;

  span {
    background: #0066ff;
    display: inline-block;
    width: 8px;
    height: 30px;
    vertical-align: middle;
    border-radius: 5px;
    margin-right: 10px;
  }
}

.main-info {
  background: #F7F7F7;

  .item-box {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;

    .item {
      width: 50%;
    }
  }
}

.healthy-icon {
  height: 50px;
}

/* .resource-manage{
  background-color: #fff;
} */
.panel {
  padding: 0px 10px 10px 10px;
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
  text-align: center;
  padding-top: 92px;
}

.form-list {
  margin-top: 10px;
  padding-left: 10px;
  /* margin-bottom: 20px; */
}

.add-btn {
  float: right;
}

.btn-box span {
  margin: 0 5px;
  cursor: pointer;
}

.btn-box span:hover {
  color: #0066ff;
}
</style>
