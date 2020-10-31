<template>
  <div class="aia-content">
    <!-- 筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        ref="searchFrom"
        :model="searchFrom"
        label-width="80px"
        class="search-inline-form"
      >
        <el-form-item>
          <el-input
            v-model="searchFrom.rulesName"
            clearable
            placeholder="请输入规则名称"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchFrom.level"
            clearable
            placeholder="请选择级别"
          >
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <icon-svg
                style="font-size: 18px; vertical-align: sub;"
                icon-class="bj"
                :class="item.value | iconLevelFilter"
              />
              <span >{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="searchFrom.label"
            placeholder="请选择标签"
          >
            <el-option
              v-for="item in labelList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="search-rule">
          <el-button icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="search-inline-btn">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addRule"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{ background: '#f5f5f5' }"
      @row-click="ruleDeatil"
      style="width: 100%"
    >
      <el-table-column prop="name" label="规则名称" />
      <el-table-column prop="level" label="级别">
        <template v-slot="scope">
          <div class="img">
            <icon-svg
              icon-class="bj"
              style="font-size: 18px; vertical-align: sub; margin-left: 10px"
              :class="scope.row.level | iconLevelFilter"
            />
            <span>{{ scope.row.level | LevelFilter }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="label" label="标签">
        <template v-slot="scope">
          <span>{{ scope.row.label | labelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="operation" label="操作">
        <template v-slot="scope">
          <div class="rule-box" @click.stop="openRule(scope.row)">
            <el-switch
              size="large"
              v-model="scope.row.enabledState"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </div>
          <div class="task-btn-box">
            <el-link
              type="primary"
              :underline="false"
              @click.stop="handleEdit(scope.row)"
              >编辑</el-link
            >
            <el-link
              type="primary"
              :underline="false"
              @click.stop="handleDelete(scope.row)"
              >删除</el-link
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
            <img src="../../../../static/img/blank-page.png" alt />
          </div>
          <p class="empty-text">暂无相关数据</p>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="totalSize"
      :current-page.sync="page.current"
      :page-size.sync="page.size"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="text-align: center; margin-top: 92px"
    />
    <!-- 删除组件 -->
    <deleteDialog ref="deleteDialog" @confim-delete="confirmDelete" />
  </div>
</template>

<script>
import axios from '@/api'
import deleteDialog from '../../common/deleteDialog'
export default {
  components: {
    deleteDialog
  },
  data: () => ({
    tableData: [],
    levelList: [
      {
        value: '1',
        label: 'critical'
      },
      {
        value: '2',
        label: 'error'
      },
      {
        value: '3',
        label: 'warning'
      }
      // {
      //   value: '4',
      //   label: 'S4'
      // },
      // {
      //   value: '5',
      //   label: 'S5'
      // }
    ],
    labelList: [
      { label: '交易类型', value: '1' },
      { label: '应用', value: '2' },
      { label: '服务', value: '3' },
      { label: '进程', value: '4' },
      { label: '主机', value: '5' }
    ],
    searchFrom: {
      rulesName: '',
      level: '',
      label: ''
    },
    page: {
      current: 1,
      size: 10
    },
    totalSize: 0,
    currentDeleteItemId: -1
  }),
  filters: {
    labelFilter: label => {
      const labelMap = {
        1: '交易类型',
        2: '应用',
        3: '服务',
        4: '进程',
        5: '主机'
      };
      return labelMap[label]
    },
    LevelFilter: level => {
      const iconMap = {
        1: 'critical',
        2: 'error',
        3: 'warning'
        // 4: 'S4',
        // 5: 'S5'
      };
      return iconMap[level];
    },
    iconLevelFilter: level => {
      const iconMap = {
        1: 's1-color',
        2: 's2-color',
        3: 's3-color',
        4: 's4-color',
        5: 's5-color'
      };
      return iconMap[level]
    }
  },
  created() {
    this.AlarmrulesList()
  },
  methods: {
    // 告警规则列表
    AlarmrulesList() {
      let params = {
        name: this.searchFrom.rulesName || '',
        level: this.searchFrom.level || '',
        label: this.searchFrom.label || '',
        current: this.page.current,
        size: this.page.size
      };
      axios.alarmRuleList(params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
        }
      })
    },
    search() {
      this.AlarmrulesList()
    },
    handleEdit(row) {
      this.$router.push({
        path: '/Aibms/Bconfiguration/addRules/edit',
        query: {
          code: 8,
          ruleId: row.iD
        }
      });
    },
    handleDelete(row) {
      this.currentDeleteItemId = row.iD
      this.$refs.deleteDialog.confirmDeleteDialogVisible = true
    },
    confirmDelete() {
      const id = this.currentDeleteItemId
      axios.alarmRuleDelete(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
          this.AlarmrulesList()
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      }).catch(() => {
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      })
    },
    addRule() {
      this.$router.push({
        path: '/Aibms/Bconfiguration/addRules/create',
        query: {
          code: 8
        }
      });
    },
    openRule(scope) {
      let params = {
        ID: scope.iD,
        enabledState: scope.enabledState ? '1' : '0'
      };
      axios.alarmRuleEnabled(params).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: scope.enabledState ? '规则已开启！' : '规则已关闭!',
            type: 'success'
          });
          this.AlarmrulesList()
        }
      });
    },
    ruleDeatil(row) {
      this.$router.push({
        path: '/Aibms/Bconfiguration/addRules/read',
        query: {
          code: 8,
          ruleId: row.iD
        }
      });
    },
    // 分页
    handleCurrentChange() {
      this.AlarmrulesList()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.AlarmrulesList()
    }
  }
};
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  padding: 10px 10px;
  box-sizing: border-box;
  .search-rule {
    .el-button {
      border: 1px solid #fff;
      color: #fff;
      &:hover {
        border: 1px solid #fff;
        color: #fff;
        background: transparent;
      }
      &:focus {
        color: #fff;
        background: transparent;
      }
      &:active {
        border: 1px solid #fff;
        background: transparent;
        color: #fff;
      }
    }
  }
  .img {
    img {
      width: 20px;
      vertical-align: text-bottom;
      margin-left: 10px;
    }
  }
  .rule-box {
    display: inline-block;
  }
  .task-btn-box {
    text-align: center;
    display: inline-block;
    .el-link {
      color: #fff;
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

.s1-color {
  color: #ff0000 !important;
  fill: #ff0000 !important;
}
.s2-color {
  color: #ff9900 !important;
  fill: #ff9900 !important;
}
.s3-color {
  color: #ffcc00 !important;
  fill: #ffcc00 !important;
}
.s4-color {
  color: #ffff00 !important;
  fill: #ffff00 !important;
}
.s5-color {
  color: #ffff88 !important;
  fill: #ffff88 !important;
}
.aia-content /deep/ .el-table__row {
  cursor: pointer !important;
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
  width: 100px;
}
</style>
