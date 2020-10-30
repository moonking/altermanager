<template>
  <el-dialog center class="layout-form" :visible="isVisibleEdit" @update:visible="updateVisible">
    <div class="dialog-detail">
      <div class="backspace-title">
        <span></span> 查看回退方案
      </div>
      <div class="backspace-pannel">
        <form class="dialog-form" :model="back">
          <div class="form-item">
            <label for>回退方案名称：</label>
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="grid-content bg-purple">
                  <el-input :disabled="!edit" v-model="data.name"></el-input>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-item">
            <label for>所属系统：</label>
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="grid-content bg-purple">
                  <el-select
                    style="width: 100%;"
                    :disabled="!edit"
                    v-model="data.systemId"
                    placeholder="所属系统选择"
                    clearable
                  >
                    <el-option
                      v-for="item in systemTypes"
                      :key="item.value"
                      :label="item.name"
                      :value="item.systemId"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-item">
            <label for>创建回退方案时间：</label>
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="grid-content bg-purple">
                  <el-input :disabled="!edit" v-model="data.createDate"></el-input>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-item">
            <label for>创建人：</label>
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="grid-content bg-purple">
                  <el-input :disabled="!edit" v-model="data.createName"></el-input>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-item">
            <label for>节点：</label>
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="grid-content bg-purple">
                  <el-input :disabled="!edit" v-model="data.nodeName"></el-input>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-item">
            <label for>脚本：</label>
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="grid-content bg-purple">
                  <el-input :disabled="!edit" v-model="data.fileName"></el-input>
                </div>
              </el-col>
            </el-row>
          </div>
        </form>
      </div>

      <!--<div class="backspace-title" ><span></span>连通性验证</div>-->
      <!--<div class="result-html">-->
      <!--<div class="yanzmessage">-->
      <!--<div>>>已创建连接</div>-->
      <!--<div>>>已获取备份信息</div>-->
      <!--<div>>>已验证备份信息</div>-->
      <!--<div>>>回退已连通</div>-->
      <!--<div>>>回退方案验证成功</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="backspace-title"><span></span>有效性验证</div>-->
      <!--<div  class="result-html" >-->
      <!--<div  class="yanzmessage">-->
      <!--<div>>>已创建连接</div>-->
      <!--<div>>>回退方案有效</div>-->
      <!--<div>>>回退方案有效性验证成功</div>-->
      <!--</div>-->
      <!--</div>-->
    </div>
  </el-dialog>
</template>

<script>
import axios from '@/api';
export default {
  props: {
    isVisibleEdit: {
      type: Boolean,
      default: false
    }
  },
  name: 'BackspaceEdit',
  data () {
    return {
      key: 'edit',
      edit: false,
      systemTypes: [],
      data: {},
      back: {
        id: '',
        system: '金融企业系统',
        num: 'H201901091511',
        backspace: '回退至201901091511',
        alternum: 'B201901091511',
        alterselected: 'vfdvsvsfd',
        js: 'wewdds',
        altername: '',
        backspacealter: 'F5发布备份',
        time: '2019-01-10 15:44:14',
        person: '张晓'
      }
    }
  },
  created () {
    // this.getSystemList()
  },
  methods: {
    openDialog (data) {
      this.data = data
    },
    updateVisible (value) {
      this.$emit('update:isVisibleEdit', false)
    },
    getSystemList () {
      let name = ''
      axios.getcigroupSystablist(name).then(data => {
        if (data.data.code === 200) {
          this.systemTypes = data.data.data.result
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.dialog-form {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.backspace-pannel {
  /*padding: 20px 0 20px 26px;*/
}
.dialog-detail {
  background: #fff;
}
.form-item {
  padding-left: 140px;
  position: relative;
  padding-top: 10px;
  min-height: 30px;
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
  color: #3e444a;
}

.dialog-btn .btn-cancel {
  float: right;
}
.dialog-detail .closeicon {
  float: right;
  width: 10px;
  height: 10px;
}
.dialog-detail .el-tabs__item {
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
  color: #00d1b2 !important;
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
  background: #0280ff;
  vertical-align: middle;
}
.yanzmessage {
  width: 100%;
  overflow: visible;
  color: #aaa;
  padding-left: 80px;
}
.result-html {
  border: 1px solid #ccc;
  width: 90%;
  padding-top: 30px;
  margin-top: 10px;
  margin-left: 20px;
}
</style>
