<template>
  <div class="container envirmentPage refreshContainer">
    <!-- <p class="mark-icon">
      {{status === 'create' ? "新增环境" : status === 'edit' ? "编辑环境" : "查看环境"}}
    </p>-->
    <div class="item-block-title" @click="envController = !envController">
      <div class="item-block-title-mark"></div>
      <span
        class="item-block-title-font"
      >{{status === 'create' ? "新增环境" : status === 'edit' ? "编辑环境" : "查看环境"}}</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: envController ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <el-form
      ref="form3"
      :rules="rules3"
      :model="envdata"
      class="item-block-content"
      label-width="60px"
      :style="{height: envController ? 'auto' : 0}"
    >
      <div>
        <el-row>
          <el-col :span="16">
            <el-form-item label="名称" prop="name" class="disinlne input" style="width:90%">
              <el-input
                v-model="envdata.name"
                autocomplete="off"
                maxlength="20"
                @input="inputFun1(envdata.name)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="text-align: left;padding-top: 8px;">
            <span>{{menuNameLength}}</span>/
            <span>20</span>
          </el-col>
        </el-row>
      </div>

      <div>
        <el-row>
          <el-col :span="16">
            <el-form-item
              label="环境"
              class="disinlne input"
              style="width:90%"
              prop="environmentType"
            >
              <el-select
                placeholder="选择环境"
                clearable
                style="width:100%"
                v-model="envdata.environmentType"
              >
                <el-option label="测试环境" value="1"></el-option>
                <el-option label="预生产环境" value="2"></el-option>
                <el-option label="生产环境" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="text-align: left;padding-top: 8px;"></el-col>
        </el-row>
      </div>

      <div>
        <el-row>
          <el-col :span="16">
            <el-form-item label="描述" class="disinlne input" style="width:90%">
              <el-input
                type="textarea"
                v-model="envdata.remarks"
                autocomplete="off"
                maxlength="100"
                @input="inputFun2(envdata.remarks)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="text-align: left;padding-top: 8px;">
            <span>{{menuRemarksLength}}</span>/
            <span>100</span>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="txtcenter">
      <el-button
        v-if="status === 'create'"
        size="medium"
        type="primary"
        class="opera-btn"
        @click="addEnvClickbtn"
      >确认</el-button>
      <el-button
        v-if="status === 'edit'"
        size="medium"
        type="primary"
        class="opera-btn"
        @click="addEnvClickbtn('2')"
      >保存</el-button>
      <el-button plain size="medium" @click="noAddUser">取消</el-button>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'envirmentPage',
  data () {
    return {
      envdata: {
        name: '',
        environmentType: '',
        remarks: ''
      },
      menuNameLength: 0,
      menuRemarksLength: 0,
      status: this.$route.params.status,
      rules3: {
        name: [
          { required: true, message: '名称不能为空!', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        environmentType: [
          { required: true, message: '环境必选！', trigger: 'change' }
        ]
      },
      envController: true

    }
  },
  created () {
    if (this.$route.query.id) {
      this.getEnvDetail(this.$route.query.id)
    }
  },
  methods: {
    // 新增或编辑环境
    addEnvClickbtn (num) {
      let that = this
      this.$refs.form3.validate(valid => {
        if (valid) {
          let data = {
            environmentType: this.envdata.environmentType,
            name: this.envdata.name,
            remarks: this.envdata.remarks
          }
          if (num && num === '2') {
            axios.envDataEdit(data, this.$route.query.id).then(function (res) {
              if (res.data.code == 200) {
                that.$notify({
                  title: '提示',
                  message: '修改成功',
                  type: 'success'
                })
                that.$router.push({
                  path: '/ResourceAllocation/OtherConfiguration',
                  query: {
                    code: 1
                  }
                })
              } else {
                that.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
          } else {
            axios.createNewEnv(data).then(res => {
              if (res.data.code == 200) {
                that.$notify({
                  title: '提示',
                  message: '新增成功',
                  type: 'success'
                })
                that.$router.push({
                  path: '/ResourceAllocation/OtherConfiguration',
                  query: {
                    code: 1
                  }
                })
              } else {
                that.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
          }
        }
      })
    },
    inputFun1 (value) {
      if (value) {
        this.menuNameLength = value.length
      } else {
        this.menuNameLength = 0
      }
    },
    inputFun2 (value) {
      if (value) {
        this.menuRemarksLength = value.length
      } else {
        this.menuRemarksLength = 0
      }
    },
    getEnvDetail (environmentId) {
      axios.getenvDataIm(environmentId).then(res => {
        if (res.data.code === 200) {
          this.envdata = res.data.data.result
        }
      })
    },
    // 取消新增
    noAddUser () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="scss">
.envirmentPage {
  margin: 10px;
  padding: 20px 0;
  .item-block-title {
    margin: 20px 0;
  }
  .item-block-content {
    padding-left: 20px;
  }
  .txtcenter {
    padding: 0 0 20px;
  }
  .opera-btn {
    margin: 0 80px;
  }
}
</style>
