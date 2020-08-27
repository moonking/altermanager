<template>
  <div class="node-layout aibms-color-bg">
    <!-- <div class="node-title">
      <p class="mark-icon padding-title headtitle">新增节点</p>
    </div> -->
    <div class="item-block-title paddingTop" @click="nodeOpen = !nodeOpen">
      <div class="item-block-title-mark"></div>
      <span class="item-block-title-font">新增节点</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: nodeOpen ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <div class="node-pannel item-block-content" :style="{height: nodeOpen ? 'auto' : 0}">
      <el-form
        :model="data"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="节点名称：" prop="name" class="w28ml20">
          <el-input maxlength="20" v-model="data.name" placeholder="请输入节点名称"></el-input>
        </el-form-item>
        <el-form-item label="节点用途：" prop="purposes" class="w28ml20" style="margin-top: 20px;">
          <el-select
            style="width: 100%"
            clearable
            @change="changeTest"
            v-model="data.purposes"
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
            v-model="data.systemId"
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
        <el-form-item label="所属环境：" prop="env" class="w28ml20">
          <el-select placeholder="请选择环境" v-model="data.env" style="width: 100%" clearable>
            <el-option v-for="Env in envList" :label="Env.lab" :value="Env.val" :key="Env.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属集群：" class="w28ml20">
          <el-select
            style="width: 100%"
            clearable
            v-model="data.clusterName"
            placeholder="请选择集群"
            :disabled="isPurposesd"
          >
            <el-option
              v-for="(item,index)  in clusterList"
              :key="index"
              :label="item.name"
              :value="item.clusterId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="主机名：" prop="hostname" class="w28ml20">
          <el-input maxlength="40" v-model="data.hostname" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="IP地址：" prop="ipaddr" class="w28ml20">
          <el-input v-model="data.ipaddr" placeholder="请输入ip地址"></el-input>
        </el-form-item>
        <el-form-item label="远程目录：" class="w28ml20">
          <el-input maxlength="40" v-model="data.remoteRootDir" placeholder="请输入远程目录"></el-input>
        </el-form-item>
        <el-form-item label="凭证：" class="w28ml20" prop="voucherId">
          <el-cascader
            style="width: 100%"
            placeholder="请选择凭证"
            expand-trigger="hover"
            :options="sshList"
            :value="voucherId"
            @change="handleVoucher"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="连接端口：" prop="port" class="w28ml20">
          <el-input v-model="data.port" placeholder="请输入端口号"></el-input>
        </el-form-item>
        <el-form-item label="超时时间：" class="w28ml20" maxlength="6">
          <el-input type="number" @input="limitLength" v-model="data.timeout" placeholder="请输入超时限制"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-item dialog-btn">   
        <div class="grid-content bg-purple">
          <el-button :disabled="isClick" @click="submitNode" type="primary">确认</el-button>
          <el-button class="nomal-button" @click="cancelSubmit">取消</el-button>
        </div>   
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'NodeAdd',
  data () {
    return {
      data: {
        isbl: false,
        timeout: 300000,
        port: '',
        ipaddr: '',
        voucherId: [],
        remoteRootDir: '',
        hostname: '',
        name: '',
        purposes: '',
        systemId: '',
        clusterName: '',
        env: ''
      },
      rules: {
        purposes: [
          { required: true, message: '请选择节点用途!', trigger: 'change' }
        ],
        port: [{ required: true, message: '请输入端口号!', trigger: 'blur' }],
        ipaddr: [{ required: true, message: '请输入ip地址!', trigger: 'blur' }],
        hostname: [
          { required: true, message: '请输入主机名!', trigger: 'blur' }
        ],
        name: [
          {
            required: true,
            message: '请输入节点名称!且长度在0到20之间',
            trigger: 'blur'
          }
        ],
        systemId: [
          { required: true, message: '请选择节点所属系统!', trigger: 'change' }
        ],
        env: [{ required: true, message: '请选择环境', trigger: 'change' }],
        // addsysurl: [
        //   { required: true, validator: validateurl, trigger: "blur" }
        // ],
        // addSysvoucherId: [
        //   { required: true, message: "请输入代码库凭证!", trigger: "change" }
        // ],
        voucherId: [
          { required: true, message: '请选择凭证！', trigger: 'change' }
        ]
      },
      isClick: false,
      voucherId: [],
      systemTypes: [],
      nodeUse: [{ label: '测试', value: '1' }, { label: '正式', value: '2' }],
      testNodeName: '',
      clusterList: [],
      isEditTest: false,
      isPurposesd: false,
      nodeOpen: true, // 控制展开或收缩
      sshList: [
        { label: 'SSH凭证', value: '0', children: [] },
        { label: '应用管理凭证', value: '1', children: [] },
        { label: '代码库凭证', value: '2', children: [] },
        { label: '数据库凭证', value: '3', children: [] }
      ],
      envList: []
    }
  },
  created () {
    this.getAllSystem()
    this.getVoucherList()
    this.getenvtablist()
  },
  mounted () {},
  // beforeRouteLeave(to, from, next) {
  //   let bl = checkModification(this.isbl);
  //   if (bl) {
  //     const answer = window.confirm("页面相关数据还未保存，是否离开当前页面!");
  //     if (answer) {
  //       next();
  //     } else {
  //       // 不kp;o支持传递回调(因为this实例已经创建可以获取到，所以没必要)
  //       next(false);
  //     }
  //   } else {
  //     next();
  //   }
  // },
  beforeDestroy () {},

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
        })
        .catch()
    },
    // 限制超时限制长度
    limitLength () {
      if (this.data.timeout.length > 6) {
        this.data.timeout = this.data.timeout.slice(0, 6)
      }
    },
    // 根据系统查询集群
    getNodeList () {
      // alert(888);
      this.data.clusterName = ''
      if (this.data.systemId) {
        this.loadAll()
      } else {
        this.clusterList = []
      }
    },
    handleVoucher (value) {
      this.data.voucherId = value[1]
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
      // let com = this.data.voucherId;
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
                }
              })
            })
          }
        }
      })
    },
    // 取消新增
    cancelSubmit () {
      this.voucherId = []
      this.data = {}
      this.testNodeName = ''
      this.$router.push({
        path: '/AutomatedRelease/NodeManage',
        query: { code: 3 }
      })
    },
    changeTest () {
      this.testNodeName = ''
      this.data.testNodeId = ''
      if (this.data.purposes == 1) {
        this.isPurposesd = true
      } else {
        this.isPurposesd = false
      }
    },

    // 获取下拉集群
    loadAll () {
      // let name = '';
      this.nodeList = []
      this.isEditTest = true
      let purposes = ''
      axios.pullDownList(this.data.systemId, purposes).then(data => {
        if (data.data.code === 200) {
          if (data.data.data.result) {
            this.clusterList = data.data.data.result
            console.log(this.clusterList)
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
    // 获取系统
    getAllSystem () {
      let name = ''
      axios.getcigroupSystablist(name).then(data => {
        if (data.data.code === 200) {
          this.systemTypes = data.data.data.result
        }
      })
    },

    // 确定新增
    submitNode () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = {
            name: this.data.name,
            purposes: this.data.purposes, // 节点用途
            systemId: this.data.systemId, // 系统id
            clusterId: this.data.clusterName, // 集群
            hostname: this.data.hostname, // 主机
            ipaddr: this.data.ipaddr,
            remoteRootDir: this.data.remoteRootDir, // 远程目录
            voucherId: this.data.voucherId, // 凭证
            port: this.data.port,
            nodeId: '',
            timeout: this.data.timeout,
            environmentId: this.data.env
          }
          if (
            !/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/g.test(
              this.data.ipaddr
            )
          ) {
            this.$notify({
              title: '提示',
              message: '请输入正确的ip地址',
              type: 'error'
            })
          } else if (
            !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/g.test(
              this.data.port
            )
          ) {
            this.$notify({
              title: '提示',
              message: '请输入正确的端口号',
              type: 'error'
            })
          } else {
            axios.addNode(data).then(res => {
              console.log(res)
              if (res.data.code == 200) {
                this.$router.go(-1)
                //   this.$refs.nodeForm.resetFields();
                this.$notify({
                  title: '提示',
                  type: 'success',
                  message: '节点新增成功'
                })
                this.isdisabled = false
              } else {
                this.isbl = false
                this.$notify({
                  title: '提示',
                  message: res.data.message
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.node-alert {
  padding: 4px 10px 8px;
  color: #ff0000;
  font-size: 12px;
}
.node-alert img {
  height: 14px;
  margin-right: 5px;
  vertical-align: text-bottom;
}
.form-item {
  padding-left: 140px;
  position: relative;
  padding-top: 10px;
  min-height: 30px;
  margin-bottom: 10px;
}
.form-item label {
  position: absolute;
  left: 0;
  top: 10px;
  line-height: 30px;
  width: 130px;
  font-size: 14px;
  text-align: right;
}
.dialog-btn {
  overflow: hidden;
  padding: 30px 0 50px 0;
  text-align: center;
}
.dialog-btn .btn-cancel {
  float: right;
}
.node-layout {
  background: #fff;
  margin: 10px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.16);
}
.node-title {
  color: #585858;
  font-size: 16px;
  padding-top: 6px;
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
.node-pannel {
  padding: 0 84px;
}
.node-fr {
  margin-left: 200px;
}
.w28ml20 {
  width: 35%;
  margin-left: 20px;
}
.headtitle {
  padding: 10px 0;
}
</style>
