<template>
  <div class="select-content">
    <!-- 筛选 -->
    <el-form
      :inline="true"
      ref="searchFrom"
      :model="searchFrom"
      label-width="80px"
      v-if="!readOnly"
    >
      <el-form-item>
        <el-select
          clearable
          v-model="searchFrom.businessValue"
          placeholder="请选择业务系统"
        >
          <el-option
            v-for="item in businessList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchFrom.ipAddress"
          clearable
          placeholder="请输入主机名"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" class="search-icon" @click="search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      ref="dataTable"
      stripe
      :header-cell-style="{ background: '#f5f5f5' }"
      @select-all="handleSelectionChangeAll"
      @select="handleSelectionChange"
    >
      <el-table-column
        v-if="!readOnly"
        type="selection"
        width="80"
        :selectable="checkSelectable"
      />
      <!-- <el-table-column prop="name" label="业务系统" /> -->
      <el-table-column prop="hosts" label="主机" />
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
      style="text-align: center; margin: 92px 0"
    />
  </div>
</template>

<script>
import axios from '@/api'
export default {
  props: {
    readOnly: {
      required: true,
      default: false,
      type: Boolean
    }
  },
  watch: {
    // // 获取勾选数据
    // checkedTableData(val, oldVal) {
    //   console.log(val)
    //   if (val.length) {
    //     if (this.$route.query.id) {
    //       this.hostList = val
    //       this.hostList.forEach((item, index) => {
    //         if (!item.bl) {
    //           this.hostList.splice(index, 1)
    //         }
    //       })
    //       console.log(this.hostList)
    //       // this.returnSelect()
    //       if (this.readOnly) {
    //         this.tableData = val
    //       }
    //     }
    //   }
    // }
  },
  data: () => ({
    tableData: [],
    businessList: [],
    searchFrom: {
      businessValue: '',
      ipAddress: ''
    },
    page: {
      current: 1,
      size: 10
    },
    totalSize: 0,
    hostList: [],
    checkedHostList: []
  }),
  mounted() {
    this.$nextTick(() => {
      this.hostList = this.$parent.checkedTableData
      if (this.readOnly) {
        this.tableData = this.$parent.checkedTableData
      }
      if (this.$route.query.id) {
        if (!this.readOnly) {
          this.getHostTableData()
          this.getBusinessList()
        }
      } else {
        this.getHostTableData()
        this.getBusinessList()
      }
    })
  },
  methods: {
    // 是否可选
    checkSelectable(row) {
      return !row.belongOps
    },
    // 返回选中值
    returnSelect() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.hostList.forEach(result => {
            this.tableData.forEach((row, index) => {
              if (row.systemId === result.systemId && row.ciitemId === result.ciitemId) {
                row.bl = true
                this.$refs.dataTable.toggleRowSelection(this.tableData[index], true)
              }
            })
          })
        })
      }, 300)
    },
    // 搜索
    search() {
      this.getHostTableData()
    },
    // 告警通知业务下拉框数据
    getBusinessList() {
      const params = {
        name: '',
        ipAddress: '',
        current: 1,
        size: 1000
      }
      axios.getSystemList(params).then(res => {
        if (res.data.success) {
          this.businessList = [...new Set(res.data.data.result.records.map(item => item.name))]
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    // 获取系统列表
    getHostTableData() {
      const params = {
        name: this.searchFrom.businessValue,
        ipAddress: this.searchFrom.ipAddress,
        current: this.page.current,
        size: this.page.size
      }
      axios.getCiSystemList(params).then(res => {
        if (res.data.success) {
          console.log(res.data.data.records)
          res.data.data.records.forEach((item) => {
            if (!item.belongOps) {
              item.bl = false
            }
            if (!this.readOnly && this.$route.query.id) {
              item.belongOps = false
            }
          })

          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
      this.returnSelect()
    },
    // 全选判断去重
    handleSelectionChangeAll(selection) {
      let isBelongOps = false
      let num = 0
      selection.forEach((item) => {
        if (item.belongOps) {
          num++
        }
      })
      if (num === selection.length) {
        isBelongOps = true
      }
      if (selection.length > 0) {
        if (isBelongOps) {
          this.tableData.forEach((item) => {
            if (!item.belongOps) {
              item.bl = false
            }
          })
          this.tableData.forEach((item) => {
            if (!item.bl) {
              this.hostList.forEach((items, index) => {
                if (item.ciitemId + item.systemId == items.ciitemId + items.systemId) {
                  this.hostList.splice(index, 1)
                }
              })
            }
          })
        } else {
          this.tableData.forEach((item) => {
            if (!item.belongOps) {
              item.bl = true
            }
          })
          if (this.hostList.length === 0) {
            this.hostList = selection
          } else {
            let ciitemList = this.hostList.map(item => item.ciitemId)
            let systemList = this.hostList.map(item => item.systemId)
            let arrayList = []
            ciitemList.forEach((item) => {
              systemList.forEach((data) => {
                arrayList.push(item + data)
              })
            })
            arrayList = [...new Set(arrayList)]
            this.tableData.forEach((item, index) => {
              if (item.bl) {
                if (!arrayList.includes(item.ciitemId + item.systemId)) {
                  this.hostList.push(item)
                }
              } else {
                this.hostList.forEach((items, index) => {
                  if (item.ciitemId + item.systemId == items.ciitemId + items.systemId) {
                    this.hostList.splice(index, 1)
                  }
                })
              }
            })
          }
        }
      } else {
        this.tableData.forEach((item) => {
          if (!item.belongOps) {
            item.bl = false
          }
        })
        this.tableData.forEach((item, index) => {
          this.hostList.forEach((items, index) => {
            if (item.ciitemId + item.systemId == items.ciitemId + items.systemId) {
              this.hostList.splice(index, 1)
            }
          })
        })
      }
    },
    // 单选逻辑去重
    handleSelectionChange(selection, row) {
      if (selection.length > 0) {
        let ciitemIdList = selection.map(item => item.ciitemId)
        let systemIdList = selection.map(item => item.systemId)
        let arrList = []
        ciitemIdList.forEach((item) => {
          systemIdList.forEach((data) => {
            arrList.push(item + data)
          })
        })
        arrList = [...new Set(arrList)]
        let bl = false
        if (arrList.includes(row.ciitemId + row.systemId)) {
          bl = true
        }
        this.tableData.forEach((item) => {
          if (item.ciitemId === row.ciitemId && item.systemId === row.systemId) {
            if (!item.belongOps) {
              item.bl = bl
            }
          }
        })
      } else {
        this.tableData.forEach((item) => {
          if (item.ciitemId === row.ciitemId && item.systemId === row.systemId) {
            if (!item.belongOps) {
              item.bl = false
            }
          }
        })
      }
      if (this.hostList.length === 0) {
        this.hostList = selection
      } else {
        let ciitemList = this.hostList.map(item => item.ciitemId)
        let systemList = this.hostList.map(item => item.systemId)
        let arrayList = []
        ciitemList.forEach((item) => {
          systemList.forEach((data) => {
            arrayList.push(item + data)
          })
        })

        arrayList = [...new Set(arrayList)]

        this.tableData.forEach((item, index) => {
          if (item.bl) {
            if (!arrayList.includes(item.ciitemId + item.systemId)) {
              this.hostList.push(item)
            }
          } else if (!item.bl && arrayList.includes(item.ciitemId + item.systemId)) {
            this.hostList.forEach((items, index) => {
              if (item.ciitemId + item.systemId == items.ciitemId + items.systemId) {
                this.hostList.splice(index, 1)
              }
            })
          }
        })
      }
    },
    // 分页
    handleCurrentChange() {
      this.getHostTableData()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.getHostTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-content {
  margin: 50px 20px 20px;
}
.search-icon {
  color: #fff;
  border: 1px solid #436382;
  &:hover {
    border: 1px solid #436382;
    color: #fff;
    background: transparent;
  }
  &:focus {
    color: #fff;
    background: transparent;
  }
  &:active {
    border: 1px solid #436382;
    background: transparent;
    color: #fff;
  }
}
</style>
