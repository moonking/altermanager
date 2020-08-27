<template>
  <div class="step">
    <ul>
      <li v-for="(item,index) in stepData" :class="item.status | getStatus" :key="index">
        <div class="step-line" v-if="index !== 0"></div>
        <div class="photo-box">
          <img src="../../../../static/img/photo.png" alt />
          <!-- <div class="step-status">
          </div>-->
          <icon-svg icon-class="chenggong" class="right-status-icon" v-if="item.status==='OK'" />
          <icon-svg icon-class="cuowu" class="error-status-icon" v-if="item.status==='REFUSE'" />
          <div class="message-box width-color">
            <h3 class="white-color">{{ item.name }}</h3>
            <p class="white-color">发起时间：{{ item.time }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'progress',
  props: {
    stepData: Array
  },
  data: function () {
    return {}
  },
  filters: {
    getStatus (status) {
      if (status === 'OK') {
        return 'active'
      } else if (status === 'REFUSE') {
        return 'unactive'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
/* .step {
  display: flex;
}
.step li .step-status {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;

  display: none;
}
.step li.active .step-status {
  display: block;
  background: url("../../../../static/img/success.png");
  background-size: cover;
}
.step li.unactive .step-status {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: url("../../../../static/img/refuse.png");
  background-size: cover;
  display: block;
} */
.step li.active .step-line,
.step li.unactive .step-line {
  border-color: #707070;
}
.step .photo-box {
  border-radius: 60px;
  height: 60px;
  width: 60px;
  margin: 0 10px;
  border: 2px solid #0280ff;
  position: relative;
  overflow: visible;
}
.step .photo-box img {
  width: 100%;
  border-radius: 60px;
}
.step ul {
  display: flex;
  width: 90%;
  margin: 0 auto;
  min-height: 160px;
}
.step ul li {
  position: relative;
}
.step ul li .message-box {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  text-align: center;
}
.step ul li .message-box h3 {
  text-wrap: avoid;
  white-space: nowrap;
  font-size: 14px;
  color: #3e444a;
  font-weight: normal;
}
.step ul li .message-box p {
  text-wrap: avoid;
  white-space: nowrap;
  font-size: 14px;
  color: #9d9d9d;
  line-height: 40px;
}
.step ul li .message-box {
  left: 50%;
  transform: translateX(-50%);
}
.step ul li:nth-child(n + 2) {
  /*padding-left: 30%;*/
  /*padding-right: 10px;*/
  position: relative;
  flex: 1;
  display: flex;
}
.step ul li:nth-child(n + 2) .step-line {
  /*position: absolute;*/
  /*left: 0;*/
  /*top: 30px;*/
  position: relative;
  top: 30px;
  left: 0;
  flex: 10;
}
.step ul li:nth-child(n + 2) .step-line {
  width: 80px;
}
.step-line {
  width: 90%;
  margin-right: 10px;
  border-top: 2px dashed #d3d3d3;
}
</style>
