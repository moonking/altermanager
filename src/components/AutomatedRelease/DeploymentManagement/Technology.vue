<template>
  <div class="backspace">
    <el-form :inline="true">
      <!-- <el-form-item>
                <el-date-picker  type="date" placeholder="选择创建日期" v-model="searchItem.createTime"></el-date-picker>
      </el-form-item>-->
      <el-form-item>
        <el-input class="input12" v-model="searchItem.name" placeholder="请输入方案名称"></el-input>
      </el-form-item>
      <!-- <el-form-item >
                <el-select v-model="searchItem.systemId" placeholder="所属系统选择" clearable>
                    <el-option
                        v-for="item in systemTypes"
                        :key="item.value"
                        :label="item.name"
                        :value="item.systemId">
                    </el-option>
                </el-select>
      </el-form-item>-->
      <el-form-item class="search-wrapper">
        <el-button class="nomal-button" @click="searchBackSpace">搜索</el-button>
        <el-button @click="addBackSpace()" type="primary">新增方案</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <div class="table">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          :cell-style="cellstyle"
          :header-cell-style="getRowClass"
        >
          <el-table-column prop="planName" label="方案名称" align="center"></el-table-column>

          <el-table-column prop="nodeType" label="节点类型" align="center"></el-table-column>

          <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                :title="title1"
                @click="detailBackspace(scope.row.planId)"
                class="cm-form-btn cm-watch-btn btn-watch"
              ></el-button>
              <!-- <el-button
                :title="title2"
                @click="editBackspace(scope.row.planId)"
                class="cm-form-btn cm-edit-btn-light"
                :style="{'backgroundSize':'50%'}"
              ></el-button>-->
              <el-button
                :title="title3"
                @click="deleteDeployPlan(scope.row.planId)"
                class="cm-form-btn cm-delete-btn-light"
                :style="{'backgroundSize':'50%'}"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-limit" style="text-align:center;margin-top:92px">
        <el-pagination
          v-if="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          style="cursor: pointer;"
        ></el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'BackspaceManage',
  data () {
    return {
      searchItem: {},
      currPage: 1,
      size: 10,
      total: 0,
      backupTypes: [
        { label: 'f5发布', value: '0' },
        { label: '数据库发布', value: '1' },
        { label: '应用发布', value: '2' }
      ],
      tableData: [],
      systemTypes: [],
      title1: '查看',
      title2: '编辑',
      title3: '删除'
    }
  },

  methods: {
    searchBackSpace () {
      this.currPage = 1
      this.getdeployPlanList()
    },
    cellstyle ({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    // 设置表格第一行的颜色
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return { background: '#f5f5f5', color: '#2a2f55' }
      } else {
        return ''
      }
    },

    // 新增回退方案
    addBackSpace (row) {
      // this.$refs.showDialog.isDialog()
      this.$router.push({
        path: '/AutomatedRelease/Newscheme',
        query: { code: 3, plantype: '1', protype: '3' }
      })
    },
    // 编辑方案
    editBackspace (planId) {
      // plantype 1:方案 ，2: 任务  protype 方案类型 1,备份 2,部署 3,验证 4,回退
      this.$router.push({
        path: '/AutomatedRelease/Newscheme',
        query: {
          code: 3,
          planId: planId,
          type: '1',
          plantype: '1',
          protype: '3'
        }
      })
    },
    // 查看方案
    detailBackspace (planId) {
      this.$router.push({
        path: '/AutomatedRelease/Newscheme',
        query: {
          code: 3,
          planId: planId,
          type: '1',
          plantype: '1',
          protype: '3'
        }
      })
    },
    // 获取部署列表
    getdeployPlanList () {
      this.searchItem.current = this.currPage
      this.searchItem.size = this.size
      this.searchItem.name = this.searchItem.name
      this.searchItem.planType = '3'
      // if(this.searchItem.createTime){
      //     var time = moment(this.searchItem.createTime).format("YYYY-MM-DD");
      //      this.searchItem.createTime = time;
      // }
      axios.deployPlanList(this.searchItem).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          res.data.data.records.forEach(item => {
            item.nodeType =
              item.nodeType == '1'
                ? 'F5'
                : item.nodeType == '2'
                  ? '数据库'
                  : '服务器'
          })
          this.tableData = res.data.data.records
          this.total = parseInt(res.data.data.total)
        } else {
          this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    // 删除回退方案
    deleteDeployPlan (planId) {
      let _this = this
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.deleteDeployPlan(planId).then(res => {
          if (res.data.code === 200) {
            _this.$notify({
              title: '提示',
              message: '删除成功！',
              type: 'success'
            })
            if (this.tableData.length <= 1 && this.currPage > 1) {
              this.currPage = this.currPage - 1
            }
            this.getdeployPlanList()
            // _this.getBackspaceList();
          } else {
            _this.$notify({
              title: '错误',
              message: res.data.message,
              type: 'error'
            })
          }
        })
      })
    },
    // 分页
    handleCurrentChange (val) {
      this.currPage = val
      this.getdeployPlanList()
      // this.getBackspaceList();
    },
    handleSizeChange (val) {
      this.size = val
      this.getdeployPlanList()
      // this.getBackspaceList();
    }
  },
  mounted () {
    this.getdeployPlanList()
  }
}
</script>

<style scoped>
.backspace {
  padding: 10px;
}

/* .search-wrapper{
     padding-top: 6px;
} */
.input12 {
  width: 230px;
}
.btn-watch {
  color: #fff;
  background-color: #0280ff;
  background-size: 50%;
}
.logTitle {
  float: left;
  margin-left: 10px;
}
.table {
  text-align: center;
}
</style>
