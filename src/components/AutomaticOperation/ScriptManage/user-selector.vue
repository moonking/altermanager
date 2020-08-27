<template>
  <div class="user-selector clear-fix">
    <ul class="approve-list" v-if="!(single && isSelecting)">
      <li :class="[{'margin-r20': !isOrdered}]" v-for="(people,index) in selectedList" :key="index">
        <div class="user">
          <i
            class="btn-delete-user iconfont el-icon-error"
            @click="deleteSeletedUser(people, index)"
            v-if="isEdit && !single && !readonly"
          ></i>
          <div class="people-pic">
            <div class="bg-layer" v-if="single && !readonly" @click="changeSingle">
              <i class="iconfont el-icon-edit-outline"></i>
            </div>
            <img :src="people.photo" />
          </div>
          <div class="people-name">{{people.name}}</div>
        </div>
        <div class="line" v-if="shouldShowLine(index)"></div>
      </li>
    </ul>
    <div class="select-list" v-if="isSelecting && !readonly">
      <el-select v-model="userSelected" placeholder="请选择人员" :class="{'outline': isSelect}">
        <el-option
          v-for="(user,index) in dataCandidates"
          :key="index"
          :disabled="user.isCheck"
          :label="user.name"
          :value="user.userId"
        ></el-option>
      </el-select>
      <div v-if="isSelect" style="color: #ff0000;font-size: 12px;" class="tips-text">*请选择人员</div>
      <div class="confirm-btns">
        <el-button type="primary" size="mini" style="margin-right: 200px;" @click="selectUser">确定</el-button>
        <el-button size="mini" @click="isSelecting = false;userSelected = '';isSelect=false">取消</el-button>
      </div>
    </div>
    <div class="user-selector-btn" @click="handleChoose" v-if="shouldShowBtn">
      <i class=" el-icon-user" v-if="single"></i>
      <i class=" el-icon-plus" v-else></i>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    candidates: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    single: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isOrdered: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.dataCandidates = JSON.parse(JSON.stringify(this.candidates))
  },
  data () {
    return {
      isSelecting: false,
      userSelected: '',
      isSelect: false,
      dataCandidates: []
    }
  },
  watch: {
    candidates () {
      if (this.dataCandidates.length === 0) {
        this.dataCandidates = JSON.parse(JSON.stringify(this.candidates))
      }
    },
    dataCandidates (val) {
      if (val[0] && typeof val[0].isCheck !== 'boolean') {
        for (let i = 0; i < val.length; i++) {
          this.dataCandidates[i].isCheck = false
        }
      }
    }
  },
  mounted () {},
  methods: {
    handleChoose () {
      let map = {}
      const list = this.dataCandidates
      for (let user of this.selectedList) {
        map[user.userId] = user.isCheck
      }
      for (let i = 0; i < list.length; i++) {
        const id = list[i].userId
        if (map[id]) {
          list[i].isCheck = true
        }
      }
      this.isSelecting = true
    },
    selectUser () {
      if (this.userSelected) {
        const list = this.dataCandidates
        let seletedList = this.selectedList.slice(0, this.selectedList.length)
        let idx = ''
        for (let i = 0; i < list.length; i++) {
          if (list[i].userId === this.userSelected) {
            idx = i
            if (this.single) {
              seletedList = []
            }
            seletedList.push(list[i])
            this.userSelected = ''
            this.$emit('update:selectedList', seletedList)
          }
        }
        if (!this.single) {
          this.dataCandidates[idx].isCheck = true
        }
        this.isSelect = false
        this.isSelecting = false
      } else {
        this.isSelect = true
      }
    },
    deleteSeletedUser (people, index) {
      let list = this.selectedList.slice(0, this.selectedList.length)
      list.splice(index, 1)
      for (let user of this.dataCandidates) {
        if (user.userId === people.userId) {
          user.isCheck = false
        }
      }
      this.$emit('update:selectedList', list)
    },
    changeSingle () {
      this.isSelecting = true
    },
    shouldShowLine (index) {
      if (!this.isOrdered) {
        return false
      }
      if (this.single) {
        return false
      }
      if (this.readonly && index === this.selectedList.length - 1) {
        return false
      }
      return true
    }
  },
  computed: {
    shouldShowBtn () {
      if (this.isSelecting) {
        return false
      }
      if (this.single && this.selectedList.length > 0) {
        return false
      }
      if (this.readonly) {
        return false
      }
      return true
    }
  }
}
</script>
<style scoped>
.approve-list {
  float: left;
}
.approve-list > li {
  float: left;
}
.approve-list > li .user {
  float: left;
  width: 56px;
  position: relative;
  top: 0;
  left: 0;
}
.approve-list > li .line {
  float: left;
  width: 100px;
  border-top: 3px dotted #999;
  line-height: 66px;
  margin: 0 20px;
  position: relative;
  top: 28px;
  left: 0;
}
.approve-list > li .people-pic {
  width: 56px;
  height: 56px;
  position: relative;
  top: 0;
  left: 0;
  cursor: pointer;
  border-radius: 50%;
  box-sizing: border-box;
  border: 2px solid #0280ff;
  overflow: hidden;
}
.people-pic .bg-layer {
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 0;
  color: #585858;
  line-height: 66px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
}
.bg-layer > i {
  font-size: 22px;
}
.people-pic .bg-layer:hover {
  opacity: 0.8;
}
.people-pic .bg-layer:hover i {
  opacity: 1;
}

.user .btn-delete-user {
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  color: #ea1818;
  z-index: 10;
  cursor: pointer;
}
.approve-list > li .people-pic > img {
  display: block;
  width: 52spx;
  height: 52px;
  margin: 0 auto;
}
.approve-list > li .people-name {
  text-align: center;
  color: #999;
}
.approve-list > li .user:hover .btn-delete-user {
  display: block;
}
.select-list {
  float: left;
}
.select-list .tips-text {
  line-height: 20px;
}
.select-list .confirm-btns {
  margin-top: 10px;
}
.user-selector-btn {
  float: left;
  width: 56px;
  height: 56px;
  background-color: #f6f6f6;
  border: 1px dashed #999;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  color: #999;
}
.user-selector-btn:hover {
  background-color: #e2f1ff;
  border: 1px dashed #0280ff;
  color: #0280ff;
}
.user-selector-btn > i {
  font-size: 20px;
  line-height: 56px;
}
.outline {
  border: 1px solid #ff0000;
}
.margin-r20 {
  margin-right: 20px;
}
</style>
