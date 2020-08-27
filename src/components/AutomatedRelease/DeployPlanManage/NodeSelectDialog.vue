<template>
  <div class="node-select-dialog">
    <el-dialog center title="选择节点" :visible="dialogVisible" @update:visible="update" width="50%">
      <el-form v-model="formData" inline>
        <el-form-item>
          <el-input v-model="formData.nodeName" placeholder="节点名称"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="formData.system" @change="getsysid">
            <el-option
              v-for="system in systemList"
              :key="system.systemId"
              :label="system.name"
              :value="system.systemId">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">
            <i class="el-icon-search"></i>&nbsp;&nbsp;查找
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="name" label="节点名称"></el-table-column>
        <el-table-column prop="purposesName" label="节点用途" align="center"></el-table-column>
        <el-table-column prop="systemName" label="所属系统"></el-table-column>
        <el-table-column prop="hostname" label="主机名"></el-table-column>
        <!-- <el-table-column align="center" prop="username" label="用户名"></el-table-column> -->
        <el-table-column prop="ipaddr" label="ip" width="120"></el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="selectNode(scope.row)" type="primary" size="mini">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right;width: 100%;padding: 30px 0;">
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
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  props: {
    sysid: { id: '' },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    systemParams: {
      type: String
    }
  },
  data () {
    return {
      formData: {
        nodeName: '',
        system: ''
      },
      n: 0,
      systemList: [
        // {
        //   type: 1,
        //   name: '网上银行'
        // },
        // {
        //   type: 2,
        //   name: '团险业务系统'
        // }
      ],
      tableData: [
        //   {
        //   id: 145,
        //   name: '152.78.woeladd',
        //   useTo: '部署',
        //   system: '网上银行',
        //   hostName: 'siasloOperations-sit/7-dowasd.gy',
        //   userName: 'test112',
        //   ip: '182.15.245.23',
        //   recentUpdate: '2019-1-15 12:15:36'
        // }
      ],
      size: 10,
      total: 1,
      currPage: 1,
      nodeUse: [{ label: '测试', value: '1' }, { label: '生产', value: '2' }]
    }
  },
  filters: {
    filterUse (val) {
      return val == 1 ? '测试' : '生产'
    },
    filterSystem (val) {}
  },
  watch: {
    systemParams () {
      this.formData.system = this.systemParams
      console.log(this.systemParams)
      console.log(this.formData.system)
      if (this.systemParams) {
        this.getSysList()
        this.getNodeList()
      }
    }
  },
  mounted () {
    console.log(this.systemParams)
    this.getSysList()
    this.getNodeList()
  },

  methods: {
    getsysid () {
      console.log(this.formData.system)
      this.sysid.id = ''
    },
    handleCurrentChange (val) {
      this.currPage = val
      this.getNodeList()
    },
    handleSizeChange (val) {
      this.size = val
      this.getNodeList()
    },
    getSysList () {
      let name = ''
      axios.getcigroupSystablist(name).then(data => {
        if (data.data.code === 200) {
          this.systemList = data.data.data.result
        }
      })
    },
    search () {
      this.getNodeList()
    },
    getNodeList () {
      if (this.sysid) {
        if (this.sysid.id.length > 0) {
          this.formData.system = this.sysid.id
        }
      }
      let params = {
        name: this.formData.nodeName,
        systemId: this.formData.system,
        current: this.currPage,
        size: this.size
      }
      axios.searchNode(params).then(res => {
        if (res.data.success) {
          console.log(res)
          if (res.data.data.result) {
            this.total = parseInt(res.data.data.result.total)
            res.data.data.result.records.forEach(item => {
              this.nodeUse.forEach(itemChilde => {
                if (item.purposes == itemChilde.value) {
                  item.purposesName = itemChilde.label
                }
              })
              this.systemList.forEach(systemType => {
                if (item.systemId == systemType.systemId) {
                  item.systemName = systemType.name
                }
              })
            })
            this.tableData = res.data.data.result.records
            console.log(this.tableData)
          }
        }
      })
    },
    update (value) {
      this.$emit('update:dialogVisible', value)
    },
    selectNode (data) {
      this.$emit('confirm', data)
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
<style scoped>
</style>
