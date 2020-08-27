<template>
  <div class="step">
    <ul>
      <li v-for="(item,index) in stepData" :key="index">
        <div class="step-line" style="visibility: hidden" v-if="index !== 0"></div>
        <div class="photo-box">
          <div class="photo-box_img">
            <img :src="'../../../../' + item.photo" alt />
          </div>
          <!-- <div class="step-status"></div> -->
          <icon-svg icon-class="chenggong" class="right-status-icon" v-if="item.status==='1'" />
          <icon-svg icon-class="cuowu" class="error-status-icon" v-if="item.status==='0'" />
          <div class="message-box">
            <h3>{{ item.name }}</h3>
            <!--<p class="proStarttime">发起时间：{{ item.proStarttime }}</p>-->
            <!--<p v-if="item.auditText">审批意见：{{item.auditText}}</p>-->
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ReleaseStep',
  props: {
    stepData: Array
  },
  data () {
    return {}
  },
  filters: {
    getStatus (status) {
      if (status == '1') {
        return 'active'
      } else if (status == '0') {
        return 'unactive'
      } else {
        return ''
      }
    },
    getCurrentStatus (status) {
      if (status == '0') {
        return '审批被拒绝'
      } else if (status == '1') {
        return '审批通过'
      } else {
        return '未审批'
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
.step {
  /*display: flex;*/
  /*padding: 0 30px;*/
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
}
.step li.active .step-line,
.step li.unactive .step-line {
  border-color: #707070;
}
.step .photo-box {
  border-radius: 60px;
  width: 60px;
  margin: 0 10px;

  position: relative;
  overflow: visible;
}
.step .photo-box_img {
  border-radius: 60px;
  height: 60px;
  width: 60px;
  border: 2px solid #0280ff;
  position: relative;
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
  flex-wrap: wrap;
}
.step ul li {
  position: relative;
}
.step ul li .message-box {
  /*position: absolute;*/
  /*top: 70px;*/
  /*left: -50%;*/
  /*transform: translateX(-50%);*/
  width: auto;
  margin: auto 0;
  text-align: center;
}
.step ul li .message-box h3 {
  text-wrap: avoid;
  white-space: nowrap;
  font-size: 14px;
  color: #3e444a;
  margin: 0 auto;
  text-align: center;
  /*width: 100px;*/
  font-weight: normal;
}
.step ul li .message-box p {
  /*text-wrap: avoid;*/
  word-break: break-all;
  width: 200px;
  text-align: left;
  font-size: 14px;
  color: #9d9d9d;
  line-height: 20px;
  padding: 10px 0;
}
.step ul li .message-box p + p {
  padding-top: 0;
}
.step ul li .message-box {
  left: 0;
  width: 100%;
  text-align: center;
}
.step ul li:nth-child(n + 2) {
  /*padding-left: 30%;*/
  /*padding-right: 10px;*/
  position: relative;
  /*flex: 1;*/
  width: 300px;
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
