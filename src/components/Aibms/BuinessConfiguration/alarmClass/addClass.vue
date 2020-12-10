<template>
  <div class="add-source">
    <div class="content">
      <h3>基本信息</h3>
      <div class="form-area">
        <el-form
          :model="form"
          :label-position="labelPosition"
          label-width="100px"
          :rules="rules"
          :inline="true"
          ref="form"
        >
          <el-form-item label="名称：" prop="name">
            <el-input
              v-model="form.name"
              clearable
              style="width: 632px"
              maxlength="150"
              :disabled="readOnly"
              placeholder="请输入名称"
            />
          </el-form-item>
          <br />
          <el-form-item label="设置标签：" prop="label">
            <el-radio-group @change="getselectValue" v-model="selectlabel">
              <el-radio-button
                :disabled="readOnly"
                v-for="item in labelList"
                :label="item.label"
                :key="item.value"
              />
            </el-radio-group>
          </el-form-item>
          <br />
          <!-- 动态增加项目 -->
          <div
            v-for="(domain, index) in form.domains"
            :key="domain.key"
            class="domains-form"
          >
            <el-form-item
              label="描述"
              :prop="'domains.' + index + '.desc'"
              :rules="{
                required: true,
                message: '请输入表达式描述',
                trigger: 'blur',
              }"
            >
              <el-input
                :disabled="readOnly"
                type="textarea"
                v-model="domain.desc"
                autosize
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="'来源：'"
              :prop="'domains.' + index + '.source'"
              :rules="{
                required: true,
                message: '请选择来源',
                trigger: 'change',
              }"
            >
              <el-select
                v-model="domain.source"
                clearable
                :disabled="readOnly"
                placeholder="请选择来源"
              >
                <el-option
                  v-for="item in source"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="表达式："
              :prop="'domains.' + index + '.expression'"
              :rules="{
                required: true,
                message: '表达式不能为空',
                trigger: 'blur',
              }"
            >
              <el-input
                v-model="domain.expression"
                :disabled="readOnly"
                type="textarea"
                autosize
                style="width: 280px"
              />
            </el-form-item>
            <i
              class="el-icon-circle-plus-outline"
              v-if="!readOnly"
              @click="addDomain"
            />
            <i
              class="el-icon-remove-outline"
              v-if="!readOnly"
              @click.prevent="removeDomain(domain)"
            />
          </div>
          <el-form-item  class="footer-form">
            <el-button
              v-if="!readOnly"
              type="primary"
              @click.stop="handleSave"
              style="margin-right: 100px"
              >保存</el-button
            >
            <el-button @click="handleCancel" class="cancle-button"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- 删除提示 -->
      <el-dialog
        center
        title="删除提示"
        :visible.sync="confirmDeleteDialogVisible"
        width="25%"
      >
        <div style="text-align: center">
          <i class="el-icon-warning" /> 确认删除？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="medium"
            class="nomal-button"
            @click="confirmDeleteDialogVisible = false"
            >取消</el-button
          >
          <el-button size="medium" type="primary" @click="confirmDelete"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from '@/api'
const valueMap = {
  交易类型: '1',
  应用: '2',
  服务: '3',
  进程: '4',
  主机: '5'
};
const labelMap = {
  '1': '交易类型',
  '2': '应用',
  '3': '服务',
  '4': '进程',
  '5': '主机'
};
export default {
  filters: {
    valueFilter: label => valueMap[label],
    labelFilter: value => labelMap[value]
  },
  data: () => ({
    labelPosition: 'right',
    readOnly: false,
    form: {
      name: '',
      domains: [
        {
          source: '',
          expression: '',
          desc: ''
        }
      ]
    },
    rules: {
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
    },
    source: [
      {
        id: 1,
        value: 'BPC',
        label: 'BPC'
      },
      {
        id: 2,
        value: 'Dynatrace',
        label: 'Dynatrace'
      },
      {
        id: 3,
        value: 'Prometheus',
        label: 'Prometheus'
      }
    ],
    confirmDeleteDialogVisible: false,
    editId: 0,
    labelList: [
      { value: '1', label: '交易类型' },
      { value: '2', label: '应用' },
      { value: '3', label: '服务' },
      { value: '4', label: '进程' },
      { value: '5', label: '主机' }
    ],
    selectlabel: '',
    selectValue: '',
    deleteId: -1
  }),
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.$route.query.id) {
      // 查看（只读状态）
        if (this.$route.query.read) {
          this.$route.meta.title = '查看分类'
          this.readOnly = true
        } else {
          this.$route.meta.title = '编辑分类'
        }
        this.editId = this.$route.query.id
        axios.getAlarmDetail(this.editId).then(res => {
          if (res.data.success) {
            const sourceDetail = res.data.data
            const { name, label, extend } = sourceDetail
            this.form.name = name
            this.selectValue = label
            this.selectlabel = this.$options.filters['labelFilter'](label)
            const matcheList = JSON.parse(extend)
            if (matcheList && matcheList.length) {
              this.form.domains = []
              this.form.domains = matcheList.map(item => {
                return { source: item.source, expression: item.expression, desc: item.desc }
              });
            }
          } else {
            this.$notify({
              title: '提示',
              type: 'error',
              message: res.data.message
            });
          }
        });
      } else {
        this.$route.meta.title = '新增分类'
        this.selectValue = '1'
        this.selectlabel = '交易类型'
      }
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.editId) {
            this.addOrEdit(axios.editAlarm)
          } else {
            this.addOrEdit(axios.addAlarm)
          }
        } else {
          return false
        }
      });
    },
    getselectValue() {
      this.selectValue = this.$options.filters['valueFilter'](this.selectlabel)
    },
    handleCancel() {
      this.$router.back()
    },
    addOrEdit(methods) {
      const params = {
        id: this.editId,
        name: this.form.name,
        displayName: '',
        label: this.selectValue,
        source: [...new Set(this.form.domains.map(item => item.source))].join(
          ','
        ),
        extend: this.form.domains.map(item => ({
          source: item.source,
          expression: item.expression,
          desc: item.desc
        }))
      };
      methods(params).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: res.data.message
          });
          this.$router.push({
            path: '/Aibms/BuinessConfiguration/alarmclassification',
            query: {
              code: 2
            }
          });
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          });
        }
      });
    },
    confirmDelete() {
      this.form.domains.splice(this.deleteId, 1)
      this.confirmDeleteDialogVisible = false
    },
    addDomain() {
      this.form.domains.push({
        source: '',
        expression: '',
        key: Date.now()
      });
    },
    // 删除动态信息
    removeDomain(item) {
      const index = this.form.domains.indexOf(item);
      if (this.form.domains.length > 1 && index !== -1) {
        if (item.source || item.expression) {
          this.confirmDeleteDialogVisible = true
          this.deleteId = index
        } else {
          this.form.domains.splice(index, 1)
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.add-source {
  padding: 10px;
  .content {
    width: 100%;
    background-color: rgba(4, 28, 37, 0.3);
    padding: 10px;
    overflow: visible;
    .form-area {
      margin: 10px;
      position: relative;
      .footer-form {
        width: 100%;
        text-align: center;
      }
      & /deep/ .el-textarea__inner {
        min-height: 40px !important;
      }
      &
        /deep/
        .el-radio-button__orig-radio:disabled:checked
        + .el-radio-button__inner {
        background-color: #00a8e8;
        border: 1px solid #00a8e8;
        color: #fff;
      }
      .domains-form {
        i {
          color: #fff;
          font-size: 24px;
          transform: translateY(8px);
          cursor: pointer;
        }
      }
      .label-class {
        li {
          display: inline-block;
          width: 80px;
          height: 35px;
          line-height: 35px;
          margin-right: 10px;
          border: 1px solid #dcdfe6;
          text-align: center;
          border-radius: 5px;
          cursor: pointer;
        }
        .active-class {
          background: #00a8e8;
          border: 1px solid #00a8e8;
          color: #fff;
        }
      }
    }
    h3 {
      position: relative;
      font-size: 16px;
      font-weight: 500;
      height: 24px;
      line-height: 24px;
      margin-left: 10px;
      color: #fff;
      span {
        margin-left: 5px;
        font-size: 14px;
        color: #00a8e8;
        cursor: pointer;
      }
      &:before {
        content: '';
        position: absolute;
        z-index: 1;
        left: -20px;
        top: -3px;
        width: 8px;
        border-radius: 4px;
        height: 30px;
        background: #00a8e8;
      }
    }
    .footer-area {
      padding-left: 30px;
    }
    .cancle-button {
      border: 1px solid #fff;
      color: #fff;
      &:hover {
        border: 1px solid #fff;
        color: #fff;
        background: transparent;
      }
      &:focus {
        color: #fff;
        background: transparent;
      }
      &:active {
        border: 1px solid #fff;
        background: transparent;
        color: #fff;
      }
    }
  }
}
</style>
