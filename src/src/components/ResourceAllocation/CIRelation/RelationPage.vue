<template>
  <div class="container page refreshContainer aibms-color-bg non-border">
    <!-- <p class="mark-icon padding-title">
      {{status === 'create' ? "新增CI关系" : status === 'edit' ? "编辑CI关系" : "查看CI关系"}}
    </p>-->
    <div class="item-block-title" @click="relationController = !relationController">
      <div class="item-block-title-mark"></div>
      <span
        class="item-block-title-font"
      >{{status === 'create' ? "新增CI关系" : status === 'edit' ? "编辑CI关系" : "查看CI关系"}}</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: relationController ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <el-form
      class="input-form item-block-content"
      ref="form"
      :model="RelationForm"
      :rules="rules"
      label-width="152px"
      :style="{height: relationController ? 'auto' : 0}"
    >
      <el-form-item label="选择CI类型-属性: " class="disinlne first" style="width:94%" prop="Cirelation">
        <!-- <el-cascader
          :options="options2"
          @active-item-change="handleItemChange"
          :props="props"
        ></el-cascader>-->
        <el-cascader
          :class="isshowerr1 ? 'borderColorRed' : 'borderColorGry'"
          :options="options"
          :value="RelationForm.Cirelation"
          filterable
          @change="handleItemChange"
          @focus="hideTip(1)"
          :disabled="status === 'watch'"
          clearable
        ></el-cascader>
        <span class="alert" v-if="isshowerr1">CI类型或者属性不能为空</span>
      </el-form-item>
      <el-form-item label="设置关系: " class="disinlne" style="width:94%" prop="sshid3">
        <el-select
          v-model="RelationForm.sshid3"
          placeholder="请选择关系"
          clearable
          :disabled="status === 'watch'"
          style="width: 632px"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in List"
            :key="index"
            clearable
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择CI类型-属性: " class="disinlne" style="width:94%" prop="Cirelation2">
        <el-cascader
          :class="isshowerr3 ? 'borderColorRed' : 'borderColorGry'"
          :value="RelationForm.Cirelation2"
          :options="options"
          filterable
          @change="handleItemChange2"
          @focus="hideTip(2)"
          :disabled="status === 'watch'"
          clearable
        ></el-cascader>
        <span class="alert" v-if="isshowerr3">CI类型或者属性不能为空</span>
      </el-form-item>
    </el-form>
    <div class="btn-item">
      <el-button
        v-if="status === 'create'"
        size="medium"
        :loading="editLoading"
        type="primary"
        style="margin-right: 200px;"
        @click="addrelation"
      >确认</el-button>
      <el-button
        v-if="status === 'edit'"
        :loading="editLoading"
        size="medium"
        type="primary"
        style="margin-right: 150px;"
        @click="addrelation('2')"
      >保存</el-button>
      <el-button class="nomal-button" size="medium" @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'RelationPage',
  data () {
    return {
      status: this.$route.params.status,
      relationController: true,
      options: [],
      RelationForm: {
        Cirelation: ['', '', ''],
        Cirelation2: ['', '', ''],
        sshid3: ''
      },
      isshowerr1: false,
      isshowerr2: false,
      editLoading: false,
      isshowerr3: false,
      List: [
        { name: '运行', id: '1' },
        { name: '连接', id: '2' },
        { name: '依赖', id: '3' },
        { name: '包含', id: '4' },
        { name: '虚拟化', id: '5' },
        { name: '管理', id: '6' },
        { name: '运行于', id: '7' },
        { name: '被连接', id: '8' },
        { name: '被依赖', id: '9' },
        { name: '被包含', id: '10' },
        { name: '被虚拟化', id: '11' },
        { name: '被管理', id: '12' }
      ],
      rules: {
        Cirelation: [
          { required: true, message: '请选择CI类型或者属性', trigger: 'blur' }
        ],
        sshid3: [
          { required: true, message: '请选择关系', trigger: 'change' }
        ],
        Cirelation2: [
          { required: true, message: '请选择连接的CI类型或者属性', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCIList();
  },
  mounted () {
    if (this.$route.query.id) {
      this.viewRelation(this.$route.query.id);
    }
  },
  methods: {
    // 隐藏提示
    hideTip (val) {
      if (val === 1) {
        this.isshowerr1 = false;
      } else {
        this.isshowerr3 = false;
      }
    },
    // 获取CI类型属性
    getCIList () {
      let name = ''
      let templateId = ''
      axios.getCIList(name, templateId).then(res => {
        res.data.data.result.forEach(item => {
          this.options.push({
            value: item.cigroupId,
            label: item.name,
            cigroupId: item.cigroupId,
            children: []
          })
        })
        for (var j = 0; j < res.data.data.result.length; j++) {
          for (var i = 0; i < this.options.length; i++) {
            if (
              this.options[i].cigroupId == res.data.data.result[j].cigroupId &&
              res.data.data.result[j].citypeList.length > 0
            ) {
              for (
                var k = 0;
                k < res.data.data.result[j].citypeList.length;
                k++
              ) {
                this.options[i].children.push({
                  value: res.data.data.result[j].citypeList[k].citypeId,
                  label: res.data.data.result[j].citypeList[k].name,
                  citypeId: res.data.data.result[j].citypeList[k].citypeId,
                  children: []
                })
              }
            }
          }
        }
        let a
        this.options.forEach(item => {
          // console.log(item)
          item.children.forEach(item2 => {
            for (var i = 0; i < res.data.data.result.length; i++) {
              for (
                var j = 0;
                j < res.data.data.result[i].citypeList.length;
                j++
              ) {
                if (
                  item2.citypeId ==
                  res.data.data.result[i].citypeList[j].citypeId
                ) {
                  // console.log(res.data.data.result[i].citypeList[j].extend)
                  if (
                    res.data.data.result[i].citypeList[j].extend.length == 0
                  ) {
                    res.data.data.result[i].citypeList[j].extend = [
                      {
                        extend: [
                          {
                            defaultValue: '',
                            label: '名称',
                            type: 'singleLineInput'
                          },
                          {
                            defaultValue: '',
                            label: '业务组',
                            type: 'optionsInputSys'
                          },
                          {
                            defaultValue: '',
                            label: '环境',
                            type: 'optionsInputEnv'
                          }
                        ]
                      }
                    ]
                  }
                  if (res.data.data.result[i].citypeList[j].extend.length > 0) {
                    if (
                      typeof res.data.data.result[i].citypeList[j].extend !==
                      'string'
                    ) {
                      a = res.data.data.result[i].citypeList[j].extend
                    } else {
                      a = JSON.parse(
                        res.data.data.result[i].citypeList[j].extend
                      )
                    }

                    if (a.length > 0) {
                      a.forEach(item3 => {
                        // console.log(item3)
                        if (item3.extend.length > 0) {
                          item3.extend.forEach(item4 => {
                            item2.children.push({
                              value: item4.label + ',' + item4.type,
                              label: item4.label,
                              type: item4.type
                            })
                          })
                        }
                      })
                    }
                  }
                }
              }
            }
          })
        })
      })
    },
    // CI详情
    viewRelation (id) {
      axios.viewRelation(id)
        .then(res => {
          if (res.data.code === 200) {
            let data = res.data.data.result;
            this.RelationForm.Cirelation[0] = data.fromGroupId
            this.RelationForm.Cirelation[1] = data.fromTypeId
            this.RelationForm.Cirelation[2] =
              data.fromAttrLabel +
              ',' +
              data.fromAttrType
            this.RelationForm.Cirelation2[0] = data.toGroupId
            this.RelationForm.Cirelation2[1] = data.toTypeId
            this.RelationForm.Cirelation2[2] =
              data.toAttrLabel +
              ',' +
              data.toAttrType
            this.RelationForm.sshid3 = data.relationType
            this.RelationForm.Cirelation.reverse().reverse()
            this.RelationForm.Cirelation2.reverse().reverse()
          }
        })
        .catch()
    },
    handleItemChange (val) {
      this.RelationForm.Cirelation = val;
    },
    handleItemChange2 (val) {
      this.RelationForm.Cirelation2 = val
    },
    // 添加或保存
    addrelation (n) {
      let validSate = false;
      this.$refs.form.validate((valid) => {
        if (this.RelationForm.Cirelation[0] && this.RelationForm.Cirelation[1] && this.RelationForm.Cirelation[2]) {
          validSate = true;
          this.isshowerr1 = false;
        } else {
          validSate = false
          this.isshowerr1 = true;
        }
        if (this.RelationForm.Cirelation2[0] && this.RelationForm.Cirelation2[1] && this.RelationForm.Cirelation2[2]) {
          validSate = true;
          this.isshowerr3 = false;
        } else {
          validSate = false
          this.isshowerr3 = true;
        }
        if (validSate) {
          let data = {}
          data.fromGroupId = this.RelationForm.Cirelation[0]
          data.fromTypeId = this.RelationForm.Cirelation[1]
          if (this.RelationForm.Cirelation[2].length > 0 && this.RelationForm.Cirelation[2].indexOf(',') > -1) {
            data.fromAttrType = this.RelationForm.Cirelation[2].split(',')[1]
            data.fromAttrLabel = this.RelationForm.Cirelation[2].split(',')[0]
          }
          if (this.RelationForm.Cirelation2[2].length > 0 && this.RelationForm.Cirelation2[2].indexOf(',') > -1) {
            data.toAttrType = this.RelationForm.Cirelation2[2].split(',')[1]
            data.toAttrLabel = this.RelationForm.Cirelation2[2].split(',')[0]
          }
          data.toGroupId = this.RelationForm.Cirelation2[0]
          data.toTypeId = this.RelationForm.Cirelation2[1]

          data.relationType = this.RelationForm.sshid3;
          if (valid) {
            if (n == '2') {
              axios.setlistRelation(data, this.$route.query.id)
                .then(res => {
                  if (res.data.success) {
                    this.$notify({
                      type: 'success',
                      message: '修改成功!'
                    })
                    this.$router.push({
                      path: '/ResourceAllocation/CIrelationship',
                      query: {
                        code: 1
                      }
                    })
                  } else {
                    this.$notify({
                      title: '提示',
                      type: 'warning',
                      message: res.data.message,
                      duration: 1000
                    })
                  }
                })
                .catch()
            } else {
              if (this.num > 0) {
                return false
              }
              this.num++
              axios.addrelation(data)
                .then(res => {
                  if (res.data.success) {
                    this.$notify({
                      type: 'success',
                      message: '添加成功!'
                    })
                    this.$router.push({
                      path: '/ResourceAllocation/CIrelationship',
                      query: {
                        code: 1
                      }
                    })
                  } else {
                    this.num = 0
                    this.$notify({
                      title: '提示',
                      type: 'warning',
                      message: res.data.message,
                      duration: 1000
                    })
                  }
                })
                .catch()
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    },
    // changeType () {
    //   this.registration_data.pwdType =
    //     this.registration_data.pwdType === 'password' ? 'text' : 'password'
    //   this.registration_data.src =
    //     this.registration_data.src == require('static/img/eyes.png')
    //       ? require('static/img/colse.png')
    //       : require('static/img/eyes.png')
    // },
    // 取消按钮
    cancel () {
      this.isshowerr1 = false;
      this.isshowerr2 = false;
      this.isshowerr3 = false;

      this.$router.push({
        path: '/ResourceAllocation/CIrelationship',
        query: {
          code: 1
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.page {
  margin: 10px;
  padding-top: 10px!important;
  .item-block-title {
    margin-bottom: 10px;
    .icons {
      color: #00A8E8;
    }
  }
  .input-form {
    .disinlne {
      display: inline-block;
      position: relative;
    }
    .el-cascader {
      display: inline-block;
      position: relative;
      font-size: 14px;
      line-height: 40px;
      width: 632px;
    }
    .alert {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }
    .borderColorRed {
      border: 1px solid #f56c6c;
      border-radius: 5px;
    }
    .borderColorGry {
      border: none;
    }
  }
  .btn-item {
    padding: 0 20px 20px;
    text-align: center;
  }
  .waringstyle {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0px;
  }
  .txtcenter {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
