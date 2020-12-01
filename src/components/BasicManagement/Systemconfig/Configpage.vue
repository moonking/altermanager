<template>
  <div class="container refreshContainer">
    <div class="item-block-title paddingTop" @click="openConfig = !openConfig">
      <div class="item-block-title-mark"></div>
      <span class="item-block-title-font">基本信息</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{ transform: openConfig ? 'rotate(90deg)' : 'rotate(0)' }"
      ></i>
    </div>
    <el-form
      :model="confData"
      label-width="120px"
      class="form-style item-block-content"
      :style="{ height: openConfig ? 'auto' : '0' }"
      :class="openConfig ? '' : 'clearMargin'"
    >
      <el-form-item label="数据库：">
        <el-input
          v-model="confData.name"
          disabled
          class="title-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="高危语句配置：">
        <div class="config-list-box">
          <el-row></el-row>
          <el-row
            :gutter="8"
            v-for="state in confData.statements"
            :key="state.riskId"
          >
            <el-col :span="2" class="col-title">
              <span>{{ state.name }}语句:</span>
            </el-col>
            <el-col :span="22">
              <ul class="warn-box">
                <li
                  class="warn-item"
                  v-for="(item, index) in state.stateList"
                  :key="index"
                  :class="[
                    item.val ? 'activited' : '',
                    operation === 'detail' ? 'notClick' : '',
                  ]"
                  @click="chooseStatement(item)"
                >
                  {{ item.lab }}
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>
    <div class="foot-btn">
      <el-button
        v-if="operation !== 'detail'"
        type="primary"
        @click="confirmConfig"
        style="margin-right: 100px; background: #0066ff"
        >确 定</el-button
      >
      <el-button @click="cancelPage" class="turn-back">返 回</el-button>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
import { statementTypes } from './util';
export default {
  name: 'config-page',
  data() {
    return {
      // 控制是否展开
      openConfig: true,
      confData: {},
      type: '',
      // 保存原始的数据
      sourceData: [],
      operation: this.$route.query.operation
    };
  },
  mounted() {
    this.type = this.$route.query.id;
    this.operation = this.$route.query.operation;
    this.getHighrisk(this.type);
  },
  methods: {
    // 确认按钮
    confirmConfig() {
      let jsonArray = [];
      for (let key of this.confData.statements) {
        let obj = {
          riskId: key.riskId,
          keyword: '',
          existConfig: false
        };
        let newObj = {};
        // 将当前的数据与获取到的元数据对比，并将json格式的语句关键词转换成需要的格式，判断是否有变更，有则改变状态
        for (let ob of key.stateList) {
          for (let item of this.sourceData) {
            if (ob.lab === item.lab && ob.riskId === item.riskId) {
              if (ob.val !== item.val) {
                obj.existConfig = true;
              }
              newObj[ob.lab] = ob.val;
            }
          }
        }
        obj.keyword = JSON.stringify(newObj);
        // 只有发生改变的才放到jsonArray里
        if (obj.existConfig) {
          jsonArray.push(obj);
        }
      }
      if (jsonArray.length) {
        // 将改变的数据进行保存
        axios.statementConfig(jsonArray).then(res => {
          if (res.data.code === 200) {
            this.$router.push({
              path: '/BasicManagement/Systemconfig/Highriskconf',
              query: {
                code: 0
              }
            });
            this.$notify({
              title: '提示',
              type: 'success',
              message: '高危语句配置成功'
            });
          } else {
            this.$notify({
              title: '提示',
              type: 'error',
              message: res.data.message
            });
          }
        });
      } else {
        this.$router.push({
          path: '/BasicManagement/Systemconfig/Highriskconf',
          query: {
            code: 0
          }
        });
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '未进行配置操作!'
        });
      }
    },
    // 取消按钮
    cancelPage() {
      this.$router.go(-1);
    },
    // 获取需要配置的数据库
    getHighrisk(id) {
      let params = {
        databaseType: id,
        statementType: ''
      };
      // 将查询的数据显示
      axios.dataBaseSearch(params).then(res => {
        if (res.data.code === 200) {
          this.sourceData = [];
          let obj = {
            name: '',
            statements: []
          };
          let data = res.data.data;
          // 过滤空的数据
          let current;
          for (let key in data) {
            if (data[key].length > 0) {
              obj.name = key;
              current = data[key];
            }
          }
          console.log(current);
          // 根据定义的类型code匹配名称
          try {
            for (let item of current) {
              for (let state of statementTypes) {
                if (state.value === item.statementType) {
                  let newVal = {
                    name: state.label,
                    riskId: item.riskId,
                    stateList: []
                  };
                  // 将字符型的语句关键词转换成json
                  let keys = JSON.parse(item.keyword);
                  for (let ob in keys) {
                    let newObj = {
                      lab: ob,
                      val: keys[ob],
                      riskId: item.riskId
                    };
                    newVal.stateList.push(newObj);
                    this.sourceData.push(newObj);
                  }
                  obj.statements.push(newVal);
                }
              }
            }
          } catch (err) {
            console.log(err);
          }

          this.confData = JSON.parse(JSON.stringify(obj));
        }
      });
    },
    // 选中项时回调
    chooseStatement(item) {
      if (this.operation !== 'detail') {
        item.val = !item.val;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  background: rgba(4, 28, 37, 0.3);
  border: none;
  .turn-back {
    .el-button {
      border: 1px solid #fff;
      color: #fff;
      &:hover {
        border: 1px solid #01aef1;
        color: #01aef1;
        background-color: #041c25;
      }
      &:focus {
        border: 1px solid #01aef1;
        color: #01aef1;
        background-color: #041c25;
      }
      &:active {
        background-color: #041c25;
        border: 1px solid #01aef1;
        color: #01aef1;
      }
    }
  }
  .item-block-title {
    .item-block-title-font {
      color: #fff;
    }
  }
  .form-style {
    margin: 20px 128px;

    .title-input {
      width: 400px;
    }

    .config-list-box {
      .col-title {
        text-align: left;
        color: #fff;
      }
      .warn-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        .warn-item {
          margin: 5px 10px;
          padding: 0 16px;
          border-radius: 20px;
          border: 1px solid #fff;
          color: #fff;
          line-height: 30px;
          cursor: pointer;
        }
      }
    }
  }
  .foot-btn {
    text-align: center;
    padding: 30px 0;
  }
  .activited {
    background: #0066ff;
    border: 1px solid #0066ff !important;
    color: #fff !important;
  }
  .notClick {
    cursor: not-allowed !important;
  }
  .clearMargin {
    margin: 0 !important;
  }
}
</style>
