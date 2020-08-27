<template>
  <div class="select-task clear-fix">
    <div class="task-list">
      <div class="block-title">
        <i class="title-line"></i>选择任务
      </div>
      <div class="block-content">
        <div class="search-task">
          <el-input
            v-model="searchingTaskName"
            placeholder="请输入任务名称"
            @keyup.enter.native="searchTaskByName"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search search-task-btn"
              @click="searchTaskByName"
            ></i>
          </el-input>
        </div>

        <div
          class="show-list"
          v-if="taskPipelineList"
          @scroll="loadingMoreData($event)"
          ref="showList"
        >
          <el-checkbox-group v-model="checkedGroup" @change="changeSelectedTask">
            <el-checkbox
              v-for="(item, index) in taskPipelineList"
              :label="item.name"
              :key="index"
              :disabled="isSearching"
              size="medium"
              :style="{width: '100%',lineHeight: '40px'}"
            ></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="loading-block" v-if="isSearching || !taskPipelineList">
          <div class="loading-icon">
            <i class="el-icon-loading"></i>数据加载中，请稍后....
          </div>
        </div>
      </div>
    </div>
    <div class="task-timeline-set">
      <div class="block-title">
        <i class="title-line"></i>执行顺序
      </div>
      <div class="title-tips">
        <i class="el-icon-warning-outline">勾选本计划要执行的任务流水线,可拖动改变其执行顺序</i>
      </div>
      <div class="timeline-set">
        <task-timeline :taskType="taskType"></task-timeline>
      </div>
    </div>
  </div>
</template>
<script>
import TaskTimeline from './TaskTimeline'
import axios from '@/api';
export default {
  created () {
    const data = {
      systemId: this.systemId,
      jobName: '',
      buildStatus: 3,
      tasktype: this.getCurrentJobTaskType,
      date: '',
      current: 1,
      size: 10
    }
    this.getTaskPipelineList(data)
    this.resetCheckedStatus()
  },
  props: {
    // 系统编号,用于查询系统下所有流水线
    systemId: {
      type: String,
      default: ''
    },
    // 任务类型
    taskType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 任务流水线数据列表
      taskPipelineList: '',
      // 多选框组件数据
      checkedGroup: [],
      // 搜索栏任务名称
      searchingTaskName: '',
      // 是否再搜索中状态
      isSearching: false,
      // 当前页
      currentPage: 1,
      // 页面总数
      pages: 0
    }
  },
  methods: {
    /**
     * 左侧任务列表任务选择状态发生改变时调用
     */
    changeSelectedTask (val) {
      let results = []
      const list = this.taskPipelineList
      let sortNum = 1
      for (let i = 0; i < val.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (val[i] === list[j].name) {
            let obj = {}
            obj.jobTaskId = list[j].jobId
            obj.name = list[j].name
            obj.jobTaskSort = sortNum
            obj.jobTaskStrategy = 'success'
            sortNum++
            results.push(obj)
          }
        }
      }
      this.$store.commit('set' + this.taskType, results)
    },
    /**
     * 后台网络请求方法
     * 用于根据systemId获取流水线列表
     */
    getTaskPipelineList (data) {
      axios.findBypage(data).then(res => {
        if (res.data.success) {
          const result = []
          const list = res.data.data.records
          // 将新数据合并到已有数据中
          for (let i = 0; i < this.taskPipelineList.length; i++) {
            result.push(this.taskPipelineList[i])
          }
          for (let i = 0; i < list.length; i++) {
            result.push(list[i])
          }
          console.log(result)
          this.taskPipelineList = result
          this.pages = res.data.data.pages
          // 获取数据成功页码+1
          this.currentPage++
          this.isSearching = false
        }
      })
    },
    /**
     * 重置侧边选择列表选中状态
     */
    resetCheckedStatus () {
      this.checkedGroup = []
      const list = this.$store.state['temp' + this.taskType]
      console.log(list)
      for (let i = 0; i < list.length; i++) {
        console.log('666')
        this.checkedGroup.push(list[i].name)
      }
    },
    /**
     * 根据任务名称搜素任务
     */
    searchTaskByName () {
      this.isSearching = true
      const data = {
        systemId: this.systemId,
        jobName: this.searchingTaskName,
        buildStatus: 3,
        tasktype: this.getCurrentJobTaskType,
        date: '',
        current: 1,
        size: 10
      }
      axios.findBypage(data).then(res => {
        if (res.data.success) {
          this.taskPipelineList = res.data.data.records
          // 获取数据成功页码+1
          this.currentPage = 1
          this.pages = res.data.data.pages
          // 列表滚动到顶部，防止重复触发滚动条触底
          console.log(this.$refs.showList)
          this.$refs.showList.scrollTop = 0
          this.isSearching = false
        }
      })
    },
    /**
     * 滚动触底加载更多数据
     */
    loadingMoreData (event) {
      const taskListEl = event.target
      const scrollTop = taskListEl.scrollTop
      const scrollHeight = taskListEl.scrollHeight
      const height = taskListEl.offsetHeight
      if (scrollTop + height === scrollHeight) {
        if (this.currentPage < this.pages) {
          const pageNum = this.currentPage + 1
          this.isSearching = true
          const data = {
            systemId: this.systemId,
            jobName: this.searchingTaskName,
            buildStatus: '',
            tasktype: this.getCurrentJobTaskType,
            date: '',
            current: pageNum,
            size: 10
          }
          this.getTaskPipelineList(data)
        }
      }
    }
  },
  watch: {
    /**
     * 监测systemId变化
     * 则根据新的systemId更新任务流水线列表
     */
    systemId (val) {
      this.getTaskPipelineList()
    },
    /**
     * 同步任务流水线列表中项目的选中状态
     */
    tempCheckList () {
      this.resetCheckedStatus()
    }
  },
  computed: {
    tempCheckList () {
      return this.$store.state['temp' + this.taskType] || []
    },
    getCurrentJobTaskType () {
      return this.taskType === 'BuildCheckTaskList' ? '0' : '1'
    }
  },
  components: {
    TaskTimeline
  }
}
</script>
<style scoped>
.task-list {
  width: 25%;
  padding-right: 40px;
  min-height: 424px;
  box-sizing: border-box;
  float: left;
}
.task-timeline-set {
  width: 75%;
  float: right;
}
.block-title {
  font-size: 18px;
  padding-left: 20px;
  margin-bottom: 20px;
  position: relative;
  top: 0;
  left: 0;
}
.title-line {
  width: 4px;
  height: 100%;
  background-color: rgb(24, 38, 230);
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
}
.block-content {
  width: 85%;
  margin: 0 auto;
  position: relative;
}
.title-tips {
  font-size: 12px;
  color: #999;
  margin-left: 40px;
  margin-bottom: 20px;
}
.search-task {
  margin-bottom: 20px;
}
.show-list {
  padding: 0 14px;
  height: 320px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.timeline-set {
  padding: 0 40px;
}
.loading-block {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  position: absolute;
  bottom: -40px;
  left: 0;
  z-index: 1000;
}
.loading-icon {
  color: #999;
}
.loading-icon > i {
  font-size: 18px;
  margin-right: 10px;
}
.search-task-btn {
  cursor: pointer;
}
</style>
