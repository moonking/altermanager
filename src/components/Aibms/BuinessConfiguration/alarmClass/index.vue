<template>
  <div class="aia-content">
    <!-- 筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="alarmModel"
        label-width="80px"
        class="search-inline-form"
      >
        <el-form-item>
          <el-autocomplete
            v-model="alarmModel.alarmClass"
            clearable
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            style="width: 200px"
            class="inline-input"
            placeholder="请输入告警分类"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            style="width: 200px"
            v-model="alarmModel.sourceValue"
            clearable
            placeholder="请选择来源"
          >
            <el-option
              v-for="item in sourceList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <el-form :inline="true" class="search-inline-btn">
        <el-form-item class="search-type">
          <el-button icon="el-icon-search" class="search-icon search-btn" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="common-btn add-btn" icon="el-icon-plus" @click="addType"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      stripe
      height="74%"
      @row-click="classDetail"
      :header-cell-style="{ background: '#f5f5f5' }"
      style="width: 100%"
    >
      <el-table-column prop="name" label="分类名称">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="light"
            :content="scope.row.name"
            placement="top"
          >
            <span class="white-space">{{ scope.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="label" label="标签">
        <template slot-scope="scope">
          {{ scope.row.label | labelFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="source" label="来源" />
      <el-table-column align="center" prop="operation" label="操作">
        <template v-slot="scope">
          <div class="task-btn-box">
            <el-link
              type="primary"
              :underline="false"
              class="el-icon-edit-outline"
              @click.stop="handleEdit(scope.row)"
              ></el-link
            >
            <el-link
              type="primary"
              :underline="false"
              class="el-icon-close"
              @click.stop="handleDelete(scope.row)"
              ></el-link
            >
            <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <span class="special" @click.stop="handleEdit(scope.row)">
                <icon-svg icon-class="bianji" />
              </span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <span class="special" @click.stop="handleDelete(scope.row)">
                <icon-svg icon-class="shanchu" />
              </span>
            </el-tooltip> -->
          </div>
        </template>
      </el-table-column>
      <template slot="empty">
        <div class="blank-page">
          <div class="img-content">
            <img src="../../../../../static/img/blank-page.png" alt />
          </div>
          <p class="empty-text">暂无相关数据</p>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="totalSize && totalSize > 10"
      :current-page.sync="page.current"
      :page-size.sync="page.size"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="absolute-center"
    />
    <!-- 删除提示 -->
    <el-dialog
      center
      title="删除提示"
      :visible.sync="confirmDeleteDialogVisible"
      width="25%"
    >
      <div style="text-align: center">
        <i class="el-icon-warning" /> 确认删除？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          class="nomal-button"
          @click="confirmDeleteDialogVisible = false"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="confirmDelete"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api'
const labelMap = {
  '1': '交易类型',
  '2': '应用',
  '3': '服务',
  '4': '进程',
  '5': '主机'
}
export default {
  filters: {
    labelFilter: label => labelMap[label]
  },
  data: () => ({
    callNum: 0,
    classList: [],
    sourceList: [
      {
        id: 1,
        value: 'BPC',
        label: 'BPC'
      }, {
        id: 2,
        value: 'Dynatrace',
        label: 'Dynatrace'
      }, {
        id: 3,
        value: 'Prometheus',
        label: 'Prometheus'
      },
      {
        id: 4,
        value: 'ARMS',
        label: 'ARMS'
      }, {
        id: 5,
        value: 'Splunk',
        label: 'Splunk'
      }
    ],
    tableData: [],
    alarmModel: {
      alarmClass: '',
      sourceValue: ''
    },
    page: {
      current: 1,
      size: 10
    },
    totalSize: 0,
    confirmDeleteDialogVisible: false,
    currentDeleteItemId: -1
  }),
  created() {
    let params = this.getParams()
    this.getClassList()
    this.getAlarmList(params)
  },
  methods: {
    // 将search数据缓存至session
    setSession() {
      if (this.callNum > 1) {
        const params = {
          name: this.alarmModel.alarmClass,
          source: this.alarmModel.sourceValue,
          current: this.page.current,
          size: this.page.size
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    // 将缓存数据取出回显至search
    getParams() {
      let params
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { name, source, current, size } = params
        this.alarmModel.alarmClass = name
        this.alarmModel.sourceValue = source
        this.page.current = current
        this.page.size = size
      }
      return params
    },
    // 获取联想输入信息
    getClassList() {
      axios.geAlarmNameList().then(res => {
        if (res.data.success) {
          this.classList = res.data.data
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 联想输入
    querySearch(queryString, cb) {
      const alarmClassList = this.classList
      const results = queryString ? alarmClassList.filter(this.createFilter(queryString)) : alarmClassList
      cb(results)
    },
    // 查找输入字符
    createFilter(queryString) {
      return (classList) => {
        return (classList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 获取告警分类列表
    getAlarmList(params) {
      if (params === undefined) {
        params = {
          name: this.alarmModel.alarmClass,
          source: this.alarmModel.sourceValue,
          label: '',
          current: this.page.current,
          size: this.page.size
        }
      }
      axios.getAlarmList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
          this.callNum++
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 分页
    handleCurrentChange() {
      this.getAlarmList()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.getAlarmList()
    },
    search() {
      this.page.current = 1
      this.getAlarmList()
    },
    // 跳转至新增分类
    addType() {
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addClass',
        query: {
          code: 2
        }
      })
    },
    // 跳转至编辑分类
    handleEdit(row) {
      this.setSession()
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addClass',
        query: {
          code: 2,
          id: row.iD
        }
      })
    },
    // 关闭删除dialog
    handleDelete(row) {
      this.currentDeleteItemId = row.iD
      this.confirmDeleteDialogVisible = true
    },
    // 删除告警分类
    confirmDelete() {
      const id = this.currentDeleteItemId
      axios.deleteAlarm(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: res.data.message
          })
          this.getAlarmList()
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
      this.confirmDeleteDialogVisible = false
    },
    // 告警分类详情
    classDetail(row) {
      this.setSession()
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addClass',
        query: {
          code: 2,
          id: row.iD,
          read: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  height: 94%;
  padding: 10px 10px;
  box-sizing: border-box;
  .search-type {
    .el-button {
      // border: 1px solid #436382;
      // color: #fff;
      // &:link {
      //   border: 1px solid #436382;
      //   color: #fff;
      // }
      // &:visited {
      //   border: 1px solid #436382;
      //   color: #fff;
      //   background-color: transparent !important;
      // }
      // &:hover {
      //   background-color: #041c25;
      //   border: 1px solid #01aef1;
      //   color: #01aef1;
      // }
      // &:active {
      //   border: 1px solid #436382;
      //   color: #fff;
      // }
    }
  }
  .task-btn-box {
    text-align: center;
    .el-link {
      // color: #fff;
    }
    // span {
    //   display: inline-block;
    //   background: #fff;
    //   border: 1px solid #0066ff;
    //   line-height: 24px;
    //   padding: 0 4px;
    //   border-radius: 5px;
    //   color: #0066ff;
    //   font-size: 14px;
    //   margin-right: 12px;
    //   cursor: pointer;
    //   margin: 5px 0;
    //   &:hover {
    //     background: #0066ff;
    //   }
    //   &:active {
    //     background: #0066ff;
    //     color: #fff;
    //   }
    // }
  }
  .blank-page {
    .img-content {
      height: 200px;
      padding-top: 15px;
    }
    .empty-text {
      font-size: 18px;
      height: 30px;
      line-height: 30px;
      margin-top: -30px;
      margin-bottom: 10px;
      color: #fff;
    }
  }
}
</style>
<style scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
}
.search-inline-form {
  flex: 1;
}
.search-inline-btn {
  /* width: 100px; */
}
.white-space {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
