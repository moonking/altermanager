<template>
    <el-dialog center class="layout-form" :visible="isVisibleBackup" @update:visible="updateVisible">
        <el-form v-model="formData" inline>
            <el-form-item>
                <el-input v-model="formData.value" placeholder="节点名称/所属系统/ip地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" @click="search" type="primary"><i class="el-icon-search"></i>查找</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="backupList" style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="nameIndex" label="备份编号"></el-table-column>
            <el-table-column prop="name" label="备份名称" ></el-table-column>
            <el-table-column prop="case" label="备份方案" ></el-table-column>
            <el-table-column prop="systemName" label="所属系统"></el-table-column>
            <el-table-column prop="updateDate" label="备份时间"></el-table-column>
            <el-table-column align="center" prop="operate" label="操作" >
                <template slot-scope="scope">
                    <el-button @click="selectBackup(scope.row)" type="primary" size="mini">选择</el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-dialog>
</template>

<script>
export default {
  props: {
    isVisibleBackup: {
      type: Boolean,
      default: true
    }
  },
  name: 'BackupDialog',
  data () {
    return {
      formData: {},
      backupList: [
        {
          nameIndex: 0,
          name: 'F5备份',
          case: 'F5备份',
          backId: 1,
          systemName: 'F5发布备份',
          updateDate: '2018-09-10 9:00'
        }, {
          nameIndex: 0,
          name: 'F5备份',
          case: 'F5备份',
          backId: 2,
          systemName: 'F5发布备份',
          updateDate: '2018-09-10 9:00'
        }
      ]

    }
  },
  methods: {
    search () {

    },
    updateVisible () {
      this.$emit('update:isVisibleBackup', false)
    },

    selectBackup (data) {
      this.$emit('selectBackup', data)
    }
  }
}
</script>

<style scoped>
    .layout-form .el-dialog {
        width: 70% !important;
    }

    .dialog-detail {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 100;
        background: #fff;
        width: 60%;

    }

    .form-item .el-input {
        width: 100%;
    }
    .form-item label {
        position: absolute;
        left: 0;
        top: 10px;
        width: 130px;
        text-align: right;
        line-height: 30px;
        font-size: 14px;
        color: #3E444A;
    }
    /* .get-title {
        font-size: 18px;
        font-weight: normal;
        padding-bottom: 10px;
        text-align: center;
    } */
    .dialog-btn {
        padding: 20px 20px 20px 140px;
    }
    .dialog-btn .btn-cancel{
        float: right;

    }
    .dialog-detail .closeicon {
        float: right;
        width:10px;
        height:10px;
    }
    .dialog-detail .el-tabs__item{
        padding: 0 20px;
        height: 40px !important;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        line-height: 40px !important;
        display: inline-block;
        list-style: none;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        position: relative;

    }
    .dialog-detail .el-tabs__item.is-active {
        color: #00D1B2 !important;
    }
    .gap-item {
        margin-top: 10px;
    }
    .backspace-title {
        color: #585858;
        font-size: 14px;
        padding: 20px 0 0;
    }
    .backspace-title span {
        display: inline-block;
        width: 6px;
        border-radius: 10px;
        margin-right: 20px;
        height: 20px;
        background: #0280FF;
        vertical-align: middle;
    }
    .yanzmessage{
        width:100%;
        overflow:visible;
        color:#aaa;
        padding-left:80px;
    }
</style>
