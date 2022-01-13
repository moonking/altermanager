<template>
	<div class="index">
		<div class="tips unauthorized" v-if="!isAuthorized">
			<p class="tips-label"><i class="iconfont el-icon-warning"></i> 未经授权的用户</p>
			<div class="tips-text">
				<p ref="one">Shepherd运维平台操作需经过license授权，请联系上海倚博信息科技有限公司进行授权后再予以操作！</p>
				<!-- <p ref="pTwo">Shepherd运维平台操作需经过license授权，请联系上海倚博信息科技有限公司进行授权后再予以操作！</p> -->
			</div>
			<div class="btn-authorization" @click="showAuthorDialog = true">申请授权</div>
		</div>
		<div class="tips expiration-time" v-if="isAuthorized && getLicenseDays <= 30">
			<p class="tips-label"><i class="iconfont el-icon-warning"></i> 授权证书即将过期</p>
			<div class="tips-text">
				<p ref="one">您的license证书还有{{getLicenseDays}}天即将过期，请尽快联系上海倚博信息科技有限公司续费授权！</p>
				<!-- <p ref="pTwo">Shepherd运维平台操作需经过license授权，请联系上海倚博信息科技有限公司进行授权后再予以操作！</p> -->
			</div>
			<div class="btn-expiration-time" @click="showAuthorDialog = true">续费授权</div>
		</div>
		<!-- <div class="wrapper">
       <div class="box">系统统计信息</div>
       <div class="box">自动化发布信息</div>
       <div class="box">各类通知</div>
       <div class="box">AI服务记录信息</div>
       <div class="box">自动化运维信息</div>
       <div class="box">告警信息</div>
    </div> -->
		<div class="link-list .clear-fix">
			<div class="link-item"
				v-for="(item, index) in linkList"
				:key="item.name"
				:style="{marginRight: (index+ 1)%5 === 0 ? '0' : '2.5%'}"
				@click="openLink(item.href)">
				<div class="link-logo">
					<img src="/static/img/logos/coding.png" alt="" v-if="item.type === 'coding'">
					<img src="/static/img/logos/sornaqb.svg" alt="" v-if="item.type === 'sonarqube'">
					<img src="/static/img/logos/nxrm.svg" alt="" v-if="item.type === 'nexus'">
					<img src="/static/img/logos/jenkins.svg" alt="" v-if="item.type === 'jenkins'">
					<img src="/static/img/logos/axure.svg" alt="" v-if="item.type === 'axure'">
					<img src="/static/img/logos/wt.png" alt="" v-if="item.type === 'worktile'">
					<img src="/static/img/logos/shepherd.jpg" alt="" v-if="item.type === 'shepherd'">
				</div>
				<div class="link-name">{{item.name}}</div>
			</div>
		</div>
		<el-dialog
			:visible.sync="showAuthorDialog"
			:center="true"
			width="400px"
			title="提示">
			<div class="tips-dialog">
				<div class="dialog-text">请联系上海倚博信息科技有限公司授权！</div>
				<p><i class="iconfont icon-kaoqinqiandao"></i> 公司地址：上海市徐汇区番禺路888号方糖小镇R18室</p>
				<p><i class="iconfont icon-shouji"></i> 联系电话：021-61390719</p>
				<p><i class="iconfont icon-youxiangyoujian"></i> 联系邮箱：sales@eproe.com.cn</p>
				<p><i class="iconfont el-icon-s-platform"></i> 申请码：{{macBase}}</p>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import vSidebar from './Sidebar.vue'
import vTags from './Tags.vue'
import bus from './bus'
export default {
  data () {
    return {
      tagsList: [],
      collapse: false,
      showAuthorDialog: false,
      macBase: '',
      linkList: [
        {
          type: 'coding',
          name: 'Coding代码仓库',
          href: 'https://eproe-01.coding.net/'
        },
        {
          type: 'sonarqube',
          name: 'SonarQube代码扫描平台',
          href: 'http://10.217.24.203:9000'
        },
        {
          type: 'axure',
          name: 'Axure产品原型',
          href: 'http://111.231.166.138:9886'
        },
        {
          type: 'nexus',
          name: 'Nexus | 内网',
          href: 'http://10.217.24.203:9981'
        },
        {
          type: 'jenkins',
          name: 'Jenkins | 内网',
          href: 'http://10.217.24.203:9090'
        },
        {
          type: 'jenkins',
          name: 'Jenkins | 云-dev',
          href: 'http://111.231.165.249:9880'
        },
        {
          type: 'jenkins',
          name: 'Jenkins | 云-test',
          href: 'http://111.231.166.138:9880'
        },
        {
          type: 'worktile',
          name: 'worktile工作台',
          href: 'https://eproe.worktile.com'
        },
        {
          type: 'shepherd',
          name: 'shepherd | dev',
          href: 'http://111.231.165.249:9888'
        },
        {
          type: 'shepherd',
          name: 'shepherd | prod',
          href: 'http://111.231.166.138:9888'
        }
      ]
    }
  },
  methods: {
    openLink (url) {
      window.open(url, '_blank')
    }
  },
  components: {
    vSidebar, vTags
  },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
    // let id = localStorage.getItem('userId');
    // if(id==null)
    // {
    //      this.$router.push({
    //     path:'/login'
    // })
    // }

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = []
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name)
      }
      this.tagsList = arr
    })
  },
  mounted () {
    this.macBase = JSON.parse(localStorage.getItem('verify')).macBase
  },
  computed: {
    //   权限判断
    isAuthorized () {
      const verify = JSON.parse(localStorage.getItem('verify'))
      return verify.code === 200
    },
    // License日期获取
    getLicenseDays () {
      const verify = JSON.parse(localStorage.getItem('verify'))
      let result = parseInt(verify.days)
      return result || 10000
    }
  }
}
</script>

<style scoped>
	.index {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		box-sizing: border-box;
	}
	.link-list {
		width: 100%;
		height: 100%;

		/* display: flex;
		flex-wrap: wrap;
		justify-content: space-between; */

		padding: 20px;
		box-sizing: border-box;
		/* background-color: #fff; */
	}
	.link-item {
		width: 18%;
		min-width: 260px;
		height: 160px;
		/* background-color: #203745; */
		display: flex;
		flex-direction: column;
		float: left;
		margin-right: 2%;
		margin-bottom: 2%;
	}
	.link-logo {
		width: 100%;
		height: 120px;
		flex: 1;
		box-sizing: border-box;
		border: 1px solid #d8d8d8;
		border-bottom: none;
		padding: 20px;
	}
	.link-logo>img {
		width: 100%;
		height: 100%;
	}
	.link-name {
		width: 100%;
		height: 40px;
		line-height: 40px;
		background-color: #23404a;
		padding: 0 20px;
		color: #bdbdbd;
		text-align: center;
		box-sizing: border-box;
		border: 1px solid #d8d8d8;
		border-top: none;
	}
	.link-item:hover {
		box-shadow: 0 0 10px #465157;
		cursor: pointer;
	}
	.link-item:hover .link-logo {
		border: 1px solid transparent;
		border-bottom: none;
	}
	.link-item:hover .link-name {
		border: 1px solid transparent;
		border-top: none;
	}
	.tips {
		width: 920px;
		height: 46px;
		line-height: 46px;
		margin: 0 auto;
		background-color: #fef0f0;
		color: #fb6565;
		border-radius: 3px;
		padding: 0 30px;
	}
	.tips>.tips-label {
		float: left;
		font-weight: bold;
	}
	.tips>.tips-text {
		float: left;
		width: 670px;
		height: 100%;
		position: relative;
		font-size: 14px;
		margin-left: 30px;
		overflow: hidden;
	}
	.btn-authorization {
		float: right;
		height: 24px;
		line-height: 24px;
		font-size: 12px;
		text-align: center;
		background-color: #fb6565;
		color: #fff;
		margin-top: 11px;
		padding: 0 10px;
		border-radius: 3px;
		cursor: pointer;
	}
	.btn-authorization:hover {
		background-color: #fa5454;
	}
	.tips-text>p {
		width: 660px;
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		/* animation: textScroll 6s linear 0s infinite; */
	}
	.box{
		width: 400px;
		height: 300px;
		line-height: 300px;
		text-align: center;
		margin: 20px;
		border: 1px solid #ccc;
		display: inline-block;
		color: #fff;
	}
	@keyframes textScroll {
		0% {
			left: 0
		}
		80% {
			left: -160px
		}
		100% {
			left: -160px
		}
	}
	.tips-dialog>.dialog-text {
		font-weight: bold;
	}
	.tips-dialog>p {
		font-size: 14px;
		margin-top: 16px;
	}
	.unauthorized {
		background-color: #fef0f0;
		color: #fb6565;
	}
	.expiration-time {
		background-color: #fdf6ec;
		color: #e6a23c;
	}
	.btn-expiration-time {
		float: right;
		height: 24px;
		line-height: 24px;
		font-size: 12px;
		text-align: center;
		background-color: #e6a23c;
		color: #fff;
		margin-top: 11px;
		padding: 0 10px;
		border-radius: 3px;
		cursor: pointer;
	}
	.btn-expiration-time:hover {
		background-color: #de9d3b;
	}
</style>
