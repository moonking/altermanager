<template>
  <div class="aia-content">
   <div class="wrapper-pannel">
    <h3>编辑业务系统</h3>
    <el-form  ref="configData" >

      <!-- <el-form-item label="编辑业务系统"></el-form-item> -->

        <el-input type="textarea"
        :rows="10"
        placeholder="请输入内容"
        v-model="sysdata.systemlists"></el-input>

      </el-form-item>

    </el-form>
    </div>
  <div style="font-size:0;">
    <el-button @click="save" class="common-btn save-btn"
      >提交</el-button
    >
    <el-button @click="reset"  class="cancel-button"
      >重置</el-button
    >
    <el-button @click="cancel"  class="cancel-button"
      >返回</el-button
    >
    </div>
  </div>
</template>

<script>
// import selectHost from './common/selectHost'
import axios from '@/api'
export default {

  data: () => ({
    sysdata: {

      systemlists: ''
    }

  }),
  created() {
  },
  methods: {

    // 保存新增或修改维护窗口
    save() {
      // this.$refs.selectDate.$refs['dateFrom'].validate((valid) => {
      //   if (valid) {
      //     if (this.editId) {
      //       this.addOrEdit(axios.updateMaintenance)
      //     } else {
      //       this.addOrEdit(axios.addMaintenance)
      //     }
      //   } else {
      //     return false
      //   }
      // })

      console.log(this.sysdata)

      axios.addsystemForBatch(this.sysdata).then(res => {
        if (res.data.success) {
          this.$notify({
            title: '提示',
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },

    reset() {
      this.systemlists = ''
    },
    // 跳转至前页
    cancel() {
      this.$router.replace({
        path: '/Aibms/otherConfiguration/systemOperation',
        query: { code: 2 }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  h3{
    margin-bottom:20px;
    font-size: 28px;
    font-weight: 500;
    color: #BFF3FF;
    line-height: 40px;
  }
  .wrapper-pannel {
    width: 100%;
    // background-color: rgba(4, 28, 37, 0.3);
    padding: 10px 0 60px;
    overflow: visible;
    .operation-button {
      margin-top: 12px;
      text-align: center;
      .el-button {
        margin-right: 12px;
      }
      .cancel-button {
        // color: #fff;
        // border: 1px solid #436382;
        // &:hover {
        //   border: 1px solid #436382;
        //   color: #fff;
        //   background: transparent;
        // }
        // &:focus {
        //   color: #fff;
        //   background: transparent;
        // }
        // &:active {
        //   border: 1px solid #436382;
        //   background: transparent;
        //   color: #fff;
        // }
      }
    }
  }
}
</style>
