<template>
  <div class="resource-manage">
    <el-row class="formclass">
      <el-form :inline="true" :model="searchdata" class="demo-form-inline">
        <el-form-item>
          <el-input placeholder="请输入流水线名称" v-model="searchdata.name" clearable />
        </el-form-item>
        <el-form-item class="disbr overHideMargin">
          <el-button icon="el-icon-search" class="nomal-button" @click.stop="searchList">查找</el-button>
          <el-button
            v-if="this.pageStates === '0'"
            type="primary"
            icon="el-icon-plus"
            class="margin-left-btn"
            @click.prevent="goPipeline('create')"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div class="panel">
      <el-tabs v-model="pageStates" @tab-click="getList">
        <el-tab-pane label="我的" name="0">
          <el-table
            stripe
            :data="mineList"
            style="width: 100%;"
            :header-cell-style="{ background: '#f5f5f5' }"
            @row-click="readPipeline"
          >
            <el-table-column prop="name" label="流水线名称" />
            <el-table-column prop="environmentName" label="所属环境" />
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="btn-box">
                  <span @click.stop="exmPipeline(scope.row)">执行</span>
                  <span @click.stop="CreatepipelineTemp(scope.row)">{{examText(scope.row)}}</span>
                  <span @click.stop="click()">
                    <el-dropdown trigger="click">
                      <span class="el-dropdown-link">更多</span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="goLog(scope.row)">日志</el-dropdown-item>
                        <el-dropdown-item
                          :class="['', scope.row.applyStatus=='2'?'nocour':'']"
                          @click.native="editPipeline('edit',scope.row)"
                        >编辑</el-dropdown-item>
                        <el-dropdown-item @click.native="showPipeline(scope.row.pipelineId)">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchdata.current"
              :page-sizes="[10,30,50]"
              layout="prev, pager, next, sizes, total, jumper"
              :total="searchdata.total1"
              v-if="pageStates==0"
              style="margin-right:15px;cursor: pointer;"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="公共模板" name="1">
          <el-table
            stripe
            :data="allList"
            style="width: 100%;"
            :header-cell-style="{ background: '#f5f5f5' }"
            @row-click="readPipelineTemp"
          >
            <el-table-column prop="name" label="流水线名称" />
            <el-table-column prop="environmentName" label="所属环境" />
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="btn-box">
                  <span @click.stop="exmPipeline(scope.row, true)">执行</span>
                  <span @click.stop="goLog(scope.row)">日志</span>
                  <span @click.stop="showDeleteTemp(scope.row.tempId)">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleallSizeChange2"
              @current-change="handleallCurrentChange2"
              :current-page="searchdata.page2"
              :page-sizes="[10,30,50]"
              layout="prev, pager, next, sizes, total, jumper"
              :total="searchdata.total2"
              v-if="pageStates==1"
              style="cursor: pointer;"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :visible.sync="isApproval"
      title="存为模板"
      center
      :before-close="handleDialogClose"
      width="1000px"
    >
      <Approval
        v-if="isApproval"
        :userdata="userlist"
        :pipename="pipename"
        :approvalsNum="approvalsNum"
        :environmentId="environmentId"
        :pipelineId="pipelineId"
        :nodeParam="nodeParam"
        :actXml="actXml"
        @ApprovalInfo="getApprovaldata"
      />
    </el-dialog>

    <el-dialog center :visible.sync="dialogVisibleDeleteTemp" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该公共模板吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="save-btn-margin-special"
          size="mini"
          @click="delPipelineTemp"
        >确 定</el-button>
        <el-button size="mini" @click="dialogVisibleDeleteTemp = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog center :visible.sync="dialogVisibleDeleteMyTemp" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该模板吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="save-btn-margin-special"
          size="mini"
          @click="delPipeline"
        >确 定</el-button>
        <el-button size="mini" @click="dialogVisibleDeleteMyTemp = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Approval from './Approval.vue'
import axios from '@/api';
export default {
  data () {
    return {
      dialogVisibleDeleteTemp: false,
      dialogVisibleDeleteMyTemp: false,
      pipename: '',
      pipelineId: '',
      environmentId: '',
      nodeParam: [],
      pipelineVersion: '',
      actXml: '',
      isApproval: false,
      approvalsNum: '',
      userlist: [],
      copyuserlist: [],
      searchdata: {
        total1: 0,
        total2: 0,
        current: 1,
        page2: 1,
        size2: 10,
        size: 10
      },
      pageStates: '0',
      mineList: [{}],
      allList: [{}],
      deletePipelineId: '',
      deleteMyTempId: ''
    }
  },
  components: {
    Approval
  },
  methods: {
    click () { },
    examText (item) {
      let result = item.applyStatus
      if (result === '5' || result === '1' || result === '3') {
        return '存为模板'
      } else {
        return '已提交审批'
      }
    },
    getApprovaldata (data) {
      if (data.isclose) {
        this.isApproval = false
        this.getpagepipeline()
      }
    },
    // 获取用户列表
    getuserlist () {
      axios.userList({
        condition: '',
        current: 1,
        online: false,
        roleIds: [],
        size: 20,
        userStatus: ''
      })
        .then(res => {
          this.copyuserlist = res.data.data.result.records.concat()
          this.userlist = res.data.data.result.records
        })
        .catch()
    },
    handleDialogClose () {
      this.isApproval = false
    },
    // 查找资源
    searchList () {
      this.searchdata.current = 1
      if (this.pageStates === '0') {
        this.getpagepipeline()
      } else {
        this.GetPagepipelineTemp()
      }
    },
    // 分页查询流水线
    getpagepipeline (tit) {
      let data = {
        environmentId: '',
        name: this.searchdata.name || '',
        current: this.searchdata.current,
        size: this.searchdata.size
      }
      axios.pagepipeline(data)
        .then(res => {
          if (res.data.code === 200) {
            this.mineList = res.data.data.records
            this.searchdata.total1 = parseInt(res.data.data.total)
            if (tit) {
              let startdata = {}
              res.data.data.records.forEach(item => {
                if (item.pipelineId === tit) {
                  startdata.procDefKey = item.procDefKey
                  startdata.actXml = item.actXml
                  startdata.procDefId = item.procDefId
                }
              })
              // 这是执行
              axios.startpipe(startdata.procDefKey)
                .then(res => {
                  if (res.data.code === 200) {
                    let data = {
                      actXml: startdata.actXml,
                      businessType: '2',
                      status: '2',
                      businessId: tit,
                      procInsId: res.data.data.procInsId,
                      procDefId: startdata.procDefId,
                      procDefKey: startdata.procDefKey
                    }
                    axios.processupdate(data).then(res => {
                      if (res.data.status.code === 200) {
                        this.$notify({
                          title: '提示',
                          message: '执行成功！',
                          type: 'success'
                        })
                        this.getpagepipeline()
                      }
                    })
                  } else {
                    this.$notify({
                      title: '错误',
                      message: res.data.message,
                      type: 'error'
                    })
                  }
                })
                .catch()
            }
          }
        })
        .catch()
    },
    // 分页查询公共模板
    GetPagepipelineTemp () {
      let data = {
        environmentId: '',
        name: this.searchdata.name || '',
        current: this.searchdata.page2,
        size: this.searchdata.size2
      }
      axios.getPagepipelineTemp(data).then(res => {
        if (res.data.code === 200) {
          this.allList = res.data.data.records
          this.searchdata.total2 = parseInt(res.data.data.total)
        }
      })
    },
    // 切换tab选项
    getList () {
      this.$set(this.searchdata, 'name', '')
      this.searchdata.current = 1

      if (this.pageStates === '0') {
        this.getpagepipeline()
      } else {
        this.GetPagepipelineTemp()
      }
    },
    goPipeline (key) {
      this.$router.push({
        path: '/AutomaticOperation/Newpipeline',
        query: {
          code: 4,
          key: key
        }
      })
    },
    // 查看流水线
    readPipeline (row) {
      this.$router.push({
        path: '/AutomaticOperation/Newpipeline',
        query: {
          code: 4,
          key: 'detail',
          pipelineId: row.pipelineId
        }
      })
    },
    // 查看公共模板流水线
    readPipelineTemp (row) {
      this.$router.push({
        path: '/AutomaticOperation/Newpipeline',
        query: {
          code: 4,
          key: 'detail',
          tempId: row.tempId
        }
      })
    },
    // 编辑流水线
    editPipeline (key, row) {
      if (row.applyStatus === '2') {
        this.$confirm('当前流水线正在审批，撤回后编辑?', '提示', {
          confirmButtonText: '去撤回',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push({
              path: '/AutomaticOperation/examineAndApprove',
              query: {
                code: 4
              }
            })
          })
          .catch(() => {
            console.log('取消')
          })
      } else {
        this.$router.push({
          path: '/AutomaticOperation/Editpipeline',
          query: {
            code: 4,
            key: key,
            pipelineId: row.pipelineId
          }
        })
      }
    },
    showPipeline (id) {
      this.dialogVisibleDeleteMyTemp = true
      this.deleteMyTempId = id
    },
    // 删除流水线
    delPipeline () {
      axios.deletepipeline(this.deleteMyTempId).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '删除成功！',
            type: 'success'
          })
          this.searchdata.current = 1
          this.getpagepipeline()
          this.dialogVisibleDeleteMyTemp = false
        } else {
          this.$notify({
            title: '删除模板出错',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    showDeleteTemp (id) {
      this.dialogVisibleDeleteTemp = true
      this.deletePipelineId = id
    },
    // 删除模板
    delPipelineTemp () {
      axios.deletepipelineTemp(this.deletePipelineId).then(res => {
        if (res.data.code === 200) {
          this.GetPagepipelineTemp()
          this.$notify({
            title: '提示',
            message: '删除成功！',
            type: 'success'
          })
          this.dialogVisibleDeleteTemp = false
        } else {
          this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    // 流水线执行
    exmPipeline (row, isTemplate) {
      let type = 3
      let id = row.pipelineId
      let path = '/AutomaticOperation/ExecutePipeLine'
      if (isTemplate && row.tempId) {
        type = 4
        id = row.tempId
        path = '/AutomaticOperation/ExecuteTemplate'
      }
      let data = {
        businessType: type,
        businessId: id || ''
      }
      axios.executeWorkflow(data)
        .then(res => {
          if (res.data.status && res.data.status.code === 200) {
            this.$notify({
              title: '提示',
              message: '请求成功！',
              type: 'success'
            })
            this.$router.push({
              path: path,
              query: {
                code: 4,
                [type === 3 ? 'pipelineLogId' : 'templateLogId']: res.data
                  .logId,
                key: 'detail'
              }
            })
          } else if (res.data.code === 500) {
            this.$notify({
              title: '错误',
              message: res.data.message,
              type: 'error'
            })
            this.getpagepipeline()
          }
        })
        .catch()
      // console.log(row);
      // if (!row.procDefKey) {
      //   // let data = {
      //   //   xml: row.actXml,
      //   //   category: 3
      //   // };
      //   let jobs = [];
      //   row.pipeLineNodeparams.forEach(item => {
      //     jobs.push({
      //       actNodeId: item.actNodeId,
      //       businessId: item.pipelineId,
      //       businessName: item.actNodeName
      //     });
      //   });
      //   let data = {
      //     category: '3',
      //     jobs: jobs,
      //     xml: row.actXml
      //   };
      //   // 这是部署
      //   deploypipe(data)
      //     .then(res => {
      //       console.log(res);
      //       if (res.data.code == 200) {
      //         // "category":"业务类型 1：Jenkins 2：工单 3：操作流水线",
      //         let data2 = {
      //           actXml: row.actXml,
      //           businessType: '2',
      //           status: '2',
      //           businessId: row.pipelineId,
      //           procDefId: res.data.data.procDefId,
      //           procDefKey: res.data.data.procDefKey
      //         };
      //         axios.processupdate(data2).then(res => {
      //           // console.log(res)
      //           if (res.data.status.code == 200) {
      //             this.getpagepipeline(row.pipelineId);
      //           }
      //         });
      //       } else {
      //         this.$notify({
      //           title: '错误',
      //           message: res.data.message,
      //           type: 'error'
      //         });
      //       }
      //     })
      //     .catch();
      // } else {
      //   // 这是执行
      //   axios.startpipe(row.procDefKey)
      //     .then(res => {
      //       // console.log(res);
      //       if (res.data.code == 200) {
      //         let data = {
      //           actXml: row.actXml,
      //           businessType: '2',
      //           status: '2',
      //           businessId: row.pipelineId,
      //           procInsId: res.data.data.procInsId,
      //           procDefId: row.procDefId,
      //           procDefKey: row.procDefKey
      //         };
      //         axios.processupdate(data).then(res => {
      //           if (res.data.status.code == 200) {
      //             this.$notify({
      //               title: '提示',
      //               message: '执行成功！',
      //               type: 'success'
      //             });
      //             this.getpagepipeline();
      //           }
      //         });
      //       } else {
      //         this.$notify({
      //           title: '错误',
      //           message: res.data.message,
      //           type: 'error'
      //         });
      //       }
      //     })
      //     .catch();
      // }
    },
    handleallSizeChange (val) {
      this.searchdata.size = val
    },

    handleSizeChange (val) {
      this.searchdata.size = val
      this.getpagepipeline()
    },
    handleCurrentChange (val) {
      this.searchdata.current = val
      this.getpagepipeline()
    },
    handleallSizeChange2 (val) {
      this.searchdata.size2 = val
      this.GetPagepipelineTemp()
    },
    handleallCurrentChange2 (val) {
      this.searchdata.page2 = val
      this.GetPagepipelineTemp()
    },
    aplying (row) {
      if (row.applyStatus === '2') {
        this.$notify({
          title: '错误',
          message: '您已提交审批，请勿重复操作',
          type: 'error'
        })
        return false
      }
    },
    // 查看日志
    goLog (data) {
      this.$router.push({
        path: '/AutomaticOperation/PerformLog',
        query: {
          code: 4,
          name: data.name
        }
      })
    },
    // 新增公共模板
    CreatepipelineTemp (row) {
      if (row.applyStatus === '0') {
        this.$notify({
          title: '错误',
          message: '该操作流水线已经存为模版，不可重复操作',
          type: 'error'
        })
        return false
      }
      if (row.applyStatus === '2') {
        this.$notify({
          title: '错误',
          message: '您已提交审批，请勿重复操作',
          type: 'error'
        })
        return false
      }
      this.userlist = []
      this.pipelineId = row.pipelineId
      this.pipename = ''
      this.approvalsNum = row.approvalsNum
      this.environmentId = row.environmentId
      this.nodeParam = row.pipeLineNodeparams || []
      this.actXml = row.actXml
      this.pipelineVersion = row.pipelineVersion
      this.userlist = this.copyuserlist
      this.isApproval = true
    }
  },
  mounted () {
    this.GetPagepipelineTemp()
    this.getpagepipeline()
    this.getuserlist()
  }
}
</script>
<style scoped>
.resource-manage {
  padding-left: 10px;
  padding-top: 10px;
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
.disbr {
  float: right;
}
.block {
  text-align: center;
  margin: 92px 0 0 0;
}
.nocour {
  cursor: not-allowed !important;
  color: #c6c6c6 !important;
  /* background-color: #ccc !important; */
}
.btn-box span {
  margin: 0 5px;
  cursor: pointer;
}
.btn-box span:hover {
  color: #0066ff;
}
.formclass {
  padding-bottom: -15px;
}
.demo-form-inline /deep/ .overHideMargin {
  margin-right: 0 !important;
}
.el-pagination {
  text-align: center;
}
</style>
