<template>
  <div class="release-plan-manage">
    <div class="contain">
      <el-form :model="formData" inline>
        <el-form-item>
          <el-input v-model="formData.planName" placeholder="计划名称" :style="{width:'140px'}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formData.initiator" placeholder="发起人" :style="{width:'140px'}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.taskType" :style="{width:'140px'}">
            <el-option
              v-for="(taskType,index) in taskTypeList"
              :key="index"
              :label="taskType.name"
              :value="taskType.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.taskStatus" :style="{width:'140px'}">
            <el-option
              v-for="(status,index) in taskStatusList"
              :key="index"
              :label="status.name"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="formData.time"
            type="daterange"
            range-separator="至"
            start-placeholde="开始日期"
            end-placeholde="结束日期"
            :style="{width:'280px'}"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="nomal-button">
            <i class="el-icon-search"></i>&nbsp;&nbsp;搜索
          </el-button>
          <el-button type="primary" @click="releasePlanAdd">
            <i class="el-icon-plus"></i>&nbsp;&nbsp;新增发布计划
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        stripe
        :style="{width:'100%'}"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column prop="id" label="计划编号"></el-table-column>
        <el-table-column prop="name" label="计划名称"></el-table-column>
        <el-table-column prop="taskName" label="部署任务名称"></el-table-column>
        <el-table-column prop="systemName" label="系统名称" width="80px"></el-table-column>
        <el-table-column prop="releaseTime" label="计划发布时间"></el-table-column>
        <el-table-column prop="taskType" label="任务类型" width="80px"></el-table-column>
        <el-table-column prop="executor" label="执行人" width="80px"></el-table-column>
        <el-table-column prop="applicant" label="请求人" width="80px"></el-table-column>
        <el-table-column prop="status" label="状态" width="100px"></el-table-column>
        <el-table-column prop="progress" label="进度" width="200px">
          <template slot-scope="scope">
            <div class="no-progress" v-if="getNum(scope.row.progress) === 0">无</div>
            <div class="progress" v-if="getNum(scope.row.progress) > 0">
              <el-progress :stroke-width="10" :percentage="getNum(scope.row.progress)"></el-progress>
              <p :style="{fontSize:'12px',color:'#666',paddingTop:'6px'}">已耗时:5分钟</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240px">
          <template slot-scope="scope">
            <el-button @click="toApproval(scope.row)" size="mini" type="primary">审批</el-button>
            <el-button @click="readLogs" size="mini">查看日志</el-button>
            <el-button size="mini">更多</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paging-area">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="pageChangeHandle"
          background
          :page-size="pageSize"
          :page-sizes="[20,50,100,200]"
          layout=" prev,pager, next, jumper,sizes"
          :total="400"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        planName: '',
        initiator: '',
        taskType: 1,
        taskStatus: 1,
        time: ''
      },
      taskTypeList: [
        { value: 1, name: '常规任务' },
        { value: 2, name: '定时任务' }
      ],
      taskStatusList: [
        {
          value: 1,
          name: '待审批'
        },
        {
          value: 2,
          name: '进行中'
        },
        {
          value: 3,
          name: '已完成'
        },
        {
          value: 4,
          name: '审批未通过'
        },
        {
          value: 5,
          name: '审批通过'
        }
      ],
      tableData: [
        {
          id: 'C154',
          name: '金融业务的构建',
          taskName: '构建W1923222',
          systemName: '金融业务管理系统',
          releaseTime: '2018-11-28 17:29',
          taskType: '常规任务',
          executor: '张萌',
          applicant: '李溪',
          status: '待审批',
          progress: '0'
        },
        {
          id: 'C155',
          name: '金融业务的构建',
          taskName: '构建W1923222',
          systemName: '金融业务管理系统',
          releaseTime: '2018-11-28 17:29',
          taskType: '常规任务',
          executor: '张萌',
          applicant: '李溪',
          status: '进行中',
          progress: '80'
        },
        {
          id: 'C156',
          name: '金融业务的构建',
          taskName: '构建W1923222',
          systemName: '金融业务管理系统',
          releaseTime: '2018-11-28 17:29',
          taskType: '常规任务',
          executor: '张萌',
          applicant: '李溪',
          status: '已完成',
          progress: '100'
        },
        {
          id: 'C157',
          name: '金融业务的构建',
          taskName: '构建W1923222',
          systemName: '金融业务管理系统',
          releaseTime: '2018-11-28 17:29',
          taskType: '常规任务',
          executor: '张萌',
          applicant: '李溪',
          status: '审批未通过',
          progress: '0'
        }
      ],
      pageSize: 20
    }
  },
  computed: {},
  methods: {
    // 获取syetem列表
    // getSystemList() {
    //   let name = "";
    //   getcigroupSystablist(name).then(data => {
    //     if (data.data.code === 200) {
    //       this.systemTypes = data.data.data.result;
    //     } else {
    //       this.$notify({
    //         title: "提示",
    //         message: data.data.message,
    //         type: "error"
    //       });
    //     }
    //   });
    // },
    getNum (num) {
      const result = Number.parseInt(num)
      return isNaN(result) ? 0 : result
    },
    readLogs () {
      this.$router.push({
        path: '/AutomatedRelease/ReleasePlanLog',
        query: { code: 3 }
      })
    },
    // 分页组件相关
    sizeChangeHandle () {},
    pageChangeHandle () {},
    toApproval (row) {
      this.$router.push({
        path: '/AutomatedRelease/approval',
        query: {
          code: '3',
          id: row.id
        }
      })
    },
    // 新增发布计划
    releasePlanAdd () {
      this.$router.push({
        path: '/AutomatedRelease/ReleasePlanAdd',
        query: { code: 3 }
      })
    }
  },
  mounted () {
    // this.getSystemList();
  }
}
</script>

<style scoped>
.release-plan-manage {
  width: 100%;
}
.release-plan-manage .contain {
  padding: 10px;
}
.contain .paging-area {
  padding-top: 92px;
  text-align: center;
}
</style>
