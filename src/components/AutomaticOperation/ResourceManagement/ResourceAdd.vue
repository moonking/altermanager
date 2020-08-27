<template>
  <div class="resource-add aibms-color-bg non-shadow">
    <div class="item-block-title paddingTop" @click="closeBlock(1)">
      <div class="item-block-title-mark"></div>
      <span class="item-block-title-font">基本信息</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <div class="resource-form" :style="{height: blockSwitch[1] ? 'auto' : '0'}">
      <el-form
        :inline="true"
        :rules="rules"
        :model="formList"
        label-width="120px"
        label-position="right"
      >
        <el-form-item class="resource-item" label="资源名称：" prop="name">
          <el-input
            :disabled="status === 'read'"
            maxlength="20"
            v-model="formList.name"
            placeholder="请输入资源名称"
            style="min-width: 400px"
          />
        </el-form-item>
        <el-form-item class="resource-item" label="所属环境：" prop="environmental">
          <el-select
            :disabled="status === 'read'"
            v-model="formList.environmentId"
            style="min-width: 400px"
            placeholder="请选择所属环境"
          >
            <el-option
              v-for="environmental in environmentals"
              :label="environmental.label"
              :value="environmental.value"
              :key="environmental.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="resource-item" label="资源类型：" prop="resourceType">
          <!-- <el-select
            :disabled="status === 'read'"
            v-model="formList.resourcesType"
            style="min-width: 400px"
            placeholder="请选择资源类型"
          >
            <el-option
              v-for="(type,index) in resourceTypes"
              :label="type.label"
              :value="type.value"
              :key="index"
            ></el-option>
          </el-select>-->
          <el-cascader
            :disabled="status === 'read'"
            v-model="formList.type"
            :options="resourceTypes"
            style="min-width: 400px"
            placeholder="请选择资源类型"
          />
        </el-form-item>
        <div v-if="formList.type[0] == 1">
          <el-form-item class="resource-item" label="主机名：" prop="hostName">
            <el-input
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.hostName"
              placeholder="请输入主机名"
              style="min-width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item class="resource-item" label="IP地址：" prop="ipAddress">
            <el-input
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.ipAddress"
              placeholder="请输入IP地址"
              style="min-width: 400px"
            />
          </el-form-item>
          <el-form-item
            class="resource-item"
            label="远程连接凭证："
            prop="voucherId"
            v-if="status ==='create'"
          >
            <el-cascader
              :disabled="status === 'read'"
              style="width: 400px"
              placeholder="请选择凭证"
              expand-trigger="hover"
              :options="sshList"
              :value="voucherId"
              @change="handleVoucher"
              clearable
            />
          </el-form-item>
          <el-form-item class="resource-item" label="远程连接凭证：" prop="voucherId" v-else>
            <el-cascader
              :disabled="status === 'read'"
              style="width: 400px"
              placeholder="请选择凭证"
              expand-trigger="hover"
              :options="sshList"
              v-model="voucherId"
              @change="handleVoucher"
              clearable
            />
            <!-- <el-select
              :disabled="status === 'read'"
              v-model="formList.voucherId"
              style="min-width: 400px"
              placeholder="请选择远程连接凭证"
            >
              <el-option
                v-for="proof in resourceProofs"
                :label="proof.label"
                :value="proof.value"
                :key="proof.value"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item class="resource-item" label="远程连接端口：" prop="longPort">
            <el-input
              type="number"
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.portNum"
              placeholder="请输入远程连接端口"
              style="min-width: 400px"
            />
          </el-form-item>
          <el-form-item class="resource-item" label="远程连接超时时间：" prop="time">
            <el-input
              type="number"
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.outTime"
              placeholder="请输入远程连接超时时间"
              style="min-width: 400px"
            />
          </el-form-item>
        </div>
        <div v-else-if="formList.type[0] == 2">
          <el-form-item class="resource-item" label="IP地址：" prop="ipAddress">
            <el-input
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.ipAddress"
              placeholder="请输入IP地址"
              style="min-width: 400px"
            />
          </el-form-item>
          <el-form-item class="resource-item" label="控制台端口：" prop="longPort">
            <el-input
              type="number"
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.portNum"
              placeholder="请输入控制台端口"
              style="min-width: 400px"
            />
          </el-form-item>
          <el-form-item
            class="resource-item"
            label="控制台凭证："
            prop="voucherId"
            v-if="status ==='create'"
          >
            <el-cascader
              :disabled="status === 'read'"
              style="width: 400px"
              placeholder="请选择凭证"
              expand-trigger="hover"
              :options="sshList"
              :value="voucherId"
              @change="handleVoucher"
              clearable
            />
          </el-form-item>
          <el-form-item class="resource-item" label="控制台凭证：" prop="voucherId" v-else>
            <el-cascader
              :disabled="status === 'read'"
              style="width: 400px"
              placeholder="请选择凭证"
              expand-trigger="hover"
              :options="sshList"
              v-model="voucherId"
              @change="handleVoucher"
              clearable
            />
            <!-- <el-select
              :disabled="status === 'read'"
              v-model="formList.voucherId"
              style="min-width: 400px"
              placeholder="请选择远程连接凭证"
            >
              <el-option
                v-for="proof in resourceProofs"
                :label="proof.label"
                :value="proof.value"
                :key="proof.value"
              ></el-option>
            </el-select>-->
          </el-form-item>

          <el-form-item class="resource-item" label="远程目录：" prop="remoteDirectory">
            <el-input
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.remoteDirectory"
              placeholder="请输入远程目录"
              style="min-width: 400px"
            />
          </el-form-item>
        </div>
        <div v-else-if="formList.type[0] == 3">
          <el-form-item class="resource-item" label="实例名：" prop="instanceName">
            <el-input
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.instanceName"
              placeholder="请输入实例名"
              style="min-width: 400px"
            />
          </el-form-item>
          <el-form-item class="resource-item" label="IP地址：" prop="ipAddress">
            <el-input
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.ipAddress"
              placeholder="请输入IP地址"
              style="min-width: 400px"
            />
          </el-form-item>
          <el-form-item
            class="resource-item"
            label="数据库凭证："
            prop="voucherId"
            v-if="status ==='create'"
          >
            <el-cascader
              :disabled="status === 'read'"
              style="width: 400px"
              placeholder="请选择凭证"
              expand-trigger="hover"
              :options="sshList"
              :value="voucherId"
              @change="handleVoucher"
              clearable
            />
          </el-form-item>
          <el-form-item class="resource-item" label="数据库凭证：" prop="voucherId" v-else>
            <el-cascader
              :disabled="status === 'read'"
              style="width: 400px"
              placeholder="请选择数据库凭证"
              expand-trigger="hover"
              :options="sshList"
              v-model="voucherId"
              @change="handleVoucher"
              clearable
            />
            <!-- <el-select
              :disabled="status === 'read'"
              v-model="formList.voucherId"
              style="min-width: 400px"
              placeholder="请选择远程连接凭证"
            >
              <el-option
                v-for="proof in resourceProofs"
                :label="proof.label"
                :value="proof.value"
                :key="proof.value"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item class="resource-item" label="数据库端口：" prop="longPort">
            <el-input
              type="number"
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.portNum"
              placeholder="请输入数据库端口"
              style="min-width: 400px"
            />
          </el-form-item>
        </div>
        <div v-else-if="formList.type[0] == 4">
          <el-form-item class="resource-item" label="IP地址：" prop="ipAddress">
            <el-input
              :disabled="status === 'read'"
              maxlength="50"
              v-model="formList.ipAddress"
              placeholder="请输入IP地址"
              style="min-width: 400px"
            />
          </el-form-item>
          <el-form-item
            class="resource-item"
            label="连接凭证："
            prop="voucherId"
            v-if="status ==='create'"
          >
            <el-cascader
              :disabled="status === 'read'"
              style="width: 400px"
              placeholder="请选择凭证"
              expand-trigger="hover"
              :options="sshList"
              :value="voucherId"
              @change="handleVoucher"
              clearable
            />
          </el-form-item>
          <el-form-item class="resource-item" label="连接凭证：" prop="voucherId" v-else>
            <el-cascader
              :disabled="status === 'read'"
              style="width: 400px"
              placeholder="请选择数据库凭证"
              expand-trigger="hover"
              :options="sshList"
              v-model="voucherId"
              @change="handleVoucher"
              clearable
            />
          </el-form-item>
          <el-form-item class="resource-item" label="远程连接端口：" prop="longPort">
            <el-input
              type="number"
              :disabled="status === 'read'"
              maxlength="20"
              v-model="formList.portNum"
              placeholder="请输入远程连接端口"
              style="min-width: 400px"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="item-block-title paddingTop" @click="closeBlock(2)">
      <div class="item-block-title-mark"></div>
      <span class="item-block-title-font">支持工具</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <div class="resource-form" :style="{height: blockSwitch[2] ? 'auto' : '0'}">
      <el-form
        :inline="true"
        :rules="rules"
        label-width="138px"
        label-position="right"
        class="pl32"
      >
        <el-form-item class="resource-item" label="支持工具：" prop="supTools">
          <el-checkbox-group v-model="formList.supTools" :disabled="status === 'read'">
            <el-checkbox label="python" />
            <el-checkbox label="shell" />
            <el-checkbox label="saltstack" />
            <el-checkbox label="ansible" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-group" v-if="status === 'create'">
      <button class="cm-btn deep" style="margin-right:200px" @click="addRes">确 定</button>
      <button class="cm-btn isoutline" @click="cancel">取 消</button>
    </div>
    <div class="btn-group" v-if="status === 'edit'">
      <button class="cm-btn deep" style="margin-right:200px" @click="editResource">确定修改</button>
      <button class="cm-btn isoutline" @click="cancel">取 消</button>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
import common from '@/utils/commonjs'
export default {
  data () {
    var validatedev = (rule, value, callback) => {
      // this.formList.supTools = JSON.stringify(this.formList.supTools)
      // console.log(this.formList.supTools)
      if (this.formList.supTools === '') {
        callback(new Error('请选择工具集'))
      } else {
        callback()
      }
    }
    var validateenv = (rule, value, callback) => {
      if (this.formList.environmentalId === '') {
        callback(new Error('请选择所属环境'))
      } else {
        callback()
      }
    }
    var validatetype = (rule, value, callback) => {
      if (this.formList.type === '') {
        callback(new Error('请选择资源类型'))
      } else {
        callback()
      }
    }
    return {
      voucherId: [],
      status: 'read',
      tools: [],
      formList: {
        supTools: [],
        type: []
      },
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
      blockSwitch: { '1': true, '2': false },
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
          label: '数据库',
          children: [
            {
              value: '3-1',
              label: 'Oracle'
            },
            { value: '3-2', label: 'MySQL' },
            { value: '3-3', label: 'SQL Server' }
          ]
        },
        {
          value: '4',
          label: '网络设备'
        }
      ],
      sshList: [
        { label: 'SSH凭证', value: '0', children: [] },
        { label: '应用管理凭证', value: '1', children: [] },
        { label: '代码库凭证', value: '2', children: [] },
        { label: '数据库凭证', value: '3', children: [] }
      ],
      // resourceProofs: [
      //   {
      //     value: 1,
      //     label: '通用SSH凭证'
      //   }, {
      //     value: 2,
      //     label: '特殊SSH凭证'
      //   }
      // ],
      resourceProofs: [],
      rules: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        environmental: [
          { required: true, validator: validateenv, trigger: 'change' }
        ],
        resourceType: [
          { required: true, validator: validatetype, trigger: 'change' }
        ],
        hostName: [
          {
            required: true,
            message: '请输入主机名称',
            trigger: 'blur'
          }
        ],
        ipAddress: [
          { required: true, message: '请输入ip地址', trigger: 'blur' }
        ],
        supTools: [
          { required: true, validator: validatedev, trigger: 'change' }
        ],
        instanceName: [
          { required: true, message: '请输入实例名', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getVoucherList()
    this.envtablist()
    let query = this.$route.query
    this.status = this.$route.params.status
    if (
      (this.status === 'edit' || this.status === 'read') &&
      query.resourcesId
    ) {
      this.resourcesId = query.resourcesId
      this.getResDetail()
    }
  },
  methods: {
    closeBlock (num) {
      this.blockSwitch[num] = !this.blockSwitch[num]
    },
    // 获取环境
    envtablist () {
      let data = {}
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
    handleVoucher (value) {
      this.voucherId = value[1]
      this.formList.voucherId = value[1]
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
      let vids = this.voucherId
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
                  if (vids === itemChild.voucherId) {
                    _this.vids = [item.value, itemChild.voucherId]
                  }
                }
              })
            })
          }
        }
      })
    },
    // 获取资源管理详情
    getResDetail () {
      axios.getResDetail(this.resourcesId).then(res => {
        if (res.data.code === 200) {
          let obj = res.data.data
          // console.log(obj)
          if (obj.databaseType) {
            // obj.type = new Array(
            //   obj.resourcesType,
            //   `${obj.resourcesType}-${obj.databaseType}`
            // )
            obj.type = [obj.resourcesType, `${obj.resourcesType}-${obj.databaseType}`]
          } else {
            obj.type = [obj.resourcesType]
            // obj.type = new Array(obj.resourcesType)
          }
          this.formList = obj
          this.formList.supTools = common.evil(res.data.data.supTools)
          this.voucherId = res.data.data.voucherId
          this.tools = res.data.data.supTools
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 确定增加
    addRes () {
      // let devtools = this.formList.toolsName.toString();
      // console.log(devtools)
      // this.formList.voucherId = this.voucherId;
      let formData = this.formList
      let data = {
        MaResources: formData
      }
      this.$set(data.MaResources, 'resourcesType', this.formList.type[0])
      if (this.formList.type[1]) {
        let typeStr = this.formList.type[1].split('-')
        this.$set(data.MaResources, 'databaseType', typeStr[1])
      }
      data.MaResources.voucherId = this.voucherId
      // data.MaResources.supTools = this.formList.supTools.toString();
      data.MaResources.supTools = JSON.stringify(this.formList.supTools)
      if (!/[a-z]/i.test(data.MaResources.supTools)) {
        this.$notify({
          title: '提示',
          message: '请选择工具集',
          type: 'error'
        })
        this.formList.supTools = []
      } else if (
        this.formList.portNum &&
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/g.test(
          this.formList.portNum
        )
      ) {
        this.$notify({
          title: '提示',
          message: '请输入正确的端口号',
          type: 'error'
        })
      } else {
        data.MaResources.portNum = Number(data.MaResources.portNum)
        axios.addResource(data.MaResources).then(res => {
          if (res.data.code === 200) {
            this.formList.supTools = []

            this.$router.back(-1)
            if (res) {
              this.$notify({
                title: '提示',
                message: '添加成功',
                type: 'success'
              })
            }
          } else {
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      }
    },
    // 修改
    editResource () {
      //  console.log(this.formList.supTools)
      //       if(this.formList.supTools.length == 4){
      //         console.log(888888)
      //         this.formList.supTools = ['Pathon','shell','saltstack','ansible']
      //       }
      let formData = this.formList
      let data = {
        MaResources: formData
      }
      this.$set(data.MaResources, 'resourcesType', this.formList.type[0])
      if (this.formList.type[1]) {
        let typeStr = this.formList.type[1].split('-')
        this.$set(data.MaResources, 'databaseType', typeStr[1])
      }
      data.MaResources.voucherId = this.voucherId
      let toolStr = JSON.stringify(this.formList.supTools)
      data.MaResources.supTools = toolStr
      if (!/[a-z]/i.test(data.MaResources.supTools)) {
        this.$notify({
          title: '提示',
          message: '请选择工具集',
          type: 'error'
        })
        this.formList.supTools = []
      } else if (
        this.formList.portNum &&
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/g.test(
          this.formList.portNum
        )
      ) {
        this.$notify({
          title: '提示',
          message: '请输入正确的端口号',
          type: 'error'
        })
      } else {
        axios.updateresour(data.MaResources).then(res => {
          if (res.data.code === 200) {
            this.$router.back(-1)
            if (res) {
              this.$notify({
                title: '提示',
                message: '修改成功',
                type: 'success'
              })
            }
          } else {
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
            this.formList.supTools = this.tools
          }
        })
      }
    },
    // 取消增加或修改
    cancel () {
      this.$router.push({
        path: '/AutomaticOperation/ResourceManage',
        query: { code: 4 }
      })
    }
  }
}
</script>
<style scoped>
.resource-add {
  margin: 10px;
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.16);
}
.padding-title {
  padding-bottom: 20px;
}
.resource-item {
  display: block;
  width: 80%;
}
.resource-item input,
.resource-item select {
  width: 100%;
}
.node-title {
  color: #585858;
  font-size: 14px;
  padding: 10px 0 0;
}
.dev-title {
  display: inline-block;
  color: #585858;
  font-size: 16px;
  padding: 20px 0 0;
  margin-top: 20px;
  margin-left: -35px;
}
.node-title > h3 {
  font-size: 16px;
  display: inline-block;
  color: #000;
  font-weight: normal;
  line-height: 32px;
}
.node-title span,
.dev-title span {
  display: inline-block;
  width: 8px;
  border-radius: 4px;
  margin-right: 22px;
  height: 32px;
  background: #0066ff;
  vertical-align: middle;
}
.resource-form {
  overflow: hidden;
}
.btn-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;
}
.margin-right {
  margin-right: 20%;
}
.padding-title {
  padding-bottom: 20px;
}
.pl80 {
  padding-left: 80px;
}
.pl32 {
  padding-left: 32px;
}
</style>
