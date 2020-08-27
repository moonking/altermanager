<template>
  <div class="container refreshContainer aibms-color-bg non-border">
    <div class="info-top">
      <div class="item-block-title paddingTop" @click="switchBlock(1)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">基本信息</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div
        class="demand-block-content item-block-content"
        :style="{height: blockSwitch[1] ? 'auto' : 0}"
      >
        <el-form label-width="100px" :model="baseInfoForm" :rules="baseInfoFormRules">
          <el-form-item label="编号" prop="number">
            <el-input v-model="baseInfoForm.number" :readonly="true" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="baseInfoForm.title" :readonly="true" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input v-model="baseInfoForm.type" :readonly="true" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="发布状态" prop="status">
            <el-input v-model="baseInfoForm.status" :readonly="true" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="环境" prop="env">
            <el-input v-model="baseInfoForm.env" :readonly="true" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="上线时间" prop="time">
            <el-input v-model="baseInfoForm.time" :readonly="true" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="执行人" prop="person">
            <el-input v-model="baseInfoForm.person" :readonly="true" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="所属系统" prop="system">
            <el-input v-model="baseInfoForm.system" :readonly="true" style="width: 400px;"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="info-bottom">
      <div class="item-block-title paddingTop" @click="switchBlock(2)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">发布任务</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div
        class="demand-table-wrapper demand-block-content item-block-content"
        :style="{height: blockSwitch[2] ? 'auto' : 0}"
      >
        <el-table
          class="demand-table"
          :data="deployTasks"
          :header-cell-style="{background:'#f5f5f5'}"
        >
          <el-table-column type="expand">
            <template >
              <el-row :gutter="12" class="expand-item">
                <el-col :span="12">
                  <span>pipeline</span>:
                  <span>个险业务构建</span>
                </el-col>
                <el-col :span="4">
                  <span>执行状态</span>:
                  <span>执行成功</span>
                </el-col>
                <el-col :span="4">
                  <span>执行时间</span>:
                  <span>20min</span>
                </el-col>
                <el-col :span="4">
                  <span>执行阶段</span>:
                  <span>验证</span>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="发布任务名称" prop="name"></el-table-column>
          <el-table-column label="所属环境" prop="env"></el-table-column>
          <el-table-column label="发布任务类型" prop="type"></el-table-column>
          <el-table-column label="业务系统" prop="system"></el-table-column>
          <el-table-column label="优先级" prop="level"></el-table-column>
          <el-table-column label="负责人" prop="principal"></el-table-column>
          <el-table-column label="执行人" prop="excutePerson"></el-table-column>
          <el-table-column label="发布状态" prop="status"></el-table-column>
          <el-table-column label="计划发布时间" prop="time"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemandDetail',
  data () {
    return {
      // 控制块的展开或收缩
      blockSwitch: { 1: true, 2: false },
      // 基础信息的存储
      baseInfoForm: {},
      // 基础信息表单的验证
      baseInfoFormRules: {
        number: [{ required: true, message: '', trigger: 'blur' }],
        title: [{ required: true, message: '', trigger: 'blur' }],
        type: [{ required: true, message: '', trigger: 'blur' }],
        status: [{ required: true, message: '', trigger: 'blur' }],
        env: [{ required: true, message: '', trigger: 'blur' }],
        time: [{ required: true, message: '', trigger: 'blur' }],
        person: [{ required: true, message: '', trigger: 'blur' }],
        system: [{ required: true, message: '', trigger: 'blur' }]
      },
      // 发布任务列表存储
      deployTasks: [
        {
          name: '个险业务构建任务',
          env: 'SIT',
          type: '构建',
          system: '个险业务',
          level: 9,
          principal: '张三',
          excutePerson: '李四',
          status: 'SUCCESS',
          time: '2019-12-12 12:12:12'
        }
      ]
    }
  },
  methods: {
    // 点击标题展开或折叠
    switchBlock (val) {
      this.blockSwitch[val] = !this.blockSwitch[val]
    }
  }
}
</script>

<style scoped>
.expand-item {
  margin: 0 20px !important;
}
.demand-block-content {
  padding-left: 110px !important;
}
.info-bottom {
  width: 100%;
}
.demand-table-wrapper {
  text-align: center;
}
.demand-table {
  width: 90% !important;
  margin-bottom: 30px;
}
</style>
