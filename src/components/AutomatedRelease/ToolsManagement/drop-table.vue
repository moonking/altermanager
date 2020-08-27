<template>
  <div class="drop-table">
    <el-row>
      <el-col :span="23">
        <el-table
          :data="dataSource"
          row-key="id"
          @cell-click="handleCell"
          :header-cell-style="{background:'#f5f5f5'}"
          class="table"
        >
          <el-table-column
            v-for="(v,i) in cols"
            :label="v.label"
            :prop="v.prop"
            align="center"
            :key="i"
            :render-header="renderHeader"
            :width="v.prop === 'isEmpty' || v.prop === 'paramType' ? '120px' : v.prop === 'name' ? '160px' : ''"
          >
            <template slot-scope="scope">
              <span v-if="scope.row[v.judge]">
                <el-select
                  v-if="v.prop == 'isEmpty'"
                  v-model="scope.row[v.prop]"
                  @change="changeState(scope.row, v.judge)"
                >
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
                <!-- 判断是参数类型 -->
                <el-select
                  v-else-if="v.prop === 'paramType'"
                  v-model="scope.row[v.prop]"
                  @change="changeType(scope.row, v.judge)"
                >
                  <el-option
                    v-for="type in types"
                    :key="type.val"
                    :label="type.tag"
                    :value="type.val"
                  />
                </el-select>
                <!-- 判断是参数值 -->
                <div v-else-if="v.prop === 'paramValue'">
                  <el-select
                    v-if="scope.row.paramType === '1'"
                    v-model="scope.row[v.prop]"
                    @change="changeState(scope.row, v.judge)"
                  >
                    <el-option label="使用" value="1" />
                    <el-option label="不使用" value="0" />
                  </el-select>
                  <el-input
                    v-else
                    v-model="scope.row[v.prop]"
                    @click="clearData(scope.row, v.prop)"
                    @keyup.enter.native="handleStateChange(scope.row, v.judge)"
                    @blur="handleStateChange(scope.row, v.judge)"
                    autofocus="true"
                    placeholder="点击输入"
                  />
                </div>
                <el-input
                  v-else
                  v-model="scope.row[v.prop]"
                  @click="clearData(scope.row, v.prop)"
                  @keyup.enter.native="handleStateChange(scope.row, v.judge)"
                  @blur="handleStateChange(scope.row, v.judge)"
                  autofocus="true"
                  placeholder="点击输入"
                />
              </span>
              <span v-else>
                <span v-if="scope.row[v.prop]">
                  <span v-if="v.prop == 'isEmpty'">{{scope.row[v.prop] | filterState}}</span>
                  <span v-else-if="v.prop === 'paramType'">{{scope.row[v.prop] | formatCode}}</span>
                  <span v-else-if="v.prop === 'paramValue'">{{formatValueCode(scope.row, v.prop)}}</span>
                  <span v-else>{{scope.row[v.prop]}}</span>
                </span>
                <span v-else class="common-font">点击输入</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80" v-if="canAdd">
            <template slot-scope="scope">
              <span class="icon-style" @click="deleteRow(scope.row)">
                <i class="el-icon-delete"></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">
        <div class="add-btn" @click="addNewInputRow" v-if="canAdd">
          <i class="el-icon-circle-plus-outline"></i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import axios from '@/api';
import { typeList } from '../../AutomaticOperation/ScriptManage/util'
export default {
  name: 'DropTable',
  data () {
    return {
      cols: [
        { label: '参数名', prop: 'name', judge: 'paramsNameEdit' },
        { label: '参数标题名称', prop: 'titleName', judge: 'titleNameEdit' },
        { label: '参数类型', prop: 'paramType', judge: 'paramsTypeEdit' },
        { label: '参数值', prop: 'paramValue', judge: 'paramsValueEdit' },
        { label: '是否必填', prop: 'isEmpty', judge: 'isRequired' },
        { label: '参数说明', prop: 'paramState', judge: 'paramsMarkEdit' }
      ],
      index: this.dataSource.length + 1
    }
  },
  props: {
    dataSource: {
      type: Array
    },
    canAdd: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    types () {
      return typeList
    }
  },
  filters: {
    filterState (val) {
      return val == 1 ? '是' : val == 0 ? '否' : val
    },
    formatCode (code) {
      let codeName = ''
      switch (code) {
        case '0': {
          codeName = '字符'
          break
        }
        case '1': {
          codeName = '布尔'
          break
        }
        case '2':
          codeName = '等号连接'
          break
        case '3':
          codeName = '位置参数'
          break
      }
      return codeName
    }
  },
  mounted () {
    this.rowDrop()
  },
  methods: {
    renderHeader (h, { column }) {
      // h即为cerateElement的简写
      if (
        column.label == '参数值' ||
        column.label == '参数说明' ||
        column.label === '参数名'
      ) {
        return h('div', [h('span', column.label)])
      } else {
        return h('div', [
          h(
            'i',
            { style: 'margin-right: 4px;color: #ff0000;font-size: 18px;' },
            '*'
          ),
          h('span', column.label)
        ])
      }
    },
    changeState (row, label) {
      let data = row
      let idx
      for (let i in this.dataSource) {
        if (this.dataSource[i].id === row.id) {
          idx = i
        }
      }
      this.dataSource.splice(idx, 1, data)
      row[label] = false
      this.$emit('rebackData', this.dataSource)
    },
    deleteRow (value) {
      if (value.paramId) {
        axios.deleteParams(value.paramId).then(res => {
          let idx
          this.dataSource.map((item, index) => {
            if (item.id === value.id) {
              idx = index
            }
          })
          this.dataSource.splice(idx, 1)
          this.$emit('isDelete', this.dataSource)
        })
      } else {
        let idx
        this.dataSource.map((item, index) => {
          if (item.id === value.id) {
            idx = index
          }
        })
        this.dataSource.splice(idx, 1)
        this.$emit('isDelete', this.dataSource)
      }
    },
    addNewInputRow () {
      this.index += 1
      this.dataSource.push({
        id: 'x' + this.index,
        name: '',
        titleName: '',
        paramValue: '',
        paramType: '0',
        isEmpty: '',
        paramState: '',
        paramsNameEdit: false,
        paramsValueEdit: false,
        paramsTypeEdit: false,
        paramsMarkEdit: false,
        isRequired: false,
        titleNameEdit: false
      })
    },
    rowDrop () {
      const tbody = document.querySelector(
        '.table-params .el-table__body-wrapper tbody'
      )
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.dataSource.splice(oldIndex, 1)[0]
          _this.dataSource.splice(newIndex, 0, currRow)
        }
      })
    },
    handleCell (row, column, cell, event) {
      let prop = column.property
      console.log(column)
      console.log(row)
      let rowContent = row
      let idx = ''
      switch (prop) {
        case 'name':
          rowContent.paramsNameEdit = true
          break
        case 'titleName':
          rowContent.titleNameEdit = true
          break
        case 'paramValue':
          rowContent.paramsValueEdit = true
          break
        case 'paramType':
          rowContent.paramsTypeEdit = true
          break
        case 'isEmpty':
          rowContent.isRequired = true
          break
        case 'paramState':
          rowContent.paramsMarkEdit = true
          break
      }
      for (let i in this.dataSource) {
        if (this.dataSource[i].id === row.id) {
          idx = i
        }
      }
      this.$set(this.dataSource, idx, rowContent)
    },
    handleStateChange (row, label) {
      let idx
      for (let i in this.dataSource) {
        if (this.dataSource[i].id === row.id) {
          idx = i
        }
      }
      row[label] = false
      this.dataSource.splice(idx, 1, row)
      this.$emit('rebackData', this.dataSource)
      this.$emit('testData', { index: idx, data: this.dataSource })
    },
    clearData (value) {
      value = ''
    },
    // 参数值的转换
    formatValueCode (row, label) {
      if (row.paramType === '1') {
        return row[label] === '1' ? '使用' : '不使用'
      } else {
        return row[label]
      }
    },
    // 参数类型选择
    changeType (row, label) {
      let idx
      for (let i in this.dataSource) {
        if (this.dataSource[i].id === row.id) {
          idx = i
        }
      }
      row[label] = false
      row.paramValue = ''
      this.dataSource.splice(idx, 1, row)
      this.$emit('rebackData', this.dataSource)
      this.$emit('testData', { index: idx, data: this.dataSource })
    }
  }
}
</script>
<style scoped>
.drop-table {
  width: 98%;
  margin: 0 auto;
}
.add-btn {
  text-align: center;
  line-height: 20px;
  cursor: pointer;
}
.icon-style {
  cursor: pointer;
}
.redMark {
  margin-right: 4px;
  color: #ff0000;
  font-size: 16px;
}
.common-font {
  color: #777;
}
</style>
