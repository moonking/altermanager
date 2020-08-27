<template>
  <div class="layout">
    <div class="layout-panel aibms-bg non-shadow">
      <div class="layout-item">
        <el-row>
          <el-form :inline="true" :model="search">
            <el-form-item style="margin-left: 15px">
              <el-input placeholder="请输入报告名称" v-model="search.name" />
            </el-form-item>
            <el-form-item class="form-select">
              <el-input placeholder="请输入ip地址" v-model="search.ipAddress" />
            </el-form-item>
            <el-form-item class="form-select">
              <el-select
                placeholder="请选择健康状态"
                v-model="search.healthy"
                :clearable="true"
              >
                <el-option
                  v-for="item in healthy"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="item-right">
              <el-button
                icon="el-icon-search"
                class="nomal-button"
                @click="_resourceListData"
              >查找</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row style="padding: 0 10px">
          <el-table
            stripe
            :data="resourceList"
            style="width: 100%;"
            :header-cell-style="{ background: '#f5f5f5' }"
          >
            <el-table-column prop="name" label="报告名称">
              <template slot-scope="scope">
                <div
                  @click="showDetail(scope.row.resourcesId)"
                  style="cursor: pointer"
                >{{scope.row.name}}健康检查报告</div>
              </template>
            </el-table-column>
            <el-table-column prop="ipAddress" label="IP地址" />
            <el-table-column prop="healthStatus" label="健康状态">
              <template slot-scope="scope">
                <icon-svg
                  v-if="scope.row.healthStatus === 1"
                  class="healthy-icon success-operation-color"
                  icon-class="jiankang"
                />
                <icon-svg
                  v-else-if="scope.row.healthStatus === 0"
                  class="healthy-icon task-operation-color"
                  icon-class="bujiankang"
                />
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="search.current"
              :page-sizes="[10,30,50]"
              layout="prev, pager, next, sizes, total, jumper"
              :total="total"
              
              style="margin-right:15px;cursor: pointer;"
            />
          </div>
        </el-row>
      </div>
    </div>

    <el-dialog :title="'健康检查报告'" :visible.sync="dialogVisible" width="50%" center>
      <div class="main-info">
        <el-form class="item-box" size="mini" label-width="120px">
          <el-form-item class="item" label="检查类型：">{{ resultInfo.checkType | checkType }}</el-form-item>
          <el-form-item class="item" label="检查时间：">{{ resultInfo.checkDate }}</el-form-item>
          <el-form-item class="item" label="IP地址：">{{ resultInfo.ipAddress }}</el-form-item>
          <el-form-item class="item" label="健康状态：">{{ resultInfo.healthStatus | getHealthyStatus }}</el-form-item>
        </el-form>
      </div>
      <div v-for="(result,index) in resultList" :key="index">
        <div class="title">
          <span></span>
          {{ result.name }}
          <i
            v-if="isFirst"
            @click="changeDrop(1)"
            class="el-icon-arrow-right icon"
          ></i>
          <i v-else @click="changeDrop(1)" class="el-icon-arrow-down icon"></i>
        </div>
        <el-table
          v-if="isFirst"
          :data="result.checkStandardList"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column align="center" prop="name" label="检查子项"></el-table-column>
          <el-table-column align="center" prop="name" label="检查标准">
            <template
              slot-scope="scope"
            >{{ scope.row.name}} {{scope.row.checkRool | checkRule}} {{ scope.row.checkNumber}}</template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="实际指标">
            <template slot-scope="scope">{{ scope.row.realNumber || '-' }}</template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="是否健康">
            <template slot-scope="scope">{{scope.row.checkStatus | getHealthyStatus}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'HealthResult',
  data () {
    return {
      dialogVisible: false,
      search: {
        current: 1,
        size: 10,
        resourcesType: 1,
        name: '',
        ipAddress: ''
      },
      healthy: [
        {
          value: 0,
          label: '健康'
        },
        {
          value: 1,
          label: '不健康'
        }
      ],
      resourceList: [],
      total: 0,
      isFirst: true,
      isSecond: true,
      isThird: true,
      currentReport: {},
      resultInfo: {},
      resultList: []
    }
  },
  created () {
    let resourcesType = this.$route.query.type
    if (resourcesType) {
      this.search.resourcesType = this.$route.query.type
    }
    this._resourceListData()
  },
  filters: {
    getHealthyStatus (value) {
      if (value === 0) {
        return '健康'
      } else if (value === 1) {
        return '不健康'
      } else {
        return '-'
      }
    },
    checkRule (value) {
      if (value === 'exit') {
        return '存在'
      } else {
        return value
      }
    },
    checkType (value) {
      if (value == '0') {
        return '定时'
      } else if (value == '1') {
        return '手动检查'
      }
    }
  },
  methods: {
    // 获取健康检查报告
    _healthyReport (resourcesId) {
      let search = {
        resourcesType: this.search.resourcesType,
        resourcesId: resourcesId
      }
      axios.healthyReport(search).then(result => {
        if (result.data.code === 200) {
          let data = result.data.data
          this.resultInfo = data.maResources
          if (this.resultInfo.healthStatus !== '') {
            this.resultInfo.healthStatus = parseInt(this.resultInfo.healthStatus)
          }
          this.resultList = data.maCheckTermsList

          this.resultList.forEach((checkItem, index) => {
            checkItem.checkStandardList.forEach((checkChildItem, childIndex) => {
              this.resultInfo.resourcesStdHealthy.forEach((resultItem, resultIndex) => {
                if (checkChildItem.standardId === resultItem.standardId) {
                  this.$set(this.resultList[index].checkStandardList[childIndex], 'realNumber', resultItem.realNumber)
                  this.$set(this.resultList[index].checkStandardList[childIndex], 'checkStatus', resultItem.checkStatus)
                  this.$set(this.resultList[index].checkStandardList[childIndex], 'checkType', resultItem.checkType)
                }
              })
            })
          })
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      })
    },
    // 获取健康检查列表
    _resourceListData () {
      axios.resourceListData(this.search).then(result => {
        if (result.data.code === 200) {
          this.resourceList = result.data.data.records
          this.total = parseInt(result.data.data.total)
        } else {
          this.$notify({
            title: '提示',
            message: '查询出错，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        }
      })
    },

    showDetail (resourcesId) {
      this._healthyReport(resourcesId)
      this.dialogVisible = true
    },

    // 搜索列表
    searchList () { },
    // 分页
    handleCurrentChange (val) {
      this.search.current = val
      this._resourceListData()
    },
    handleSizeChange (val) {
      this.search.size = val
      this._resourceListData()
    },
    changeDrop (index) {
      if (index === 1) {
        this.isFirst = !this.isFirst
      } else if (index === 2) {
        this.isSecond = !this.isSecond
      } else if (index === 3) {
        this.isThird = !this.isThird
      }
    }
  }
}
</script>

<style lang="stylus" scoped >
.icon {
  color: #1e90ff;
  font-size: 20px;
  vertical-align: text-bottom;
}

.el-form {
  .el-form-item {
    margin-bottom: 15px !important;
  }
}

.title {
  font-size: 14px;
  color: #585858;
  padding: 20px 0 10px;

  span {
    background: #0066ff;
    display: inline-block;
    width: 8px;
    height: 30px;
    vertical-align: middle;
    border-radius: 5px;
    margin-right: 10px;
  }
}

.main-info {
  background: #F7F7F7;

  .item-box {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;

    .item {
      width: 50%;
    }
  }
}

.healthy-icon {
  height: 50px;
}

.block {
  padding: 20px 0;
  margin-top: 72px;
  text-align: center;
}

.task-btn-box span {
  display: inline-block;
  background: #fff;
  border: 1px solid #0066ff;
  line-height: 24px;
  /* padding: 0 8px; */
  border-radius: 5px;
  color: #0066ff;
  font-size: 14px;
  margin-right: 12px;
  cursor: pointer;
}

.layout {
  padding: 10px;

  .layout-panel {
    background: #fff;
    box-shadow: 0 0 4px #ccc;
    padding: 10px;
    border-radius: 5px;

    .form {
      width: 50%;
      margin-left: 10%;
    }
  }
}

.item-right {
  float: right;
}
</style>
