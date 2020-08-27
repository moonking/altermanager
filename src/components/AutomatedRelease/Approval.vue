<template>
  <div class="approval">
    <div class="detail-box">
      <table class="table non-border">
        <thead class="deep-aibms-color-bg">
          <th class="non-border white-color">计划编号</th>
          <th class="non-border white-color">计划名称</th>
          <th class="non-border white-color">部署任务名称</th>
          <th class="non-border white-color">系统名称</th>
          <th class="non-border white-color">计划发布时间</th>
          <th class="non-border white-color">任务类型</th>
          <th class="non-border white-color">状态</th>
          <th class="non-border white-color">进度</th>
        </thead>
        <tbody>
          <tr class="non-border">
            <td class="aibms-color-bg non-border white-color">C154</td>
            <td class="aibms-color-bg non-border white-color">金融业务的构建</td>
            <td class="aibms-color-bg non-border white-color">构建W3674172</td>
            <td class="aibms-color-bg non-border white-color">金融业务管理系统</td>
            <td class="aibms-color-bg non-border white-color">2019-3-26 10:10:00</td>
            <td class="aibms-color-bg non-border white-color">常规任务</td>
            <td class="aibms-color-bg non-border white-color">审批已通过</td>
            <td class="aibms-color-bg non-border white-color">无</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="content-wrapper aibms-color-bg non-border non-shadow">
      <div class="box-con">
        <div class="left-box">
          <p class="mark-icon white-color">我的审批意见</p>
          <el-radio class="radio" v-model="radio" label="1">通过</el-radio>
          <el-radio class="radio" v-model="radio" label="2">不通过</el-radio>
          <div class="form-group">
            <p>审批意见</p>
            <el-input type="textarea" :rows="4" placeholder="请输入审批意见" v-model="textarea"></el-input>
          </div>
        </div>
        <div class="right-box">
          <p class="mark-icon white-color">送下一步审批</p>
          <div class="next-approval">
            <el-form label-position="right" label-width="120px">
              <el-form-item label="选择审批人：">
                <el-select v-model="approval" placeholder="选择审批人">
                  <el-option label="张三" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="selected-list" label="已选择审批人：">
                <el-input type="textarea" rows="6"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="foot-btn">
        <el-button type="primary">提交</el-button>
        <el-button class="nomal-button">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'approval',
  data () {
    return {
      radio: 0,
      textarea: '',
      approval: ''
    }
  },
  methods: {}
}
</script>

<style scoped>
.approval {
  padding: 10px;
}
.detail-box {
  height: auto;
  overflow: hidden;
}
.table {
  width: 100%;
  border-spacing: 0;
  border: 1px solid #ccc;
}
.table thead {
  background-color: #dcdcdc;
}
.table th {
  padding: 10px 32px;
  text-align: center;
  border-right: 1px solid #ccc;
}
.table th:last-child {
  border-right: none;
}
.table td {
  padding: 10px 25px;
  text-align: center;
  background-color: #fff;
  border-right: 1px solid #ccc;
}
.table td:last-child {
  border-right: none;
}
.mark-icon {
  margin-left: 15px;
}

.content-wrapper {
  background-color: #fff;
  padding: 15px 0;
  margin-top: 24px;
  box-shadow: 0 0 10px 0 #ddd;
}
.box-con {
  display: flex;
  flex-direction: row;
}
.left-box,
.right-box {
  flex: 1;
}
.left-box > p {
  margin-bottom: 10px;
}
.left-box .form-group {
  padding-left: 42px;
}
.form-group > p {
  margin-bottom: 20px;
}
.radio {
  display: block;
  padding: 10px 42px;
  margin-left: 0;
}
.right-box .next-approval {
  padding: 20px 42px 0 42px;
}
.next-approval .selected-list {
  margin-top: 50px;
}
.foot-btn {
  text-align: center;
  margin-top: 30px;
  padding-left: 42px;
  margin-top: 40px;
}
</style>
