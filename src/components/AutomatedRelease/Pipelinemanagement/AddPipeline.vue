<template>
  <div class="node-layout aibms-color-bg white-color">
    <div class="panel-item" v-for="(item,index) in titleList" :key="index">
      <div class="node-title white-color">
        <span></span>
        {{item.name}}
        <i
          :class="item.status ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'"
          @click="toggleTitle(index)"
        ></i>
      </div>
      <div class="panel-box" v-show="index === 0 && item.status" style="width:30%;padding: 20px">
        <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="部署任务名称：" class="w28ml20">
            <el-input maxlength="40" placeholder="请输入部署任务名称" style="width: 632px"></el-input>
          </el-form-item>
          <el-form-item label="所属系统：" class="w28ml20">
            <el-select style="width: 632px" clearable v-model="value" placeholder="请选择所属系统">
              <el-option
                v-for="(item,index)  in systemTypes"
                :key="index"
                :label="item.name"
                :value="item.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务测试节点：" class="w28ml20">
            <el-select style="width: 632px" clearable v-model="value2" placeholder="任务测试节点">
              <el-option
                v-for="(item,index)  in systemTypes"
                :key="index"
                :label="item.name"
                :value="item.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务超时时间：" class="w28ml20">
            <el-input maxlength="40" placeholder="请输入任务超时时间" style="width: 632px"></el-input>
          </el-form-item>
          <el-form-item label="通知邮箱：" class="w28ml20">
            <el-input maxlength="40" placeholder="请输入通知邮箱" style="width: 632px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="panel-box" v-show="index === 1 && item.status" style="width:30%;padding: 20px">
        <div style="height:575px;"></div>
      </div>
      <div class="panel-box" v-show="index === 2 && item.status" style="width:30%;padding: 20px">
        <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="流程名称：" class="w28ml20">
            <el-input maxlength="40" size="medium" placeholder="请输入流程名称" style="width: 632px"></el-input>
          </el-form-item>
          <el-form-item label="流程步骤类型：" size="medium" class="w28ml20">
            <el-radio label="1">工具</el-radio>
            <el-radio label="2">流水线</el-radio>
            <el-radio label="2">审批</el-radio>
          </el-form-item>
          <el-form-item label="执行用户：" class="w28ml20">
            <el-input maxlength="40" placeholder="执行用户" style="width: 632px"></el-input>
          </el-form-item>
          <el-form-item size="medium" class="w28ml20">
            <el-radio label="1">失败退出</el-radio>
            <div class="tool-box" style="width: 200%;padding: 10px;">
              <el-row>
                <!--<el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>-->
                <el-col :span="14" style="border-radius: 5px 0 0 5px !important;">
                  <el-input placeholder="请输入内容"></el-input>
                </el-col>
                <el-col :span="10">
                  <el-select placeholder="请选择" v-model="value3">
                    <el-option label="餐厅名" value="1"></el-option>
                    <el-option label="订单号" value="2"></el-option>
                    <el-option label="用户电话" value="3"></el-option>
                  </el-select>
                </el-col>
                <ul>
                  <li>cat</li>
                  <li>cat</li>
                  <li>cat</li>
                  <li>cat</li>
                  <li>cat</li>
                  <li>cat</li>
                  <li>cat</li>
                </ul>
              </el-row>
              <!--<div style="padding: 10px">-->
              <!--&lt;!&ndash;<el-input placeholder="请输入内容"  class="input-with-select">&ndash;&gt;-->
              <!--&lt;!&ndash;&lt;!&ndash;<el-button slot="append" icon="el-icon-search"></el-button>&ndash;&gt;&ndash;&gt;-->
              <!--&lt;!&ndash;</el-input>&ndash;&gt;-->

              <!--</div>-->
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="panel-item" v-show="index === 3 && item.status">
        <div class="node-title">
          <span style="visibility: hidden"></span>
        </div>
        <div class="panel-box" style="width:80%;padding: 20px">
          <el-table
            :data="tableData"
            stripe
            :header-cell-style="{ background: '#f5f5f5' }"
            style="width: 100%"
          >
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <Workflow  v-show="index === 1 && item.status"    @confirm="getId"/> -->
    </div>
    <Workflow v-if="isbl" @confirm="getId" style="margin: 20px" />
  </div>
</template>

<script>
import Workflow from '../ReleaseWorkflow.vue'
export default {
  name: 'ExamineAndApproveDetail',
  data () {
    return {
      titleList: [
        {
          status: false,
          name: '基本信息'
        },
        {
          status: false,
          name: '流程设计'

        },
        {
          status: false,
          name: '任务流程设置'
        },
        {
          status: false,
          name: '设置参数'
        }
      ],
      releaseList: [{
        name: 'jill',
        auditText: '123',
        auditStatus: 'OK',
        proStarttime: '2018-09-03',
        photo: '../../../../static/img/Fruit-1.png'
      }, {
        name: 'jill',
        auditText: '123',
        auditStatus: 'OK',
        proStarttime: '2018-09-03',
        photo: '../../../../static/img/Fruit-1.png'
      }, {
        name: 'jill',
        auditText: '123',
        auditStatus: 'OK',
        proStarttime: '2018-09-03',
        photo: '../../../../static/img/Fruit-1.png'
      }, {
        name: 'jill',
        auditText: '123',
        auditStatus: 'OK',
        proStarttime: '2018-09-03',
        photo: '../../../../static/img/Fruit-1.png'
      }],
      systemTypes: [
        {
          name: '1',
          systemId: '3'
        },
        {
          name: '2',
          systemId: '4'
        }
      ],
      value: '123',
      value2: '345',
      value3: '',
      isbl: false,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: ' 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: ' 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: ' 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: ' 1516 弄'
      }],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
    }
  },
  components: {
    Workflow: Workflow
  },
  methods: {
    getId (id) {
      console.log(id)
    },
    toggleTitle (index) {
      console.log(index)
      if (index == 1) {
        this.isbl = !this.isbl
      }
      this.titleList[index].status = !this.titleList[index].status
    }

  }
}
</script>

<style scoped>
.icons {
  color: #0066ff;
  font-size: 14px;
}
.tool-box ul {
  padding: 0 40px;
  max-height: 200px;
  overflow: auto;
}
.tool-box {
  border: 1px solid #c6c6c6;
  min-height: 200px;
  border-radius: 5px;
}
.form-text {
  width: 60%;
  resize: none;
  padding: 10px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ccc;
  box-sizing: border-box;
  resize: none;
}
.form-item {
  padding-left: 140px;
  position: relative;
  padding-top: 10px;
  min-height: 30px;
  margin-bottom: 10px;
}
.form-item label {
  position: absolute;
  left: 0;
  top: 10px;
  line-height: 30px;
  width: 130px;
  font-size: 14px;
  text-align: right;
}
.dialog-btn {
  overflow: hidden;
  padding: 30px 0 30px 140px;
}
.dialog-btn .btn-cancel {
  float: right;
}
.node-layout {
  background: #fff;
  padding-bottom: 20px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.16);
  margin-top: 10px;
}
.node-title {
  color: #585858;
  font-size: 16px;
  padding: 20px 0 0;
}
.node-title span {
  display: inline-block;
  width: 6px;
  border-radius: 10px;
  margin-right: 20px;
  height: 20px;
  background: #0280ff;
  vertical-align: middle;
}
.node-pannel {
  padding: 0 26px;
}
.node-fr {
  float: right;
}
.content {
  width: auto;
  height: 100%;
  padding: 10px;
  overflow-y: scroll;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
