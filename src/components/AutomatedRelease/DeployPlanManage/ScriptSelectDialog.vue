<template>
  <div class="script-select-dialog">
    <el-dialog center title="选择脚本" :visible="dialogVisible" width="50%" @update:visible="updateVisible">
      <el-form v-model="formData" inline>
        <el-form-item>
          <el-input v-model="formData.value" placeholder="脚本名称"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select
            v-model="formData.system"
            :clearable="true"
            @change="getsysid"
            placeholder="选择业务系统"
          >
            <el-option
              v-for="system in systemList"
              :key="system.systemId"
              :label="system.name"
              :value="system.systemId"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button size="mini" @click="search" type="primary">
            <i class="el-icon-search"></i>&nbsp;&nbsp;查找
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="脚本名称"></el-table-column>
        <el-table-column prop="systemName" label="所属系统" width="140"></el-table-column>
        <el-table-column prop="filePath" label="脚本"></el-table-column>
        <el-table-column prop="scriptType" label="脚本类型" width="100">
          <template slot-scope="scope">{{scope.row.scriptType | filteType}}</template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="updateDate" label="最近更新"></el-table-column> -->
        <el-table-column align="center" prop="operate" label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="selectScript(scope.row)" type="primary" size="mini">选择</el-button>
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
  filters: {
    filteType (val) {
      if (val) {
        return val == 1 ? 'F5脚本' : val == 2 ? '数据库脚本' : '应用脚本'
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      formData: {
        value: '',
        system: ''
      },
      n: 0,
      systemList: [
        // {
        //   type: 1,
        //   name: '个险业务系统'
        // },
        // {
        //   type: 2,
        //   name: '团险业务系统'
        // }
      ],
      tableData: [],
      //   {
      //   id: 145,
      //   name: '152.78.woeladd',
      //   system: '大数据平台系统',
      //   script: 'siasloOperations-sit/7-dowasd.gy',
      //   scriptType: 'F5脚本',
      //   recentUpdate: '2019-1-15 12:15:36'
      // },
      // {
      //   id: 145,
      //   name: '152.78.woeladd',
      //   system: '大数据平台系统',
      //   script: 'siasloOperations-sit/7-dowasd.gy',
      //   scriptType: '数据库脚本',
      //   recentUpdate: '2019-1-15 12:15:36'
      // }],
      validateDialogTableData: [
        {
          id: 'Y2019110154414',
          name: '验证节点 152.78.woeladd',
          node: '152.78.woeladd',
          createTime: '2019-2-13 03:21:32'
        }
      ],
      currPage: 1,
      size: 10,
      total: 0,
      scriptType: ''
    }
  },
  watch: {
    dialogVisible () {
      // console.log('dialog的值改变了：'+this.dialogVisible)
      // this.$emit('update:dialogVisible',this.dialogVisible)
    },
    systemParams () {
      if (this.systemParams) {
        this.formData.system = this.systemParams

        this.getScriptList()
        // this.getSysList();
      }
    }
  },
  mounted () {
    this.getScriptList()
    this.getSysList()
    this.search()
  },
  methods: {
    getsysid () {
      this.sysid.id = ''
    },
    handleCurrentChange (val) {
      this.currPage = val
      this.search()
    },
    handleSizeChange (val) {
      this.size = val
      this.search()
    },
    search () {
      this.getScriptList()
    },
    getSysList () {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.success) {
          this.systemList = res.data.data.result
        }
      })
    },
    getScriptList () {
      if (this.systemParams) {
        this.formData.system = this.systemParams
      }

      let params = {
        current: this.currPage,
        size: this.size,
        name: this.formData.value,
        systemId: this.formData.system,
        scriptType: ''
      }
      // console.log(params);
      axios.selectScript(params).then(res => {
        if (res.data.status.index == 201) {
          this.tableData = res.data.result.records
          this.total = res.data.result.total * 1
        }
      })
    },
    selectScript (row) {
      this.$emit('confirm', row)
      // this.dialogVisible = false;
      this.$emit('update:dialogVisible', false)
    },
    updateVisible (value) {
      this.$emit('update:dialogVisible', value)
    }
  }
}
</script>
<style scoped>
</style>
