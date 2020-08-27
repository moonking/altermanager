<template>
  <div class="node-edit aibms-color-bg">
    <!-- <div class="node-title" v-if="key === 'edit'">
    <span></span> 编辑节点-->
    <!-- <i @click="cancelDialog" class="i-close">
        <img src="../../../../static/img/i_close.png" alt>
    </i>-->
    <!-- </div>
    <div class="node-title" v-if="key === 'detail'">
    <span></span> 查看详情-->
    <!-- <i @click="cancelDialog" class="i-close">
        <img src="../../../../static/img/i_close.png" alt>
    </i>-->
    <!-- </div> -->
    <div class="item-block-title paddingTop">
      <div class="item-block-title-mark"></div>
      <span class="item-block-title-font">{{key === 'edit' ? "编辑节点" : "查看详情"}}</span>
    </div>
    <div class="node-pannel item-block-content">
      <el-form
        :model="nodeDetail"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm dialog-form"
      >
        <el-form-item label="节点名称：" prop="name" class="w28ml20">
          <el-input
            maxlength="40"
            v-model="nodeDetail.name"
            placeholder="请输入节点名称"
            :disabled="!isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="节点用途：" prop="purposes" class="w28ml20" style="margin-top: 20px;">
          <el-select
            style="width: 100%"
            clearable
            @change="changeTest"
            v-model="nodeDetail.purposes"
            :disabled="!isEdit"
            placeholder="请选择节点用途"
          >
            <el-option
              v-for="(item,index)  in nodeUse"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属系统：" prop="systemId" class="w28ml20">
          <el-select
            style="width: 100%"
            @change="getNodeList"
            clearable
            v-model="nodeDetail.systemId"
            :disabled="!isEdit"
            placeholder="请选择所属系统"
          >
            <el-option
              v-for="(item,index)  in systemTypes"
              :key="index"
              :label="item.name"
              :value="item.systemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属集群：" class="w28ml20">
          <el-select
            style="width: 100%"
            clearable
            v-model="nodeDetail.clusterName"
            :disabled="isPurposesd"
            placeholder="请选择集群"
          >
            <el-option
              v-for="(item,index)  in nodeList"
              :key="index"
              :label="item.name"
              :value="item.clusterId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属环境：" prop="environmentType" class="w28ml20">
          <el-select
            placeholder="请选择环境"
            v-model="nodeDetail.environmentId"
            style="width: 100%"
            clearable
            :disabled="!isEdit"
          >
            <el-option v-for="Env in envList" :label="Env.lab" :value="Env.val" :key="Env.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机名：" prop="hostname" class="w28ml20">
          <el-input
            maxlength="40"
            v-model="nodeDetail.hostname"
            placeholder="请输入名称"
            :disabled="!isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="IP地址：" prop="ipaddr" class="w28ml20">
          <el-input v-model="nodeDetail.ipaddr" placeholder="请输入ip地址" :disabled="!isEdit"></el-input>
        </el-form-item>
        <el-form-item label="远程目录：" class="w28ml20">
          <el-input
            maxlength="40"
            v-model="nodeDetail.remoteRootDir"
            placeholder="请输入远程目录"
            :disabled="!isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="凭证：" class="w28ml20" prop="voucherId">
          <el-cascader
            style="width: 100%"
            placeholder="请选择凭证"
            expand-trigger="hover"
            :options="sshList"
            v-model="voucherId"
            @change="handleVoucher"
            :disabled="!isEdit"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="连接端口：" prop="port" class="w28ml20">
          <el-input v-model="nodeDetail.port" placeholder="请输入端口号" :disabled="!isEdit"></el-input>
        </el-form-item>
        <el-form-item label="超时时间：" class="w28ml20">
          <el-input
            type="number"
            @input="limitLength"
            :disabled="!isEdit"
            v-model="nodeDetail.timeout"
            placeholder="请输入超时限制"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="form-item dialog-btn" v-if="key !== 'detail'">   
          <div class="grid-content bg-purple">
            <el-button :disabled="isClick" @click="addNodeSubmit" type="primary">确认</el-button>
            <el-button class="nomal-button" @click="cancelDialog">取消</el-button>
          </div>  
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'NodeEdit',

  data () {
    var validateenvironmentType = (rule, value, callback) => {
      if (!this.nodeDetail.environmentId) {
        callback(new Error('请选择环境'))
      } else {
        callback()
      }
    }
    return {
      isPurposesd: false,
      clusterName: '',
      isShowDialog: false,
      isEdit: true,
      key: 'edit',
      data: [{}],
      testNodeName: '',
      voucherId: ['', ''],
      systemTypes: [],
      vids: [],
      nodeList: [],
      nodeDetail: {},
      envList: [],
      isEditTest: false,
      nodeUse: [{ label: '测试', value: '1' }, { label: '正式', value: '2' }],
      rules: {
        purposes: [
          { required: true, message: '请选择节点用途!', trigger: 'change' }
        ],
        port: [{ required: true, message: '请输入端口号!', trigger: 'blur' }],
        ipaddr: [{ required: true, message: '请输入ip地址!', trigger: 'blur' }],
        hostname: [
          { required: true, message: '请输入主机名!', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入节点名称!', trigger: 'blur' }],
        systemId: [
          { required: true, message: '请选择节点所属系统!', trigger: 'change' }
        ],
        voucherId: [
          { required: true, message: '请选择凭证！', trigger: 'change' }
        ],
        environmentType: [
          {
            required: true,
            validator: validateenvironmentType,
            trigger: 'change'
          }
        ]
        // addsysurl: [
        //   { required: true, validator: validateurl, trigger: "blur" }
        // ],
        // addSysvoucherId: [
        //   { required: true, message: "请输入代码库凭证!", trigger: "change" }
        // ],
        // svngit: [
        //   { required: true, message: "请选择代码库类型", trigger: "change" }
        // ]
      },
      sshList: [
        { label: 'SSH凭证', value: '0', children: [] },
        { label: '应用管理凭证', value: '1', children: [] },
        { label: '代码库凭证', value: '2', children: [] },
        { label: '数据库凭证', value: '3', children: [] }
      ]
    }
  },
  created () {
    let id = this.$route.query.id
    let key = this.$route.query.key
    if (id && key) {
      this.key = key
      this.nodeId = id
      this.getAllSystem()
    }
  },
  mounted () {
    // this.loadAll();
  },
  methods: {
    // 获取环境下拉
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

          this.getNodeDetail(this.nodeId)
        })
        .catch()
    },
    // 限制超时限制长度
    limitLength () {
      if (this.data.timeout.length > 40) {
        this.data.timeout = this.data.timeout.slice(0, 40)
      }
    },
    getNodeList () {
      this.nodeDetail.clusterName = ''
      if (this.data.systemId) {
        this.loadAll()
      } else {
        this.nodeList = []
      }
    },

    changeTest () {
      this.testNodeName = ''
      this.data.testNodeId = ''
      if (this.nodeDetail.purposes == 1) {
        this.isPurposesd = true
      } else {
        this.isPurposesd = false
      }
    },

    handleSelect (item) {
      this.data.testNodeId = item.name
    },
    querySearch (queryString, cb) {
      let nodeList = this.nodeList
      let results = queryString
        ? nodeList.filter(this.createFilter(queryString))
        : nodeList
      cb(results)
    },
    createFilter (queryString) {
      return nodeList => {
        return nodeList.value.indexOf(queryString) === 0
      }
    },
    // 获取集群
    loadAll () {
      //  let name = '';
      this.nodeList = []
      let purposes = ''
      axios.pullDownList(this.nodeDetail.systemId, purposes).then(data => {
        if (data.data.code === 200) {
          this.nodeList = data.data.data.result
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
    // 获取详情
    getNodeDetail (id) {
      axios.getNodeDetail(id).then(data => {
        if (data.data.code === 200) {
          let node = data.data.data.result
          this.openDialog(node, this.key)
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },

    // 点开查看修改
    openDialog (data, key) {
      this.data = JSON.parse(JSON.stringify(data))
      this.sshList.forEach(item => {
        if (item.children.length > 0) {
          item.children.forEach(d => {
            if (d.value == this.data.voucherId) {
              this.voucherId = [item.value, this.data.voucherId]
            }
          })
        }
      })

      if (key === 'detail') {
        this.isEdit = false
        this.isPurposesd = true
      } else {
        this.isEdit = true
        if (this.nodeDetail.purposes == 1) {
          this.isPurposesd = true
        } else {
          this.isPurposesd = false
        }
      }
      this.loadAll()
      // this.getVoucherList();
      // this.getNodeDetail(this.data.nodeId);
      this.nodeDetail = this.data
      this.testNodeName = ''
      // this.key = key;
      // this.isShowDialog = true;
    },
    handleVoucher (value) {
      this.nodeDetail.voucherId = value[1]
    },
    // 获取凭证列表
    getVoucherList () {
      this.sshList = [
        { label: 'SSH凭证', value: '0', children: [] },
        { label: '应用管理凭证', value: '1', children: [] },
        { label: '代码库凭证', value: '2', children: [] },
        { label: '数据库凭证', value: '3', children: [] }
      ]
      let voucherId = ''
      let voucherType = ''
      let _this = this
      let vids = this.data.voucherId
      axios.getVoucherList(voucherId, voucherType).then(function (res) {
        if (res.data.code == 200) {
          if (res.data.data.result && res.data.data.result.length) {
            let voucherList = res.data.data.result
            _this.sshList.forEach(item => {
              voucherList.forEach(itemChild => {
                if (itemChild.voucherType === item.value) {
                  let obj = {}
                  obj.label = itemChild.name
                  obj.value = itemChild.voucherId
                  item.children.push(obj)
                  if (vids === itemChild.voucherId) {
                    _this.vids = [item.value, itemChild.voucherId]
                  }
                }
              })
            })

            _this.getenvtablist()
          }
        }
      })
    },
    // 获取系统下拉
    getAllSystem () {
      let name = ''
      axios.getcigroupSystablist(name).then(data => {
        if (data.data.code === 200) {
          this.systemTypes = data.data.data.result
          this.getVoucherList()
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    // 修改数据
    addNodeSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (
            !/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/g.test(
              this.nodeDetail.ipaddr
            )
          ) {
            this.$notify({
              title: '提示',
              message: '请输入正确的ip地址',
              type: 'error'
            })
          } else if (
            !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/g.test(
              this.nodeDetail.port
            )
          ) {
            this.$notify({
              title: '提示',
              message: '请输入正确的端口号',
              type: 'error'
            })
          } else {
            axios.addNode(this.nodeDetail).then(data => {
              if (data.data.code === 200) {
                // this.isbl = true
                //  this.$emit("getNodeList", this.isbl);
                this.$notify({
                  title: '提示',
                  message: '修改成功！',
                  type: 'success'
                })
                this.$router.push({
                  path: '/AutomatedRelease/NodeManage',
                  query: {
                    code: 3
                  }
                })
                // this.$parent.getNodes();
                // this.cancelDialog();
              } else {
                this.$notify({
                  title: '提示',
                  message: data.data.message,
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },

    cancelDialog () {
      this.$router.push({
        path: '/AutomatedRelease/NodeManage',
        query: {
          code: 3
        }
      })
    }
  }
}
</script>

<style scoped>
.node-edit {
  background: #fff;
  margin: 10px;
}

.node-pannel {
  padding: 20px 0 20px 128px;
  width: 50%;
}

.form-item {
  padding-left: 140px;
  position: relative;
  padding-top: 10px;
  min-height: 30px;
}
.form-item .el-input {
  width: 100%;
}
.form-item label {
  position: absolute;
  left: 0;
  top: 10px;
  width: 130px;
  text-align: right;
  line-height: 30px;
  font-size: 14px;
  color: #3e444a;
}
.get-title {
  font-size: 18px;
  font-weight: normal;
  padding-bottom: 10px;
  text-align: center;
}
.dialog-btn {
  padding: 20px 20px 20px 140px;
}
.dialog-btn .btn-cancel {
  float: right;
}
.dialog-btn .btn-info {
}
.dialog-detail .close-btn {
  float: right;
}
.dialog-detail .el-tabs__item {
  padding: 0 20px;
  height: 40px !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 40px !important;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  position: relative;
}
.dialog-detail .el-tabs__item.is-active {
  color: #00d1b2 !important;
}
.gap-item {
  margin-top: 10px;
}
.node-title {
  color: #585858;
  font-size: 16px;
  padding: 20px 0 0;
}
.node-title span {
  display: inline-block;
  width: 6px;
  border-radius: 10px;
  margin-right: 20px;
  height: 20px;
  background: #0280ff;
  vertical-align: middle;
}
.i-close {
  height: 20px;
  float: right;
  padding: 0 50px;
}
.i-close img {
  width: 14px;
}
.node-fr {
  margin-left: 200px;
}
</style>
