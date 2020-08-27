<template>
  <div class="common-table">
    <el-table
      :data="dataSource"
      row-key="paramId"
      :header-cell-style="{background:'#f5f5f5'}"
      class="table"
    >
      <el-table-column
        v-for="(v,i) in cols"
        :label="v.label"
        :prop="v.prop"
        align="left"
        :key="i"
        :render-header="renderHeader"
        :width="v.prop === 'isEmpty' || v.prop === 'paramType' ? '120px' : v.prop === 'name' ? '160px' : ''"
      >
        <template slot-scope="scope">
          <span v-if="scope.row[v.prop]">
            <span v-if="v.prop == 'isEmpty'">{{scope.row[v.prop] | filterState}}</span>
            <span v-else-if="v.prop === 'paramType'">{{scope.row[v.prop] | formatCode}}</span>
            <span v-else-if="v.prop === 'paramValue'">{{formatValueCode(scope.row, v.prop)}}</span>
            <span v-else>{{scope.row[v.prop]}}</span>
          </span>
          <span v-else class="common-font">点击输入</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'CommonTable',
  data () {
    return {}
  },
  props: ['dataSource', 'cols'],
  filters: {
    filterState (val) {
      return val === '1' ? '是' : val === '0' ? '否' : val
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
    // 参数值的转换
    formatValueCode (row, label) {
      if (row.paramType === '1') {
        return row[label] === '1' ? '使用' : '不使用'
      } else {
        return row[label]
      }
    }
  }
}
</script>
<style scoped>
</style>
