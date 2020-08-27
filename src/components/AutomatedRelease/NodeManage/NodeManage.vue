<template>
  <div class="node-layout">
    <!-- <NodeEdit ref="showDialog" @getNodeList="getNodes" :isbl='isbl'/> -->
    <!-- <NodeEdit ref="showDialog" @getNodeList="getNodes" /> -->
    <el-row :gutter="10">
      <el-col :span="3">
        <el-input v-model="nodename" placeholder="节点名称" clearable></el-input>
      </el-col>
      <el-col :span="3">
        <el-select clearable style="width: 100%" v-model="systemId" placeholder="选择所属系统">
          <el-option
            v-for="(item,index)  in systemTypes"
            :key="index"
            :label="item.name"
            :value="item.systemId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select style="width: 100%" clearable v-model="clusterId" placeholder="请选择集群">
          <el-option
            v-for="(item,index)  in clusterList"
            :key="index"
            :label="item.name"
            :value="item.clusterId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="10" class="search-wrapper item-right">
        <el-button class="nomal-button" @click="dialogVisible = true">导入</el-button>
        <el-button
          class="nomal-button margin-left-btn"
          @click="exportBtn(tableChecked)"
        >导出</el-button>
        <el-button
          icon="el-icon-search"
          class="nomal-button margin-left-btn"
          @click="searchByKey"
        >查找</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="addNode"
        >新增</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding:20px 10px;">
      <el-table
        stripe
        :data="nodeList"
        style="background:#fff"
        :header-cell-style="{background:'#f5f5f5'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" label="节点名称"></el-table-column>
        <el-table-column prop="purposesName" label="节点用途"></el-table-column>
        <el-table-column prop="systemName" label="所属系统"></el-table-column>
        <el-table-column label="所属集群">
          <template slot-scope="scope">
            <span v-if="scope.row.clusterName">{{scope.row.clusterName}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="hostname" label="主机名"></el-table-column>
        <el-table-column prop="voucherName" label="凭证"></el-table-column>
        <el-table-column prop="port" label="连接端口"></el-table-column>
        <el-table-column prop="ipaddr" label="IP"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="editNode(scope.row,'detail')">
                <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                  <icon-svg icon-class="chakan" />
                </el-tooltip>
              </span>
              <span class="special" @click="editNode(scope.row,'edit')">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <icon-svg icon-class="bianji" />
                </el-tooltip>
              </span>
              <span class="special" @click="showDeleteDialog(scope.row.nodeId)">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <icon-svg icon-class="shanchu" />
                </el-tooltip>
              </span>
            </div>
            <!-- <button class="cm-table-btn cm-watch-btn" @click="editNode(scope.row,'detail')"></button>
            <button class="cm-table-btn cm-edit-btn-light" @click="editNode(scope.row,'edit')"></button>
            <button class="cm-table-btn cm-delete-btn-light" @click="deleteSel(scope.row.nodeId)"></button>-->
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
      <el-dialog
        center
        title="导入节点"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose"
      >
        <el-row :gutter="10">
          <el-col :span="20" class="titleNotice">
            <h3>注意：</h3>
            <p>上传前请先下载模版</p>
            <p>请上传符合条件的附近，否则将无法处理数据，因此请务必按照附近要求上传</p>
            <p>只支持Excel格式文件</p>
            <p>每份上传文件不超过500条</p>
          </el-col>
          <el-col :span="2">
            <el-button @click="downTemplate" size="small" type="primary">下载模版</el-button>
            <el-upload
              style="padding:20px 0"
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
            <el-button @click="down()" size="small" type="primary">确认导入</el-button>
          </el-col>
        </el-row>
        <!-- <el-row>
          <p>导入结果：{{notice}}</p>
          <p>报错提示：{{notice}}</p>
        </el-row>-->
      </el-dialog>
    </el-row>

    <el-dialog center :visible.sync="dialogVisibleDelete" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该节点吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" class="nomal-button" @click="dialogVisibleDelete = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="deleteSel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import NodeEdit from './NodeEdit.vue'
export default {
  name: 'NodeManage',
  data () {
    return {
      //  notice: "",
      dialogVisibleDelete: false,
      isbl: false,
      nodename: '',
      systemId: '',
      currPage: 1,
      name: '',
      way: '',
      dialogVisible: false,
      size: 10,
      total: 1,
      page: false,
      fileList: [],
      data: { nodeId: '' },
      nodeUse: [{ label: '测试', value: '1' }, { label: '正式', value: '2' }],
      nodeList: [],
      systemTypes: [],
      clusterList: [],
      clusterId: '',
      tableChecked: []
    }
  },
  components: {
    NodeEdit: NodeEdit
  },
  created () {
    this.getNodes()
    this.getAllSystem()
    this.loadAll()
  },
  watch: {
    // isbl(){
    //   console.log(this.isbl)
    //   if(this.isbl){
    //     this.getNodes()
    //   }
    // }
  },
  methods: {
    // 获取列表
    getNodes (isbl) {
      // if(isbl){
      // this.isbl = isbl

      // }else{
      //   this.isbl = false
      // }
      let data = {
        name: this.nodename,
        systemId: this.systemId,
        clusterId: this.clusterId,
        current: this.currPage,
        size: this.size
      }
      axios.searchNode(data).then(data => {
        if (data.data.code === 200) {
          if (data.data.data.result) {
            this.total = parseInt(data.data.data.result.total)

            data.data.data.result.records.forEach(item => {
              this.nodeUse.forEach(itemChilde => {
                if (item.purposes == itemChilde.value) {
                  item.purposesName = itemChilde.label
                }
              })
              this.systemTypes.forEach(systemType => {
                if (item.systemId == systemType.systemId) {
                  item.systemName = systemType.name
                }
              })
            })
            this.nodeList = data.data.data.result.records
          }
        } else {
          this.$notify({
            title: '错误',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    // 获取系统
    getAllSystem () {
      let name = ''
      axios.getcigroupSystablist(name).then(data => {
        if (data.data.code === 200) {
          this.systemTypes = data.data.data.result
        }
      })
    },
    // 获取下拉集群
    loadAll () {
      let systemId = ''
      this.nodeList = []
      let purposes = ''
      this.isEditTest = true
      axios.pullDownListExtra(systemId, purposes).then(data => {
        if (data.data.code === 200) {
          if (data.data.data.result) {
            this.clusterList = data.data.data.result
          }
        } else {
          this.isEditTest = true
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    showDeleteDialog (id) {
      this.dialogVisibleDelete = true
      this.deleteNodeId = id
    },
    // 删除数据
    deleteSel (id) {
      let nodeId = this.deleteNodeId
      let _this = this
      axios.deleteNode(nodeId).then(res => {
        if (res.data.code === 200) {
          _this.$notify({
            title: '提示',
            message: '删除成功！',
            type: 'success'
          })
          if (this.nodeList.length <= 1 && this.currPage > 1) {
            this.currPage = this.currPage - 1
          }
          _this.getNodes()
          this.dialogVisibleDelete = false
        } else {
          _this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    searchByKey () {
      this.currPage = 1
      this.getNodes()
    },
    // 分页
    handleCurrentChange (val) {
      this.currPage = val
      this.getNodes()
    },
    handleSizeChange (val) {
      this.size = val
      this.getNodes()
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
    exportBtn (rows) {
      var ids = []
      rows.forEach(element => {
        ids.push(element.nodeId)
      })
      var nodeIds = ids.join(',')
      if (!nodeIds) {
        this.$notify({
          title: '提示',
          message: '请选择要导出的数据',
          type: 'warning'
        })
      } else {
        window.open(axios.deliveryurl() + 'sshNode/excelExport?nodeIds=' + nodeIds)
      }
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview (file) {
      // console.log(file)
      this.resid = file.uid
      // console.log(file);
    },
    handleClose () {
      this.dialogVisible = false
    },
    // 下载模版
    downTemplate () {
      window.open(axios.deliveryurl() + 'sshNode/excelExportTemplate')
    },
    // 导入
    down () {
      let AUTH_TOKEN = (function () {
        return localStorage.getItem('token')
      })()
      var instance = this.$axios.create({})
      instance.defaults.headers.common['Authorization'] =
        'Bearer ' + AUTH_TOKEN
      var fd = new FormData()
      let files

      this.$refs.upload.uploadFiles.forEach(item => {
        //  console.log(item)
        if (this.resid == item.uid) {
          files = item.raw
          //  console.log(item)
        }
      })
      // console.log(files);
      if (!files) {
        this.$notify({
          title: '提示',
          message: '请选择要导入的文件',
          type: 'warning'
        })
        return false
      }
      fd.append('file', files)
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      // console.log(fd)
      //  console.log(  this.filedata)
      this.$axios
        .post(axios.deliveryurl() + 'sshNode/excelImport', fd, config)
        .then(res => {
          console.log(res)
          // this.notice = res.data;
          if (res.status == 200) {
            // this.notice = res.data;
            this.dialogVisible = false
            //  console.log(res.data)
            this.$notify({
              title: '提示',
              message: res.data,
              type: 'success'
            })
            this.excellist.push({
              name: files.name,
              size: (files.size / 1024).toFixed(2) + 'M',
              status: '上传成功'
            })
          }
          // } else {
          //   this.$notify({
          //     title: "提示",
          //     message: res.data.message,
          //     type: "warning"
          //   });
          // }
        })
    },
    // 编辑数据
    editNode (dataRow, key) {
      // this.$refs.showDialog.openDialog(dataRow, key);
      this.$router.push({
        path: `/AutomatedRelease/editNode/${key}`,
        query: {
          id: dataRow.nodeId,
          code: 3,
          key: key
        }
      })
    }
  }
}
</script>

<style scoped>
.node-layout {
  padding: 10px;
}
.page-limit {
  text-align: center;
  margin: 92px 0 20px;
}
.search-wrapper {
  padding-top: 5px;
  text-align: right;
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
</style>
