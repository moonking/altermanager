<template>
  <div class="node-layout">
    <el-row :gutter="20" style="padding:0 10px;">
      <el-table
        stripe
        :data="CiDataList"
        :header-cell-style="{background:'#f5f5f5'}"
      >
        <el-table-column label="节点编号">
          <template slot-scope="scope">
            <span v-html="scope.row.id"></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="节点名称"></el-table-column>
        <el-table-column prop="deployName" label="节点用途"></el-table-column>
        <el-table-column prop="sysName" label="所属系统"></el-table-column>
        <el-table-column prop="deployTime" label="主机名"></el-table-column>
        <el-table-column prop="taskType" label="用户名"></el-table-column>
        <el-table-column prop="status" label="IP"></el-table-column>
        <el-table-column prop="progress" label="IP"></el-table-column>
      </el-table>
    </el-row>
    <div class="log-item aibms-color-bg">
      <div class="node-title">
        <span></span> 审批意见记录
      </div>
      <div class="log-item-main">
        <ReleaseStep :stepData="releaseList" />
      </div>
    </div>
  </div>
</template>

<script>
import ReleaseStep from '../AutomatedRelease/NodeManage/ReleaseStep.vue'
export default {
  name: 'ReleasePlanLog',
  data () {
    return {
      CiDataList: [
        {
          id: 'C154',
          name: '金融业务构建',
          deployName: '构建W1232132',
          sysName: '金融业务系统',
          deployTime: '2018-08-10',
          taskType: '常规任务',
          status: '审批已通过',
          progress: '无'
        },
        {
          id: 'C154',
          name: '金融业务构建',
          deployName: '构建W1232132',
          sysName: '金融业务系统',
          deployTime: '2018-08-10',
          taskType: '常规任务',
          status: '审批已通过',
          progress: '无'
        },
        {
          id: 'C154',
          name: '金融业务构建',
          deployName: '构建W1232132',
          sysName: '金融业务系统',
          deployTime: '2018-08-10',
          taskType: '常规任务',
          status: '审批已通过',
          progress: '无'
        }
      ],
      releaseList: [
        {
          id: 1,
          name: 'jill',
          time: '2018-10-09 12:10',
          comment: '不错',
          status: 'OK'
        },
        {
          id: 2,
          name: 'jill2',
          time: '2018-10-09 12:10',
          comment: '不错',
          status: 'OK'
        },
        {
          id: 3,
          name: 'jill3',
          time: '2018-10-09 12:10',
          comment: '不错',
          status: 'REFUSE'
        },
        {
          id: 4,
          name: 'jill4',
          time: '2018-10-09 12:10',
          comment: '不错',
          status: ''
        }
      ]
    }
  },
  components: {
    ReleaseStep: ReleaseStep
  },
  filters: {
    getStatus (status) {
      if (status === 'OK') {
        return 'active'
      } else if (status === 'REFUSE') {
        return 'unactive'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.node-layout {
  padding: 10px;
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
.log-item {
  background: #fff;
  margin-top: 20px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.16);
}
.log-item-main {
  padding: 20px;
}
</style>
