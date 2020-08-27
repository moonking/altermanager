<template>
  <div class="demandComparison container aibms-color-bg non-border">
    <el-row class="comparie-title">
      <el-col :span="22">
        <span class="white-color">文件名称</span>
      </el-col>
      <el-col :span="2" class="operation-comparie">
        <span class="white-color">操作</span>
      </el-col>
    </el-row>
    <div class="comparie-box">
      <el-row v-for="(file,index) in files" :key="index" class="comparie-item non-border">
        <el-col :span="22">
          <span
            :class="filterStatus(file.status).color"
            class="file-comparie text-overflow"
          >{{file.name}}</span>
        </el-col>
        <el-col :span="2" class="operation-comparie">
          <span :class="filterStatus(file.status).color">{{filterStatus(file.status).operate}}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemandComparison',
  data () {
    return {
      files: [
        { name: '/src/components/BasicManagement/user.vue', status: 'create' },
        { name: '/src/components/BasicManagement/user.vue', status: 'edit' },
        { name: '/src/components/BasicManagement/user.vue', status: 'delete' },
        { name: '/src/components/BasicManagement/user.vue', status: 'create' }
      ]
    }
  },
  methods: {
    filterStatus (status) {
      let color = ''
      let name = ''
      switch (status) {
        case 'create':
          color = 'create'
          name = '增加'
          break
        case 'edit':
          color = 'edit'
          name = '编辑'
          break
        case 'delete':
          color = 'delete'
          name = '删除'
          break
      }
      return {
        color: color,
        operate: name
      }
    }
  }
}
</script>

<style scoped>
.demandComparison {
  padding: 20px;
}
.comparie-title /deep/ .operation-comparie {
  text-align: right;
  padding-right: 10px;
}
.comparie-box {
  margin-top: 10px;
}
.comparie-box .comparie-item {
  border: 1px solid #f0f0f0;
  line-height: 40px;
  color: #585858;
  font-size: 16px;
}
.file-comparie {
  padding-left: 10px;
  width: 100%;
}
.comparie-item /deep/ .operation-comparie {
  text-align: right;
  padding-right: 10px;
  font-size: 14px !important;
}
.create {
  color: #49bc71;
} 
.delete {
  color: #ff0000;
}
.edit {
  color: #fff;
}
</style>
