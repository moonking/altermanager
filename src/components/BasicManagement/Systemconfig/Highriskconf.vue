<template>
  <div class="high-risk aibms-role">
    <el-form :model="searchModel" inline>
      <el-form-item>
        <el-select
          v-model="searchModel.database"
          placeholder="请选择数据库"
          clearable
          @clear="handleRest"
        >
          <el-option
            v-for="database in databaseList"
            :label="database.label"
            :value="database.value"
            :key="database.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchModel.statement"
          placeholder="请选择语句类型"
          clearable
          @clear="handleRest"
        >
          <el-option
            v-for="type in statementTypes"
            :label="type.label"
            :value="type.value"
            :key="type.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="item-right overHideMargin">
        <el-button icon="el-icon-search" class="nomal-button" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe @row-click="handleDetail" :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column :type="'expand'">
        <template slot-scope="scope">
          <ul class="showList" v-if="scope.row.hasValue">
            <div v-for="statement in scope.row.children" :key="statement.statementType">
              <li
                class="statement-list-item"
                v-if="statement.keys"
              >
                <el-row :gutter="8">
                  <el-col :span="6">
                    <label class="label-str">语句类型:</label>
                    <span>{{ statement.name }}</span>
                  </el-col>
                  <el-col :span="18">
                    <label class="label-str">高危关键字:</label>
                    <span>{{ statement.keys }}</span>
                  </el-col>
                </el-row>
              </li>
            </div>
          </ul>
          <div v-else class="tip-font">暂无配置数据</div>
        </template>
      </el-table-column>
      <el-table-column label="数据库" prop="name">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <div class="task-btn-box">
            <span class="special" @click.stop="handleEdit(scope.row.name)">
              <el-tooltip class="item" effect="dark" content="配置" placement="top-start">
                <icon-svg icon-class="peizhi" class="whiteness-icon-color"/>
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-size="size"
        :page-sizes="[10, 30, 50]"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        v-if="total > 10"
        style="cursor: pointer;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
import { databaseList, statementTypes } from './util'
export default {
  name: 'high-risk',
  data () {
    return {
      // 查询参数
      searchModel: {
        database: '',
        statement: ''
      },
      // 数据源存储
      tableData: [],
      // 初始分页设置
      currPage: 1,
      size: 10,
      total: 0
    }
  },
  mounted () {
    this.search()
  },
  computed: {
    databaseList () {
      return databaseList
    },
    statementTypes () {
      return statementTypes
    }
  },
  methods: {
    // 查询数据库及配置
    search () {
      let params = {
        databaseType: this.searchModel.database,
        statementType: this.searchModel.statement
      }
      axios.dataBaseSearch(params).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          let source = []
          for (let key in data) {
            if (data[key].length > 0) {
              let obj = {
                name: key,
                children: [],
                hasValue: false
              }

              // 处理子项，使其包含名称
              let temp = data[key]
              for (let dt of temp) {
                for (let base of statementTypes) {
                  if (base.value === dt.statementType) {
                    this.handleStringToObj(base, dt, obj)
                  }
                }
              }
              source.push(obj)
            }
          }
          this.tableData = source
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 处理keyword字符串成需要的对象
    handleStringToObj (base, dt, obj) {
      let newParam = {
        name: base.label,
        statementType: dt.statementType,
        keys: ''
      }
      // 判断是否有选择的项
      let keys = JSON.parse(dt.keyword)
      let arr = []
      for (let ob in keys) {
        if (keys[ob]) {
          obj.hasValue = true
          arr.push(ob)
        }
      }
      if (arr.length > 0) {
        newParam.keys = arr.join('，')
      }
      if (newParam.keys) {
        obj.children.push(newParam)
      }
    },
    // 配置跳转
    handleEdit (name) {
      let id = ''
      for (let key of databaseList) {
        if (name === key.label) {
          id = key.value
        }
      }
      this.$router.push({
        path: '/BasicManagement/Systemconfig/Configpage',
        query: {
          code: 1,
          id: id,
          operation: 'edit'
        }
      })
    },
    // 切换size时回调
    handleSizeChange (size) {},
    // 切花页码时回调
    handleCurrentChange (page) {},
    // 重置
    handleRest () {
      this.search()
    },
    // 查看详情
    handleDetail (row, column, e) {
      let id = ''
      for (let key of databaseList) {
        if (row.name === key.label) {
          id = key.value
        }
      }
      this.$router.push({
        path: '/BasicManagement/Systemconfig/Configpage',
        query: {
          code: 1,
          id: id,
          operation: 'detail'
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.high-risk {
  padding: 10px;
  .showList {
    width: 80%;
    margin-left: 10%;
    .statement-list-item {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      & /deep/ .el-row {
        width: 100%;
        margin: 5px 0;
      }
      .label-str {
        margin-right: 10px;
      }
    }
  }
  .task-btn-box {
    padding: 10px;
    span {
    display: inline-block;
    background: #fff;
    border: 1px solid #0066ff;
    line-height: 24px;
    padding: 0 4px;
    border-radius: 5px;
    color: #0066ff;
    font-size: 14px;
    margin: 2px 2px;
    cursor: pointer;
    }
  }
  .block {
    text-align: center;
    width: 100%;
    padding: 30px 0;
  }
  .tip-font {
    text-align: center;
  }
}

</style>
