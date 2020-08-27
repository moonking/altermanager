<template>
  <div class="userList">
    <ul class="approve-list">
      <li v-for="(people,index) in selectedList" :key="index">
        <div class="user">
          <div class="people-pic">
            <img :src="people.photo" alt />
          </div>
          <div class="people-name">{{people.name}}</div>
        </div>
        <div class="line" v-if="!(index === (selectedList.length-1))"></div>
      </li>
    </ul>
    <div class="clear"></div>
  </div>
</template>
<script>
export default {
  name: 'UserListSelect',
  data () {
    return {}
  },
  props: {
    selectedList: {
      type: Array,
      default: () => {
        return []
      }
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
}
.approve-list > li .line {
  float: left;
  width: 100px;
  border-top: 3px dotted #999;
  line-height: 56px;
  margin: 0 20px;
  position: relative;
  top: 28px;
  left: 0;
}
.approve-list > li .people-pic {
  position: relative;
  top: 0;
  left: 0;
  cursor: pointer;
}
.approve-list > li .people-pic > img {
  display: block;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 auto;
  box-sizing: border-box;
  border: 2px solid #0280ff;
}
.approve-list > li .people-name {
  text-align: center;
  color: #999;
}
.clear {
  clear: both;
}
</style>
