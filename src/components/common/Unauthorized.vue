<template>
  <div class="unauthorized">
    <div class="wrapper">
      <div class="tips">{{getVerifyMsg}}</div>
      <p>
        <el-tag type="danger"><i class="iconfont icon-jinggao"></i>&nbsp;&nbsp;Shepherd2.0 运维平台操作需经过lincense 授权，请联系上海倚博信息科技有限公司进行授权后再予以操作！</el-tag>
      </p>
      <p class="apply-code">申请码：{{getApplyCode}}</p>
      <el-button type="primary" @click="showAuthorDialog = true">购买该系统</el-button>
    </div>
    <el-dialog
			:visible.sync="showAuthorDialog"
			:center="true"
			width="400px"
      top="160px"
			title="提示">
			<div class="tips-dialog">
				<div class="dialog-text">请联系上海倚博信息科技有限公司授权！</div>
				<p><i class="iconfont icon-kaoqinqiandao"></i> 公司地址：上海市徐汇区番禺路888号方糖小镇R18室</p>
				<p><i class="iconfont icon-shouji"></i> 联系电话：021-61390719</p>
				<p><i class="iconfont icon-youxiangyoujian"></i> 联系邮箱：sales@eproe.com.cn</p>
        <p><i class="iconfont el-code"></i></p>
			</div>
		</el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: true,
      showAuthorDialog: false
    }
  },
  computed: {
    getVerifyMsg () {
      return `抱歉，您没有权限进入${this.$route.query.system}系统`
    },
    // 判断verify
    getApplyCode () {
      let info = JSON.parse(localStorage.getItem('verify'))
      const applyCode = info.macBase || ''
      return applyCode || ''
    }
  }
}
</script>
<style scoped>
  .unauthorized {
    padding-top: 40px;
  }
  .wrapper {
    width: 800px;
    padding-top: 80px;
    margin: 0 auto;
  }
  .tips {
    font-size: 42px;
    color: #333;
    margin-bottom: 60px;
  }
  .wrapper>p {
    color: #333;
    margin-bottom: 40px;
  }
  .wrapper>.apply-code {
    color: #666;
    font-weight: bold;
  }
</style>
