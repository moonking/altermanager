<template>
  <div class="cluster-manage">
    <div class="wrapper">
      <div class="operate-bar">
        <el-form :inline="true" :model="formData" :rules="rules" class="demo-form-inline">
          <el-form-item>
            <el-select v-model="formData.system" placeholder="选择所属系统" :clearable="true">
              <el-option
                v-for="system in systemList"
                :label="system.name"
                :value="system.systemId"
                :key="system.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formData.clusterName" placeholder="集群名称" sortable clearable></el-input>
          </el-form-item>
          <el-form-item class="item-right overHideMargin">
            <el-button icon="el-icon-search" class="nomal-button" @click="search">查找</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="margin-left-btn"
              @click.prevent="toAddCluster"
            >新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="cluster-list">
        <!-- <el-table :data="tableData" style="width: 100%" @cell-mouse-enter="expandSelect" :default-sort ="{prop:'name',order:'descending'}"> -->
        <el-table
          stripe
          :data="tableData"
          style="width: 100%"
          @cell-mouse-enter="expandSelect"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <!-- <el-table :data="tableData" style="width: 100%" @expand-change="expandSelect"> -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" :inline="true">
                <div v-for=" (item,index) in scope.row.nodelist" :key="index">
                  <el-form-item label="节点名称:">
                    <span>{{item.node }}</span>
                  </el-form-item>
                  <el-form-item label="节点用途:">
                    <span>{{ item.purposes }}</span>
                  </el-form-item>
                  <el-form-item label="所属系统:">
                    <span>{{item.systemName }}</span>
                  </el-form-item>
                  <el-form-item label="主机名:">
                    <span>{{item.hostname }}</span>
                  </el-form-item>
                  <el-form-item label="凭证名称:">
                    <span>{{item.voucherName }}</span>
                  </el-form-item>
                  <el-form-item label="IP地址:">
                    <span>{{ item.ipaddr }}</span>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="集群编号"
            prop="clusterId">
          </el-table-column>-->
          <!-- <el-table-column sortable label="集群名称" prop="name"></el-table-column> -->
          <el-table-column label="集群名称" prop="name"></el-table-column>
          <el-table-column label="系统" prop="systemName"></el-table-column>
          <el-table-column label="环境" prop="envname"></el-table-column>
          <el-table-column label="用途" prop="purposes" :formatter="formatpurposes"></el-table-column>
          <!-- <el-table-column
            label="编辑者"
            prop="updateBy">
          </el-table-column>-->
          <el-table-column label="更新时间" prop="updateDate"></el-table-column>
          <el-table-column label="操作" align="center" prop="operate">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="handleEdit(scope.row,'edit')">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                    <icon-svg icon-class="bianji" />
                  </el-tooltip>
                </span>
                <span class="special" @click="showDelete(scope.row)">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <icon-svg icon-class="shanchu" />
                  </el-tooltip>
                </span>
              </div>
              <!-- <el-button @click="handleWatch(scope.row,'detail')" type="text" size="small">查看</el-button> -->
              <!-- <el-button @click="handleEdit(scope.row,'edit')" type="text" size="small">编辑</el-button> -->
              <!-- <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button> -->
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
      <!-- 分页 -->
      <div class="block" style="text-align: center;width: 100%;padding: 92px 0 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          v-if="page"
          style="margin-right:15px;cursor: pointer;"
        ></el-pagination>
      </div>
    </div>
    <el-dialog center :visible.sync="clusterDialogVisible" width="700px" @close="dialogCloseHandle">
      <el-form
        ref="clusterForm"
        :model="clusterDescFormData"
        label-position="right"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="集群名称:" prop="name">
          <el-input
            v-model="clusterDescFormData.name"
            :disabled="dialogIsReadOnly"
            :style="{width: '220px'}"
          ></el-input>
        </el-form-item>
        <el-form-item label="节点" prop="node">
          <el-select
            v-model="clusterDescFormData.node"
            placeholder="节点"
            :disabled="dialogIsReadOnly"
            @change="selectOne"
            width="300"
          >
            <el-option
              v-for="(node,index) in nodeList"
              :key="index"
              :value="node.nodeId"
              :label="node.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="env">
          <el-select
            v-model="clusterDescFormData.env"
            placeholder="环境类型"
            :disabled="dialogIsReadOnly"
            width="300"
          >
            <el-option
              v-for="(env,index) in envList"
              :key="index"
              :value="env.value"
              :label="env.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统:" prop="systemId">
          <el-select
            v-model="clusterDescFormData.systemId"
            :disabled="dialogIsReadOnly"
            width="300"
          >
            <el-option
              v-for="system in systemList"
              :key="system.systemId"
              :label="system.name"
              :value="system.systemId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用途" prop="purposes">
          <el-select
            v-model="clusterDescFormData.purposes"
            placeholder="用途"
            :disabled="dialogIsReadOnly"
            width="300"
          >
            <el-option
              v-for="(purposes,index) in purposesList"
              :key="index"
              :value="purposes.value"
              :label="purposes.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="!dialogIsReadOnly">
          <template>
            <el-button type="primary" @click="confirmEdit">确认</el-button>
            <el-button @click="closeDialog">取消</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog center :visible.sync="dialogVisibleDelete" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该集群吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisibleDelete = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="handleDelete">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'clusterManage',
  data () {
    return {
      dialogVisibleDelete: false,
      clusterId: '',
      formData: {
        system: '',
        clusterName: ''
      },
      detailnodeList: [],
      systemList: [],
      copytableData: [{ nodelist: [] }],
      tableData: [],
      expands: [], // 展开行id的数组
      getRowKeys (row) {
        return row.id
      },
      nodeList: [],
      envList: [],
      purposesList: [
        { label: 'UAT', value: '1' },
        { label: 'SIT', value: '2' },
        { label: '灾备', value: '3' }
      ],
      // css
      alignCenterStyle: {
        'text-align': 'center'
      },
      // 分页数据
      page: 1,
      total: 1,
      currPage: 1,
      size: 10,
      clusterDescFormData: {},
      // ??
      clusterDialogVisible: false,
      dialogIsReadOnly: true,
      rules: {
        clusterName: [
          {
            required: true,
            message: '请填写集群编号/集群名称',
            trigger: 'blur'
          }
        ],
        system: [
          { required: true, message: '请选择业务系统', trigger: 'change' }
        ]
      },
      // ??
      systemParams: '',
      name: '',
      currentId: '',
      deleteClusterId: ''
    }
  },
  created () {
    this.getenvtablist()
    this.getSystemList()
  },
  methods: {
    gitdeat (row) {
      console.log(row)
    },
    selectOne (event, item) { },
    getenvtablist () {
      let data = {
        environmentType: '',
        name: ''
      }
      axios.envtablist(data)
        .then(res => {
          // console.log(res)
          res.data.data.result.forEach(item => {
            this.envList.push({
              val: item.environmentId,
              lab: item.name
            })
          })
          this.getclusterList()
        })
        .catch()
    },
    expandSelect (row, expandedRows) {
      let nodelist = []
      var ind
      axios.nodeDetail(row.clusterId).then(res => {
        this.tableData.forEach((item, index) => {
          if (item.clusterId == row.clusterId) {
            item.nodelist = []
            ind = index
            res.data.data.result.forEach(d => {
              nodelist.push({
                node: d.name,
                purposes: d.purposes == '1' ? '部署' : '构建',
                systemName: d.systemName,
                hostname: d.hostname,
                voucherName: d.voucherName,
                ipaddr: d.ipaddr
              })
            })
          }
        })
        // this.tableData[ind].nodelist.push(nodelist)
        this.$set(this.tableData[ind], 'nodelist', nodelist)
      })
    },
    // 获取系统
    getSystemList () {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.success) {
          this.systemList = res.data.data.result
        }
      })
    },
    selectSys (val) {
      this.ruleForm.system = val
      this.systemList.forEach(item => {
        if (item.systemId == val) {
          this.systemName = item.name
        }
      })
    },
    // 跳转新增集群
    toAddCluster () {
      this.$router.push({
        path: '/AutomatedRelease/ResourceManagement/NewCluster',
        query: {
          code: 3
        }
      })
    },
    // 查找
    search () {
      this.getclusterList()
    },
    // 获取集群列表
    getclusterList () {
      let params = {
        current: this.currPage,
        size: this.size,
        name: this.formData.clusterName,
        systemId: this.formData.system
      }
      axios.clusterList(params).then(res => {
        if (res.data.code == 200) {
          console.log(this.envList)

          res.data.data.result.records.forEach(d => {
            this.envList.forEach(item => {
              if (item.val == d.environmentId) {
                d.envname = item.lab
              }
            })
          })
          // this.copytableData = res.data.data.result.records;
          this.tableData = res.data.data.result.records
          this.total = res.data.data.result.total * 1
        }
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.getclusterList()
    },
    handleCurrentChange (val) {
      this.currPage = val
      this.getclusterList()
    },
    handleWatch (row) {
      axios.clusterDetail(row.clusterId).then(res => {
        if (res.status == 200) {
          // 将 row中数据映射到对话框中
          this.clusterDescFormData = row
          // 显示dialog
          this.dialogIsReadOnly = true
          this.clusterDialogVisible = true
        }
      })
    },
    closeDialog () {
      this.clusterDialogVisible = false
    },
    handleEdit (row) {
      this.$router.push({
        path: '/AutomatedRelease/ResourceManagement/NewCluster',
        query: {
          code: 3,
          clusterId: row.clusterId
        }
      })
    },
    showDelete (id) {
      this.dialogVisibleDelete = true
      this.deleteClusterId = id.clusterId
    },

    handleDelete () {
      const clusterId = this.deleteClusterId

      axios.deleteCluster(clusterId)
        .then(res => {
          if (res.data.success === true) {
            this.getclusterList()
            this.$notify({
              title: '提示',
              type: 'success',
              message: '删除集群成功！'
            })
            this.dialogVisibleDelete = false
          } else {
            this.$notify({
              title: '提示',
              message: '删除集群失败！'
            })
          }
        })
        .catch(e => {
          this.$notify({
            title: '提示',
            message: '删除集群失败！'
          })
        })
    },
    dialogCloseHandle () {
      this.$refs.clusterForm.clearValidate()
    },
    formatpurposes: function (row, column) {
      return row.purposes === '1' ? '构建' : '部署'
    },
    // editCluster(){},
    confirmEdit () {
      //  console.log(this.$refs.clusterForm)
      this.$refs.clusterForm.validate(valid => {
        if (valid) {
          let params = {
            clusterId: this.clusterDescFormData.clusterId,
            name: this.clusterDescFormData.name,
            nodeName: this.clusterDescFormData.nodeName,
            env: this.clusterDescFormData.env,
            purposes: this.clusterDescFormData.purposes,
            systemId: this.clusterDescFormData.systemId,
            updateData: this.clusterDescFormData.updateData
          }
          axios.editClusterapi(params).then(res => {
            if (res.data.success) {
              this.clusterDialogVisible = false
              this.$notify({
                title: '提示',
                message: '数据修改成功'
              })
              this.currPage = 1
              this.getclusterList()
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.cluster-manage {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.cluster-manage .wrapper {
  width: 100%;
}
.wrapper .operate-bar {
  position: relative;
  width: 100%;
}
.wrapper .paging-area {
  margin-top: 40px;
  text-align: center;
}
.cluster-list .btn-watch {
  color: #fff;
  background-color: #0280ff;
  background-size: 50%;
  background-position: center center;
}
.cluster-list .btn-watch:hover {
  background-color: #196cbe;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.other {
  background-size: 12% !important;
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
*/ .right {
  position: absolute;
  right: 0;
  top: 10px;
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
.demo-form-inline /deep/ .overHideMargin {
  margin-right: 0 !important;
}
</style>
