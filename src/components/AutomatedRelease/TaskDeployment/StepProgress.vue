<template>
  <div class="task-progress">
    <div class="task-progress_line"></div>
    <div class="task-progress_circle" :style="styleObject">
      <span></span>
      <p>{{ name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepProgress',
  props: {
    present: Number,
    name: String
  },
  watch: {
    present () {
      let present = this.present
      if (present > 100) {
        present = 100
      }
      this.styleObject = {
        left: present + '%'
      }
    }
  },
  data () {
    return {
      styleObject: {
        left: `${this.present > 100 ? 100 : this.present}` + '%'
      }
    }
  }
}
</script>

<style scoped>
.task-progress {
  width: 100%;
  padding-top: 10px;
  position: relative;
  height: 30px;
}
.task-progress_line {
  width: 101%;
  background: #d3d3d3;
  border-radius: 5px;
  height: 6px;
}
.task-progress_circle {
  position: absolute;
  left: 0;
  top: 8px;
  height: 10px;
  width: 10px;
}
.task-progress_circle span {
  display: block;
  background: #49bc71;
  border-radius: 10px;
  height: 10px;
  width: 10px;
  margin: 0 !important;
  padding: 0 !important;
}
.task-progress_circle p {
  width: 200px;
  position: absolute;
  top: 0px;
  font-size: 14px;
  left: 50%;
  transform: translate(-50%);
  text-align: center;
}
</style>
