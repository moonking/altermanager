<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item
      v-for="(item, index) in breadlist"
      :key="index"
      :to="{ path: item.path }"
    >
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  data() {
    return {
      breadlist: [],
      firstPath: '',
      secPath: ''
    }
  },
  created() {
    this.getBread()
  },
  methods: {
    getBread() {
      console.log(this.$route.matched)
      this.breadlist = this.$route.matched
      // console.log(this.$route);
      //                this.breadlist.forEach((item,index) => {
      if (this.$route.meta.title === '用户管理' || this.$route.meta.title === 'CI列表' || this.$route.meta.title === '业务路径') {
        this.firstPath = this.$route.fullPath
      }

      this.breadlist[0].path = this.firstPath
      this.secPath = this.$route.fullPath
      this.breadlist[1].path = this.secPath

      // 先判断父级路由是否是空字符串者meta是否为首页，直接复写路径到根路径
      //                    item.meta.title=== '首页' ? item.path = '/' :  item.path=this.$route.fullPath;
      //                });
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.getBread()
    }
  }
}
</script>
<style>
.el-breadcrumb {
  padding: 10px;
}
</style>
