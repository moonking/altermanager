<template>
  <div class="backspace">
    <el-form :inline="true">
      <!-- <el-form-item>
                <el-date-picker  type="date" placeholder="选择创建日期" v-model="searchItem.createTime"></el-date-picker>
      </el-form-item>-->
      <el-form-item>
        <el-input class="input12" v-model="searchItem.planIdOrName" placeholder="请输入方案名称"></el-input>
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
      <el-form-item class="item-right">
        <el-button icon="el-icon-search" class="nomal-button" @click="searchBackSpace">查找</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="addBackSpace"
        >新增</el-button>
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
          <el-table-column prop="name" label="方案名称" align="center"></el-table-column>

          <el-table-column prop="systemName" label="节点类型" align="center"></el-table-column>

          <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click="detailBackspace(scope.row,'detail')"
                class="cm-form-btn cm-watch-btn btn-watch"
              ></el-button>
              <el-button
                @click="editBackspace(scope.row,'edit')"
                class="cm-form-btn cm-edit-btn-light"
                :style="{'backgroundSize':'50%'}"
              ></el-button>
              <el-button
                @click="deleteBack(scope.row.regretId)"
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
          style="margin-right:15px;cursor: pointer;"
        ></el-pagination>
      </div>
    </el-row>
    <BackspaceEdit :isVisibleEdit.sync="isShowDialog" ref="editDialog" />
  </div>
</template>

<script>
import BackspaceEdit from '../backspaceManage/BackspaceEdit.vue'
import axios from '@/api';
import moment from 'moment'
export default {
  name: 'BackspaceManage',
  data () {
    return {
      isShowDialog: false,
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
      systemTypes: []
    }
  },
  components: {
    BackspaceEdit: BackspaceEdit
  },
  mounted () {
    this.getBackspaceList()
    this.getSystemList()
  },
  methods: {
    getSystemList () {
      let name = ''
      axios.getcigroupSystablist(name).then(data => {
        if (data.data.code === 200) {
          this.systemTypes = data.data.data.result
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    searchBackSpace () {
      this.currPage = 1
      this.getBackspaceList()
    },
    cellstyle ({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    // 设置表格第一行的颜色
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return { background: '#f5f5f5' }
      } else {
        return ''
      }
    },

    // 新增回退方案
    addBackSpace (row) {
      // this.$refs.showDialog.isDialog()
      this.$router.push({
        path: '/AutomatedRelease/Newscheme',
        query: { code: 3 }
      })
    },
    editBackspace (data) {
      this.$router.push({
        path: '/AutomatedRelease/BackspaceAdd',
        query: { code: 3, key: 'edit', id: data.regretId }
      })
    },
    detailBackspace (data) {
      this.isShowDialog = true
      this.$refs.editDialog.openDialog(data)
    },
    getBackspaceList () {
      this.searchItem.currentPage = this.currPage
      this.searchItem.pageSize = this.size
      if (this.searchItem.createTime) {
        var time = moment(this.searchItem.createTime).format('YYYY-MM-DD')
        this.searchItem.createTime = time
      }
      axios.backspaceList(this.searchItem).then(res => {
        if (res.data.code == 200) {
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
    deleteBack (id) {
      let regretId = id
      let _this = this
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.deleteBackspace(regretId).then(res => {
          if (res.data.code === 200) {
            _this.$notify({
              title: '提示',
              message: '删除成功！',
              type: 'success'
            })
            if (this.tableData.length <= 1 && this.currPage > 1) {
              this.currPage = this.currPage - 1
            }
            _this.getBackspaceList()
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
      this.getBackspaceList()
    },
    handleSizeChange (val) {
      this.size = val
      this.getBackspaceList()
    }
  }
}
</script>

<style scoped>
.backspace {
  padding: 10px;
}

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
