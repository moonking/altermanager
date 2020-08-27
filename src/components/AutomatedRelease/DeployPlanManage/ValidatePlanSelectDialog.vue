<template>
  <div class="validate-plan-select-dialog">
    <el-dialog
      center
      title="选择验证方案"
      :visible="dialogVisible"
      @update:visible="updateVisible"
      width="1100px">
      <el-form v-model="formData" inline>
        <el-form-item>
          <el-input v-model="formData.value" placeholder="验证方案名称/节点"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button><i class="el-icon-search"></i>搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column prop="id" label="验证方案编号"></el-table-column>
        <el-table-column prop="name" label="验证方案名称"></el-table-column>
        <el-table-column prop="node" label="节点"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="operate" label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="selectValidatePlan(scope.row)" size="mini" type="primary">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {
        value: ''
      },
      tableData: [{
        id: 'Y2019110154414',
        name: '验证节点 152.78.woeladd',
        node: '152.78.woeladd',
        createTime: '2019-2-13 03:21:32'
      }, {
        id: 'Y2019110154414',
        name: '验证节点 152.78.woeladd',
        node: '152.78.woeladd',
        createTime: '2019-2-13 03:21:32'
      }
      ]
    }
  },
  methods: {
    updateVisible (value) {
      this.$emit('update:dialogVisible', value)
    }
  }
}
</script>
<style scoped>

</style>
