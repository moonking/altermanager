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
    this.createList()
    this.getBread()
  },
  methods: {
    createList() {
      this.$route.matched.forEach((item) => {
        this.breadlist.push(
          {
            path: item.fullPath,
            meta: {
              title: item.meta.title
            }
          }
        )
      })
    },
    getBread(newValue, oldValue) {
      if (this.$route.meta.title === '用户管理' || this.$route.meta.title === 'CI列表' || this.$route.meta.title === '业务路径') {
        console.log(this.$route)
        this.breadlist[0].path = this.$route.fullPath
        this.breadlist[0].meta.title = this.$route.matched[0].meta.title
      }

      if (Object.keys(this.$route.query).length > 1 || this.$route.path.search('add') > -1 || this.$route.path.search('create') > -1) {
        this.breadlist[1].path = oldValue.fullPath
        this.breadlist[1].meta.title = oldValue.meta.title
        console.log(newValue)
        if (this.breadlist.length === 2) {
          this.breadlist.push(
            {
              path: newValue.fullPath,
              meta: {
                title: newValue.meta.title
              }
            }
          )
        } else if (this.breadlist.length === 3) {
          // this.breadlist[2].path = newValue.fullPath
          // this.breadlist[2].meta.title = newValue.meta.title
          this.$set(this.breadlist[2], 'path', newValue.fullPath)
          this.$set(this.breadlist[2], 'meta', newValue.meta)
        }
      } else {
        this.breadlist[1].path = this.$route.fullPath
        this.breadlist[1].meta.title = this.$route.meta.title
        if (this.breadlist.length > 2) {
          this.breadlist.pop()
        }
      }
      // 先判断父级路由是否是空字符串者meta是否为首页，直接复写路径到根路径
      //                    item.meta.title=== '首页' ? item.path = '/' :  item.path=this.$route.fullPath;
      //                });
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.$nextTick(() => {
        this.getBread(newValue, oldValue)
      })
    }
  }
}
</script>
<style>
.el-breadcrumb {
  padding: 10px;
}
</style>
