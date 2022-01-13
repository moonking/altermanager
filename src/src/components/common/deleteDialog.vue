<template>
  <div>
    <el-dialog center title="删除提示" :visible.sync="confirmDeleteDialogVisible" width="25%">
      <div style="text-align: center">
        <i class="el-icon-warning" /> 确认删除？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" class="nomal-button" @click="confirmDeleteDialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="confirmDelete">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    confirmDeleteDialogVisible: false
  }),
  methods: {
    confirmDelete () {
      this.$emit('confim-delete')
    }
  }
}
</script>

<style>
</style>