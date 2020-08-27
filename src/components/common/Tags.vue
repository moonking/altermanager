<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li
        class="tags-li"
        v-for="(item,index) in tags"
        :class="{'active': isActive(item.path)}"
        :key="index"
      >
        <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>
        <span class="tags-li-icon" @click="closeTags(index)">
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary" >
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from './bus'
import router from '../../router'
import axios from '@/api';
export default {
  data () {
    return {
      tagsList: [],
      userId: '',
      apipath: []
    }
  },
  methods: {
    //   getnewtags(){
    //         for(var i = 0 ;i<router.options.routes.length;i++){
    //                     for(var j = 0 ;j<this.apipath.length;j++){
    //                         if(router.options.routes[i].path == this.apipath[j].path){
    //                             router.options.routes[i].meta.title=this.apipath[j].name
    //                         }
    //                     }
    //                 }
    //   },
    getcpath (item) {
      item.forEach(item => {
        if (item.href.indexOf('?') > -1) {
          this.apipath.push({ path: item.href.split('?')[0], name: item.name })
        } else {
          this.apipath.push({ path: item.href, name: item.name })
        }
        if (item.children && item.children.length > 0) {
          this.getcpath(item.children)
        }
      })
    },
    getLoginerMenu (userId) {
      axios.getLoginMenu(userId).then(res => {
        let payload = {}
        if (res && res.status == '200') {
          res.data.data.menus.forEach(item => {
            if (item.href.indexOf('?') > -1) {
              this.apipath.push({
                path: item.href.split('?')[0],
                name: item.name
              })
            } else {
              this.apipath.push({ path: item.href, name: item.name })
            }
            if (item.children && item.children.length > 0) {
              this.getcpath(item.children)
            }
          })
          payload.router = router.options.routes
          payload.path = this.apipath

          // this.getnewtags()
          this.setTags(this.$route)
          this.$store.dispatch('GET_TAGSLIST', payload)
        }
      })
    },
    isActive (path) {
      return path === this.$route.fullPath
    },
    // 关闭单个标签
    closeTags (index) {
      const delItem = this.tagsList.splice(index, 1)[0]
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1]
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path)
      } else {
        this.$router.push('/')
      }
    },
    // 关闭全部标签
    closeAll () {
      this.tagsList = []
      this.$router.push('/')
    },
    // 关闭其他标签
    closeOther () {
      const curItem = this.tagsList.filter(item => {
        return item.path === this.$route.fullPath
      })
      this.tagsList = curItem
    },
    // 设置标签
    setTags (route) {
      //   console.log(route);
      const isExist = this.tagsList.some(item => {
        return item.path === route.fullPath
      })
      if (!isExist) {
        if (this.tagsList.length) {
          if (this.tagsList.length >= 8) {
            this.tagsList.shift()
          }
        }

        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath
          // xs     name: route.matched[1].components.default.name
        })
      }
      bus.$emit('tags', this.tagsList)
    },
    handleTags (command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    }
  },
  computed: {
    showTags () {
      return this.tagsList.length > 0
    },
    tags () {
      let arr = []
      for (var i = 0; i < this.$store.state.tags.length; i++) {
        for (var j = 0; j < this.tagsList.length; j++) {
          if (
            this.$store.state.tags.path[i].path ==
            this.tagsList[j].path.split('?')[0]
          ) {
            this.tagsList[j].title = this.$store.state.tags.path[i].name
          }
        }
      }
      arr = this.tagsList
      return arr
    }
  },
  watch: {
    $route (newValue, oldValue) {
      this.setTags(newValue)
      //   console.log(this.$store.state.tags);
      // console.log(this.tagsList);
    },
    apipath (newValue, oldValue) {
      //    console.log(newValue)
    }
  },
  created () {
    this.userId = localStorage.getItem('userId')
    this.getLoginerMenu(this.userId)

    // console.log(router.options.routes[1].meta)
    // router.options.routes[1].meta.title = 'adasda'
  },
  updated () {
    //   this.getnewtags()
  }
}
</script>

<style>
.tags {
  position: relative;
  height: 30px;
  overflow: hidden;
  background: rgba(4, 28, 37, 0.7);
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}
.el-button--primary{
    color: #FFF;
    background-color: #00A8E8;
    border-color: #00A8E8;
}
.el-button--primary:focus, .el-button--primary:hover{
  background: #66b1ff !important;
    border-color: #66b1ff !important;
    color: #FFF;
}
.tags-li.active {
  color: #fff;
  background: #00A8E8;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
