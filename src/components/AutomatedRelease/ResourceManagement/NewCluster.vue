<template>
  <div class="container refreshContainer aibms-color-bg non-border non-shadow">
    <!-- <p class="mark-icon">新增集群</p> -->
    <div class="item-block-title paddingTop" @click="clusterOpen = !clusterOpen">
      <div class="item-block-title-mark"></div>
      <span class="item-block-title-font">{{this.$route.query.clusterId ? "新增集群" : "编辑集群"}}</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: clusterOpen ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <el-form
      :model="ruleForm"
      ref="clusterForm"
      label-width="160px"
      :rules="rules"
      class="add-form item-block-content"
      :style="{height: clusterOpen ? 'auto' : 0}"
    >
      <el-form-item label="集群名称：" prop="name">
        <el-input v-model="ruleForm.name" class="name-input" style="width:632px"></el-input>
      </el-form-item>
      <!-- <el-form-item label="节点" prop="node">
        <el-select placeholder="请选择节点" v-model="ruleForm.node"
        @change="selectOne" >
          <el-option
            v-for="(node,index) in nodeList"
            :label="node.name"
            :value="node.nodeId"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>-->

      <el-form-item label="所属系统：" prop="system">
        <el-select placeholder="请选择系统" v-model="ruleForm.system" style="width:632px">
          <el-option
            v-for="system in systemList"
            :label="system.name"
            :value="system.systemId"
            :key="system.systemId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="环境：" prop="env">
        <el-select placeholder="请选择环境" v-model="ruleForm.env" style="width:632px">
          <el-option v-for="Env in envList" :label="Env.lab" :value="Env.val" :key="Env.val"></el-option>
        </el-select>
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
      <el-form-item style="padding-top: 20px;">
        <span
          class="cm-btn deep"
          style="margin-right: 200px;"
          @click="handleConfirm"
        >{{$route.query.clusterId?'保存':'确认'}}</span>
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
        env: '',
        system: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        system: [{ required: true, message: '请选择系统', trigger: 'change' }],
        env: [{ required: true, message: '请选择环境', trigger: 'change' }],
        purposes: [
          { required: true, message: '请选择用途', trigger: 'change' }
        ],
        systemName: ''
      },
      nodeList: [],
      systemList: [],
      purposesList: [
        { lab: '构建', val: '1' },
        { lab: '部署', val: '2' }
      ],
      envList: [
        // { lab: "生产", val: "1" },
        // { lab: "测试", val: "2" },
      ],
      clusterOpen: true // 控制展开
    }
  },
  created () {
    this.getSystemList()
    // this.getnodeList();
    this.getenvtablist()
    if (this.$route.query.clusterId) {
      this.getclusterDetail()
    }
  },
  methods: {
    selectOne (event, item) {
      // change 触发事件
      console.log(this.ruleForm.node)
      // 直接就拿到当前的这个对象了
    },
    getclusterDetail () {
      axios.clusterDetail(this.$route.query.clusterId).then(res => {
        if (res.status == 200) {
          console.log(res)
          this.ruleForm.name = res.data.data.result.name
          this.ruleForm.system = res.data.data.result.systemId
          this.ruleForm.env = res.data.data.result.environmentId
          this.ruleForm.purposes = res.data.data.result.purposes
        }
      })
    },

    handleConfirm () {
      this.$refs.clusterForm.validate(valid => {
        if (valid) {
          let data = {
            name: this.ruleForm.name,
            systemId: this.ruleForm.system,
            environmentId: this.ruleForm.env,
            purposes: this.ruleForm.purposes,
            clusterId: this.$route.query.clusterId
              ? this.$route.query.clusterId
              : ''
          }
          axios.addCluster(data).then(res => {
            if (res.data.code == 200) {
              this.$router.go(-1)
              this.$refs.clusterForm.resetFields()
              if (this.$route.query.clusterId) {
                this.$notify({
                  title: '提示',
                  message: '集群修改成功'
                })
              } else {
                this.$notify({
                  title: '提示',
                  message: '集群添加成功'
                })
              }

              this.isdisabled = false
            } else if (res.data.code == 500) {
              this.$notify({
                title: '提示',
                message: '集群名称已存在'
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
      this.$refs.clusterForm.resetFields()
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
    },

    // getnodeList() {
    //   let name = "";

    //   nodeList(name).then(res => {

    //       if (res.data.success) {
    //       this.nodeList = res.data.data.result;
    //        console.log(this.nodeList)
    //     }
    //   });
    // },
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
    }
  }
}
</script>
<style scoped>
.container .add-form {
  padding: 20px 0 0 30px;
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
