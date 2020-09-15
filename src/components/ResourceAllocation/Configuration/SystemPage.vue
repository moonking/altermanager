<template>
  <div class="container systemPage refreshContainer aibms-color-bg non-border">
    <!-- <p class="mark-icon padding-title">
      {{status === 'create' ? "新增业务系统" : status === 'edit' ? "编辑业务系统" : "查看业务系统"}}
    </p>-->
    <div class="item-block-title" @click="sysController = !sysController">
      <div class="item-block-title-mark"></div>
      <span
        class="item-block-title-font"
      >{{status === 'create' ? "新增业务系统" : status === 'edit' ? "编辑业务系统" : "查看业务系统"}}</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: sysController ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <el-form
      ref="form"
      label-width="120px"
      :rules="status ==='create' ? rules : rules2"
      :model="sysdata"
      class="form-css item-block-content white-color"
      :style="{height: sysController ? 'auto' : 0}"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="sysdata.name" :disabled="status === 'watch'"></el-input>
      </el-form-item>
      <el-form-item label="英文缩写" prop="englishAbridge">
        <el-input v-model="sysdata.englishAbridge" :disabled="status === 'watch'"></el-input>
      </el-form-item>
      <el-form-item label="节点类型" prop="type">
        <el-input v-model="sysdata.type" :disabled="status === 'watch'"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="opsPerson">
        <el-input v-model="sysdata.opsPerson" :disabled="status === 'watch'"></el-input>
      </el-form-item>
      <el-form-item label="关联CI项" prop="hosts">
        <div @click="showChooseHostDialog"><i class="el-icon-link"></i> 已选择 {{hostTableSelected.length}} 个主机</div>
      </el-form-item>
      <!-- <el-form-item label="关联主机" prop="hosts">
        <div style="display: flex;">
          <el-select
            v-model="sysdata.hosts"
            collapse-tags
            multiple
            filterable
            placeholder="请选择"
            :disabled="status === 'watch'"
            :style="{flex: '1'}">
            <p class="related-host-selector-header">
              <span class="header-host-name">主机名称</span>
              <span class="header-host-ip">IP地址</span>
            </p>
            <el-option
              v-for="item in hostList"
              :key="item.ciitemId"
              :label="item.name"
              :value="item.ciitemId">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 20px;">{{ item.ip }}</span>
            </el-option>
          </el-select>
          <span style="display: block; padding: 0 20px;">已选择 {{sysdata.hosts.length}} 个主机</span>
        </div>
      </el-form-item> -->
      <!-- <el-form-item label="代码库类型" prop="repoType" style="text-align: left;">
        <el-radio-group v-model="sysdata.repoType" :disabled="status === 'watch'">
          <el-radio label="Svn"></el-radio>
          <el-radio label="Git"></el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="代码库URL" prop="url">
        <el-input v-model="sysdata.url" :disabled="status === 'watch'"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="代码库凭证" prop="voucherId">
        <el-select
          v-model="sysdata.voucherId"
          placeholder="请选择代码库凭证"
          clearable
          style="width: 100%;"
          :disabled="status === 'watch'"
        >
          <el-option
            :label="item.name"
            :value="item.voucherId"
            v-for="(item,index) in voucherListData"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="开发负责人">
        <el-input v-model="sysdata.devPerson" :disabled="status === 'watch'"></el-input>
      </el-form-item> -->

      <!-- <el-form-item label="描述">
        <el-input type="textarea" v-model="sysdata.remarks" :disabled="status === 'watch'"></el-input>
      </el-form-item> -->
    </el-form>
    <div class="item-block-title">
      <div class="item-block-title-mark"></div>
      <span
        class="item-block-title-font"
      >调用业务</span>
    </div>
    <el-form
      label-width="120px"
      class="form-css item-block-content">
      <el-form-item label="业务名称" v-for="(system, index) in callNodes" :key="index">
        <div style="display: flex;">
          <el-select
            v-model="system.systemId"
            filterable
            placeholder="请选择"
            :disabled="status === 'watch'"
            @change="handeSelectSystemChange"
            :style="{flex: '1'}">
            <el-option
              v-for="item in systemNodeList"
              :key="item.systemId"
              :label="item.name"
              :value="item.systemId"
              :disabled="item.disabled">
            </el-option>
          </el-select>
          <div class="form-item-oparates" style="padding: 0 20px; font-size: 24px">
            <span class="form-item-oparate-item" @click="addNodeSelect"><i class="el-icon-circle-plus-outline white-color"></i></span>
            <span class="form-item-oparate-item" @click="deleteNodeSelect(system, index)"><i class="el-icon-remove-outline white-color"></i></span>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="txtcenter">
      <el-button v-if="status === 'create'" size="medium" type="primary" @click="addSystemclick">确认</el-button>
      <el-button
        v-if="status === 'edit'"
        size="medium"
        type="primary"
        @click="addSystemclick('2')"
      >保存</el-button>
      <el-button class="nomal-button" plain size="medium" @click="detaiAddenvBtn">取消</el-button>
    </div>
    <el-dialog
      title="选择主机"
      center
      :close-on-click-modal="false"
      :visible.sync="chooseHostDialogVisible"
      width="730px">
      <el-form :inline="true" :model="hostDialogForm">
        <el-form-item>
          <el-input v-model="hostDialogForm.search" size="small" placeholder="请输入IP地址/主机名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="searchHostList"><i class="el-icon-search"></i> 搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="dialogTable"
        :data="hostList"
        stripe
        size="small"
        style="width: 100%"
        @select="handleTableSelect"
        @select-all="handleTableSelectAll"
        @selection-change="handleTableSelectChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="主机名称"
          width="280">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址"
          width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.ip || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="dialogPager.current"
        :pager-count="5"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="dialogPager.size"
        layout="total, prev, pager, next, sizes, jumper"
        :total="dialogPager.total"
        style="margin-top: 10px">
      </el-pagination>
      <!-- <p>
        <span v-for="item in tempSelect" :key="item.ciitemId">{{item.name}}, </span>
      </p> -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleChooseHost">确 定</el-button>
        <el-button size="small" @click="chooseHostDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'systemPage',
  data () {
    var validateurl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入Url'))
      } else if (
        !/^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/.test(
          value
        )
      ) {
        callback(new Error('请输入正确的Url!'))
      } else {
        callback()
      }
    }
    var validatename = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称!'))
      } else if (
        !/^[0-9A-Za-z_\u4e00-\u9fa5]{2,10}$/.test(
          value
        )
      ) {
        callback(new Error('请输入正确的名称!'))
      } else {
        callback()
      }
    }
    var validategitsvn = (rule, value, callback) => {
      if (this.repoType == '') {
        callback(new Error('请选择代码库类型!'))
      } else {
        callback()
      }
    }
    return {
      dialogPager: {
        current: 1,
        size: 10,
        total: 0
      },
      tempSelect: [],
      hostTableSelected: [],
      hostDialogForm: {
        search: ''
      },
      // 选择主机对话框
      chooseHostDialogVisible: false,
      systemNodeList: [],
      hostList: [],
      businessdata: {
        selectedNode: ''
      },
      callNodes: [
        { systemId: '' }
      ],
      sysdata: {
        name: '',
        repoType: '',
        url: '',
        voucherId: '',
        opsPerson: '',
        devPerson: '',
        remarks: '',
        // 英文缩写
        englishAbridge: '',
        // 节点类型
        type: '',
        // 关联主机
        hosts: []
      },
      sysController: true,
      status: this.$route.params.status,
      voucherListData: [],
      rules: {
        name: [
          // { required: true, message: "请输入名称!", trigger: "blur" },
          // { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
          { required: true, validator: validatename, trigger: 'blur' }
        ],
        url: [
          { required: true, validator: validateurl, trigger: 'blur' }
        ],
        voucherId: [
          { required: true, message: '请输入代码库凭证!', trigger: 'change' }
        ],
        repoType: [
          { required: true, message: '请选择代码库类型!', trigger: 'change' }
        ],
        opsPerson: [
          { required: true, message: '请输入名称!', trigger: 'blur' }
        ]
      },
      rules2: {
        name: [
          { required: true, message: '请输入名称!', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        url: [{ required: true, validator: validateurl, trigger: 'blur' }],
        voucherId: [
          { required: true, message: '请输入代码库凭证!', trigger: 'change' }
        ],
        repoType: [
          { required: true, validator: validategitsvn, trigger: 'change' }
        ],
        opsPerson: [
          { required: true, message: '请输入名称!', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getVoucherData()
    if (this.$route.query.id) {
      this.getSystemDetail(this.$route.query.id)
    }
    this.getHostList()
    if (this.$route.params.status !== 'edit') this.getSystemList()
  },
  methods: {
    handleCurrentPageChange (value) {
      this.dialogPager.current = value
      this.searchHostList()
    },
    handlePageSizeChange (value) {
      this.dialogPager.current = 1
      this.dialogPager.size = value
      this.searchHostList()
    },
    handleChooseHost () {
      // 获取选中row
      console.log(this.hostList)
      this.hostTableSelected = JSON.parse(JSON.stringify(this.tempSelect))
      // 重置tempSelet
      this.tempSelect = []
      this.chooseHostDialogVisible = false
    },
    handleTableSelect (selection, row) {
      let checked = false
      selection.forEach(item => {
        if (item.ciitemId === row.ciitemId) {
          checked = true
        }
      })
      if (checked) {
        this.tempSelect.push(row)
      } else {
        this.tempSelect.forEach((item, index) => {
          if (item.ciitemId === row.ciitemId) {
            this.tempSelect.splice(index, 1)
          }
        })
      }
      // this.tempSelect = temp
      console.log('selection: ', selection)
      console.log('row: ', row)
    },
    handleTableSelectAll (selection) {
      // 取消全选
      if (selection.length === 0) {
        const result = []
        this.tempSelect.forEach(temp => {
          let isContain = false
          this.hostList.forEach(item => {
            if (item.ciitemId === temp.ciitemId) {
              isContain = true
            }
          })
          console.log('isContain: ', isContain)
          if (!isContain) {
            result.push(temp)
          }
        })
        this.tempSelect = result
      } else {
        // 全选
        const length = this.tempSelect
        selection.forEach(item => {
          this.tempSelect.splice(length - 1, 0, item)
        })
      }
      console.log('all: ', selection)
    },
    handleTableSelectChange (selection) {
      // console.log('change: ', selection)
    },
    searchHostList () {
      const {current, size} = this.dialogPager
      const data = {
        citypeId: '',
        current,
        dataFrom: '',
        environment: '',
        keyword: this.hostDialogForm.search,
        size,
        systemId: ''
      }
      this.getHostList(data)
    },
    showChooseHostDialog () {
      this.chooseHostDialogVisible = true
      this.tempSelect = JSON.parse(JSON.stringify(this.hostTableSelected))
      this.setTableSelectStatus()
    },
    // 禁用已经选择了的系统
    handeSelectSystemChange () {
      const callNodes = this.callNodes
      const systemList = this.systemNodeList
      systemList.forEach(system => {
        let flag = false
        callNodes.forEach(node => {
          const id = node.systemId
          if (id === system.systemId) {
            flag = true
          }
        })
        if (this.status === 'edit' && this.$route.query.id === system.systemId) {
          system.disabled = true
        } else {
          system.disabled = flag
        }
      })
    },
    // 获取系统节点列表
    getSystemList () {
      const data = {
        name: '',
        current: 1,
        size: 100000
      }
      axios.getSystemList(data).then(res => {
        console.log(res)
        const data = res.data.data
        if (res.data.code === 200) {
          const records = data.result.records
          records.forEach(record => {
            record.diabled = false
          })
          this.systemNodeList = records
          const status = this.status
          const id = this.$route.query.id
          console.log('id: ', id)
          if (status === 'edit') {
            this.systemNodeList.forEach(system => {
              if (id === system.systemId) {
                system.disabled = true
              }
              this.callNodes.forEach(node => {
                if (node.systemId === system.systemId) {
                  system.disabled = true
                }
              })
            })
          }
        }
      })
    },
    setTableSelectStatus () {
      this.hostList.forEach(row => {
        let isContain = false
        this.tempSelect.forEach(item => {
          if (item.ciitemId === row.ciitemId) {
            isContain = true
          }
        })
        console.log(isContain)
        this.$nextTick(() => {
          if (this.$refs.dialogTable) {
            this.$refs.dialogTable.toggleRowSelection(row, isContain)
          }
        })
      })
    },
    // 获取主机列表
    getHostList (data) {
      data = data || {
        citypeId: '',
        current: 1,
        dataFrom: '',
        environment: '',
        keyword: '',
        size: this.dialogPager.size || 10,
        systemId: ''
      }
      axios.getCiDataList(data).then(res => {
        const data = res.data.data
        if (res.data.code === 200) {
          console.log('请求成功!')
        }
        const records = data.result.records
        const parsedData = []
        records.forEach(record => {
          const ciitemId = record.ciitemId
          const citypeId = record.citypeId
          const content = JSON.parse(record.content)
          let name = ''
          let ip = ''
          content.forEach(item => {
            const extend = item.extend
            extend.forEach(prop => {
              if (prop) {
                if (prop.label === '名称') {
                  name = prop.defaultValue
                }
                if (prop.rules === 'IP地址' || prop.rules === 'ADDRESS' || prop.rules === 'ipAddress') {
                  const value = prop.defaultValue
                  ip = this.isValidIp(value) ? value : ''
                }
              }
            })
          })
          const obj = { ciitemId, name, ip, citypeId }
          parsedData.push(obj)
        })
        this.dialogPager.total = Number(data.result.total)
        this.hostList = parsedData
        // 根据数据回显表格选中数据
        this.setTableSelectStatus()
      })
    },
    isValidIp (ip) {
      return /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(ip)
    },
    addNodeSelect () {
      this.callNodes.push({systemId: ''})
    },
    deleteNodeSelect (system, index) {
      this.systemNodeList.forEach(sys => {
        if (sys.systemId === system.systemId) {
          sys.disabled = false
        }
      })
      this.callNodes.splice(index, 1)
    },
    // 确认新增业务系统
    addSystemclick (num) {
      let that = this
      const nodes = this.callNodes
      const nodesData = []
      nodes.forEach(node => {
        this.systemNodeList.forEach(sysNode => {
          if (node.systemId === sysNode.systemId) {
            nodesData.push({
              systemId: sysNode.systemId,
              name: sysNode.name
            })
          }
        })
      })
      const hostsData = this.hostTableSelected
      // const hosts = this.hostTableSelected
      // const hostsData = []
      // hosts.forEach(id => {
      //   this.hostList.forEach(host => {
      //     if (host.ciitemId === id) {
      //       hostsData.push({
      //         // citypeId: host.citypeId,
      //         // ciitemId: host.ciitemId,
      //         // name: host.name,
      //         // ip: host.ip,
      //         ...host,
      //         useState: true
      //       })
      //     }
      //   })
      // })
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = {
            name: this.sysdata.name,
            devPerson: this.sysdata.devPerson,
            opsPerson: this.sysdata.opsPerson,
            url: this.sysdata.url,
            voucherId: this.sysdata.voucherId,
            remarks: this.sysdata.remarks,
            repoType: this.sysdata.repoType === 'Svn' ? '1' : '2',
            englishAbridge: this.sysdata.englishAbridge,
            type: this.sysdata.type,
            hosts: hostsData,
            callNodes: nodesData
          }
          if (num && num === '2') {
            axios.getEditSystemList(data, this.$route.query.id).then(function (res) {
              if (res.data.code == 200) {
                that.$notify({
                  title: '提示',
                  message: '修改成功',
                  type: 'success'
                })
                that.$router.push({
                  path: '/ResourceAllocation/OtherConfiguration',
                  query: {
                    code: 2
                  }
                })
              } else {
                that.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
          } else {
            axios.getAddSystemList(data).then(res => {
              if (res.data.code == 200) {
                that.$notify({
                  title: '提示',
                  message: '新增成功',
                  type: 'success'
                })
                that.$router.push({
                  path: '/ResourceAllocation/OtherConfiguration',
                  query: {
                    code: 2
                  }
                })
              } else {
                that.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
          }
        }
      })
    },
    //  取消新增业务系统
    detaiAddenvBtn () {
      this.$router.push({
        path: '/ResourceAllocation/OtherConfiguration',
        query: {
          code: 2
        }
      })
    },
    // 下拉框凭证
    getVoucherData () {
      var name = ''
      var voucherType = '2'
      let that = this
      axios.getVoucherList(name, voucherType).then(function (res) {
        if (res.data.code == 200) {
          that.voucherListData = res.data.data.result
        }
      })
    },
    // 获取业务系统详情
    getSystemDetail (systemId) {
      axios.getSystemDetail(systemId).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data.result
          data.repoType = data.repoType == 1 ? 'Svn' : data.repoType == 2 ? 'Git' : ''
          let callNodesData = []
          const callNodes = JSON.parse(data.callNodes)
          callNodes.forEach(node => {
            callNodesData.push({systemId: node.systemId})
          })
          this.hostTableSelected = JSON.parse(data.hosts)
          this.sysdata = data
          if (callNodesData.length > 0) this.callNodes = callNodesData
          
          this.getSystemList()
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.systemPage {
  margin: 10px;
  padding: 10px!important;
  .item-block-title {
    margin-bottom: 20px;
    .icons {
      color: #00A8E8
    }
  }
  .form-css {
    width: 60%;
  }
  .txtcenter {
    padding-left: 20px;
    padding-bottom: 20px;
    text-align: center;
    .cancel-btn {
      margin-left: 200px;
    }
  }
}
.related-host-selector-header {
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding: 0 40px 0 20px;
  font-size: 14px;
  color: #8492a6;
  font-weight: bold;
  box-sizing: border-box;
  position: relative;
}
.header-host-name, .header-host-ip {
  display: block;
}
.header-host-name {
  float: left;
}
.header-host-ip {
  float: right;
}
.form-item-oparate-item:hover {
  color: #1890ff;
  cursor: pointer;
}
</style>
