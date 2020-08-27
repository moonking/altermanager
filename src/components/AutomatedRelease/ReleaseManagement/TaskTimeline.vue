<template>
  <div class="task-timeline">
    <div class="timeline-bg">
      <div class="task-item-bg" v-for="(item, index) in tempCheckList" :key="index">
        <div class="timeline">
          <div class="direction-h clear-fix">
            <div :class="['h-left', 'clear-fix', {hidden: !isOdd(index)}]">
              <div
                class="step-text"
                :style="{marginRight: '10px',textAlign: 'right'}"
              >{{getStepTaskNum(index)}}</div>
              <div class="h-line"></div>
            </div>
            <div class="line-icon">
              <i class="el-icon-time"></i>
            </div>
            <div :class="['h-right', 'clear-fix', {hidden: isOdd(index)}]">
              <div class="h-line"></div>
              <div class="step-text" :style="{marginLeft: '10px'}">{{getStepTaskNum(index)}}</div>
            </div>
          </div>
          <div class="direction-v">
            <div class="v-line"></div>
          </div>
        </div>
      </div>
    </div>
    <draggable v-model="tempCheckList" draggable=".drag-item">
      <div
        :class="['task-item','clear-fix', {'drag-item': !readonly} ]"
        v-for="(item, index) in tempCheckList"
        :key="index"
      >
        <div :class="['task-info-left', {hidden: !isOdd(index)}]">
          <div class="info-box">
            <div class="task-name">任务名称：{{item.name}}</div>
            <div class="task-dependency">
              任务依赖：
              <el-select
                v-model="item.jobTaskStrategy"
                size="mini"
                :style="{width: '126px'}"
                :disabled="!isOdd(index) || readonly"
              >
                <el-option
                  v-for="(dep, index) in dependencyTypeList"
                  :key="index"
                  :label="dep.value"
                  :value="dep.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div :class="['task-info-right', {hidden: isOdd(index)}]">
          <div class="info-box">
            <div class="task-name">任务名称：{{item.name}}</div>
            <div class="task-dependency">
              任务依赖：
              <el-select
                v-model="item.jobTaskStrategy"
                size="mini"
                :style="{width: '126px'}"
                :disabled="isOdd(index) || readonly"
              >
                <el-option
                  v-for="(dep, index) in dependencyTypeList"
                  :key="index"
                  :label="dep.value"
                  :value="dep.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
export default {
  props: {
    // 组件是否只读标识
    readonly: {
      type: Boolean,
      default: false
    },
    // 任务类型，1构建 2部署
    taskType: {
      type: String,
      default: ''
    },
    // 只读时数据源
    initReadingData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      // 任务执行依赖方式映射表
      dependencyTypeList: [
        { id: 'success', value: '前置任务成功后执行' },
        { id: 'failed', value: '前置任务失败后执行' },
        { id: 'always', value: '前置任务执行后执行' }
      ]
    }
  },
  methods: {
    /**
     * 获取任务步骤对应显示的数字
     * 第一步显示 Start,最后一步显示End,其余步骤从1开始以此类推
     */
    getStepTaskNum (val) {
      if (val === 0) {
        return 'Start'
      }
      if (val === this.tempCheckList.length - 1) {
        return 'End'
      }
      if (val < 10) {
        return '0' + val
      }
      return val
    },
    // 判断是否为奇数
    isOdd (val) {
      if (isNaN(val)) {
        return false
      }
      return (val + 1) % 2 !== 0
    }
  },
  computed: {
    /**
     * 已选择任务列表，与存储再vux中的数据进行交互
     */
    tempCheckList: {
      get () {
        if (this.readonly) {
          return this.initReadingData
        }
        return this.$store.state['temp' + this.taskType] || []
      },
      set (value) {
        if (this.readonly) {
          return
        }
        for (let i = 0; i < value.length; i++) {
          value[i].jobTaskSort = i
        }
        this.$store.commit('set' + this.taskType, value)
      }
    }
  },
  components: {
    Draggable
  }
}
</script>
<style scoped>
.task-timeline {
  position: relative;
}
.timeline-bg {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -280px;
  z-index: 0;
  line-height: 1;
}
.task-item-bg {
  position: relative;
  z-index: 0;
}
.task-item,
.task-item-bg {
  width: 560px;
  margin: 0 auto;
}
.direction-h {
  height: 28px;
}
.direction-h > div {
  float: left;
}
.h-left,
.h-right {
  float: left;
}
.h-line {
  width: 180px;
  height: 1px;
  border-top: 1.8px dotted #999;
  position: relative;
  top: 8px;
}
.step-text,
.h-line {
  float: left;
}
.step-text {
  line-height: 1;
  font-size: 20px;
  font-weight: bold;
  color: #666;
  width: 70px;
}
.line-icon {
  line-height: 1;
  margin: 0 10px;
}
.line-icon > i {
  font-size: 20px;
  color: #409eff;
}
.v-line {
  width: 1px;
  height: 100px;
  border-left: 1.8px dotted #999;
  margin-bottom: 10px;
  position: relative;
  left: 279px;
}
.hidden {
  opacity: 0;
}
.task-item {
  height: 108px;
  margin-bottom: 30px;
  padding-top: 30px;
  box-sizing: border-box;
}
.task-info-left,
.task-info-right {
  width: 50%;
  float: left;
}
.info-box {
  width: 190px;
  margin: 0 auto;
  padding: 20px;
  font-size: 12px;
  box-shadow: 0 0 10px #ddd;
  cursor: pointer;
  position: relative;
  z-index: 20;
}
.task-name {
  line-height: 1;
  margin-bottom: 16px;
}
</style>
<style>
.task-dependency .is-disabled .el-input__inner {
  cursor: inherit !important;
}
</style>
