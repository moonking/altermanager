<template>
  <div class="output-table">
    <el-row>
      <el-col :span="23">
        <el-table
          :data="dataSource"
          row-key="id"
          @cell-dblclick="handleCell"
          :header-cell-style="{background:'#f5f5f5'}"
        >
          <el-table-column
            v-for="(v,i) in cols"
            :label="v.label"
            :prop="v.prop"
            align="center"
            :key="i"
            :render-header="renderHeader"
          >
            <template slot-scope="scope">
              <span v-if="scope.row[v.judge]">
                <el-select
                  v-if="v.prop == 'isEmpty'"
                  v-model="scope.row[v.prop]"
                  @change="changeState(scope.row, v.judge)"
                >
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                </el-select>
                <el-input
                  v-else
                  v-model="scope.row[v.prop]"
                  maxlength="20"
                  @keyup.enter.native="handleStateChange(scope.row, v.judge)"
                  @blur="handleClose(scope.row, v.judge)"
                  autofocus="true"
                  placeholder="双击输入"
                ></el-input>
              </span>
              <span v-else>
                <span v-if="scope.row[v.prop]">
                  <span v-if="v.prop == 'isEmpty'">{{scope.row[v.prop] | filterState}}</span>
                  <span v-else>{{scope.row[v.prop]}}</span>
                </span>
                <span v-else>双击输入</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <span class="icon-style" @click="deleteRow(scope.row)">
                <i class="el-icon-delete"></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">
        <div class="add-btn" @click="addNewOnputRow">
          <i class="el-icon-circle-plus-outline"></i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'DropTable',
  data () {
    return {
      cols: [
        { label: '参数名', prop: 'name', judge: 'paramsNameEdit' },
        { label: '参数标题名称', prop: 'titleName', judge: 'titleNameEdit' },
        { label: '参数值', prop: 'paramValue', judge: 'paramsValueEdit' },
        { label: '参数类型', prop: 'paramType', judge: 'paramsTypeEdit' },
        { label: '是否必填', prop: 'isEmpty', judge: 'isRequired' },
        { label: '参数说明', prop: 'paramState', judge: 'paramsMarkEdit' }
      ],
      index: this.dataSource.length
    }
  },
  filters: {
    filterState (val) {
      return val == 1 ? '是' : val == 0 ? '否' : val
    }
  },
  props: ['dataSource'],
  methods: {
    renderHeader (h, { column }) {
      // h即为cerateElement的简写
      if (column.label == '参数值' || column.label == '参数说明') {
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
    addNewOnputRow () {
      this.index += 1
      this.dataSource.push({
        id: this.index,
        name: '',
        titleName: '',
        paramValue: '',
        paramType: '',
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
    handleCell (row, column, cell, event) {
      let prop = column.property
      switch (prop) {
        case 'name':
          row.paramsNameEdit = true
          break
        case 'titleName':
          row.titleNameEdit = true
          break
        case 'paramValue':
          row.paramsValueEdit = true
          break
        case 'paramType':
          row.paramsTypeEdit = true
          break
        case 'isEmpty':
          row.isRequired = true
          break
        case 'paramState':
          row.paramsMarkEdit = true
          break
      }
    },
    handleClose (row, label) {
      this.dataSource.forEach(item => {
        item[label] = false
      })
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
    }
  }
}
</script>
<style scoped>
.output-table {
  width: 85%;
  margin: 0 128px;
}
.add-btn {
  text-align: center;
  line-height: 20px;
  cursor: pointer;
}
</style>
