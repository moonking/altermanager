<template>
  <div class="container aibms-color-bg non-border">
    <p class="mark-icon white-color">新增节点</p>
    <el-form :model="ruleForm" ref="nodeForm" label-width="160px" :rules="rules" class="add-form">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="ruleForm.name" class="name-input" style="width:632px" />
      </el-form-item>
      <el-form-item label="用途：" prop="purposes">
        <el-select placeholder="请选择用途" v-model="ruleForm.purposes" style="width:632px">
          <el-option
            v-for="purposes in purposesList"
            :label="purposes.lab"
            :value="purposes.val"
            :key="purposes.val"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统：" prop="system">
        <el-select placeholder="请选择系统" v-model="ruleForm.system" style="width:632px">
          <el-option
            v-for="system in systemList"
            :label="system.name"
            :value="system.systemId"
            :key="system.systemId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="集群：" prop="cluster">
        <el-select placeholder="请选择集群" v-model="ruleForm.cluster" style="width:632px">
          <el-option
            v-for="cluster in clusterList"
            :label="cluster.lab"
            :value="cluster.val"
            :key="cluster.val"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主机名：" prop="hostname">
        <el-input v-model="ruleForm.hostname" class="name-input" style="width:632px"></el-input>
      </el-form-item>
      <el-form-item label="IP地址：" prop="ipaddress">
        <el-input v-model="ruleForm.ipaddress" class="name-input" style="width:632px"></el-input>
      </el-form-item>
      <el-form-item label="SSH凭证：" prop="certificate">
        <el-select placeholder="请选择SSH凭证" v-model="ruleForm.certificate" style="width:632px">
          <el-option
            v-for="certificate in certificateList"
            :label="certificate.lab"
            :value="certificate.val"
            :key="certificate.val"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="远程目录：" prop="remotedirectory">
        <el-input v-model="ruleForm.remotedirectory" class="name-input" style="width:632px"></el-input>
      </el-form-item>
      <el-form-item label="SSH端口：" prop="port">
        <el-input v-model="ruleForm.port" class="name-input" style="width:632px"></el-input>
      </el-form-item>
      <el-form-item label="SSH登录超时限制" prop="timeoutlimit">
        <el-input v-model="ruleForm.timeoutlimit" class="name-input" style="width:632px"></el-input>
      </el-form-item>
      <el-form-item>
        <span class="cm-btn deep" style="margin-right: 200px;" @click="handleConfirm">确认</span>
        <span class="cm-btn nomal-button" style="border-radius: 3px" @click.prevent="handleCancle">取消</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        node: '',
        purposes: '',
        cluster: '',
        hostname: '',
        ipaddress: '',
        certificate: '',
        remotedirectory: '',
        port: '',
        timeoutlimit: '',
        system: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        hostname: [
          { required: true, message: '请输入主机名', trigger: 'blur' }
        ],
        ipaddress: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ],
        certificate: [
          { required: true, message: '请选择凭证', trigger: 'change' }
        ],
        remotedirectory: [
          { required: true, message: '请输入远程目录', trigger: 'blur' }
        ],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        timeoutlimit: [
          { required: true, message: '请输入超时限制时间', trigger: 'blur' }
        ],
        cluster: [{ required: true, message: '请选择集群', trigger: 'change' }],
        system: [{ required: true, message: '请选择系统', trigger: 'change' }],
        purposes: [
          { required: true, message: '请选择用途', trigger: 'change' }
        ],
        systemName: ''
      },
      systemList: [],
      cluster: [],
      certificateList: [],
      purposesList: [{ lab: '测试', val: '1' }, { lab: '部署', val: '2' }]
    }
  },
  created () {
    this.getSystemList()
  },
  methods: {
    handleConfirm () {
      this.$refs.nodeForm.validate(valid => {
        if (valid) {
          let data = {
            name: this.ruleForm.name,
            //  nodeId: this.ruleForm.node,
            systemId: this.ruleForm.system,
            ipaddr: this.ruleForm.ipaddress,
            purposes: this.ruleForm.purposes,
            clusterId: this.ruleForm.cluster,
            systemName: this.systemName,
            remoteRootDir: this.ruleForm.remotedirectory,
            port: this.ruleForm.port,
            nodeId: ''
          }
          axios.addNode(data).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              this.$router.go(-1)
              this.$refs.nodeForm.resetFields()
              this.$notify({
                title: '提示',
                message: '节点添加成功'
              })
              this.isdisabled = false
            } else if (res.data.code == 500) {
              this.$notify({
                title: '提示',
                message: '节点名称已存在'
              })
            } else {
              this.isbl = false
              this.$notify({
                title: '提示',
                message: '添加失败'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancle () {
      this.$refs.nodeForm.resetFields()
      this.$router.go(-1)
    },
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
    }
  }
}
</script>
<style scoped>
.container .add-form {
  padding: 20px 0 0 0;
}
.container .name-input {
  width: 20%;
}
.block {
  text-align: right;
  background: #fff;
  margin-left: 15px;
  width: 99.8%;
  padding: 16px 0 0px;
}
</style>
